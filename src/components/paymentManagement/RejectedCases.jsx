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
import { listRejectedPayment } from "../../config/services/paymentCollectionManagment";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";

const LIST_ITEM_PER_PAGE = 10;

export default function RejectedCases() {
    const uuid = getUserData("loginData")?.uuid;
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

    useEffect(() => {
        getData();
    }, [pageNo, search]);

    async function getData() {
        let params = {
            uuid: uuid,
            page_offset: pageNo - 1,
            page_size: LIST_ITEM_PER_PAGE,
            payment_approval_status: [3, 4],
            order_by: "deposit_auto_id",
            order: "DESC"
        };
        if (search && search !== "") {
            params.school_code = search;
        }
        setLoading(true);
        setLastPage(false);
        setError(false)
        listRejectedPayment(params)
            .then((res) => {
                if (res.data.rejected_payment_details) {
                    setData(res.data.rejected_payment_details);
                    setLastPage(res.data.rejected_payment_details.length < LIST_ITEM_PER_PAGE);
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
                        <h3>Rejected Cases</h3>
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
                        <TableCell>Rejected by</TableCell>
                        <TableCell>Reason of rejecion</TableCell>
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
                                <TableCell>{row?.school_code}</TableCell>
                                <TableCell>{row?.rejected_by_empname} - {row?.rejected_by_empcode}</TableCell>
                                <TableCell>{row?.rejection_reason}</TableCell>
                                {
                                    row?.payment_adjustment_approval_status_id === 8
                                        ? (
                                            <TableCell>
                                                <div>Submitted</div>
                                            </TableCell>
                                        )
                                        : (
                                            <TableCell className="crm-sd-table-cell-anchor">
                                                <div
                                                    onClick={
                                                        () => navigate(
                                                            `/authorised/manage-payments/details-form/${row?.school_code}}`,
                                                            {
                                                                state: {
                                                                    collectedPayment: row.total_amount_collected || 2000,
                                                                    deposit_for: row.product_name,
                                                                    schoolCode: row.school_code,
                                                                    deposit_auto_id: row.deposit_auto_id,
                                                                    resubmit: true,
                                                                },
                                                            }
                                                        )}
                                                >
                                                    Resubmit
                                                </div>
                                            </TableCell>
                                        )
                                }
                            </TableRow>
                        ))}
                </TableBody>
            </Table >
        </TableContainer >
    );
}

// payment_adjustment_approval_status_id