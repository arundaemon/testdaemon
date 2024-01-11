import React, { useEffect, useState } from "react";

import { Alert, Box, InputAdornment, Paper, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "../../assets/icons/icon_search.svg";
import { getHardwareVoucherList } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";
import { NavigationVouchertab } from "./TableTab";
import HardwareVoucherList from "./HardwareVoucherList";

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
        [theme.breakpoints.down("md")]: {
            display: "none",
        },
    },
    cusSelect: {
        width: "100%",
        fontSize: "14px",
        marginLeft: "1rem",
        borderRadius: "4px",
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    mbForMob: {
        [theme.breakpoints.down("md")]: {
            marginBottom: "1rem",
        },
    },
    filterSection: {
        display: "flex",
        alignItems: "center",
    },
    tabMainContainer: {
        display: 'flex',
        padding: 10,
        // justify-content: center is excluded here
    },
}));

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #fff",
    boxShadow: "0px 0px 4px #0000001A",
    p: 4,
    borderRadius: "4px",
};

const HardwareVoucherManagement = () => {
    const classes = useStyles();
    const [pageNo, setPagination] = useState(1);
    const [itemsPerPage] = useState(10);
    const [search, setSearchValue] = useState("");
    const [lastPage, setLastPage] = useState(false);
    const [loader, setLoading] = useState(false);
    const [searchBy, setSearchBy] = useState("voucher_based");
    const [hardwarevoucherList, setHardwareVoucherList] = useState([]);
    const loginData = getUserData('loginData')
    const [activeTab, setActiveTab] = useState("");
    const location = useLocation();
    const uuid = loginData?.uuid
    const { linkType } = location?.state ? location?.state : {};


    const getAllVoucherList = (status) => {
        let params = {
            page_offset: pageNo - 1,
            page_size: itemsPerPage,
            //   search_by: "hw_voucher_auto_id",
            //   search_val: search,
            voucher_status: status,
            crn_dbn_for: "HW",
            order_by: "hw_voucher_auto_id",
            order: "desc",
            uuid: uuid
        };
        setLoading(true);
        setLastPage(false);
        getHardwareVoucherList(params)
            .then((res) => {
                let list = res?.data?.voucher_details
                setHardwareVoucherList(list)
                if (list?.length < itemsPerPage) setLastPage(true);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    };

    const handleSearch = _.debounce((e) => {
        let { value } = e?.target;
        if (value.trim() !== '') {
            setPagination(1);
            setSearchValue(value, () => setPagination(1));
        } else
            setSearchValue("")
    }, 500);

    useEffect(() => {
        if (linkType == "Cancelled Voucher") {
            getAllVoucherList([3]);
        }
        else if (linkType == "Active Voucher") {
            getAllVoucherList([1]);
        }
    }, [pageNo, itemsPerPage, search, linkType]);

    useEffect(() => {
        if (linkType) {
            setActiveTab(linkType);
        }
        else {
            setActiveTab("Active Voucher")
        }

    }, [linkType]);


    return (
        <div className="tableCardContainer">
            <Paper>
                <div className="mainContainer">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 15,
                            marginBottom: 15,
                        }}
                    >
                        <div className="left">
                            <h3>Voucher Management List</h3>
                        </div>

                        <TextField
                            style={{ marginBottom: "20px" }}
                            className={`inputRounded search-input width-auto`}
                            type="search"
                            placeholder="Search"
                            onChange={handleSearch}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <img src={SearchIcon} alt="" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </div>


                    <div className={classes.tabMainContainer} >
                        <Box >
                            <NavigationVouchertab
                                data={activeTab}
                            />
                        </Box>
                    </div>


                    {loader && <Loader />}
                    {hardwarevoucherList?.length ? (
                        <HardwareVoucherList
                            voucherList={hardwarevoucherList}
                            itemsPerPage={itemsPerPage}
                            pageNo={pageNo}
                            getAllVoucherList={getAllVoucherList}
                        />
                    ) : (
                        <Alert severity="error">No Content Available!</Alert>
                    )}
                </div>
                <div className="center cm_pagination">
                    <Pagination
                        pageNo={pageNo}
                        setPagination={setPagination}
                        lastPage={lastPage}
                    />
                </div>
            </Paper>
        </div>
    );
};

export default HardwareVoucherManagement;
