import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helper/randomFunction/localStorage";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { CurrenncyFormatter } from "../../utils/utils";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #fff',
        boxShadow: '0px 0px 4px #0000001A',
        minWidth: '300px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '18px',
    },
    outlineButton: {
        color: '#85888A',
        fontSize: '14px',
        border: '1px solid #DEDEDE',
        borderRadius: '4px',
        fontWeight: 'normal',
        marginRight: '10px',
        padding: '0.5rem 1.5rem'
    },
    containedButton: {
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        padding: '0.5rem 1.5rem'
    }
}));

export default function VoucherDetailsList({ list, voucherDetails }) {
    const navigate = useNavigate();
    const classes = useStyles();
    const loginData = getUserData('loginData')
    const loggedInUser = loginData?.uuid







    return (
        <>
            <Table
                aria-label="customized table"
                className="custom-table datasets-table"
            >
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell>Implementation ID</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Invoice Id</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell> {voucherDetails?.voucher_type_code === "CRN"
                            ? "Credit Note Amount"
                            : voucherDetails?.voucher_type_code === "DBN"
                                ? "Debit Note Amount"
                                : "Bad Debt Amount"}
                        </TableCell>


                    </TableRow>
                </TableHead>

                <TableBody>
                    {list && list?.length > 0 && list?.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row?.implementation_form_id ?? 'N/A'}</TableCell>
                            <TableCell>
                                {row?.product_name ?? 'N/A'}
                            </TableCell>
                            <TableCell>
                                {row?.invoice_number ?? 'N/A'}
                            </TableCell>
                            <TableCell>
                                {row?.invoice_total_amount !== null ? (
                                    <>
                                        <CurrencyRupeeIcon
                                            sx={{
                                                position: "relative",
                                                top: "2px",
                                                fontSize: "16px",
                                            }}
                                        />
                                        {Number(row?.invoice_total_amount)?.toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                        })}
                                        / -{" "}
                                    </>
                                ) : (
                                    "N/A"
                                )}

                            </TableCell>
                            <TableCell>
                                {row?.credit_debit_amount !== null ? (
                                    <>
                                        <CurrencyRupeeIcon
                                            sx={{
                                                position: "relative",
                                                top: "2px",
                                                fontSize: "16px",
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

                        </TableRow>))}



                </TableBody>
            </Table>

        </>
    );
}
