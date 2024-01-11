import {
    Alert, InputAdornment, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Box
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/icons/icon_search.svg";
import { getCollectionTypeActivities } from "../../config/services/bdeActivities";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";
import { DecryptData } from "../../utils/encryptDecrypt";
import Page from "../Page";
import useMediaQuery from "@mui/material/useMediaQuery";

const LIST_ITEM_PER_PAGE = 10;

export default function PaymentListView() {
    const [pageNo, setPagination] = useState(1);
    const [search, setSearchValue] = useState("");
    const [lastPage, setLastPage] = useState(false);
    const [loader, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    
    const userChildRoles = useMemo(() => DecryptData(localStorage.getItem("childRoles"))?.map(item => item?.roleName) || [], []);
    const userRole = useMemo(() => {
        return localStorage.getItem("userRoles") ? JSON.parse(localStorage.getItem("userRoles")) : []
    }, []);
    useEffect(() => {
        getBdeActivity()
    }, [pageNo, search]);

    const getBdeActivity = async () => {
        let params = {
            // meetingStatus: "",
            // customerResponse: [],
            childRoleNames: userChildRoles?.length ? [...userChildRoles, ...userRole] : [],
            isCollection: true,
            pageNo: pageNo - 1,
            count: LIST_ITEM_PER_PAGE
        }
        if (search && search !== "") params.search = search;
        setLoading(true)
        let result = await getCollectionTypeActivities(params)
        if (result?.result?.length) {
            result.result = result?.result.map(item => ({ ...item?.documents?.[0] }))
        }
        setLastPage(result?.result?.length < LIST_ITEM_PER_PAGE)
        result = result?.result
        setData(result)
        setLoading(false)
    }


    const handleSearch = _.debounce((e) => {
        let { value } = e.target;
        value = value.trim();
        if (value !== "") {
            setPagination(1);
            setSearchValue(value, () => setPagination(1));
        } else {
            setSearchValue("");
        }
    }, 600);

    return (
        <Page title="Manage Payments | Extramarks" className="crm-page-wrapper" >
            <div className="crm-page-manage-payments">

                <Box className="crm-page-listing">
                    <div className="crm-page-listing-header">
                        <div className="crm-page-listing-header-label">
                    
                            <div className="left">
                                <h3>Manage Payments</h3>
                            </div>
                            {
                                !isMobile
                                ? <div className="right">
                                    <form>
                                        <TextField
                                            className={`crm-form-input medium-dark`}
                                            type="search"
                                            placeholder="Search"
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
                                setPagination={setPagination}
                                lastPage={lastPage}
                            />
                        </div>
                    </Paper>
                </Box>
            </div>
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
                        <TableCell>School Code</TableCell>
                        <TableCell>School Name</TableCell>
                        <TableCell>Deposit For</TableCell>
                        <TableCell>Amount Collected</TableCell>
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
                                <TableCell>{row?.schoolCode}</TableCell>
                                <TableCell>{row?.schoolName}</TableCell>

                                <TableCell>{row?.name}</TableCell>
                                <TableCell>{row?.collectedPayment || 0}/-</TableCell>
                                <TableCell className="crm-anchor crm-anchor-small" align="right">
                                    <div onClick={() => navigate(
                                        `details-form/${row?.schoolCode}}`,
                                        {
                                            state: {
                                                collectedPayment: row.collectedPayment,
                                                deposit_for: row.name,
                                                schoolCode: row.schoolCode,
                                                schoolName: row.schoolName,
                                                paymentActivityId: row._id
                                            },
                                        }
                                    )}
                                    >
                                        Fill Details
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

}
