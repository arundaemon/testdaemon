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




export default function HardwareVoucherFormTable({ obj, handleCreditData }) {
    const navigate = useNavigate();
    const classes = useStyles();
    const loginData = getUserData('loginData')
    const loggedInUser = loginData?.uuid
    let { hw_invoice_particular_details } = obj
    const [listData, setListData] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);



    const handleSelectClick = (data) => {
        const isSelected = selectedItems?.includes(data);
        if (isSelected) {
            const updatedSelectedItems = selectedItems?.filter(item => item !== data);
            setSelectedItems(updatedSelectedItems);
        } else {
            const updatedSelectedItems = [...selectedItems, data];
            setSelectedItems(updatedSelectedItems);
        }
    };


    useEffect(() => {
        if (hw_invoice_particular_details?.length > 0) {
            setListData(hw_invoice_particular_details)
        }
    }, [hw_invoice_particular_details])


    useEffect(() => {
        if (selectedItems?.length > 0) {
            handleCreditData(selectedItems)
        }
    }, [selectedItems, listData])





    return (
        <>
            <Table
                aria-label="customized table"
                className="custom-table datasets-table"
            >
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell></TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Selling Price</TableCell>
                        <TableCell>Credit Limit</TableCell>
                        <TableCell>Realized Amount</TableCell>
                        <TableCell>Credit Amount</TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>
                    {listData && listData?.length > 0 && listData?.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedItems.includes(
                                        row
                                    )}
                                    onChange={(event) =>
                                        handleSelectClick(row)
                                    }
                                />
                            </TableCell>
                            <TableCell>{row?.package_name ?? 'NA'}</TableCell>
                            <TableCell>
                                {row?.package_quantity ?? 'NA'}
                            </TableCell>
                            <TableCell>
                                {row?.package_selling_price ?? 'NA'}
                            </TableCell>
                            <TableCell>
                                {row?.package_credit_limit ?? 'NA'}
                            </TableCell>
                            <TableCell>
                                {row?.package_realized_amount ?? 'NA'}
                            </TableCell>

                            <TableCell>
                                <TextField
                                    className="label-text"
                                    name="creditNoteAmount"
                                    type="number"
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={listData?.package_credit_amount}
                                    onKeyDown={handleNumberInputFieldWithDecimal}
                                    onChange={(e) => {
                                        let updatedData = [...listData]
                                        updatedData[i].package_credit_amount = e?.target?.value
                                        setListData(updatedData)
                                    }}
                                />
                            </TableCell>

                           


                        </TableRow>))}
                </TableBody>
            </Table>


        </>
    );
}
