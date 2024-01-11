import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { cancelVoucher } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const useStyles = makeStyles((theme) => ({
    cusCard: {
        padding: "18px",
        boxShadow: "0px 0px 8px #00000029",
        borderRadius: "8px",
        margin: "0.5rem 1rem",
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
    noData: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 600,
        fontSize: 25,
    },
    loader: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    noData: {
        /* Add your styling for the message here */
        color: "red",
        fontWeight: "bold",
    },

    customBorder: {
        padding: "10px 16px",
        border: "1px solid #eee",
        fontSize: "15px",
    },
    quotationLink: {
        cursor: "pointer",
        color: "#f45e29",
        textDecoration: "underline",
    },
}));

export default function VoucherList({
    voucherList,
    itemsPerPage,
    pageNo,
    getAllVoucherList,
    tabValue
}) {
    const navigate = useNavigate();
    const classes = useStyles();
    const loginData = getUserData('loginData')
    const loggedInUser = loginData?.uuid



    const handleCancel = (row) => {
        let obj = {
            uuid: loggedInUser,
            voucher_for: "SW",
            voucher_auto_id: row?.voucher_auto_id,
            voucher_status: 3,

        };
        cancelVoucher(obj)
            .then((res) => {
                if (res?.data?.status === 1) {
                    toast.success("Voucher Cancelled successfully!")
                    getAllVoucherList();
                } else if (res?.data?.status === 0) {
                    let { errorMessage } = res?.data?.message;
                    toast.error(errorMessage);
                } else {
                    console.error(res);
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });

    };


    const redirectVoucherView = async (obj) => {
        navigate("/authorised/voucher-details", {
            state: {
                data: obj,
            },
        });
    };


    const updateVoucher = async (obj) => {
        navigate("/authorised/voucher-update", {
            state: {
                data: obj,
            },
        });
    };

    return (
        <>
            <Table
                aria-label="simple table"
                className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
            >
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell className="tableHeadCell">S.No.</TableCell>
                        <TableCell className="tableHeadCell">Voucher Type</TableCell>
                        <TableCell className="tableHeadCell">Voucher Type ID</TableCell>
                        <TableCell className="tableHeadCell">School Name</TableCell>
                        <TableCell className="tableHeadCell">Amount</TableCell>
                        <TableCell className="tableHeadCell">Voucher Based</TableCell>
                        <TableCell className="tableHeadCell">Created By & Date</TableCell>
                        <TableCell className="tableHeadCell">Modified By & Date</TableCell>
                        <TableCell className="tableHeadCell">View</TableCell>
                        {tabValue === 0 && <TableCell>Action</TableCell>}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {voucherList &&
                        voucherList?.length > 0 &&
                        voucherList?.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1 + (pageNo - 1) * itemsPerPage}.</TableCell>
                                <TableCell>{row?.voucher_type ?? "N/A"}</TableCell>
                                <TableCell>{row?.voucher_number ?? "N/A"}</TableCell>
                                <TableCell>{row?.school_code ?? "N/A"}</TableCell>
                                <TableCell>
                                    {row?.credit_debit_amount !== null ? (
                                        <>
                                            <CurrencyRupeeIcon
                                                sx={{
                                                    position: "relative",
                                                    top: "1px",
                                                    fontSize: "13px",
                                                }}
                                            />
                                            {Number(row?.credit_debit_amount)?.toLocaleString("en-IN", {
                                                maximumFractionDigits: 2,
                                            })}
                                            / -{" "}
                                        </>
                                    ) : (
                                        "N/A"
                                    )}

                                </TableCell>
                                <TableCell>{row?.voucher_based ?? "-"}</TableCell>
                                <TableCell>{row?.created_by ?? '-'}<div>{moment(row?.created_on * 1000).format(
                                    "DD-MM-YYYY (HH:mm A)"
                                )}</div></TableCell>
                                <TableCell>{row?.modified_by
                                    ? row?.modified_by : row?.created_by}<div>{row?.modified_on ? moment(row?.modified_on * 1000).format("DD-MM-YYYY (HH:mm A)")
                                        : moment(row?.created_on * 1000).format("DD-MM-YYYY (HH:mm A)")}</div></TableCell>
                                <TableCell component="th" scope="row">
                                    <p className={classes.quotationLink}
                                        onClick={() =>
                                            redirectVoucherView(row)
                                        }>
                                        View
                                    </p>
                                </TableCell>
                                {tabValue === 0 &&
                                    (
                                        <>
                                            <TableCell component="th" scope="row">
                                                <p className={classes.quotationLink}
                                                    onClick={() =>
                                                        updateVoucher(row)
                                                    }>
                                                    Update
                                                </p>
                                            </TableCell>

                                            <TableCell component="th" scope="row">
                                                <p className={classes.quotationLink}
                                                    onClick={() =>
                                                        handleCancel(row)
                                                    }>
                                                    Cancel
                                                </p>
                                            </TableCell>
                                        </>
                                    )
                                }



                            </TableRow>
                        ))}
                </TableBody>
            </Table>

        </>
    );
}
