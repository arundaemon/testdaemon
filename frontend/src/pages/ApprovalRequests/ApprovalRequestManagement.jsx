import { useState, useEffect } from 'react';
import { Container, TextField, Alert, Pagination, Grid, Modal, Divider, Typography, InputAdornment, Box, Tabs, Tab, Button, TablePagination } from "@mui/material";
import _ from 'lodash';
import ReactSelect from 'react-select';
import Page from "../../components/Page";
import Loader from "../Loader";
import { makeStyles } from "@mui/styles";
import { getRequestList } from '../../config/services/approvalRequest';
import SearchIcon from '../../assets/icons/icon_search.svg';
import { RequestTable } from '../../components/approvalRequestManagement';
import { getAllParentRoles } from '../../config/services/hrmServices';
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { reassignRequest } from '../../config/services/approvalRequest';
import { getMappingInfo } from '../../config/services/approvalMapping';
import ReassignRequestModal from './ReassignRequestModal';
import ApproveRejectModal from './ApproveRejectModal';
import LeadFilter from '../../components/leadFilters/LeadFilter';
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import FilterIcon from "../../assets/image/filterIcon.svg";
import { getReportApprovalRequestList } from '../../helper/DataSetFunction';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '4px',
};

const useStyles = makeStyles(() => ({
    noData: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 600,
        fontSize: 25
    },
    loader: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    addClaimBtn: {
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
        marginBottom: '10px',
        width: "max-content",
    },
    header: {
        fontSize: '28px',
        fontWeight: '600',
        marginTop: '1px'

    },
    buttonDiv: {
        display: 'grid',
        marginBottom: '10px'
    },
    filterSection: {
        display: "flex",
        alignItems: "center",
        marginTop: '20px'
    },
    filterDiv: {
        border: '1px solid #DEDEDE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        width: '100px',
        height: '38px',
        borderRadius: '4px',
        color: '#85888A',
        marginBottom: '20px',
        cursor: 'pointer'
    }
}))

export default function ApprovalRequestManagement() {
    const [reqStatus, setReqStatus] = useState("NEW");
    const [pageNo, setPagination] = useState(1);
    const [search, setSearchValue] = useState('');
    const [loader, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' });
    const [requestList, setRequestList] = useState([]);
    const [requestTotalCount, setRequestTotalCount] = useState(0);
    const [reassignModal, setReassignModal] = useState(false);
    const [rejectApproveModal, setRejectApproveModal] = useState(false);
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [loggedInId] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [roleName] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // const [requestBy_empCode] = useState(JSON.parse(localStorage.getItem('userData'))?.employee_code);
    const [userData] = useState(JSON.parse(localStorage.getItem('userData')));
    const [checkedLeads, setCheckedLeads] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [parentsList, setParentsList] = useState([]);
    const [rejectBtn, setRejectBtn] = useState(false);
    const [approveBtn, setApproveBtn] = useState(false);
    const [comment, setComment] = useState('');
    const [mappingDetails, setMappingDetails] = useState();
    const [flag, setFlag] = useState(false);
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [role] = useState('APPROVAL_REQUEST')
    const [lastPage, setLastPage] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [customFilterArray, setCustomFilterArray] = useState([])
    const navigate = useNavigate();
    const classes = useStyles()
    const { employee_code: requestBy_empCode, crm_role: requestBy_roleId, } = userData;

    const { requestedBy, fromDate, toDate } = useParams();
    const handleTabChange = (event, newValue) => {
        setPagination(1)
        setReqStatus(newValue);
    };

    const handleReassign = () => {
        setReassignModal(!reassignModal)
    }

    const handleRejectApprove = (e) => {
        if (e.target.name === 'approve') {
            setApproveBtn(true);
        }
        if (e.target.name === 'reject') {
            setRejectBtn(true);
        }
        setRejectApproveModal(!rejectApproveModal)
    }

    const handleFilterByRole = (value) => {
        setSelectedUser(value)
    }

    // const allParentsList = (object, parentsArr) => {
    //     let newObj = {
    //         displayName: object?.displayName,
    //         roleName: object?.roleName,
    //         roleID: object?.roleID,
    //         userName: object?.userName
    //     }
    //     parentsArr.push(newObj);
    //     if (object?.parents) {
    //         return allParentsList(object?.parents, parentsArr)
    //     }
    //     else {
    //         return parentsArr;
    //     }
    // }

    // const fetchAllParentRoles = async () => {

    //     getAllParentRoles({ role_name: roleName })
    //         .then(res => {
    //             let allParents = res?.data?.response?.data?.parents;
    //             if (allParents) {
    //                 let allData = allParentsList(allParents, []);
    //                 if (allData?.length > 0) {
    //                     setParentsList([...allData]);
    //                 }
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err, ":: error inside catch");
    //         })
    // }

    const handleSubmitReassign = () => {
        setReassignModal(!reassignModal);
        setSelectedUser('')
    }

    const fetchRequestList = async (reqStatus) => {


        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj, reqStatus, requestBy_empCode, type: 'approver', roleName }
        //TODO

        setLoading(true)
        setLastPage(false)
        setTotalRecords(0)
        getRequestList(params)
            .then((res) => {
                let data = res?.result
                setRequestList(res?.result);
                setRequestTotalCount(res?.totalCount)
                setTotalRecords(data?.length)
                setCheckedLeads([]);
                setApproveBtn(false);
                setRejectBtn(false);
                setLoading(false)
                if (data?.length < itemsPerPage) setLastPage(true)
            })
            .catch(err => console.error(err))
    }

    const fetchReportRequestList = async () => {
        let params = { pageNo, itemsPerPage, search, ...sortObj, reqStatus, roleName, type: 'approver', filtersApplied }
        setLoading(true)
        setLastPage(false)
        setTotalRecords(0)
        getReportApprovalRequestList(params)
            .then(res => {
                let data = res?.loadResponses?.[0]?.data
                setRequestList(data)
                setCheckedLeads([]);
                setTotalRecords(data?.length)
                setLoading(false)
                if (data?.length < itemsPerPage) setLastPage(true)
                // console.log(res, 'this is response')
            })
            .catch(err => {
                console.error('Error in fetchReportRequestList', err)
            })
    }



    const handleOnChange = (e) => {
        setComment(e.target.value);
    }

    // console.log(comment,'...................remark');

    // const getReassignData = () => {
    //     let requestList = []
    //     if (!selectedUser?.roleName) {
    //         toast.error('Please Select User');
    //         return;
    //     }
    //     if (checkedLeads && (checkedLeads.length > 0)) {
    //         checkedLeads?.map(item => {
    //             let obj = {
    //                 _id: item?._id,
    //                 approver_empCode: selectedUser?.userName,
    //                 approver_roleId: selectedUser?.roleID,
    //                 approver_roleName: selectedUser?.roleName,
    //                 approver_name: selectedUser?.displayName
    //             }
    //             requestList.push(obj);
    //         })
    //     }
    //     return requestList;
    // }

    // const handleReassignRequest = async () => {
    //     const requestList = getReassignData();
    //     console.log(requestList, '.....................req list');
    //     // reassignRequest(requestList)
    //     //     .then(res => {
    //     //         if (res?.result) {
    //     //             toast.success(`Request is reassigned successfully`);
    //     //             setReassignModal(!reassignModal);
    //     //             navigate('/authorised/approver-request-management');
    //     //             setSelectedUser('')
    //     //         }
    //     //     })
    //     //     .catch(err => {
    //     //         console.log(err, '....error inside catch');
    //     //     })
    // }

    const fetchMappingDetails = async () => {
        // let params = { approvalType: requestDetails?.requestType };
        getMappingInfo()
            .then(res => {
                if (res?.result) {
                    setMappingDetails(res?.result);
                }
            })
            .catch(err => {
                console.log(err, ':: error inside fetch mapping details');
            })
    }

    const handleReassignCancel = async () => {
        setReassignModal(!reassignModal)
        setSelectedUser('');
    }

    const handleRequestCancel = async () => {
        setRejectApproveModal(!rejectApproveModal)
        setComment('');
        setRejectBtn(false);
        setApproveBtn(false);
    }

    const getRequestData = (data) => {
        setCheckedLeads(data);
        setFlag(false);
    };

    const changeModalState = () => {
        setRejectApproveModal(!rejectApproveModal);
        setCheckedLeads([]);
        setComment('');
        setFlag(true);
        // window.location.reload();
    }

    const changeReassignState = () => {
        setFlag(true);
    }



    let totalPages = Number((requestTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < requestTotalCount)
        totalPages = totalPages + 1;

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value);
    };

    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))
    }

    const handleFilter = (e) => {
        setFilterAnchor(e.currentTarget);
    };

    // const customFilterByEmpCode = () => {
    //     let customFilter = [{
    //         "dataset": {
    //             "displayName": "Approvalrequests",
    //             "dataSetName": "Approvalrequests",
    //         },
    //         "field": {
    //             "name": "requestByEmpCode",
    //         },
    //         "operator": {
    //             "label": "Custom filter list",
    //             "value": "equals",
    //         },
    //         "filterValue": [
    //             requestedBy
    //         ]
    //     }]
    //     let visitDateCustomFilterObject = {
    //         "dataset": {
    //             "displayName": "EmployeeClaim",
    //             "dataSetName": "EmployeeClaim"
    //         },
    //         "field": {
    //             "name": "visitDate",
    //         },
    //         "operator": {
    //             "label": "In Date Range",
    //             "value": "inDateRange"
    //         },
    //         "filterValue": [fromDate + ' 00:00:00', toDate + ' 23:59:59']
    //     }

    //     if (fromDate && toDate) {
    //         customFilter.push(visitDateCustomFilterObject)
    //     }

    //     if (requestedBy) {
    //         let appliedFilter = DecryptData(localStorage?.getItem("approverRequestFilter"));
    //         let updatedFilter = [...appliedFilter, ...customFilter];
    //         let uniqueFilters = new Set(updatedFilter.map(JSON.stringify));
    //         let updatedUniqueFilters = Array.from(uniqueFilters).map(JSON.parse);
    //         setFilters(updatedUniqueFilters);
    //         setFiltersApplied(updatedUniqueFilters);
    //         localStorage.setItem("approverRequestCustomFilter", EncryptData(updatedUniqueFilters));
    //     }
    //     else {
    //         localStorage.removeItem("approverRequestCustomFilter");
    //     }
    // }

    const customFilterByEmpCode = () => {
        let customFilter = [{
            "dataset": {
                "displayName": "Approvalrequests",
                "dataSetName": "Approvalrequests",
            },
            "field": {
                "name": "requestByEmpCode",
            },
            "operator": {
                "label": "Custom filter list",
                "value": "equals",
            },
            "filterValue": [
                requestedBy
            ]
        }]
        let visitDateCustomFilterObject = {
            "dataset": {
                "displayName": "EmployeeClaim",
                "dataSetName": "EmployeeClaim"
            },
            "field": {
                "name": "visitDate",
            },
            "operator": {
                "label": "In Date Range",
                "value": "inDateRange"
            },
            "filterValue": [fromDate + ' 00:00:00', toDate + ' 23:59:59']
        }

        if (fromDate && toDate) {
            customFilter.push(visitDateCustomFilterObject)
        }

        if (requestedBy) {
            setFilters(customFilter)
            setFiltersApplied(customFilter)
            localStorage.setItem("approverRequestFilter", EncryptData(customFilter));
        }
        else {
            setFiltersApplied([])
            setFilters([])
            localStorage.removeItem("approverRequestFilter")
        }
    }

    const applyFilters = () => {
        if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
            toast.error("Select Valid Filter");
            return;
        }
        // sortObj.sortKey = dataSetIndex.updatedAt;
        // sortObj.sortOrder = "desc";
        let filtersCopy = _.cloneDeep(filters);
        localStorage.setItem("approverRequestFilter", EncryptData(filtersCopy));
        setFiltersApplied(filtersCopy);
        setFilterAnchor(null);
    };

    const addFilter = () => {
        let filtersCopy = _.cloneDeep(filters);
        if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
            toast.error("First fill empty filter");
            return;
        }
        filtersCopy?.unshift({ label: "Select Filter" });
        setFilters(filtersCopy);
    };

    const removeFilter = (filterIndex) => {
        let filtersCopy = _.cloneDeep(filters);
        if (filters[0]?.label === 'Select Filter') {
            filtersCopy?.splice(filterIndex, 1);
            setFilters(filtersCopy);
        }
        else {
            filtersCopy?.splice(filterIndex, 1);
            setFilters(filtersCopy);
            setFiltersApplied(filtersCopy);
        }
        localStorage.setItem("approverRequestFilter", EncryptData(filtersCopy));
        if (filtersCopy?.length == 0) {
            // sortObj.sortKey = dataSetIndex.updatedAt;
            // sortObj.sortOrder = -1;
            localStorage.removeItem("approverRequestFilter");
        }
    };

    const removeAllFilters = () => {
        // sortObj.sortKey = dataSetIndex.updatedAt;
        // sortObj.sortOrder = -1;
        setFilters([]);
        setFiltersApplied([]);
        localStorage.removeItem("approverRequestFilter");
    };

    // useEffect(() => {
    //     fetchRequestList(reqStatus)
    //     fetchReportRequestList()
    // }, [search, sortObj, pageNo, itemsPerPage, reqStatus]);

    useEffect(() => {

        const applyFilter = DecryptData(localStorage?.getItem("approverRequestFilter"));
        if (applyFilter === null) {
            fetchRequestList(reqStatus)
            setFilters([])
        }
        else if (filtersApplied?.length > 0) {
            fetchReportRequestList()

        }

    }, [pageNo, search, filtersApplied, itemsPerPage, reqStatus])

    useEffect(() => {

        const applyFilter = DecryptData(localStorage?.getItem("approverRequestFilter"));
        if (applyFilter) {
            setFiltersApplied(applyFilter)
            let tempFilter = [];
            applyFilter.map((item) => {
                tempFilter.push(item);
            });
            setFilters(tempFilter);
        }

        // var header = document.getElementById('header');
        // // Check if the page is loaded in an iframe
        // if (window.top === window.self) {
        //     // Hide the header element  
        //     header.style.display = 'none';
        // }

    }, [])

    useEffect(() => {
        customFilterByEmpCode()
    }, [requestedBy != undefined])



    return (
        <Page title="Extramarks | Approval Request Management" className="main-container ApprovalRequestPage_Page datasets_container">
            <Grid display='flex' justifyContent='space-between' alignItems='center' className="datasets_header" >
                <div className='requestHeading'>{reqStatus} REQUEST ({totalRecords})</div>
            </Grid>
            {requestedBy === undefined &&
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
                                <div className={classes.filterDiv}>
                                    <img style={{ marginRight: '10px' }} src={FilterIcon} alt="FilterIcon" /> Filter
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            }

            <LeadFilter
                applyFilters={applyFilters}
                filterAnchor={filterAnchor}
                setFilterAnchor={setFilterAnchor}
                addFilter={addFilter}
                filters={filters}
                setFilters={setFilters}
                removeAllFilters={removeAllFilters}
                removeFilter={removeFilter}
                role={role}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                <Tabs
                    value={reqStatus}
                    onChange={handleTabChange}
                    aria-label="secondary tabs example"
                    textColor='inherit'

                >
                    <Tab style={{ fontWeight: 600 }} value="NEW" label="New" />
                    <Tab style={{ fontWeight: 600 }} value="APPROVED" label="Approved" />
                    <Tab style={{ fontWeight: 600 }} value="REJECTED" label="Rejected" />
                </Tabs>
                {checkedLeads && checkedLeads?.length > 0 ?
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Button variant='contained' name='approve' onClick={(e) => handleRejectApprove(e)}>Approve</Button>
                        <Button variant='contained' onClick={handleReassign}>Reassign</Button>
                        <Button variant='contained' name='reject' onClick={handleRejectApprove}>Reject</Button>
                    </Box>
                    : ''}


            </Box>

            <Container className='table_max_width'>
                {loader && <Loader />}
                {requestList && requestList.length > 0 ?
                    <RequestTable
                        list={requestList}
                        pageNo={pageNo}
                        itemsPerPage={itemsPerPage}
                        approve={true}
                        reqStatus={reqStatus}
                        getRequestData={getRequestData}
                        flag={flag}
                        requestedBy={requestedBy}
                    />
                    :
                    <div style={{ marginTop: 20 }}>
                        <Alert severity="error">No Content Available!</Alert>
                    </div>
                }

            </Container>

            <div className='center cm_pagination'>
                <TablePagination
                    component="div"
                    page={pageNo}
                    onPageChange={handlePagination}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 50, 500, 1000]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ page }) => {
                        return `Page: ${page}`;
                    }}
                    backIconButtonProps={{
                        disabled: pageNo === 1
                    }}
                    nextIconButtonProps={{
                        disabled: lastPage
                    }}
                />
            </div>

            <ReassignRequestModal changeReassignState={changeReassignState} handleSubmitReassign={handleSubmitReassign} fetchRequestList={fetchRequestList} fetchReportRequestList={fetchReportRequestList} handleFilterByRole={handleFilterByRole} selectedUser={selectedUser} reassignModal={reassignModal} checkedLeads={checkedLeads} handleReassignCancel={handleReassignCancel} />
            <ApproveRejectModal fetchRequestList={fetchRequestList} fetchReportRequestList={fetchReportRequestList} filtersApplied={filtersApplied} changeModalState={changeModalState} rejectBtn={rejectBtn} approveBtn={approveBtn} rejectApproveModal={rejectApproveModal} handleRequestCancel={handleRequestCancel} handleOnChange={handleOnChange} comment={comment} checkedLeads={checkedLeads} />

        </Page>
    );
}




