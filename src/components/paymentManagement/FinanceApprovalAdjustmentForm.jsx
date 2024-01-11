import { Box, Dialog, DialogContent, DialogTitle, Divider, InputAdornment, Paper, TextField, Typography } from '@material-ui/core';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, DialogActions, SvgIcon } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateAdjustmentStatus, listPaymentApprovalDetails, pendingCollectionDetail } from '../../config/services/paymentCollectionManagment';
import { getUserData } from '../../helper/randomFunction/localStorage';
import Page from '../Page';
import toast from 'react-hot-toast';
import { CurrencySymbol } from '../../constants/general';
import { fetchEmpCode } from '../../helper/DataSetFunction';
import { addAlertNotification } from '../../config/services/alertNotification';
import moment from 'moment';

const PAYMENT_STATUS_CODE_MAP = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
}

export default function FinanceApprovalAdjustmentForm() {
    const location = useLocation();
    const navigationData = location?.state || {};
    const uuid = getUserData("loginData")?.uuid;
    const { school_code, deposit_auto_id } = useParams();
    const navigate = useNavigate();
    const [detailsState, setDetailsState] = useState({
        noChangeDetails: null,
        details: null,
        loading: false,
        error: null
    });
    const [paymentApprovalDetailsState, setPaymentApprovalDetailsState] = useState({
        details: null,
        loading: false,
        error: null
    });
    const [alertState, setAlertState] = useState(null);

    if (!(school_code && deposit_auto_id)) navigate(-1);

    async function getCollectionsDetails() {
        setDetailsState({ ...detailsState, loading: true });
        try {
            const response = await pendingCollectionDetail({
                uuid,
                seach_by: "school_code",
                search_val: school_code,
                // search_val: 'UP3137',
                // search_val: 'UP3138',
            });
            setDetailsState({ ...detailsState, details: structuredClone(response.data), noChangeDetails: structuredClone(response.data), loading: false });
        } catch (error) {
            setDetailsState({ ...detailsState, error: error.message, loading: false });
        }
    }

    async function getPaymentApprovalDetails() {
        setPaymentApprovalDetailsState({ ...paymentApprovalDetailsState, loading: true });
        try {
            const response = await listPaymentApprovalDetails({
                uuid,
                deposit_auto_id,
            });
            // payment_approval_status === 3 is rejected
            const data = {
                ...response?.data,
                total_amount: response?.data?.payment_details?.reduce((acc, item) => item?.payment_approval_status === 3 ? acc : acc + item?.deposit_amount, 0)
            }
            setPaymentApprovalDetailsState({ ...paymentApprovalDetailsState, details: structuredClone(data), loading: false });
        } catch (error) {
            setPaymentApprovalDetailsState({ ...paymentApprovalDetailsState, error: error.message, loading: false });
        }
    }

    useEffect(() => {
        getCollectionsDetails();
        getPaymentApprovalDetails();
    }, []);

    const onCollectedAmountChange = ({ invoiceIndex, collectionIndex, collected_amount }) => {
        if (collected_amount < 0) return toast.error('Collected amount cannot be negative!');
        if (collected_amount > detailsState?.details?.pending_collection_details[invoiceIndex]?.invoice_collection_details[collectionIndex]?.collection_amount)
            return toast.error('Collected amount cannot be greater than collection amount!');
        // update detailsState
        setDetailsState({
            ...detailsState,
            details: {
                ...detailsState.details,
                pending_collection_details: detailsState.details.pending_collection_details.map((invoice, i) => {
                    if (i === collectionIndex) {
                        return {
                            ...invoice,
                            invoice_collection_details: invoice.invoice_collection_details.map((collection, j) => {
                                if (j === invoiceIndex) {
                                    return {
                                        ...collection,
                                        collected_amount
                                    }
                                }
                                return collection;
                            })
                        }
                    }
                    return invoice;
                })
            }
        })
    }

    function validateCollectedAmount() {
        const currentCollectionTotalAmount = paymentApprovalDetailsState?.details?.total_amount;
        if (!currentCollectionTotalAmount) return false;
        const adjustedTotalAmount = detailsState?.details?.pending_collection_details?.reduce((acc, item) => {
            return acc + item?.invoice_collection_details?.reduce((acc, item) => {
                return acc + item?.collected_amount;
            }, 0)
        }, 0);

        const noChangeTotalAmount = detailsState?.noChangeDetails?.pending_collection_details?.reduce((acc, item) => {
            return acc + item?.invoice_collection_details?.reduce((acc, item) => {
                return acc + item?.collected_amount;
            }, 0)
        }, 0);
        return currentCollectionTotalAmount >= (adjustedTotalAmount - noChangeTotalAmount);
    }
    async function onSave() {
        try {
            if (!validateCollectedAmount()) return toast.error('Total collected amount must be equal to ajusted amount!');
            const payment_adjustment_approval_status_id = navigationData?.payment_adjustment_approval_status_id;
            if (!payment_adjustment_approval_status_id) return toast.error('Something went wrong!');
            await updateAdjustmentStatus({
                uuid,
                deposit_auto_id,
                payment_adjustment_approval_status_id: payment_adjustment_approval_status_id,
                updated_adjustment_details: detailsState?.details?.pending_collection_details?.reduce((acc, collection) => {
                    return acc.concat(collection?.invoice_collection_details?.map(item => {
                        return {
                            invoice_auto_id: collection?.invoice_auto_id,
                            collection_auto_id: item?.collection_auto_id,
                            updated_collected_amount: item?.collected_amount,
                        }
                    })).filter(item => item?.updated_collected_amount > 0)
                }, [])
            });
            toast.success('Saved successfully!');
            navigate(-1);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong!');
        }
    }

    function getPaymentAdjustmentApprovalStatusIdForApprove() {
        const payment_adjustment_approval_status_id = navigationData?.payment_adjustment_approval_status_id;
        if (!payment_adjustment_approval_status_id || payment_adjustment_approval_status_id !== 4) return toast.error('Something went wrong!');
        return 6
    }

    function checkAllPaymentsApproved() {
        return paymentApprovalDetailsState?.details?.payment_details?.every(item => item?.payment_approval_status === 2);
    }

    async function onApprove() {
        try {
            if (!validateCollectedAmount()) return toast.error('Collected amount is not equal to total adjusted amount!');
            if (!checkAllPaymentsApproved()) return setAlertState({
                title: (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                        <Typography component="h2" variant='h5'>Alert</Typography>
                    </Box>
                ),
                body: (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%", flexDirection: "column" }}>
                        <SvgIcon sx={{ alignSelf: "center", marginTop: "10px", marginBottom: "15px" }} fontSize="large" xmlns="http://www.w3.org/2000/svg" width="51.674" height="45.019" viewBox="0 0 51.674 45.019">
                            <g id="Group_45682" data-name="Group 45682" transform="translate(0.5 -3.481)">
                                <g id="Group_45681" data-name="Group 45681" transform="translate(0 4)">
                                    <g id="Group_45680" data-name="Group 45680">
                                        <path id="Path_70714" data-name="Path 70714" d="M31.34,8.043,50.208,39.124a6.459,6.459,0,0,1-5.777,9.347H6.695A6.459,6.459,0,0,1,.918,39.124L19.786,8.043a6.459,6.459,0,0,1,11.554,0ZM27.488,9.969a2.153,2.153,0,0,0-3.851,0L4.769,41.05a2.153,2.153,0,0,0,1.926,3.116H44.431a2.153,2.153,0,0,0,1.926-3.116ZM23.41,19.016a2.153,2.153,0,1,1,4.306,0V31.248a2.153,2.153,0,1,1-4.306,0ZM25.563,39.86a2.153,2.153,0,1,1,2.153-2.153A2.153,2.153,0,0,1,25.563,39.86Z" transform="translate(-0.236 -4.471)" fill="#f45e29" stroke="#fff" stroke-width="1" />
                                    </g>
                                </g>
                            </g>
                        </SvgIcon>
                        <Typography component="h2" variant="body1" style={{ textAlign: 'center' }}>You need to approve all the payments before submitting this form.</Typography>
                    </Box>
                ),
                footer: (
                    <Box
                        sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}
                    >
                        <Button variant="contained" onClick={() => setAlertState(null)}>ok</Button>
                    </Box>
                )
            })
            //save
            await updateAdjustmentStatus({
                uuid,
                deposit_auto_id,
                // TODO: based on role
                payment_adjustment_approval_status_id: getPaymentAdjustmentApprovalStatusIdForApprove(),
                updated_adjustment_details: detailsState?.details?.pending_collection_details?.reduce((acc, collection) => {
                    return acc.concat(collection?.invoice_collection_details?.map(item => {
                        return {
                            invoice_auto_id: collection?.invoice_auto_id,
                            collection_auto_id: item?.collection_auto_id,
                            updated_collected_amount: item?.collected_amount,
                        }
                    })).filter(item => item?.updated_collected_amount > 0)
                }, [])
            });
            toast.success('Approved successfully!');
            navigate(-1);
        } catch (error) {
            toast.error('Something went wrong!');
        }
    }

    function getPaymentAdjustmentApprovalStatusIdForReject() {
        const payment_adjustment_approval_status_id = navigationData?.payment_adjustment_approval_status_id;
        if (!payment_adjustment_approval_status_id) return toast.error('Something went wrong!');
        return 7
    }

    async function onReject() {
        try {
            await updateAdjustmentStatus({
                uuid,
                deposit_auto_id,
                payment_adjustment_approval_status_id: getPaymentAdjustmentApprovalStatusIdForReject(),
                updated_adjustment_details: detailsState?.noChangeDetails?.pending_collection_details?.reduce((acc, collection) => {
                    return acc.concat(collection?.invoice_collection_details?.map(item => {
                        return {
                            invoice_auto_id: collection?.invoice_auto_id,
                            collection_auto_id: item?.collection_auto_id,
                            updated_collected_amount: item?.collected_amount,
                        }
                    })).filter(item => item?.updated_collected_amount > 0)
                }, [])
            });
            toast.success('Rejected successfully!');
            navigate(-1);
        } catch (error) {
            toast.error('Something went wrong!');
        }
    }

    function notifyReject() {
        // created_by_uuid
        if (!navigationData?.created_by_uuid) return;
        return fetchEmpCode([navigationData?.created_by_uuid])
            .then(async (res) => {
                const empCode = await res?.loadResponses?.[0]?.data.map((item) => item?.["TblEmployee.eCode"])?.filter(item => item);
                if (empCode.length === 0) return
                await addAlertNotification([{
                    "title": "Payment rejected",
                    "description": "payment rejected by finance",
                    "redirectLink": `/authorised/rejected-cases`,
                    "empCode": empCode,
                    "notificationDate": moment().format("YYYY-MM-DD"),
                }]);
                toast.success('Notification sent successfully!');
                return true
            })
            .catch((err) => {
                console.error(err, "..error");
            });
    }

    return (
        <Page title="Extramarks | Payment Adjustment Form" className="main-container">
            <div className="tableCardContainer">
                <Paper>
                    <Box
                        className="crm-sd-heading"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h2">Detailed View</Typography>
                    </Box>
                    <div className="mainContainer">
                        <Box
                            sx={{
                                display: 'flex',
                                marginBottom: '15px',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography component="h4" style={{ marginLeft: "15px", marginRight: "15px" }}>Total Invoice</Typography>
                                <Typography component="h4" style={{ marginLeft: "15px", marginRight: "15px", fontWeight: "bold" }}>
                                    {/* {detailsState?.details?.total_invoice_amount}/- */}
                                    {CurrencySymbol?.India}&nbsp;
                                    {detailsState?.details?.total_invoice_amount ? Number(detailsState?.details?.total_invoice_amount)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    }) : 0}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography component="h4" style={{ marginLeft: "15px", marginRight: "15px" }}>Total Outstanding</Typography>
                                <Typography component="h4" style={{ marginLeft: "15px", marginRight: "15px", fontWeight: "bold" }}>
                                    {/* {detailsState?.details?.total_outstanding_amount}/- */}
                                    {CurrencySymbol?.India}&nbsp;
                                    {detailsState?.details?.total_outstanding_amount ? Number(detailsState?.details?.total_outstanding_amount)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    }) : 0}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography component="h4" style={{ marginLeft: "15px", marginRight: "15px" }}>Total Contract Value</Typography>
                                <Typography component="h4" style={{ marginLeft: "15px", marginRight: "15px", fontWeight: "bold" }}>
                                    {/* {detailsState?.details?.total_contract_amount || 0}/- */}
                                    {CurrencySymbol?.India}&nbsp;
                                    {detailsState?.details?.total_contract_amount ? Number(detailsState?.details?.total_contract_amount)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    }) : 0}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {
                                            [
                                                "S.No.",
                                                "Mode of Payment",
                                                "Amount",
                                                "Status",
                                                "Payment Evidence"
                                            ].map((item, index) => (
                                                <TableCell key={`header-${index}`} style={{ fontWeight: 'bold', textAlign: 'center' }}>{item}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        !paymentApprovalDetailsState?.details?.payment_details?.length
                                            ? (
                                                <TableRow>
                                                    <TableCell>NA</TableCell>
                                                </TableRow>
                                            )
                                            : (
                                                paymentApprovalDetailsState?.details?.payment_details.map((item, index) => {
                                                    return (
                                                        <TableRow key={`payment_details-${index}`}>
                                                            <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>{item?.payment_mode_name}</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                {/* {CurrencySymbol?.India}{item?.deposit_amount} /- */}

                                                                {CurrencySymbol?.India}
                                                                {item?.deposit_amount ? Number(item?.deposit_amount)?.toLocaleString("en-IN", {
                                                                    maximumFractionDigits: 2,
                                                                }) : 0}

                                                            </TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>{PAYMENT_STATUS_CODE_MAP[item?.payment_approval_status] || ''}</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                <Button variant="outlined" size="small" style={{ cursor: "pointer" }} onClick={() => navigate(`/app/payment-management/payment-adjustment-form/${school_code}/${deposit_auto_id}/payment-evidence/${item?.payment_auto_id}`)}>View</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            )
                                    }
                                    {/* <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>Total Amount</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>Rs {paymentApprovalDetailsState?.details?.total_amount} /-</TableCell>
                                        <TableCell colSpan={2}></TableCell>
                                    </TableRow> */}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={5} style={{ textAlign: 'right', fontSize: '1rem', fontWeight: 'bolder' }}>
                                            <span style={{ fontWeight: "bold" }}>Total Amount:</span> {CurrencySymbol?.India}
                                            {Number(paymentApprovalDetailsState?.details?.total_amount)?.toLocaleString("en-IN", {
                                                maximumFractionDigits: 2,
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Box>
                        <Box sx={{ width: '100%', marginBottom: '15px' }}>
                            <Typography component="h2" variant='h5' style={{ marginLeft: "15px", marginRight: "15px" }}>Software</Typography>
                        </Box>
                        <Divider />
                        <TableContainer className='crm-table-container'>
                            <Table className='crm-table-size-md'>
                                <TableHead>
                                    <TableRow>
                                        {
                                            [
                                                "S.No.",
                                                "Invoice Number",
                                                "Invoice Amount",
                                                "Product",
                                                "Late Fees",
                                                "Outstading Amount",
                                                "Collection Date",
                                                "Collection Amount",
                                                "Collected Amount",
                                                "Due Amount",
                                            ].map((item, index) => (
                                                <TableCell key={`header-${index}`} style={{ fontWeight: 'bold', textAlign: 'center' }}>{item}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        detailsState?.details?.pending_collection_details?.length === 0
                                            ? (
                                                <TableRow>
                                                    <TableCell>NA</TableCell>
                                                </TableRow>
                                            )
                                            : (
                                                <>
                                                    {
                                                        detailsState?.details?.pending_collection_details?.map((item, collectionIndex) => {
                                                            if (item?.invoice_collection_details.length < 2) {
                                                                return (
                                                                    <>
                                                                        <TableRow>
                                                                            <TableCell style={{ textAlign: 'center' }}>{collectionIndex + 1}</TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>{item?.invoice_number}</TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                {/* {CurrencySymbol?.India} {item?.invoice_amount} /- */}

                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {item?.invoice_amount ? Number(item?.invoice_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>{item?.products_name}</TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                {/* {CurrencySymbol?.India} {item?.late_fees_amount} /- */}

                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {item?.late_fees_amount ? Number(item?.late_fees_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                {/* {CurrencySymbol?.India} {item?.outstanding_amount} /- */}

                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {item?.outstanding_amount ? Number(item?.outstanding_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>{item?.invoice_collection_details?.[0]?.collection_date}</TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                {/* {CurrencySymbol?.India} {item?.invoice_collection_details?.[0]?.collection_amount} /- */}

                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {item?.invoice_collection_details?.[0]?.collection_amount ? Number(item?.invoice_collection_details?.[0]?.collection_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                <TextField
                                                                                    className='crm-form-input dark width-150px'
                                                                                    type="number"
                                                                                    value={item?.invoice_collection_details?.[0]?.collected_amount}
                                                                                    onChange={(e) => onCollectedAmountChange({ invoiceIndex: 0, collectionIndex, collected_amount: parseInt(e.target.value) })}
                                                                                    InputProps={{
                                                                                        startAdornment: <InputAdornment position="start">{CurrencySymbol?.India}</InputAdornment>,
                                                                                    }}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                {/* {CurrencySymbol?.India} {item?.invoice_collection_details?.[0]?.due_amount} /- */}
                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {item?.invoice_collection_details?.[0]?.due_amount ? Number(item?.invoice_collection_details?.[0]?.due_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                )
                                                            }
                                                            return item?.invoice_collection_details?.map((collection, invoiceIndex) => {
                                                                return (
                                                                    <>
                                                                        <TableRow>
                                                                            {
                                                                                invoiceIndex === 0
                                                                                    ? (
                                                                                        <>
                                                                                            <TableCell style={{ textAlign: 'center' }}>{collectionIndex + 1}</TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}>{item?.invoice_number}</TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                                {/* {CurrencySymbol?.India} {item?.invoice_amount} /- */}
                                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                                {item?.invoice_amount ? Number(item?.invoice_amount)?.toLocaleString("en-IN", {
                                                                                                    maximumFractionDigits: 2,
                                                                                                }) : 0}
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}>{item?.products_name}</TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                                {/* {CurrencySymbol?.India} {item?.late_fees_amount} /- */}
                                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                                {item?.late_fees_amount ? Number(item?.late_fees_amount)?.toLocaleString("en-IN", {
                                                                                                    maximumFractionDigits: 2,
                                                                                                }) : 0}
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                                {/* {CurrencySymbol?.India} {item?.outstanding_amount} /- */}
                                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                                {item?.outstanding_amount ? Number(item?.outstanding_amount)?.toLocaleString("en-IN", {
                                                                                                    maximumFractionDigits: 2,
                                                                                                }) : 0}
                                                                                            </TableCell>
                                                                                        </>
                                                                                    )
                                                                                    : (
                                                                                        <>
                                                                                            <TableCell style={{ textAlign: 'center' }}></TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}></TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}></TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}></TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}></TableCell>
                                                                                            <TableCell style={{ textAlign: 'center' }}></TableCell>
                                                                                        </>
                                                                                    )
                                                                            }


                                                                            <TableCell style={{ textAlign: 'center' }}>{collection?.collection_date}</TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                {/* {CurrencySymbol?.India} {collection?.collection_amount} /- */}
                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {collection?.collection_amount ? Number(collection?.collection_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                                <TextField
                                                                                    className='crm-form-input dark width-150px'
                                                                                    type="number"
                                                                                    value={collection?.collected_amount}
                                                                                    onChange={(e) => onCollectedAmountChange({ invoiceIndex, collectionIndex, collected_amount: parseInt(e.target.value) })}
                                                                                    InputProps={{
                                                                                        startAdornment: <InputAdornment position="start">{CurrencySymbol?.India}</InputAdornment>,
                                                                                    }}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell style={{ textAlign: 'right' }}>
                                                                                {/* {CurrencySymbol?.India} {collection?.due_amount} /- */}
                                                                                {CurrencySymbol?.India}&nbsp;
                                                                                {collection?.due_amount ? Number(collection?.due_amount)?.toLocaleString("en-IN", {
                                                                                    maximumFractionDigits: 2,
                                                                                }) : 0}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                )
                                                            })
                                                        })
                                                    }
                                                </>
                                            )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "15px",
                                marginBottom: "15px",
                            }}
                        >
                            <Box
                                sx={{
                                    minWidth: '400px',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <Button variant="outlined" size="medium" style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>Cancel</Button>
                                <Button variant="outlined" size="medium" style={{ cursor: "pointer" }} onClick={onReject}>Reject</Button>
                                <Button variant="outlined" size="medium" style={{ cursor: "pointer" }} onClick={onApprove}>Approve</Button>
                                <Button variant="contained" size="medium" style={{ cursor: "pointer" }} onClick={onSave}>Save</Button>
                            </Box>
                        </Box>
                    </div>
                </Paper>
            </div>
            <AlertModal alertState={alertState} setAlertState={setAlertState} />
        </Page>
    )
}

function AlertModal({ alertState, setAlertState }) {
    if (!alertState) return null;
    return (
        // modal with header, close button top right corner, body, footer. use mui components
        <Dialog
            open={true}
            onClose={() => setAlertState(null)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Box
                sx={{
                    maxWidth: '420px',
                    padding: '20px',
                }}
            >
                <DialogTitle id="alert-dialog-title" >{alertState?.title}</DialogTitle>
                <DialogContent>
                    {alertState?.body}
                </DialogContent>
                {
                    alertState?.footer && (
                        <DialogActions>
                            {alertState?.footer}
                        </DialogActions>
                    )
                }
            </Box>
        </Dialog>
    )
}