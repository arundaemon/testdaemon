import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { handleNumberInputFieldWithDecimal } from "../../helper/randomFunction";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

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




export default function HardwareVoucherUpdateDebitNoteTable({ list, handleAmountData }) {
    const navigate = useNavigate();
    const classes = useStyles();
    const loginData = getUserData('loginData')
    const loggedInUser = loginData?.uuid
    const [listData, setListData] = useState([])
    const [debitAmount, setDebitAmount] = useState("")



    useEffect(() => {
        if (debitAmount != "") {
            handleAmountData(debitAmount)
        }
    }, [debitAmount])



    useEffect(() => {
        if (list?.length > 0) {
            setListData(list)
            setDebitAmount(list[0]?.package_credit_amount)
        }
    }, [list])


    return (
        <>
            <Table
                aria-label="customized table"
            >
                <TableHead>
                    <TableRow >
                        <TableCell>Credit Limit</TableCell>
                        <TableCell>Debit Note Amount</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {listData && listData?.length > 0 && listData?.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {row?.package_credit_limit !== null ? (
                                    <>
                                        <CurrencyRupeeIcon
                                            sx={{
                                                position: "relative",
                                                top: "2px",
                                                fontSize: "16px",
                                            }}
                                        />
                                        {Number(row?.package_credit_limit)?.toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                        })}
                                        / -{" "}
                                    </>
                                ) : (
                                    "NA"
                                )}

                            </TableCell>
                            <TableCell key={row?.package_name}>
                                <TextField
                                    className="label-text"
                                    name="creditNoteAmount"
                                    type="number"
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={debitAmount}
                                    onChange={(e) => {
                                        let data = e?.target?.value;
                                        setDebitAmount(data);
                                    }}
                                    onKeyDown={handleNumberInputFieldWithDecimal}
                                />
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>


        </>
    );
}
