import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        width: '400px'
    },
    label: {
        marginRight: theme.spacing(2),
    },
    select: {
        width: '200px', // Set the width to 100% or your desired value
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


    tableCell: {
        border: "1px solid black",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

    },
    icon: {
        marginRight: theme.spacing(1),
        color: "green",
    },
    fileInput: {
        display: "none",
    },
    centeredRow: {
        textAlign: "center",
    },

}));


const EditLedgerTable = ({ list, pageNo, itemsPerPage }) => {
    const classes = useStyles();

    return (
        <TableContainer style={{ padding: '10px' }}>
            <Table
                aria-label="simple table"
                className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
            >
                <TableHead>
                    <TableRow className="cm_table_head" >
                        <TableCell>S.No.</TableCell>
                        <TableCell>Voucher Type</TableCell>
                        <TableCell>Payment Type</TableCell>
                        <TableCell>Deposit Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>Action</TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>
                    {list && list?.length > 0 &&
                        list.map((row, i) => (

                            <TableRow
                                key={i}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {i + 1 + (pageNo - 1) * itemsPerPage}
                                </TableCell>
                                <TableCell > {row?.voucher_type} </TableCell>
                                <TableCell>{row?.payment_type}
                                </TableCell>
                                <TableCell>
                                    {row?.voucher_amount !== null ? (
                                        <>
                                            <CurrencyRupeeIcon
                                                sx={{
                                                    position: "relative",
                                                    top: "2px",
                                                    fontSize: "14px",
                                                }}
                                            />
                                            {Number(row?.voucher_amount)?.toLocaleString("en-IN", {
                                                maximumFractionDigits: 2,
                                            })}
                                            / -{" "}
                                        </>
                                    ) : (
                                        "N/A"
                                    )}
                                </TableCell>
                                <TableCell>{row?.voucher_date}</TableCell>
                                <TableCell >{row?.voucher_comment || "N/A"}</TableCell>
                                <TableCell>
                                    <Link className={classes.quotationLink}
                                    // onClick={() => redirectPricingEngine()}
                                    >
                                        Edit
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}

                </TableBody>
            </Table>
        </TableContainer>

    );
}

export default EditLedgerTable