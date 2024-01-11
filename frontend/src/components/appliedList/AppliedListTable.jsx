import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Fade,
    styled
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { getFinanceRequestList, getRequestList } from "../../config/services/approvalRequest";
  import { getUserData } from "../../helper/randomFunction/localStorage";
  import Pagination from "../../pages/Pagination";
  import { DisplayLoader } from "../../helper/Loader";
  import { useStyles } from "../../css/ClaimForm-css";
  import { ReactComponent as IconView } from '../../assets/icons/icon_view.svg';
  import Env_Config from '../../config/settings'
  import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
  import { fetchProfileList } from "../../helper/DataSetFunction";
  import CubeDataset from "../../config/interface";
import moment from "moment";

  
  
  export const AppliedListTable = (props) => {
    let { requestByEmpCode, reqStatus, reqDate } = props;
    const [listPageNo, setListPageNo] = useState(1)
    const [lastPage, setLastPage] = useState(false)
    const [loader, setLoader] = useState(false)
    const [listData, setListData] = useState(null)
    const [itemsPerPage] = useState(10)
    const [flag, setFlag] = useState(0)
    const [isPresent, setIsPresent] = useState(false)
    const classes = useStyles();
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'))
    const financeProfile = Env_Config.FINANCE_PROFILES
    const [profileMatch, setProfileMatch] = useState(financeProfile.indexOf(userData?.crm_profile) > -1)
  
  
    const getRequestData = async () => {
      try {
        let res = await getFinanceRequestList(`empCode=${requestByEmpCode}&status=${reqStatus}&reqDate=${reqDate}&pageNo=${listPageNo-1}&count=${itemsPerPage}`)
        setLastPage(false)
        setLoader(true)
        if (res?.result) {
          let data = res?.result
        
          let filteredRoles = data
            .filter(({ claimStatus }) => claimStatus === 'REJECTED')
            .map((obj) => (obj['statusModifiedByRoleName']))
          
          let response = await fetchProfileList(filteredRoles)

          let responseData = response.loadResponses[0].data
          let list = data?.map(obj => {
            obj.visitedFlag = false
            obj.actualKms = 'NA'
            responseData?.map(item => {
              if(item[CubeDataset.TblEmployee.roleName]=== obj?.statusModifiedByRoleName && financeProfile.indexOf(item[CubeDataset.TblEmployee.profileName]) > -1){
                obj.profileName = 'FINANCE'
              } else if(item[CubeDataset.TblEmployee.roleName]=== obj?.statusModifiedByRoleName){
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
  

    useEffect(() => {
      getRequestData()
    }, [listPageNo, reqStatus, flag])
  
    const handleEdit = (row) => {
      navigate(`/authorised/update-userClaim/${row._id}`, {state: { row: row },})
    } 

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
                    <TableCell>S.no.</TableCell>
                    <TableCell>School name</TableCell>
                    <TableCell>School Code</TableCell>
                    <TableCell>Type of <br/>expense</TableCell>
                    <TableCell>Unit Label</TableCell>
                    <TableCell>Claim <br/>Amount</TableCell>
                    <TableCell>Claim <br/>Remarks</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Status <br/>Remark</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell>Visit date</TableCell>
                    <TableCell>Bill File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    listData?.length > 0 ? (
                      listData?.map((row, i) => {
                        return (
                          <TableRow>
                            <TableCell>{i + 1 + ((listPageNo - 1) * itemsPerPage)}</TableCell>
                            <TableCell>{row?.schoolName}</TableCell>
                            <TableCell>{row?.schoolCode}</TableCell>
                            <TableCell>{row?.expenseType}</TableCell>
                            <TableCell>{row?.unitLabel??'NA'}</TableCell>
                            <TableCell>{row?.claimAmount??'NA'}</TableCell>
                            <LightTooltip title={(row?.claimRemarks ? row?.claimRemarks : 'NA')} arrow>
                              <TableCell sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{(row?.claimRemarks ? row?.claimRemarks : 'NA')}</TableCell>
                            </LightTooltip>
                            <TableCell>{(row?.claimStatus ? (row?.claimStatus==='REJECTED'? row?.claimStatus+` AT ${row?.profileName}`: row?.claimStatus) : 'NA')}</TableCell>
                            <LightTooltip title={(row?.remarks ? row?.remarks : 'NA')} arrow>
                              <TableCell sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{(row?.remarks ? row?.remarks : 'NA')}</TableCell>
                            </LightTooltip>
                            <TableCell>{(row?.unit ? row?.unit : 'NA')}</TableCell>
                            <TableCell>{(row?.visitDate? moment.utc(row?.visitDate).local().format('DD-MM-YYYY, (HH:mm:ss)'): 'NA')}</TableCell>
                            <TableCell>
                            {(row?.billFile) && (
                              <a
                                href={row?.billFile}
                                target="_blank"
                                download
                              >
                                <IconView />
                              </a>
                            )}
                            </TableCell>
                            
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
  

          </TableContainer>
        </TableCell >
      </>
    );
  };
  