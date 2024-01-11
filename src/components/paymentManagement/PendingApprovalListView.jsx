import { Box } from "@material-ui/core";
import {
    Alert, InputAdornment, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "../../assets/icons/icon_search.svg";
import { listCollectionDetails } from "../../config/services/paymentCollectionManagment";
import { fetchRoleList } from "../../helper/DataSetFunction";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";
import { DecryptData } from "../../utils/encryptDecrypt";
import Page from "../Page";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CurrencySymbol } from "../../constants/general";

const LIST_ITEM_PER_PAGE = 10;

export default function PendingApprovalListView() {
    const uuid = getUserData("loginData")?.uuid;
    const navigate = useNavigate();
    const userData = getUserData("userData");
    const [searchParams, setSearchParams] = useSearchParams();
    const pageNo = parseInt(searchParams.get("page") || 1);
    function setPageNo(pageNo) {
        setSearchParams({ page: pageNo });
    }
    const [search, setSearchValue] = useState("");
    const [lastPage, setLastPage] = useState(false);
    const [loader, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [childRoleUserNames] = useState(DecryptData(localStorage.getItem("childRoles"))?.map((item) => item?.userName));
    const [searchUuids, setSearchUuids] = useState(null);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    async function getUuids() {
        return fetchRoleList([...childRoleUserNames, userData.employee_code])
            .then((res) => {
                const uuids = res?.loadResponses?.[0]?.data.map((item) => item?.["TblEmployee.uuid"])?.filter(item => item);
                setSearchUuids(uuids);
                return uuids;
            })
            .catch((err) => {
                console.error(err, "..error");
            });
    }

    useEffect(() => {
        getData();
    }, [pageNo, search]);

    function getPaymentAdjustmentApprovalStatusId() {
        const crmProfile = userData?.crm_profile;
        if (crmProfile?.toLowerCase()?.includes("collection")) {
            return [1, 5];
        } else if (crmProfile?.toLowerCase()?.includes("buh")) {
            return [2, 7];
        } else {
            // return [1];
            return [0];
        }
    }

    async function getData() {
        // finance, collection head, buh
        const search_uuid = searchUuids || await getUuids();
        let params = {
            uuid: uuid,
            page_offset: pageNo - 1,
            page_size: LIST_ITEM_PER_PAGE,
            status: [1],
            payment_adjustment_approval_status_id: getPaymentAdjustmentApprovalStatusId(), //should be based on role BUH or collection head
            search_uuid: search_uuid || [],
            "order_by": "deposit_auto_id",
            "order": "DESC"
        };
        if (search && search !== "") {
            params.search_by = "school_code";
            params.search_val = search;
        }
        setLoading(true);
        setLastPage(false);
        setError(false)
        listCollectionDetails(params)
            .then((res) => {
                if (res.data.collection_details) {
                    setData(res.data.collection_details?.map((item) => ({
                        ...item,
                        school: item.school_code,
                        amount_collected: item.total_amount_collected,
                        collected_date: item.collected_date,
                        case_id: item.collection_case_id,
                    })));
                    setLastPage(res.data.collection_details.length < LIST_ITEM_PER_PAGE);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err, "..error");
                setLoading(false);
                setError(err);
            });
    };

    const handleSearch = _.debounce((e) => {
        let { value } = e.target;
        value = value.trim();
        if (value !== "") {
            setPageNo(1);
            setSearchValue(value);
        } else {
            setSearchValue("");
        }
    }, 600);

    return (
        <Page title="Pending Collection Approvals | Extramarks" className="crm-page-wrapper" >
            <Box className="crm-page-listing">
                <div className="crm-page-listing-header">
                    <div className="crm-page-listing-header-label">

                        <div className="left">
                            <h3>Pending Collection Approvals</h3>
                        </div>
                        {
                            !isMobile
                                ? <div className="right">
                                    <form>
                                        <TextField
                                            className={`crm-form-input medium-dark`}
                                            style={{ width: '240px' }}
                                            type="search"
                                            placeholder="Search By School code"
                                            onChange={handleSearch}
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

                                </div>
                                : null
                        }
                    </div>
                </div>
                <Paper>
                    <div className="mainContainer">

                        {loader && <Loader />}
                        {data?.length ? (
                            <CollectionTable
                                data={data}
                                LIST_ITEM_PER_PAGE={LIST_ITEM_PER_PAGE}
                                pageNo={pageNo}
                            />
                        ) : (
                            <Alert severity="error">No Content Available!</Alert>
                        )}
                    </div>

                    <div className="center cm_pagination">
                        <Pagination
                            pageNo={pageNo}
                            setPagination={setPageNo}
                            lastPage={lastPage}
                            nextPageDisabled={loader ? true : undefined}
                            prevPageDisaled={loader ? true : undefined}
                        />
                    </div>
                </Paper>
            </Box>
        </Page>
    );
};

function CollectionTable({ data, LIST_ITEM_PER_PAGE, pageNo }) {
    const navigate = useNavigate();
    const list = data;
    return (
        <TableContainer component={Paper} className="crm-table-container">
            <Table
                aria-label="simple table"
                className='crm-table-size-md'
            >
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell>S.No.</TableCell>
                        <TableCell>Case - ID</TableCell>
                        <TableCell>School Name & Code</TableCell>
                        <TableCell>Collected Amount</TableCell>
                        <TableCell>Collected Date</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list &&
                        list?.length > 0 &&
                        list.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {i + 1 + (pageNo - 1) * LIST_ITEM_PER_PAGE}
                                </TableCell>
                                <TableCell>{row?.case_id}</TableCell>
                                <TableCell>{row?.school}</TableCell>
                                <TableCell>
                                    {/* {row?.amount_collected} */}

                                    {CurrencySymbol?.India}&nbsp;
                                    {row?.amount_collected ? Number(row?.amount_collected)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    }) : 0}
                                </TableCell>
                                <TableCell>{row?.collected_date}</TableCell>
                                <TableCell align="right">
                                    <div className="crm-anchor crm-anchor-small"
                                        onClick={
                                            () => navigate(
                                                `adjustment-form/${row?.school_code}/${row?.deposit_auto_id}`,
                                                {
                                                    state: {
                                                        payment_adjustment_approval_status_id: row?.payment_adjustment_approval_status_id,
                                                        created_by_uuid: row?.created_by_uuid,
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        View Details
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

}
