import React, { useEffect, useCallback } from 'react'
import Page from "../components/Page";
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
import { makeStyles } from '@mui/styles';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { DisplayLoader } from "../helper/Loader"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Revenue from '../components/MyLeads/Revenue';
import Slider from "../components/MyLeads/Slider";
import { getApprovalMappingList } from '../config/services/approvalMapping';
import ApprovalMappingTable from '../components/approvalMapping/ApprovalMappingTable';
import { DecryptData, EncryptData } from "../utils/encryptDecrypt";
import FilterIcon from "../assets/image/filterIcon.svg";
import LeadFilter from '../components/leadFilters/LeadFilter';
import { getReportApprovalMappingList } from '../helper/DataSetFunction';


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
    filterSection: {
        display: "flex",
        alignItems: "center",
        marginTop: '-40px'
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

const ApprovalMappingManagement = () => {
    const classes = useStyles();
    const [pageNo, setPagination] = useState(1)
    const [mappingList, setMappingList] = useState([]);
    const [mappingTotalCount, setMappingTotalCount] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [mappingSize, setMappingSize] = useState(false)
    const [search, setSearchValue] = useState('')
    const [searchTextField, setSearchTextField] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, setLoader] = useState(false)
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: -1 })
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [role] = useState('APPROVAL_MAPPING')

    const navigate = useNavigate();

    let totalPages = Number((mappingTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < mappingTotalCount)
        totalPages = totalPages + 1;

    const handleFilter = (e) => {
        setFilterAnchor(e.currentTarget);
    };

    const applyFilters = () => {
        if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
            toast.error("Select Valid Filter");
            return;
        }
        // sortObj.sortKey = dataSetIndex.updatedAt;
        // sortObj.sortOrder = "desc";
        let filtersCopy = _.cloneDeep(filters);
        localStorage.setItem("approvalMappingFilter", EncryptData(filtersCopy));
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
        localStorage.setItem("approvalMappingFilter", EncryptData(filtersCopy));
        if (filtersCopy?.length == 0) {
            // sortObj.sortKey = dataSetIndex.updatedAt;
            // sortObj.sortOrder = -1;
            localStorage.removeItem("approvalMappingFilter");
        }
    };

    const removeAllFilters = () => {
        // sortObj.sortKey = dataSetIndex.updatedAt;
        // sortObj.sortOrder = -1;
        setFilters([]);
        setFiltersApplied([]);
        localStorage.removeItem("approvalMappingFilter");
    };

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }

    const handleChangeRowsPerPage = (event) => {
        setLoader(!loader)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value)
    };


    const handleAddMapping = () => {
        navigate('/authorised/create-approval-mapping');
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

    const fetchReportApprovalMappingList = async () => {
        setLoader(false)
        let params = { search, itemsPerPage, pageNo, filtersApplied }
        getReportApprovalMappingList(params)
            .then(res => {
                let data = res?.loadResponses?.[0]?.data
                if (data) {
                    setMappingList(data)
                    if (data?.length < 10) setMappingSize(false)
                }
                setLoader(true)
            })
            .catch(err => {
                console.log(err, ':: error inside catch fetch approval mapping');
                setLoader(true)
                setMappingSize(false)
            })
    }

    const fetchApprovalMappingList = async () => {
        setLoader(false)
        let params = { search, itemsPerPage, pageNo: (pageNo - 1) }
        getApprovalMappingList(params)
            .then(res => {
                let data = res?.result

                if (data) {
                    let totalCount = res?.totalCount
                    setMappingList(data)
                    setMappingTotalCount(totalCount)
                    if (data?.length < 10) setMappingSize(false)
                }
                setLoader(true)
            })
            .catch(err => {
                console.log(err, ':: error inside catch fetch approval mapping');
                setLoader(true)
                setMappingSize(false)
            })
    }

    useEffect(() => {
        const applyFilter = DecryptData(localStorage?.getItem("approvalMappingFilter"));
        if (applyFilter === null) {
            fetchApprovalMappingList();
        }
        else if (filtersApplied?.length > 0) {
            fetchReportApprovalMappingList()
        }
    }, [itemsPerPage, pageNo, search, filtersApplied])

    useEffect(() => {
        const applyFilter = DecryptData(localStorage?.getItem("approvalMappingFilter"));
        if (applyFilter) {
            setFiltersApplied(applyFilter)
            let tempFilter = [];
            applyFilter.map((item) => {
                tempFilter.push(item);
            });
            setFilters(tempFilter);
        }
    }, [])

    return (
        <>
            <Page title="Extramarks | Approval Mapping" className="main-container myLeadPage datasets_container">
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
                                <h3>Approval Mapping</h3>
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
                                    // InputProps={{
                                    //     startAdornment: (
                                    //         <InputAdornment position="start">
                                    //             <img src={SearchIcon} alt="" />
                                    //         </InputAdornment>
                                    //     ),
                                    // }}
                                    />
                                    <Button className={classes.submitBtn} type="submit" onClick={handleSearch}>Search</Button>
                                </form>
                            </div>


                        </div>
                        <div align="right" style={{ marginTop: '15px' }}>
                            <Button style={{ width: '80px' }} className={classes.submitBtn} onClick={() => handleAddMapping()}>Add</Button>
                        </div>
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



                        {loader && <>

                            {/* <Box display={{ xs: "none", sm: "block" }}> */}
                            <ApprovalMappingTable
                                //filtersApplied={filtersApplied}
                                pageNo={pageNo}
                                itemsPerPage={itemsPerPage}
                                list={mappingList}
                                //handleSort={handleSort}
                                sortObj={sortObj}

                            />
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

                        {loader && mappingList?.length === 0 &&
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
                                    }}
                                    backIconButtonProps={{
                                        disabled: pageNo === 1
                                    }}
                                    nextIconButtonProps={{
                                        disabled: !mappingSize
                                    }}
                                />
                            </div>
                        }
                    </Paper >
                </div >
                <Grid />
            </Page >
        </>
    );
}
export default ApprovalMappingManagement