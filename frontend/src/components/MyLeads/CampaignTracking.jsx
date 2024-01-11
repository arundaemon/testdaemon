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
import SearchIcon from '../../assets/icons/icon_search.svg';
import { getConfigDetails } from '../../config/services/config';
import { makeStyles } from '@mui/styles';
import Revenue from "../../components/MyLeads/Revenue";
import Slider from "../../components/MyLeads/Slider";
import { DisplayLoader } from '../../helper/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import CubeDataset from "../../config/interface";
import { interestTransactionalLog } from '../../config/services/leadInterest';
import InterestTransactionalTable from './InterestTransactionalTable';


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

export default function CampaignTracking(){
    const classes = useStyles();
    const [interestSize, setInterestSize] = useState(false);
    const [pageNo, setPagination] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [search, setSearchValue] = useState('')
    const [searchTextField, setSearchTextField] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, setLoader] = useState(false)
    const [interestList, setInterestList] = useState([]);
    const [interestTotalCount, setInterestTotalCount] = useState(0)
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [dataSetIndex, setDataSetIndex] = useState(CubeDataset.Leadinterests);
    const [sortObj, setSortObj] = useState({ sortKey: CubeDataset.Leadinterests.updatedAt, sortOrder: '-1' });

    let { leadId, interest } = useParams();

    let totalPages = Number((interestTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < interestTotalCount)
        totalPages = totalPages + 1;

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }

    const handleChangeRowsPerPage = (event) => {
        setLoader(!loader)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value)
    };

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

    const fetchTransactionalLogs = async () => {
        let params = { leadId, learningProfile: interest,search, itemsPerPage, pageNo: (pageNo - 1) }
        interestTransactionalLog(params)
            .then(res => {               
                let data = res?.result                   

                    if (data && data?.length > 0) {
                        let totalCount = res?.totalCount
                        setInterestList(data)
                        setInterestTotalCount(totalCount)
                        setInterestSize(true)
                    }
                    else {
                        setInterestSize(false)
                    }
                    setLoader(true)
            })
            .catch(err => {
                console.log(err,':: error inside catch fetch trans. logs');
                setLoader(true)
                setInterestSize(false)
            })
    }

    useEffect(() => {
        fetchTransactionalLogs();
    }, [itemsPerPage, pageNo, search])

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
                                <h3>Campaign Tracking</h3>
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
                            
                                {/* <span onClick={handleFilter}>
                                    <div className="filterContainer mt-1">
                                        <img src={FilterIcon} alt="FilterIcon" /> Filter
                                    </div>
                                </span> */}
																
                        </div>

                        {/* <LeadFilter applyFilters={applyFilters} filterAnchor={filterAnchor} setFilterAnchor={setFilterAnchor} addFilter={addFilter} filters={filters} setFilters={setFilters} removeAllFilters={removeAllFilters} removeFilter={removeFilter} /> */}

                        {loader && interestSize && <>

                            {/* <Box display={{ xs: "none", sm: "block" }}> */}
                                <InterestTransactionalTable
                                    filtersApplied={filtersApplied}
                                    //getRowIds={getRowIds}
                                    pageNo={pageNo}
                                    itemsPerPage={itemsPerPage}
                                    list={interestList}
                                    //handleSort={handleSort}
                                    sortObj={sortObj}
                                    //rolesList={rolesList}
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

                        {loader && !interestSize &&
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