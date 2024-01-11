import React, { useEffect, useCallback } from 'react'
import Page from "../../components/Page";
import {
    Container,
    Button,
    Grid,
    Divider,
    TextField,
    InputAdornment,
    Paper,
    TablePagination,
    Modal,
    Box,
    Typography,
    MenuItem,
    Select
} from "@mui/material";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SearchIcon from '../../assets/icons/icon_search.svg';
import { getConfigDetails } from '../../config/services/config';
import { makeStyles } from '@mui/styles';
import Revenue from "../../components/MyLeads/Revenue";
import Slider from "../../components/MyLeads/Slider";
import FilterIcon from "../../assets/image/filterIcon.svg"
import { leadAssignmentData } from '../../helper/DataSetFunction';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import AssignTrialModal from './AssignTrialModal';
import { DisplayLoader } from '../../helper/Loader';
import settings from '../../config/settings';
import LeadAssignmentTable from './LeadAssignmentTable';
import LeadFilter from '../../components/leadFilters/LeadFilter';
import ReactSelect from 'react-select';
import toast from 'react-hot-toast';
import { assignMyLeads, getLeadAssignList } from '../../config/services/leadassign'
import { useNavigate } from 'react-router-dom';
import { getAllChildRoles } from '../../config/services/hrmServices';
import { getLoggedInRole } from '../../utils/utils';
import LeadCard from './LeadCard';
import CubeDataset from "../../config/interface";

import LeadFilterMweb from '../leadFilterMweb/LeadFilterMweb';
import { DecryptData, EncryptData } from '../../utils/encryptDecrypt';
import LeadViewTable from './LeadViewTable';
import ViewLeadCard from './ViewLeadCard';

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
}));

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

const LeadDetail = () => {
    const classes = useStyles();
    const user = settings.ONLINE_LEADS
    const [empCode] = useState(JSON.parse(localStorage.getItem("userData"))?.employee_code);
    const [assignModal, setAssignModal] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState("180");
    const [selectedClass, setSelectedClass] = useState("1582621");
    const [selectedProduct, setSelectedProduct] = useState("154");
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [batchDate, setBatchDate] = useState(null);
    const [formattedReqBody, setFormattedReqBody] = useState(null);
    const [leadList, setLeadList] = useState([])
    const [pageNo, setPagination] = useState(1)
    const [cycleTotalCount, setCycleTotalCount] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [leadSize, setLeadSize] = useState(false)
    const [search, setSearchValue] = useState('')
    const [searchTextField, setSearchTextField] = useState('')
    const [selectedLeads, setSelectedLeads] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [changeOwner, setChangeOwner] = useState(false)
    const [owner, setOwner] = useState(1)
    const [loader, setLoader] = useState(false)
    const [configDetails, setConfigDetails] = useState({})
    const userRole = getLoggedInRole()
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [selectUserModal, setSelectUserModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState()
    const [rolesList, setRoleslist] = useState([]);
    const [activeAction, setActiveAction] = useState("")
    const [checkedLeads, setCheckedLeads] = useState([]);
    const [dataSetIndex, setDataSetIndex] = useState(CubeDataset.Leadassigns)
    const [sortObj, setSortObj] = useState({ sortKey: CubeDataset.Leadassigns.updatedAt, sortOrder: '-1' })
    const [ownerChanged, setOwnerChanged] = useState(false)

    const navigate = useNavigate();

    let selectedRole = useSelector((state) => state?.ChildRolesReducer?.selectedRoles);

    let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < cycleTotalCount)
        totalPages = totalPages + 1;

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
        //fetchCrmLeadAssignmentList([...rolesList, userRole])
    }

    const handleChangeRowsPerPage = (event) => {
        setLoader(!loader)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value)
    };

    const toggleSelectUserModal = () => {
        setSelectUserModal(!selectUserModal)
    }

    const toggleChangeOwnerModal = () => {
        setSelectUserModal(!selectUserModal)
    }

    const handleSearch = (e) => {
        e.preventDefault();
        let { value } = e.target
        setPagination(1);
        setSearchValue(searchTextField)
    }

    const handleSearchField = (e) => {
        let { value } = e.target
        setSearchTextField(value)
    }

    const addList = async () => {
        let modifiedData = checkedLeads?.map((item) => {
            item.leadId = item?.[dataSetIndex.leadId]
            item.name = item?.[dataSetIndex.name]
            item.displayName = item?.[dataSetIndex.displayName]

            delete item?.[dataSetIndex.Id]
            delete item?.[dataSetIndex.assignedToRoleName]
            delete item?.[dataSetIndex.assignedToDisplayName]
            delete item?.[dataSetIndex.sourceName]
            delete item?.[dataSetIndex.subSourceName]
            delete item?.[dataSetIndex.updatedAt]
            delete item?.[dataSetIndex.mobile]
            delete item?.[dataSetIndex.email]
            delete item?.[dataSetIndex.createdAt]
            delete item?.[dataSetIndex.city]
            delete item?.[dataSetIndex.name]
            delete item?.[dataSetIndex.leadId]

            return item
        })

        const sampleData = { 'leadsData': modifiedData, 'roleData': selectedUser }
        setCheckedLeads([])
        setOwnerChanged(false)
        assignMyLeads(sampleData)
            .then((res) => {
                if (res?.result) {
                    toast.success(res?.message)
                    setOwnerChanged(true)
                }
                else if (res?.data?.statusCode === 0) {
                    let { errorMessage } = res?.data?.error
                    toast.error(errorMessage)
                }
                else {
                    console.error(res);
                }
            })
            .catch((error) => console.log(error, '...errror'))

    }

    const handleCheckedData = (data) => {
        setCheckedLeads(data)
    }

    const handleTransfer = () => {
        addList()
        toggleSelectUserModal()
        navigate('/authorised/lead-assignment')
        setSelectedUser('')
    }

    //get all child roles
    const fetchAllChildRoles = () => {
        if (rolesList.length === 0) {
            //let role_name = getLoggedInRole()
            getAllChildRoles({ role_name:userRole })
                .then(childRoles => {
                    console.log(childRoles, "::getChildRole")
                    let { all_child_roles } = childRoles?.data?.response?.data ?? { childs: [] }
                    setRoleslist(all_child_roles)
                    let childRoleNames = all_child_roles ? all_child_roles?.map(roleObj => roleObj?.roleName) : []
                    childRoleNames.push(userRole)
                    fetchCrmLeadAssignmentList(childRoleNames)
                    localStorage.setItem('childRoles', EncryptData(all_child_roles ?? []))
                })
                .catch((err) => {
                    console.log(err, 'error')
                })
        }
        else {
            fetchCrmLeadAssignmentList([...rolesList, userRole])
        }
    }


    //when filter is applied
    const fetchCubeLeadAssignmentList = () => {
        if (filtersApplied?.length > 0) {
            setDataSetIndex(CubeDataset.LeadassignsBq)
            sortObj.sortKey = CubeDataset.LeadassignsBq[sortObj.sortKey.split('.')[1]]
            let queryData = { userRole, search, itemsPerPage, pageNo, sortObj, filtersApplied, childRoles: rolesList }
            setLoader(false)
            setLeadSize(false)
            leadAssignmentData(queryData)
                .then((res) => {
                    let data = res?.loadResponses[0]?.data
                    setLeadList(data)

                    if (data?.length > 0) {
                        setLeadSize(true)
                    }
                    else {
                        setLeadSize(false)
                    }
                    setLoader(true)

                })
                .catch((err) => {
                    console.log(err, 'error')
                    setLoader(true)
                    setLeadSize(false)
                })
        }

    }
    //when filter is not applied
    const fetchCrmLeadAssignmentList = (roleList) => {
        setDataSetIndex(CubeDataset.Leadassigns)
        sortObj.sortKey = CubeDataset.Leadassigns[sortObj.sortKey.split('.')[1]]
        const applyFilter = DecryptData(localStorage?.getItem('filtersCopy'))

        if (filtersApplied?.length === 0 && (applyFilter?.length === 0 || !applyFilter)) {
            setLoader(false)
            setLeadSize(false)
            if (settings.ADMIN_ROLES.indexOf(userRole) >= 0) {
                roleList = []
            }
            let queryData = { search, itemsPerPage, pageNo: (pageNo - 1), filtersApplied, childRoleNames: roleList, ...sortObj }
            getLeadAssignList(queryData)
                .then((res) => {
                    let data = res?.result
                    let totalCount = res?.totalCount
                    setLeadList(data)
                    setCycleTotalCount(totalCount)

                    if (data?.length > 0) {
                        setLeadSize(true)
                    }
                    else {
                        setLeadSize(false)
                    }
                    setLoader(true)
                })
                .catch((err) => {
                    console.log(err, 'error')
                    setLoader(true)
                    setLeadSize(false)
                })
        }
    }

    const handleFilterByRole = (value) => {
        setSelectedUser(value)
    }


    const getRowIds = (data) => {
        setSelectedLeads(data)
    }

    const getConfigs = () => {
        getConfigDetails()
            .then((res) => {
                setConfigDetails(res?.data?.[0])
            })
    }

    const handleSort = (key) => {
        if (filtersApplied?.length > 0) {
            sortObj.sortKey = dataSetIndex[key]
            if (sortObj.sortOrder === -1 || sortObj.sortOrder === 1)
                sortObj.sortOrder = 'desc'
            let newOrder = sortObj?.sortOrder === 'desc' ? 'asc' : 'desc'
            setSortObj({ sortKey: key, sortOrder: newOrder })

        }
        else {
            let newOrder = sortObj?.sortOrder === '1' ? '-1' : '1'
            setSortObj({ sortKey: key, sortOrder: newOrder })

        }
    }

    let trialLeadReqBody = {
        empcode: empCode,
        action: configDetails?.my_leads_action,
        apikey: configDetails?.my_leads_api_key,
        trial_activation_request: formattedReqBody,
    };


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
        localStorage.setItem('filtersCopy', EncryptData(filtersCopy))
        setFiltersApplied(filtersCopy)
        setFilterAnchor(null)
    }
    const addFilter = () => {
        let filtersCopy = _.cloneDeep(filters)
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

    useEffect(() => {
        //getConfigs()
        let childRoles = localStorage.getItem('childRoles')
        if (filtersApplied.length === 0 && !childRoles) {
            fetchAllChildRoles()
        }
        else {
            let roles = DecryptData(childRoles)
            setRoleslist(roles)
        }
    }, [])
    useEffect(() => {
        let childRoles = localStorage.getItem('childRoles')
        if (filtersApplied?.length > 0) {
            sortObj.sortKey = dataSetIndex.updatedAt
            sortObj.sortOrder = "desc"
            fetchCubeLeadAssignmentList()
        }
        else if (childRoles && filtersApplied?.length === 0) {
            let roles = DecryptData(childRoles)
            let childRoleNames = roles?.map(roleObj => roleObj?.roleName)
            childRoleNames.push(userRole)
            fetchCrmLeadAssignmentList(childRoleNames)
        }
    }, [search, sortObj, pageNo, itemsPerPage, filtersApplied, ownerChanged])

    useEffect(() => {
        let selectedLeadsFormattedData = [];
        selectedLeads?.forEach((element) => {
            selectedLeadsFormattedData.push({
                uuid: "d6c66aff-dd04-4308-8780-da0b5669e113",
                email: element?.email,
                mobile: element?.phoneNumber,
                name: element?.name,
                board_id: selectedBoard,
                syllabus_id: selectedClass,
                product_id: selectedProduct,
                city: element?.city,
                state: element?.state,
                batch_id: batchDate,
                freetrail_approval: "No",
            });
        });
        setFormattedReqBody(selectedLeadsFormattedData);
    }, [selectedLeads]);

    useEffect(() => {
        const applyFilter = DecryptData(localStorage?.getItem('filtersCopy'))
        if (applyFilter) {
            setFiltersApplied(applyFilter)
            let tempFilter = []
            applyFilter.map(item => {
                tempFilter.push(item)
            })
            setFilters(tempFilter)
        }
    }, [])

    useEffect(() => {
        if (selectedRole) {
            fetchCrmLeadAssignmentList([selectedRole])
        }
    }, [selectedRole])

    return (
        <>
            <Page title="Extramarks | Lead Assignment" className="main-container myLeadPage datasets_container">
                <Container className='table_max_width'>
                    <Grid container spacing={2} sx={{ mt: "0px", mb: "16px" }}>
                        <Grid item xs={12} lg={6}>
                            <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                                <Revenue />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                                <Slider />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                <div className="tableCardContainer">
                    <Paper>
                        <div className="mainContainer">
                            <div className="left">
                                <h3>My Leads</h3>
                            </div>
                            <div className="right">
                                <form>
                                    <TextField
                                        className={`inputRounded search-input width-auto`}
                                        type="search"
                                        placeholder="Search"
                                        value={searchTextField}
                                        onChange={handleSearchField}
                                        InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <img src={SearchIcon} alt="" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button className={classes.submitBtn} type="submit" onClick={handleSearch}>Search</Button>
                                </form>                           
                            </div>
                        </div>
                        <div className={classes.filterSection}>
                            
                                <span onClick={handleFilter}>
                                    <div className="filterContainer mt-1">
                                        <img src={FilterIcon} alt="FilterIcon" /> Filter
                                    </div>
                                </span>
                        </div>

                        <LeadFilter applyFilters={applyFilters} filterAnchor={filterAnchor} setFilterAnchor={setFilterAnchor} addFilter={addFilter} filters={filters} setFilters={setFilters} removeAllFilters={removeAllFilters} removeFilter={removeFilter} />


                        {loader && leadSize && <>
                            {
                                window.innerWidth >= 1024 ?
                                    <Box >
                                        <LeadViewTable
                                            filtersApplied={filtersApplied}
                                            getRowIds={getRowIds}
                                            pageNo={pageNo}
                                            itemsPerPage={itemsPerPage}
                                            list={leadList}
                                            handleSort={handleSort}
                                            sortObj={sortObj}
                                            rolesList={rolesList}
                                            handleCheckedData={handleCheckedData}
                                            checkedLeads={checkedLeads}
                                        />
                                    </Box> :
                                    <Box>
                                        <ViewLeadCard
                                            filtersApplied={filtersApplied}
                                            getRowIds={getRowIds}
                                            pageNo={pageNo}
                                            itemsPerPage={itemsPerPage}
                                            list={leadList}
                                            handleSort={handleSort} sortObj={sortObj}
                                            isMyLeadPage={true}
                                        />
                                    </Box>
                            }
                        </>
                        }
                        {!loader &&
                            <div
                                style={{
                                    height: "50vh",
                                    width: "90vw",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: 'red'
                                }}>
                                {DisplayLoader()}
                            </div>
                        }

                        {loader && !leadSize &&
                            <div
                                style={{
                                    height: "50vh",
                                    width: "90vw",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontWeight: 600,
                                    fontSize: 18
                                }}>
                                <p>No Data Available</p>
                            </div>
                        }

                        {loader &&
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
                                    }} />
                            </div>
                        }
                    </Paper >
                </div >
                <Grid />
            </Page >
        </>
    );
}
export default LeadDetail