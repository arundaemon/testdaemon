import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Button,
    Grid,
    TextField,
    InputAdornment,
    TablePagination,

} from "@mui/material";
import SearchIcon from '../assets/icons/icon_search.svg';
import Revenue from "../components/MyLeads/Revenue";
import Slider from "../components/MyLeads/Slider";
import Page from "../components/Page";
import { getMyOrdersList } from '../helper/DataSetFunction';
import { DisplayLoader } from '../helper/Loader';
import NoDataComponent from '../components/MyLeads/NoDataComponent';
import CubeDataset from '../config/interface';
import { revenueAndSliderCss } from '../css/Revenue-Slider-css';
import MyOrderTable from './MyOrdersTable';
import { setCookieData } from '../helper/randomFunction';

const MyOrders = () => {
    const classes = revenueAndSliderCss();
    const [myOrdersList, setMyOrdersList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTextField, setSearchTextField] = useState('')
    const [search, setSearchValue] = useState('')
    const [pageNo, setPagination] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortObj, setSortObj] = useState({ sortKey: CubeDataset.EmployeeLeadsOrder.updatedOn, sortOrder: 'desc' })
    const [empCode] = useState(JSON.parse(localStorage.getItem("userData"))?.employee_code);
    const [cookieFrame, setCookieIFrame] = useState(null)


    const toOrderNumber = (orderUrl) => {
        navigate('/authorised/order-number', { state: { id: 1, url: orderUrl } })
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
    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)

    }

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value)
    };

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === 'desc' ? 'asc' : 'desc'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }



    const fetchMyOrdersList = () => {
        let queryData = { search, itemsPerPage, pageNo, sortObj }
        getMyOrdersList(queryData)
            .then((result) => {
                setMyOrdersList(result?.loadResponse?.results?.[0]?.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false)
            })

    }

    useEffect(() => {
        fetchMyOrdersList()
        setCookieData()
            .then(
                doc => {
                    setCookieIFrame(doc)
                }
            )
    }, [search, pageNo, itemsPerPage, sortObj])


    return (

        <Page title="Extramarks | Lead Assignment" className="main-container myLeadPage datasets_container">
            {cookieFrame}

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
                <div className="tableCardContainer">
                    <div className="mainContainer">
                        <div className="left">
                            <h3>My Orders</h3>
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

                    {loading ?
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
                        </div> :
                        (
                            (myOrdersList === undefined || myOrdersList?.length === 0) ?
                                <NoDataComponent message={'No Order History Available.'} />
                                :
                                (
                                    <MyOrderTable
                                        myOrdersList={myOrdersList}
                                        empCode={empCode}
                                        toOrderNumber={toOrderNumber}
                                        pageNo={pageNo}
                                        itemsPerPage={itemsPerPage}
                                        handleSort={handleSort}
                                        sortObj={sortObj}
                                    />
                                )
                        )
                    }


                    <div className='center cm_pagination'>
                        <TablePagination
                            // count={itemsPerPage}
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
                </div>

            </Container>

            <Grid />

        </Page >
    )
}

export default MyOrders