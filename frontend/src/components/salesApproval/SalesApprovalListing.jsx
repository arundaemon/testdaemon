import React, { useState, useEffect } from 'react'
import Page from "../Page";
import {
    Container,
    Button,
    Grid,
    Divider,
    TextField,
    InputAdornment,
    Paper,
    TablePagination,
    Typography,
    Autocomplete,
    Alert,
    Fade,
    Modal,
    Breadcrumbs,
    Box
} from "@mui/material";
import SearchIcon from '../../assets/icons/icon_search.svg';
import { makeStyles } from '@mui/styles';
import FilterIcon from "../../assets/image/filterIcon.svg"
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { DisplayLoader } from '../../helper/Loader';
import LeadFilter from '../leadFilters/LeadFilter';
import toast from 'react-hot-toast';
import { DecryptData, EncryptData } from '../../utils/encryptDecrypt';
import CubeDataset from "../../config/interface";
import SalesApprovalListingTable from './SalesApprovalListingTable';
import { acceptApprovalRequest, getSalesApprovalList, getSingleSalesApproval, rejectApprovalRequest, updateTypeStatus } from '../../config/services/salesApproval';
import { getApprovalMatrixList, getSingleApprovalMatrix } from '../../config/services/approvalMatrix';
import { getSalesApproval } from '../../helper/DataSetFunction';
import Loader from "../../pages/Loader";
import { useDispatch, useSelector } from 'react-redux';
import { salesApprovalAction } from '../../redux/reducers/salesApprovalReducer';
import { Link } from 'react-router-dom';
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as IconSearchSetting } from "../../assets/icons/icon-listing-setting.svg";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";

const useStyles = makeStyles((theme) => ({
    cusCard: {
        padding: "2px",
        boxShadow: "0px 0px 8px #00000029",
        borderRadius: "8px",
    },
    RevenueCard: {
        padding: "0px",
        overflow: "hidden",
    },
    submitBtn: {
        fontWeight: "400 !important",
        backgroundColor: "#f45e29",
        border: "1px solid #f45e29",
        borderRadius: "4px !important",
        color: "#ffffff !important",
        padding: "6px 16px !important",
        marginLeft: "10px",
        "&:hover": {
            color: "#f45e29 !important",
        },
        [theme.breakpoints.down('md')]: {
            display: "none"
        },
    },
    cusSelect: {
        width: "100%",
        fontSize: "14px",
        marginLeft: "1rem",
        borderRadius: "4px",
        [theme.breakpoints.up('md')]: {
            display: "none"
        },
    },
    mbForMob: {
        [theme.breakpoints.down('md')]: {
            marginBottom: "1rem",
        }
    },
    filterSection: {
        display: "flex",
        alignItems: "center",
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #fff',
        boxShadow: '0px 0px 4px #0000001A',
        minWidth: '300px',
        borderRadius: '4px',
        textAlign: 'center',
        padding: "20px"
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "600",
        marginTop: "10px",
        marginBottom: "40px",
        textAlign: 'centre'
    },
      cusCard: {
        padding: "18px",
        boxShadow: "0px 0px 8px #00000029",
        borderRadius: "8px",
        margin: "0.5rem 1rem",
      },
      approvalBtn: {
        width:"200px",
        backgroundColor: "#f45e29",
        margin: "30px",
        border: "1px solid #f45e29",
        borderRadius: "4px !important",
        color: "#ffffff !important",
        padding: "6px 16px !important",
        textDecoration: 'none',
        "&:hover": {
          color: "#f45e29 !important",
          background: '#fff !important'
        },
      },
}));

const SalesApprovalListing = () => {
    const classes = useStyles();
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [dataSetIndex, setDataSetIndex] = useState(CubeDataset.Leadassigns)
    const [sortObj, setSortObj] = useState({ sortKey: CubeDataset.Leadassigns.updatedAt, sortOrder: '-1' })
    const [selectType, setSelectType] = useState()
    const [approvalList, setApprovalList] = useState()
    const [approvalType, setApprovalType] = useState([{label: '', value: ''}])
    const [displayFields, setDisplayFields] = useState()
    const [searchValue, setSearchValue] = useState()
    const [pageNo, setPagination] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100)
    const [lastPage, setLastPage] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, setLoader] = useState(false)
    // const [approvalIDs, setApprovalIDs] = useState([]);
    const [approvalLevels, setApprovalLevels] = useState()
    const [flag, setFlag] = useState(false)
    const userData = JSON.parse(localStorage.getItem('userData'))
    const empCode = userData?.username.toUpperCase()
    const loginData = JSON.parse(localStorage.getItem('loginData'))
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModel, setIsModel] = useState(false)
    const [newRemark, setNewRemark] = useState()
    const [actionType, setActionType] = useState()
    const dispatch = useDispatch();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const salesApprovalState = useSelector((state) => state.salesApprovalState)

// search start
    const handleSearchValueChange = _.debounce((e) => {
        let { value } = e.target
        if (value.trim() !== ''){
          setSearchValue(value);
        } else
        setSearchValue("")
      }, 600)

    const handleSearchApproval = async() => {
        const response = await getSalesApprovalList(selectType?.value + `&search=${searchValue}&assignedToEmpId=${empCode}&pageNo=${pageNo-1}&count=${rowsPerPage}`)
        setApprovalList(response?.result)
      }
// search end

// types start
    useEffect(()=> {
        fetchTypeProductCombination()
        dispatch(salesApprovalAction.reset())
    }, [])

    const fetchTypeProductCombination = async() => {
        const response = await getApprovalMatrixList()
        const combinedArray = response?.result?.map(item => ({
            label: `${item.approvalType}-${item.approvalGroupName}`,
            value: `type=${item.approvalType}&groupCode=${item.approvalGroupCode}`
            // value: `type=${item.approvalType}&product=${item.approvalProductName}`
          }));
        setApprovalType(combinedArray)
    }
// types end
    
 // filter start   
    const handleFilter = (e) => {
        setFilterAnchor(e.currentTarget)
    }

    const applyFilters = () => {
        if (filters.find(fltObj => fltObj?.label === 'Select Filter')) {
            toast.error('Select Valid Filter')
            return
        }
        sortObj.sortKey = dataSetIndex.updatedAt
        sortObj.sortOrder = 'desc'
        let filtersCopy = _.cloneDeep(filters)
        localStorage.setItem('salesApprovalFilter', EncryptData(filtersCopy))
        setFiltersApplied(filtersCopy)
        setFilterAnchor(null)
    }
    const addFilter = () => {
        let filtersCopy = _.cloneDeep(filters)
        if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
            toast.error("First fill empty filter");
            return;
        }
        filtersCopy?.push({ label: 'Select Filter' })
        setFilters(filtersCopy)
    }
    const removeFilter = (filterIndex) => {
        let filtersCopy = _.cloneDeep(filters)
        filtersCopy?.splice(filterIndex, 1)
        setFilters(filtersCopy)
        setFiltersApplied(filtersCopy)
        localStorage.setItem('filtersCopy', EncryptData(filtersCopy))
        if (filtersCopy?.length == 0) {
            sortObj.sortKey = dataSetIndex.updatedAt
            sortObj.sortOrder = -1
            localStorage.removeItem("filtersCopy");
        }
    }

    const removeAllFilters = () => {
        sortObj.sortKey = dataSetIndex.updatedAt
        sortObj.sortOrder = -1
        setFilters([])
        setFiltersApplied([])
        localStorage.removeItem("filtersCopy");
    }

    const fetchCubeSalesApprovalList = () => {
        let params = { pageNo, itemsPerPage, searchValue, filtersApplied, displayFields }
        setLastPage(false)
        setLoader(false)
        getSalesApproval(params)
          .then(res => {
            let data = res?.loadResponses?.[0]?.data
            setApprovalList(res?.loadResponses?.[0]?.data)
            setLoader(true)
            if (data?.length < itemsPerPage) setLastPage(true)
            setLoader(true)
          })
          .catch(err => {
            setLastPage(true)
            console.error(err, 'Error while fetching claim list from report engine')
          })
      }
    
//   useEffect(() => {
//     const applyFilter = DecryptData(localStorage?.getItem("salesApprovalFilter"));
//     if (applyFilter?.length === 0 || applyFilter === null)  {
//         fetchSalesApprovalList()
//     }
//     else if (filtersApplied?.length > 0) {
//         fetchCubeSalesApprovalList()
//     }
//   }, [filtersApplied])

// filter end

// fetch list start
    useEffect(async() => {
        if(salesApprovalState.matrixType && !searchValue){
            setLoader(true)
            await fetchSelectedApprovalMatrix()
            await fetchSalesApprovalList()
            setLoader(false)
        }
        else if(salesApprovalState.matrixType && searchValue){
            handleSearchApproval()
        }

    }, [salesApprovalState.matrixType, flag, pageNo, rowsPerPage, searchValue])

    const fetchSelectedApprovalMatrix = async() => {
        const response = await getSingleApprovalMatrix(salesApprovalState.matrixType)
        setDisplayFields(response?.result[0]?.displayFields)
        setApprovalLevels(response?.result[0]?.approvalLevels)
    }
    const fetchSalesApprovalList = async() => {
        const response = await getSalesApprovalList(salesApprovalState.matrixType?.value + `&assignedToEmpId=${empCode}&pageNo=${pageNo-1}&count=${rowsPerPage}`)
        setApprovalList(response?.data?.responseData?.result?.data)
        setLastPage(response?.data?.responseData?.result?.totalPages)
    }
// fetch list end

// approve, reject api start
    const handleUpdateApprovalId = (param) => {
        setSelectedRows(param)
    }

    const handleApprove = async() => {
        const approvalIds = selectedRows?.map((row) => row.approvalId)
        if(!(approvalIds.length > 0)) {toast.error("Please select atleast one row"); return false}
        try{
            const response = await acceptApprovalRequest({approvalId:approvalIds, uuid: loginData?.uuid, remark:newRemark})
            setNewRemark()
            if(response?.data?.status === 400){
                toast.error(response?.data?.error?.errorMessage)
                setIsModel(false)
            }
            else if(response?.data?.status === 1){
                toast.success(response?.data?.responseData?.message)
                setIsModel(false)
            }
            setSelectedRows([])
            setFlag(!flag)
        }catch(err){
            console.log("Error in ApprovalRequest :", err);
        }
      }
    
      const handleReject = async() => {
        const approvalIds = selectedRows?.map((row) => row.approvalId)
        if(!(approvalIds.length > 0)) {toast.error("Please select atleast one row"); return false}
        try{
            const response = await rejectApprovalRequest({approvalId:approvalIds, uuid: loginData?.uuid, remark: newRemark})
            setNewRemark()
            if(response?.data?.status === 400){
                toast.error(response?.data?.error?.errorMessage)
                setIsModel(false)
            }
            else if(response?.data?.status === 1){
                toast.success(response?.data?.responseData?.message)
                setIsModel(false)
            }
            setSelectedRows([])
            setFlag(!flag)
        }catch(err){
            console.log("Error in RejectRequest :", err);
        }
      }
// approve reject api end
      
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value);
    };

    const handleAction = (type) => {
        setIsModel(true)
        setActionType(type)
    }

    const handlePopupAction = (type) => {
        
        if(type === 'cancel') {setIsModel(false); setNewRemark()}
        else if(!newRemark){
            toast.error("Please enter remark!")
            return
        }
        else if(type === 'Approve'){
            handleApprove()
        }
        else if(type === 'Reject') {
            handleReject()
        }
    }
    return (
        <Page
            title="Sales Approval | Extramarks"
            className="crm-page-wrapper crm-page-approvals-list"
        >

            <Breadcrumbs
              className="crm-breadcrumbs"
              separator={<img src={IconBreadcrumbArrow} />}
              aria-label="breadcrumbs"
            >
              <Link
                underline="hover"
                key="1"
                color="inherit"
                to="/authorised/school-dashboard"
                className="crm-breadcrumbs-item breadcrumb-link"
              >
                Dashboard
              </Link>
              
              <Typography
                key="3"
                component="span"
                className="crm-breadcrumbs-item breadcrumb-active"
              >
                Approval List
              </Typography>
            </Breadcrumbs>
            
            <div className="crm-page-container">

                <Box className="crm-page-listing">
                    <div className="crm-page-listing-header">
                        <div className="crm-page-listing-header-label">
                    
                            <div className="left">
                                <h3>Approvals List</h3>
                            </div>
                            {
                                !isMobile
                                ? <div className="right">
                                    <form>
                                        <TextField
                                            className={`crm-form-input`}
                                            type="search"
                                            placeholder="Search"
                                            onChange={handleSearchValueChange}
                                            InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="start">
                                                    <img src={SearchIcon} alt="" />
                                                </InputAdornment>
                                                ),
                                            }}
                                        />
                                        
                                    </form>
                                    <Button className="crm-search-settings">
                                        <IconSearchSetting />
                                    </Button>
                                    </div>
                                : null
                            }
                        </div>
                        
                        <div className='crm-space-between'>
                            <div>
                                <div className={classes.filterSection}>
                                    <div style={{ width: "100%", height: "100%" }}>
                                        <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                        >
                                        <span onClick={handleFilter}>
                                            <div className="filterContainer">
                                            <img src={FilterIcon} alt="FilterIcon" /> Filters
                                            </div>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <LeadFilter applyFilters={applyFilters} filterAnchor={filterAnchor} setFilterAnchor={setFilterAnchor} addFilter={addFilter} filters={filters} setFilters={setFilters} removeAllFilters={removeAllFilters} removeFilter={removeFilter} />
                            </div>
                            <div>
                                {selectedRows?.length>0 && <div align="right">
                                        <Button className="crm-btn crm-btn-outline mr-1" onClick={(e) => handleAction('Reject')}>Reject</Button>
                                        <Button className="crm-btn" onClick={(e) => handleAction('Approve')}>Approve</Button>
                                </div>}
                            </div>
                        
                        </div>

                    </div>

                </Box>

                <Box sx={{minHeight: 'calc(100% - 200px)'}}>
                    <Box className="mainContainer" sx={{my: 2}}>
                        <Autocomplete
                            disablePortal
                            options={approvalType}
                            getOptionLabel={(option) => option.label}
                            value={salesApprovalState.matrixType}
                            onChange={(_, newValue) => {
                                setSelectType(newValue);
                                dispatch(salesApprovalAction.approvalMatrixSelected({ type: newValue }));
                            }}
                            style={{width:'300px'}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="ApprovalType"
                                    className='crm-form-input'
                                />
                            )}
                            popupIcon={<DropDownIcon />}
                            classes={{
                                listbox: "crm-form-autocomplete-menuitem",
                              }}
                            />
                        
                    </Box>
                    
                    
                    {loader && <Loader />}
                    { salesApprovalState.matrixType && (approvalList?.length>0 ? <SalesApprovalListingTable approvalLevels={approvalLevels} filtersApplied={filtersApplied} approvalList={approvalList} displayFields={displayFields} handleUpdateApprovalId={handleUpdateApprovalId}/>
                    : <Alert severity="error">No Content Available!</Alert>)}
                </Box >

                <div className="center cm_pagination">
                  <TablePagination
                      component="div"
                      page={pageNo}
                      onPageChange={(e, pageNumber)=>setPagination(pageNumber)}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[10, 50, 100, 500]}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelDisplayedRows={({ page }) => {
                          return `Page: ${page}`;
                      }}
                      backIconButtonProps={{
                          disabled: pageNo === 1,
                      }}
                      nextIconButtonProps={{
                          disabled: (approvalList && approvalList?.length===0)? true: pageNo===lastPage,
                      }}
                  />
                </div>
                
            </div >

            

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
                            <Typography mt={2} className={classes.modalTitle}>Are you sure you want to {actionType} this quotation?</Typography>
                                <TextField 
                                fullWidth
                                value={newRemark} 
                                onChange={(e)=>setNewRemark(e.target.value)} 
                                placeholder="Enter remarks.."
                                multiline
                                inputProps={{ maxLength: 250 }}
                                minRows="3"
                                InputProps={{
                                disableUnderline: true,
                                style: {
                                    boxShadow: "0px 0px 8px #00000029",
                                    outline: 'none',
                                },
                                }}
                                />
                                <div style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer">
                                    <Button onClick={()=> handlePopupAction(actionType)} color="primary" autoFocus className={classes.approvalBtn } variant="contained">{actionType}</Button>
                                    <Button onClick={()=> handlePopupAction('cancel')} className={classes.approvalBtn} color="primary" variant="outlined">Cancel</Button>
                                </div>
                            </div>
                    </div>
                </Fade>
            </Modal>}
        </Page>
    );
}

export default SalesApprovalListing