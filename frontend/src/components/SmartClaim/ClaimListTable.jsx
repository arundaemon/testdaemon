import {
  Button,
  Checkbox,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Fade,
  styled,
  TableSortLabel,
} from "@mui/material";
import CubeDataset from "../../config/interface/test";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { approveClaimRequest, approveReject, getActualSchoolVisits, getFinanceRequestList, getRequestList, updateBulk } from "../../config/services/approvalRequest";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Pagination from "../../pages/Pagination";
import { DisplayLoader } from "../../helper/Loader";
import { useStyles } from "../../css/ClaimForm-css";
import toast from "react-hot-toast";
import { ReactComponent as IconFolderMain } from './../../assets/icons/icon-folder-main.svg';
import { ReactComponent as IconFolderNormal } from './../../assets/icons/icon-folder-normal.svg';
import Env_Config from '../../config/settings'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { fetchProfileList, getClaimListDropdownNew } from "../../helper/DataSetFunction";


export const MyClaimList = (props) => {
  let { requestByEmpCode, reqStatus, empCodeArray, successFlag, reqDate, filtersApplied, checkedRowsParent, setEmpCodeArray, parentCheckedRow, parentFlag, setParentFlag } = props;

  const [checkedRows, setCheckedRows] = useState([]);
  const [listPageNo, setListPageNo] = useState(1)
  const [lastPage, setLastPage] = useState(false)
  const [loader, setLoader] = useState(false)
  const [listData, setListData] = useState(null)
  const [itemsPerPage] = useState(50)
  const [actionType, setActionType] = useState()
  let [isModel, setIsModel] = useState(false)
  const [remark, setRemark] = useState()
  const [flag, setFlag] = useState(0)
  const [isPresent, setIsPresent] = useState(false)
  const classes = useStyles();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'))
  const loginData = JSON.parse(localStorage.getItem('loginData'))
  const financeProfile = Env_Config.FINANCE_PROFILES
  const [profileMatch, setProfileMatch] = useState(financeProfile.indexOf(userData?.crm_profile) > -1)
  const [sortBy, setSortBy] = useState(!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Visit_Date": "visitDate") : CubeDataset.UserClaim.visitDate);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleRowCheck = (event, row) => {
    setParentFlag(true)
    if (row.requestStatus === 'NEW' || row?.claimStatus === 'PENDING AT FINANCE') {
      if (event.target.checked) {
        setCheckedRows([...checkedRows, row]);
      } else {
        const empPresent = empCodeArray.includes(requestByEmpCode)
        if(empPresent) {
          setEmpCodeArray(empCodeArray.filter((emp)=>emp !==requestByEmpCode))
          let filteredParentArray = checkedRowsParent?.filter((checkedRow) => checkedRow[CubeDataset.UserClaim.requestByEmpCode] !== requestByEmpCode)
          parentCheckedRow(filteredParentArray);
        }
        setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
      }
    }
    else {
      toast.dismiss()
      toast.error(`${!profileMatch ? row?.currentStatus : row?.claimStatus} can not be selected`)
      return
    }
  };

  const isChecked = (row) => {
    if (checkedRows.includes(row)) {
      return checkedRows.includes(row);
    } else {
      return false
    }
  };

  const getRequestData = async () => {
    const empPresent = empCodeArray.includes(requestByEmpCode)
    setIsPresent(empPresent)
    setCheckedRows([])
    let params = {
      roleName: getUserData('userData')?.crm_role,
      requestByEmpCode: requestByEmpCode,
      reqStatus: reqStatus,
      pageNo: listPageNo - 1,
      count: itemsPerPage,
      reqDate: reqDate,
      sortKey:sortBy,
      sortOrder: sortOrder
    }
    try {
      let res
      if (profileMatch) {
        res = await getFinanceRequestList(`empCode=${requestByEmpCode}&status=${reqStatus}&type=finance&pageNo=${params.pageNo}&count=${itemsPerPage}&reqDate=${reqDate}&sortKey=${sortBy}&sortOrder=${sortOrder}`)
      } else {
        res = await getRequestList(params)
      }
      setLastPage(false)
      setLoader(true)
      if (res?.result) {
        let data = res?.result
        if (empPresent) {
          let pendingData = data?.filter((obj)=> obj.requestStatus === 'NEW')
          setCheckedRows(pendingData);
        }
        let filteredRoles = data
          .filter(({ claimStatus, currentStatus }) => profileMatch? claimStatus === 'REJECTED': currentStatus === 'REJECTED')
          .map((obj) => (profileMatch ? obj?.statusModifiedByRoleName : obj?.approver_roleName));
          
          let response = await fetchProfileList(filteredRoles)

          let responseData = response.loadResponses[0].data
          let list = data?.map(obj => {
            obj.visitedFlag = false
            obj.actualKms = 'NA'
            responseData?.map(item => {
              let role = profileMatch ? obj?.statusModifiedByRoleName:obj?.approver_roleName
              if(item[CubeDataset.TblEmployee.roleName]=== role && financeProfile.indexOf(item[CubeDataset.TblEmployee.profileName]) > -1){
                obj.profileName = 'FINANCE'
              } else if(item[CubeDataset.TblEmployee.roleName]=== role){
                obj.profileName = item[CubeDataset.TblEmployee.profileName]

              }
            })
            return obj
          })
        setListData(list)
        if (data?.length < itemsPerPage) setLastPage(true)
        setLoader(false)
      }
    } catch (err) {
      setLastPage(true)
      setLoader(false)
      console.error(err)
    }
  };

  const fetchReportClaimDropdownList = () => {
    let params = { listPageNo, itemsPerPage, filtersApplied, requestByEmpCode, reqStatus, sortBy, sortOrder }
    setLastPage(false)
    setLoader(true)
    getClaimListDropdownNew(params)
      .then(res => {
        let data = res?.loadResponses?.[0]?.data
        setListData(data)
        if (data?.length < itemsPerPage) setLastPage(true)
        setLoader(false)
      })
      .catch(err => {
        setLastPage(true)
        setLoader(false)
        console.error(err, 'Error while fetching Myclaim dropdown list from report engine')
      })
      .catch((err) => {
        setLastPage(true);
        console.error(
          err,
          "Error while fetching Myclaim dropdown list from report engine"
        );
      });
  };

  useEffect(() => {
   if(!parentFlag)
    { if(filtersApplied.length>0){
      fetchReportClaimDropdownList()
    }else {
      getRequestData()
    }}
  }, [listPageNo, reqStatus, flag, empCodeArray, successFlag, filtersApplied, parentFlag, sortBy, sortOrder])

  const handleApproveReject = async (type) => {
    setIsModel(true)
    setActionType(type)
  }

  const getActualData = async () => {
    //console.log(checkedRows)
    let data = checkedRows.filter(obj => obj.expenseType == "Conveyance").map(obj => {
      return {
        empCode: obj.requestBy_empCode,
        schoolCode: obj?.schoolCode ?? obj?.metaInfo?.[0]?.School_Code,
        _id: obj._id,
        date: moment.utc(obj.visitDate).format('YYYY-MM-DD')
      }
    })
    try {
      let list = [...listData]
      for (let record of data) {
        let res = await getActualSchoolVisits(record)
        let result = res.data.data
        if (result.visits.length > 0) {
          let schooldata = result.visits.find(obj => obj.identifier == record.schoolCode)
          //console.log(schooldata,result.visits,record)
          if (schooldata && schooldata.status.toUpperCase() == 'VERIFIED') {
            list.map(obj => {
              if (obj._id === record._id) {
                obj.visitedFlag = true
                obj.actualKms = parseFloat(schooldata.kms)
              }
              return obj
            })
          } else {
            list.map(obj => {
              if (obj._id === record._id) {
                obj.visitedFlag = false
                obj.actualKms = 0
              }
              return obj
            })
          }
        } else {
          list.map(obj => {
            if (obj._id === record._id) {
              obj.visitedFlag = false
              obj.actualKms = 0
            }
            return obj
          })
        }
      }
      setListData([...list])
    } catch (e) {
      //console.log(e)
      toast.error('Something went wrong while fetching the actual data')
    }

  }

  const handlePopupAction = async (type) => {

    if (type === 'cancel') {
      setIsModel(false)
      setRemark('')
      return false
    }
    if ((remark && remark.trim() == '') || !remark) {
      toast.error('Enter Remarks First')
      return false
    }
    const date = new Date();
    const formattedDate = date.toISOString();
    let filteredCheckedRows
    if (profileMatch) {
      filteredCheckedRows = checkedRows.map(obj => ({
        claimStatus: (type === 'approve') ? "APPROVED" : "REJECTED",
        approvedDate: formattedDate,
        _id: obj?._id,
        claimId: obj?.claimId,
        approvedAmount: obj?.claimAmount,
        modifiedBy: userData?.username,
        modifiedBy_Uuid: loginData?.uuid,
        statusModifiedByRoleName: userData?.crm_role,
        statusModifiedByEmpCode: userData?.username.toUpperCase(),
        remarks: remark
      }));
    }
    else {
      filteredCheckedRows = checkedRows.map(obj => ({
        _id: obj._id,
        approver_roleName: obj.approver_roleName,
        approver_empCode: obj.approver_empCode,
        requestId: obj.requestId,
        requestStatus: (type === 'approve') ? "APPROVED" : "REJECTED",
        remarks: remark,
        approvedAmount: obj.metaInfo[0].Claim_Amount,
      }));
    }
    try {
      setIsModel(false)
      setRemark('')
      let response
      if (profileMatch) {
        if (type === 'approve')
          response = await updateBulk({ claimList: filteredCheckedRows })
        else if (type === 'reject')
          response = await updateBulk({ claimList: filteredCheckedRows })
      } else {
        if (type === 'approve')
          response = await approveClaimRequest({ requestList: filteredCheckedRows })
        else if (type === 'reject')
          response = await approveReject({ requestList: filteredCheckedRows })
      }

      if (response && response.status === 'success' || response?.message === 'Claims updated successfully')
        toast.success("Success!")
      else if (response)
        toast.error("**Error**")

      setFlag(!flag)
      setCheckedRows([])
      setParentFlag(false)

    } catch (error) {
      console.log("Error:", error);
    }
  }

  const handleRemark = (e) => {
    setRemark(e.target.value)
  };

  const handleEdit = (row) => {
    if(filtersApplied.length > 0){
      const rowKeyModify = {
        _id: row[CubeDataset.UserClaim.MongoID],
        School_Code:row[CubeDataset.UserClaim.schoolCode],
        School_Name:row[CubeDataset.UserClaim.schoolName],
        Visit_Number:row[CubeDataset.UserClaim.visitNumber],
        Visit_Purpose:row[CubeDataset.UserClaim.visitPurpose],
        Visit_Date:row[CubeDataset.UserClaim.visitDate],
        Visit_Time_In:row[CubeDataset.UserClaim.visitTimeIn],
        Visit_Time_Out:row[CubeDataset.UserClaim.visitTimeOut],
        Expense_type:row[CubeDataset.UserClaim.expenseType],
        Unit:row[CubeDataset.UserClaim.unitLabel],
        Claim_Amount:row[CubeDataset.UserClaim.claimAmount],
        billFile:row[CubeDataset.UserClaim.billFile],
      }
      navigate(`/authorised/update-userClaim/${rowKeyModify._id}`, { state: { row: rowKeyModify }, })
    }else{
      navigate(`/authorised/update-userClaim/${row._id}`, { state: { row: row }, })
    }
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#BFD7EA',
      color: '#474747',
      boxShadow: theme.shadows[1],
      fontSize: 12,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#BFD7EA',
    },
  }));

  return (
    <>
      <TableCell colSpan={12} className="p-0">
        <TableContainer component={Paper}>

          <div className="crm-sd-cliams-table-row-inner">
            <div className="crm-sd-cliams-table-row-label">Claims</div>
            {checkedRows?.length > 0 && !empCodeArray.includes(requestByEmpCode) && (<div className={classes.flkClaimBtn + ` crm-sd-claims-table-action`} >
              <Button
                className={'crm-btn crm-btn-outline crm-btn-sm'}
                onClick={() => handleApproveReject('approve')}
              >
                Approve
              </Button>
              <Button
                className={'crm-btn crm-btn-outline crm-btn-sm'}
                onClick={() => handleApproveReject('reject')}
              >
                Reject
              </Button>
              {profileMatch && checkedRows.filter(obj => obj.expenseType === "Conveyance").length > 0 &&
                <Button
                  className={'crm-btn crm-btn-outline crm-btn-sm'}
                  onClick={() => getActualData()}
                >
                  Actual Data
                </Button>
              }

            </div>)}
          </div>


          {loader ?
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
            :
            <Table aria-label="customized table"
              className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned">
              <TableHead>
                <TableRow className="cm_table_head" >
                  <TableCell></TableCell>
                  <TableCell>S.no.</TableCell>
                  <TableCell>Requested by</TableCell>
                  <TableCell>School name</TableCell>
                  <TableCell>School Code</TableCell>
                  <TableCell>Type of <br />expense</TableCell>
                  <TableCell>Label</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === (!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Claim_Amount": "claimAmount") : CubeDataset.UserClaim.claimAmount)}
                      direction={sortBy === (!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Claim_Amount": "claimAmount") : CubeDataset.UserClaim.claimAmount) ? sortOrder : 'desc'}
                      onClick={() => handleSort(!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Claim_Amount": "claimAmount") : CubeDataset.UserClaim.claimAmount)}
                    >
                      <div className="tableHeadCell">Claim <br />Amount</div>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Claim <br />Remark</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === (!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Visit_Date": "visitDate") : CubeDataset.UserClaim.visitDate)}
                      direction={sortBy === (!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Visit_Date": "visitDate") : CubeDataset.UserClaim.visitDate) ? sortOrder : 'desc'}
                      onClick={() => handleSort(!filtersApplied.length>0 ?  (!profileMatch? "metaInfo.Visit_Date": "visitDate") : CubeDataset.UserClaim.visitDate)}
                    >
                      <div className="tableHeadCell">Visit date</div>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>{profileMatch && 'Visited (Yes/No)'}</TableCell>
                  <TableCell>{profileMatch && 'Actual Kms'}</TableCell>
                  <TableCell>Bill File</TableCell>
                  <TableCell>{profileMatch && "Action"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  listData?.length > 0 ? (
                    listData?.map((row, i) => {
                      return (
                        <TableRow>
                          {profileMatch ? (row?.claimStatus === 'PENDING AT FINANCE' ?
                            <TableCell>
                              <Checkbox checked={isChecked(row)}
                                onChange={(event) => handleRowCheck(event, row)}
                                className={classes.customCheckbox}
                              />
                            </TableCell> :
                            <TableCell>
                              <Checkbox disabled
                                className={classes.customCheckbox}
                              />
                            </TableCell>) :
                            ((row?.requestStatus === 'APPROVED' || row?.requestStatus === 'REJECTED') ?
                              <TableCell>
                                <Checkbox disabled
                                  className={classes.customCheckbox}
                                />
                              </TableCell> :
                              <TableCell>
                                <Checkbox checked={isChecked(row)}
                                  onChange={(event) => handleRowCheck(event, row)}
                                  className={classes.customCheckbox}
                                />
                              </TableCell>)}
                          <TableCell>{i + 1 + ((listPageNo - 1) * itemsPerPage)}</TableCell>
                          {!filtersApplied.length>0 ? <>
                            <TableCell >{row?.requestBy_name}</TableCell>
                            <TableCell>{!profileMatch ? row?.metaInfo?.[0]?.School_Name : row?.schoolName}</TableCell>
                            <TableCell>{!profileMatch ? row?.metaInfo?.[0]?.School_Code : row?.schoolCode}</TableCell>
                            <TableCell>{!profileMatch ? row?.metaInfo?.[0]?.Expense_type : row?.expenseType}</TableCell>
                            <TableCell>{!profileMatch ? (row?.metaInfo?.[0]?.unitLabel ? row?.metaInfo?.[0]?.unitLabel : 'NA') : (row?.unitLabel ? row?.unitLabel : 'NA')}</TableCell>
                            <TableCell>{!profileMatch ? (row?.metaInfo?.[0]?.Claim_Amount ? row?.metaInfo?.[0]?.Claim_Amount : 'NA') : (row?.claimAmount ? row?.claimAmount : 'NA')}</TableCell>
                            <LightTooltip title={!profileMatch ? (row?.metaInfo?.[0]?.claimRemarks ? row?.metaInfo?.[0]?.claimRemarks : 'NA') : (row?.claimRemarks ? row?.claimRemarks : 'NA')} arrow>
                              <TableCell sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                  {!profileMatch ? (row?.metaInfo?.[0]?.claimRemarks ? row?.metaInfo?.[0]?.claimRemarks : 'NA') : (row?.claimRemarks ? row?.claimRemarks : 'NA')}
                              </TableCell>
                            </LightTooltip>
                            <TableCell>{!profileMatch ? (row?.currentStatus ? (row?.currentStatus==='REJECTED'? row?.currentStatus+` AT ${row?.profileName}` : row?.currentStatus) : 'NA') : (row?.claimStatus ? (row?.claimStatus==='REJECTED'? row?.claimStatus+` AT ${row?.profileName}`:row?.claimStatus): 'NA')}</TableCell>
                            <TableCell>{!profileMatch ? (row?.metaInfo?.[0]?.Unit ? row?.metaInfo?.[0]?.Unit : 'NA') : (row?.unit ? row?.unit : 'NA')}</TableCell>
                            <TableCell>{!profileMatch ? (row?.metaInfo?.[0]?.Visit_Date ? moment.utc(row?.metaInfo?.[0]?.Visit_Date).local().format('DD-MM-YYYY, (HH:mm:ss)') : 'NA') : (row?.visitDate ? moment.utc(row?.visitDate).local().format('DD-MM-YYYY, (HH:mm:ss)') : 'NA')}</TableCell>
                            <TableCell>{profileMatch && (row?.actualKms != 'NA' && (row?.metaInfo?.[0]?.Expense_type == "Conveyance" || row?.expenseType == "Conveyance") ? (row.visitedFlag ? 'Yes' : 'No') : "NA")}</TableCell>
                            <TableCell>{profileMatch && (row?.actualKms != 'NA' && (row?.metaInfo?.[0]?.Expense_type == "Conveyance" || row?.expenseType == "Conveyance") ? row?.actualKms : 'NA')}</TableCell>
                            <TableCell>
                              {(profileMatch ? row?.billFile : row?.metaInfo?.[0]?.billFile) ? (
                                <a
                                  href={profileMatch ? row?.billFile : row?.metaInfo?.[0]?.billFile}
                                  target="_blank"
                                  download
                                >
                                  <IconFolderMain />
                                </a>
                              ) : (
                                <IconFolderNormal />
                              )}
                            </TableCell>
                            <TableCell>
                              {
                                profileMatch && !(row?.claimStatus === 'APPROVED' || row?.claimStatus === 'REJECTED') &&
                                <div
                                  className={'crm-btn crm-btn-outline crm-btn-sm'}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleEdit(row)}
                                >
                                  Edit
                                </div>
                              }
                            </TableCell>
                          </> :
                          <>
                            <TableCell >{row[CubeDataset.UserClaim.requestByEmpCode]}</TableCell>
                            <TableCell >{row[CubeDataset.UserClaim.schoolName]}</TableCell>
                            <TableCell >{row[CubeDataset.UserClaim.schoolCode]}</TableCell>
                            <TableCell >{row[CubeDataset.UserClaim.expenseType]}</TableCell>
                            <TableCell >{row[CubeDataset.UserClaim.unitLabel]}</TableCell>
                            <TableCell >{row[CubeDataset.UserClaim.claimAmount]}</TableCell>
                            <LightTooltip title={row[CubeDataset.UserClaim.claimRemarks] ?? "NA"} arrow>
                              <TableCell sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                  {row[CubeDataset.UserClaim.claimRemarks] ?? "NA"}
                              </TableCell>
                            </LightTooltip>
                            <TableCell >{row[CubeDataset.UserClaim.claimStatus]}</TableCell>
                            <TableCell >{row[CubeDataset.UserClaim.unit]}</TableCell>
                            <TableCell >{moment.utc(row[CubeDataset.UserClaim.visitDate]).local().format('DD-MM-YYYY, (HH:mm:ss)')}</TableCell>
                            <TableCell >{profileMatch && (row[CubeDataset.UserClaim.expenseType] === "Conveyance" ? (row[CubeDataset.UserClaim.visitDate]?'Yes':"No") : "NA")}</TableCell>
                            <TableCell >{profileMatch && (row[CubeDataset.UserClaim.expenseType] === "Conveyance"? row[CubeDataset.UserClaim.unit] : 'NA')}</TableCell>
                            <TableCell>
                              {row[CubeDataset.UserClaim.billFile] ? (
                                <a
                                  href={row[CubeDataset.UserClaim.billFile]}
                                  target="_blank"
                                  download
                                >
                                  <IconFolderMain />
                                </a>
                              ) : (
                                <IconFolderNormal />
                              )}
                            </TableCell>
                            <TableCell>
                              {
                                profileMatch && !(row[CubeDataset.UserClaim.claimStatus] === 'APPROVED' || row[CubeDataset.UserClaim.claimStatus] === 'REJECTED') &&
                                <div
                                  className={'crm-btn crm-btn-outline crm-btn-sm'}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleEdit(row)}
                                >
                                  Edit
                                </div>
                              }
                            </TableCell>

                          </>
                          }


                        </TableRow>
                      )
                    })

                  ) :
                    <TableCell colSpan="100%">
                      <div className={`crm-sd-table-no-data`}>
                        <p>No Data</p>
                      </div>
                    </TableCell>
                }
              </TableBody>
            </Table>
          }
          <div className='center cm_pagination'>
            <Pagination pageNo={listPageNo} setPagination={setListPageNo} lastPage={lastPage} />
          </div>

          {isModel && <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={isModel}
            closeAfterTransition
          >
            <Fade in={isModel}>
              <div className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                <div>
                  <div className={classes.modalTitle}>Are you sure you want to {actionType} the claims?</div>
                  <div>
                    <TextField
                      fullWidth
                      value={remark}
                      onChange={handleRemark}
                      multiline
                      minRows="3"
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          boxShadow: "0px 0px 8px #00000029",
                          outline: 'none'
                        },
                      }}
                    />
                    <div style={{ marginBottom: 0, marginRight: 0, display: "flex", justifyContent: "space-around" }} className="modal-footer">
                      <Button onClick={() => handlePopupAction(actionType)} color="primary" autoFocus className={classes.submitBtn} variant="outlined">{actionType}</Button>
                      <Button onClick={() => handlePopupAction('cancel')} className={classes.submitBtn} color="primary" variant="outlined">Cancel</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>}
        </TableContainer>
      </TableCell >
    </>
  );
};
