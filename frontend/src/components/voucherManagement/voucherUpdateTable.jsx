import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Button,
    Box
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { useState } from "react";
import moment from "moment";
import { updateVoucher } from "../../config/services/packageBundle";
import { toast } from "react-hot-toast";
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




export default function VoucherUpdateList({ voucherDetails, date }) {
    const navigate = useNavigate();
    const classes = useStyles();
    const loginData = getUserData('loginData')
    const loggedInUser = loginData?.uuid
    let { credit_debit_details } = voucherDetails
    const [listData, setListData] = useState(credit_debit_details)

    const handleUpdate = async (e) => {
        e.preventDefault();

        const transformedData = listData?.map(item => {
            return {
                crn_dbn_auto_id: item?.crdr_auto_id,
                updated_amount: parseFloat(item?.credit_debit_amount)
            };
        });

        let paramsObj = {
            uuid: loggedInUser,
            voucher_auto_id: voucherDetails?.voucher_auto_id,
            crn_dbn_for: "SW",
            deposit_date: moment(date).format("YYYY-MM-DD"),
            update_details: transformedData,
        }
        try {
            const response = await updateVoucher(paramsObj);
            if (response.data.status === 1) {
                toast.success(response?.data.message)
                navigate("/authorised/voucher-list");
            }
            else {
                toast.error(response?.data.message);
            }
        } catch (err) {
            console.log("error in addVoucher: ", err);
            toast.error("***Error***");
        }
    }

    const voucherCancelHandler = () => {
        navigate("/authorised/voucher-list");
    };



    return (
        <>
            <Table
                aria-label="customized table"
                className="custom-table datasets-table"
            >
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell>Implementation ID</TableCell>
                        <TableCell>Invoice Id</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>{voucherDetails?.voucher_type_code === "CRN"
                            ? "Credit Note Amount"
                            : voucherDetails?.voucher_type_code === "DBN"
                                ? "Debit Note Amount"
                                : "Bad Debt Amount"}</TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>
                    {listData && listData?.length > 0 && listData?.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row?.implementation_form_id ?? 'NA'}</TableCell>
                            <TableCell>
                                {row?.invoice_number ?? 'NA'}
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
                                <TextField
                                    className="label-text"
                                    name="creditNoteAmount"
                                    type="number"
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={listData[i]?.credit_debit_amount}
                                    onChange={(e) => {
                                        let updatedData = [...listData]
                                        updatedData[i].credit_debit_amount = e?.target?.value
                                        setListData(updatedData)
                                    }}
                                    onKeyDown={handleNumberInputFieldWithDecimal}

                                />
                            </TableCell>


                        </TableRow>))}


                </TableBody>
            </Table>

            <div>
                <Box className="modal-footer text-right" >
                    <Button className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" onClick={() => voucherCancelHandler()}> Cancel </Button>
                    <Button color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained" onClick={handleUpdate}> Update </Button>
                </Box>
            </div>

        </>
    );
}
