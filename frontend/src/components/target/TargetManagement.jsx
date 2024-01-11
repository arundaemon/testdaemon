import React, { useEffect, useState } from 'react'
import { addTarget, downloadSampleTarget, getTargetList, getRoleNameProducts } from '../../config/services/target';
import { Container, TextField, Button, Grid, Card, InputAdornment, Link, Modal, Box, Typography, CircularProgress, LinearProgress, Divider } from "@mui/material";
import Page from "../Page";
// import TargetTable from './TargetTable';
import toast from 'react-hot-toast';
import { makeStyles } from '@mui/styles';
import _, { assignIn } from 'lodash';
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import UploadTargetTable from './UploadTargetTable';
import Pagination from '../../pages/Pagination';
import { useNavigate } from 'react-router-dom';
import { DisplayLoader } from '../../helper/Loader';
import DownIcon from '../../assets/icons/downIcon.svg'
import UpIcon from '../../assets/icons/upIcon.svg'
import SearchIcon from "../../assets/icons/icon_search.svg";
import { getUserData } from '../../helper/randomFunction/localStorage';
import Select from 'react-select';
import CrossIcon from "../../assets/image/crossIcn.svg"
import ModalTable from './ModalTable';

const useStyles = makeStyles(() => ({
  subheading: {
    fontSize: "16px",
    marginBottom: "12px",
    fontWeight: "600"
  },
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  uploaderFile: {
    display: "flex",
    width: "500px",
    height: "44px",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #dedede",
    padding: "9px 20px",
    borderRadius: "4px",
    textAlign: "left",
    transition: "all .3s"
  },
  uploaderFileBtn: {
    position: "relative",
    overflow: "hidden"
  },
  browse: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4482FF",
    cursor: "pointer",
    textDecoration: 'underline'
  },
  emptyExcel: {
    color: 'black',
    fontSize: '19px',
    marginRight: '-14px',
    cursor: 'default'
  },
  noteHead: {
    fontSize: "12px",
    color: "#85888A",
    display: "block",
    marginTop: "5px"
  },
  downloadSample: {
    marginTop: "10px",
    lineHeight: "19px",
    color: "#4482FF",
    fontSize: "16px",
    fontWeight: "600",
    textDecorationColor: "#4482FF",
    cursor: 'pointer'
  },
  circularLoader: {
    width: '10px',
    height: '10px',
    marginTop: '3px',
    marginLeft: '4px'
  },
  bigFileName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "left",
    transition: "all .3s",
    color: "#85888a",
    fontSize: "14px"
  },
  placeholder: {
    color: "#85888a",
    fontSize: "14px",
    marginLeft: '-70px'
  },
  loaderVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    height: "50vh",
    width: "100%"
  },
  excelSubmitBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "15px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "95px",
    marginBottom: '20px',
    width: "max-content",
    float: 'right',
  }
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  boxShadow: 0,
  borderRadius: 1,
  p: 4,
};

const TargetManagement = () => {

  const [viewMoreDetails, setViewMoreDetails] = useState(false)
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
  const [fileName, setFileName] = useState('Select attach file')
  const [excelFile, setExcelFile] = useState();
  const [loader, setLoader] = useState(false)
  const [downloadLoader, setDownloadLoader] = useState(false)
  const [uploadTargetList, setUploadTargetList] = useState([])
  const [childRolesList, setChildRolesList] = useState([])
  const [childRoleList, setChildRoleList] = useState([])
  const [assignTarget, setAssignTarget] = useState(false)
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [roleName] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);
  const [totalTarget, setTotalTarget] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [selectValue, setSelectValue] = useState({ label: 'This Financial Year', value: 'year' })
  const [selectMonth, setSelectMonth] = useState(null)
  const [paginatedData, setPaginatedData] = useState([])
  const [successFileLength, setSuccessFileLength] = useState(0)
  const [successFile, setSuccessFile] = useState('')
  const [errorFile, setErrorFile] = useState('')
  const [errorFileLength, setErrorFileLength] = useState(0)
  const [uploadCheck, setUploadCheck] = useState(false)
  const [targetListRefresh, setTargetListRefresh] = useState(false)
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()
  const classes = useStyles();
  const options = [
    { label: 'This Financial Year', value: 'year' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Month', value: 'month' }
  ]

  const monthArrayOptions = [
    { label: `April ${currentYear}`, value: `${currentYear}-04-01` },
    { label: `May ${currentYear}`, value: `${currentYear}-05-01` },
    { label: `June ${currentYear}`, value: `${currentYear}-06-01` },
    { label: `July ${currentYear}`, value: `${currentYear}-07-01` },
    { label: `August ${currentYear}`, value: `${currentYear}-08-01` },
    { label: `September ${currentYear}`, value: `${currentYear}-09-01` },
    { label: `October ${currentYear}`, value: `${currentYear}-10-01` },
    { label: `November ${currentYear}`, value: `${currentYear}-11-01` },
    { label: `December ${currentYear}`, value: `${currentYear}-12-01` },
    { label: `January ${currentYear + 1}`, value: `${currentYear + 1}-01-01` },
    { label: `February ${currentYear + 1}`, value: `${currentYear + 1}-02-01` },
    { label: `March ${currentYear + 1}`, value: `${currentYear + 1}-03-01` }
  ]


  const handleDropDown = (e) => {
    setSelectValue(e)
  }

  const handleMonthDropDown = (e) => {
    setSelectMonth(e)
  }

  const handleSearch = (e) => {
    let searchQuery = e.target.value
    setSearchValue(searchQuery)
  }

  const uploadData = () => {
    if (selectMonth === null) {
      toast.dismiss()
      toast.error('Please Select Target Month')
      return
    }
    let formData = new FormData();
    let targetMonth = selectMonth?.value

    formData.append('target', excelFile)
    formData.append('createdBy', createdBy)
    formData.append('createdBy_Uuid', createdBy_Uuid)
    formData.append('modifiedBy', modifiedBy)
    formData.append('modifiedBy_Uuid', modifiedBy_Uuid)
    formData.append('targetMonth', targetMonth)
    formData.append('roleName', roleName)
    setLoader(true)
    addTarget(formData)
      .then(res => {
        if (res?.result) {
          let data = res?.result
          let success = res?.successFile
          let error = res?.errorFile
          toast.success(res?.message)
          let successLength = success?.length
          let errorLength = error?.length
          setSuccessFile(success)
          setErrorFile(error)
          setSuccessFileLength(successLength)
          setErrorFileLength(errorLength)
          setUploadCheck(!uploadCheck)
          setTargetListRefresh(!targetListRefresh)
        }
        if (res?.data) {
          let error = res?.data?.error
          let { errorMessage } = error
          toast.error(errorMessage)
        }
        setExcelFile('')
        setFileName('Select attach file')
        setSelectMonth(null)
        setLoader(false)
      })
      .catch(err => {
        console.log(err, 'Error while uploading target')
        setLoader(false)
      })
  }

  const handleSubmit = () => {
    let filledDetails = _.cloneDeep();
    filledDetails.fileName = excelFile;

    uploadData(filledDetails)
    setFileName('Select attach file')
    setExcelFile()
  }

  const handleDownload = async () => {
    let params = {
      roleName: getUserData('userData')?.crm_role
    }
    setDownloadLoader(true)
    downloadSampleTarget(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Target_Sample.csv');
        document.body.appendChild(link);
        link.click();
        setDownloadLoader(false)
        toast.success('Sample Downloaded')
      });
  }

  const onFileUpload = (e) => {
    const fileName = e.target.files[0].name
    const fileExtension = fileName.replace(/^.*\./, "")

    if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv') {
      setExcelFile(e.target?.files?.[0]);
      setFileName(fileName)
    }
    else {
      toast.error('File format not supported')
      setExcelFile('')
      return false
    }

  }

  const emptyExcelFile = () => {
    setExcelFile();
    setFileName('Select attach file')
  }

  const handleAssignTarget = () => {
    setAssignTarget(!assignTarget)
  }



  const targetList = async (childList) => {
    try {
      let range = selectValue?.value
      let params = { ...sortObj, search, childList, range };
      setLoader(true)
      setLastPage(false)
      const res = await getTargetList(params);
      let data = res?.data;
      setUploadTargetList(data);
      handlePagination(data, pageNo, itemsPerPage, search)
      setLoader(false)
    } catch (err) {
      console.error('Error in getTargetList api', err);
      setLoader(false)

    }
  };

  const handlePagination = async (data, pageNo, itemsPerPage, search) => {
    if (search?.length > 0) {
      data = await handleSearchData(data, search)
    }
    let totalData = data?.length
    let totalPageCount = Math.floor(totalData / itemsPerPage) + 1
    let startIndex = (pageNo - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let sortedData = handleSort(data)
    let modifiedData = sortedData?.slice(startIndex, endIndex);
    if (pageNo === totalPageCount || data?.length < itemsPerPage) setLastPage(true)
    if (pageNo !== totalPageCount) setLastPage(false)
    setPaginatedData(modifiedData)
  };

  const handleSearchData = (data, search) => {
    let searchData = data?.filter(item => {
      return item?.firstRecord?.displayName?.toLowerCase()?.includes(search?.toLowerCase())
    })
    setPagination(1)
    return searchData
  }

  const handleSort = (data) => {
    data?.sort((a, b) => {
      const dateA = a?.firstRecord?.updatedAt ? new Date(a?.firstRecord?.updatedAt) : new Date(0);
      const dateB = b?.firstRecord?.updatedAt ? new Date(b?.firstRecord?.updatedAt) : new Date(0);
      return dateB - dateA;
    });
    return data
  }

  const allRoleNameProducts = async () => {
    setTotalTarget(0)
    let range = selectValue?.value
    let params = { roleName, range }
    getRoleNameProducts(params)
      .then(res => {
        let list = res?.result
        let totalAmount = list?.reduce((sum, obj) => {
          if (typeof obj.targetAmount === 'number') {
            return sum + obj.targetAmount;
          }
          return sum;
        }, 0)
        // totalAmount = totalAmount?.toFixed(2)
        setTotalTarget(totalAmount)
      })
      .catch(err => {
        setTotalTarget(0)
        console.error(err, `Error while fetching all products for ${roleName}`)
      })
  }


  useEffect(() => {
    let childList = DecryptData(localStorage?.getItem("childRoles"));
    targetList(childList);
    setChildRolesList(childList)
    allRoleNameProducts();
  }, [selectValue, targetListRefresh]);


  useEffect(() => {
    handlePagination(uploadTargetList, pageNo, itemsPerPage, search)
  }, [pageNo, assignTarget, search])


  return (

    <Page title="Extramarks | Target Management" className="main-container compaignManagenentPage datasets_container targetIncentiveManagementContainer">
      <div className='tableCardContainer'>
        <h3>Target</h3>
        {!viewMoreDetails ?
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <p>Total Target Assigned to me: <b>{totalTarget}/-</b></p>
              <Link className={classes.downloadSample} style={{ marginLeft: '10px', marginBottom: '10px' }} onClick={() => navigate(`/authorised/user-details/${roleName}/${selectValue?.value}`)} >View Details</Link>
              <div style={{ marginLeft: 'auto', width: '17%', marginRight: '20px' }}>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={options}
                  value={selectValue}
                  onChange={handleDropDown}
                />
              </div>
            </div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <Link className={classes.downloadSample} onClick={handleAssignTarget} style={{ marginRight: '8px' }}>
                Assign Target to Team
              </Link>
              <img style={{ marginTop: '10px' }} src={assignTarget ? UpIcon : DownIcon} alt="" />
              <div style={{ flex: 1 }}></div>

              {assignTarget &&
                <div style={{ marginRight: '20px' }}>
                  <TextField
                    className={`inputRounded search-input width-auto`}
                    type="search"
                    placeholder="Search Assignee"
                    value={search}
                    onChange={handleSearch}
                    InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={SearchIcon} alt="" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              }
            </div>
            {assignTarget ?
              <div style={{ marginTop: '40px' }}>
                <h3 className={classes.subheading}>Upload a file</h3>
                <div className={classes.uploaderFile}>
                  <div style={{ width: '45%', marginLeft: '-20px' }}>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="color"
                      options={monthArrayOptions}
                      value={selectMonth}
                      onChange={handleMonthDropDown}
                    />
                  </div>
                  <label className={fileName?.length <= 26 ? classes.placeholder : classes.bigFileName}>{fileName}</label>
                  {!excelFile ?
                    <div className={classes.uploaderFileBtn} onChange={(e) => onFileUpload(e)} id="outlined-basic" >
                      <label className={classes.browse} for="lecture_note" >Browse</label>
                      <input style={{ display: 'none' }} id="lecture_note" type="file" accept=".csv,.xls,.xlsx" />
                    </div>
                    :
                    <Button className={classes.emptyExcel} style={{ color: 'black' }} onClick={emptyExcelFile}>
                      {loader ?
                        <CircularProgress style={{ width: '23px', height: '23px' }} /> :
                        "X"
                      }
                    </Button>
                  }
                </div>
                <span className={classes.noteHead} >Note:Excel must be in XLsx,Xls,CSV format</span>
                {excelFile &&
                  <div className={classes.excelSubmitBtn} style={{ pointerEvents: loader ? 'none' : null, cursor: loader ? 'not-allowed' : 'pointer' }} onClick={uploadData} >Submit</div>
                }
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                  <Link className={classes.downloadSample} onClick={handleDownload}>Download Sample  </Link>
                  {downloadLoader &&
                    <CircularProgress style={{ width: '23px', height: '23px', marginTop: '8px', marginLeft: '10px' }} />
                  }
                </div>
                {loader ?
                  <div className={classes.loaderVisible}>
                    {DisplayLoader()}
                  </div>
                  : (
                    paginatedData?.length > 0 ? (
                      <UploadTargetTable list={paginatedData} pageNo={pageNo} itemsPerPage={itemsPerPage} timeRange={selectValue} />
                    ) : (
                      <div className={classes.noData}>
                        <p>No Data Available</p>
                      </div>
                    )
                  )}
                <div className='center cm_pagination'>
                  <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
              </div> :
              null
            }
          </>
          :
          null
        }
        <Modal hideBackdrop={true}
          open={uploadCheck}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="targetModal1"
        >
          <Box sx={style} className="modalContainer">
            <img className='crossIcon' onClick={() => { setUploadCheck(!uploadCheck); }} src={CrossIcon} alt="close" />
            <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
              Upload process completed
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ModalTable successFile={successFile} successFileLength={successFileLength} errorFile={errorFile} errorFileLength={errorFileLength} />
            </Typography>
          </Box>
        </Modal>
      </div>
    </Page >
  )
}
export default TargetManagement