import {
    Alert,
    Box,
    InputAdornment, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
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
import { CurrencySymbol } from "../../constants/general";

const LIST_ITEM_PER_PAGE = 10;

export default function FinanceApprovalListView() {
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

    async function getUuids() {
        return fetchRoleList(childRoleUserNames)
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
        if (crmProfile?.toLowerCase()?.includes("finance")) {
            return [4];
        } else {
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
            search_uuid: search_uuid || []
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
        <div className="tableCardContainer">
            <Paper>
                <div className="mainContainer">
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <h3>Finance Payment Approvals</h3>
                        <TextField
                            className={`inputRounded search-input width-auto`}
                            type="search"
                            placeholder="Search By School code"
                            // value={searchTextField}
                            onChange={handleSearch}
                            InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <img src={SearchIcon} alt="" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
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
                    />
                </div>
            </Paper>
        </div>
    );
};

function CollectionTable({ data, LIST_ITEM_PER_PAGE, pageNo }) {
    const navigate = useNavigate();
    const list = data;
    return (
        <TableContainer component={Paper}>
            <Table
                aria-label="simple table"
                className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
            >
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell>S.No.</TableCell>
                        <TableCell>Case - ID</TableCell>
                        <TableCell>School Name & Code</TableCell>
                        <TableCell>Collected Amount</TableCell>
                        <TableCell>Collected Date</TableCell>
                        <TableCell>Action</TableCell>
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
                                <TableCell className="crm-sd-table-cell-anchor">
                                    <div
                                        onClick={
                                            () => navigate(
                                                `adjustment-form/${row?.school_code}/${row?.deposit_auto_id}`,
                                                { state: { payment_adjustment_approval_status_id: row?.payment_adjustment_approval_status_id, created_by_uuid: row?.created_by_uuid } }
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
