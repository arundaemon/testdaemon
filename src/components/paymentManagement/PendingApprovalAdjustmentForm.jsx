import { Box, Divider, InputAdornment, Paper, TextField, Typography } from '@material-ui/core';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateAdjustmentStatus, listPaymentApprovalDetails, pendingCollectionDetail } from '../../config/services/paymentCollectionManagment';
import { getUserData } from '../../helper/randomFunction/localStorage';
import Page from '../Page';
import toast from 'react-hot-toast';
import { fetchEmpCode } from '../../helper/DataSetFunction';
import { addAlertNotification } from '../../config/services/alertNotification';
import moment from 'moment';
import { ReactComponent as IconDownload } from '../../assets/icons/icon-payment-download.svg';
import { CurrencySymbol } from '../../constants/general';

const PAYMENT_STATUS_CODE_MAP = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
}

export default function PendingApprovalAdjustmentForm() {
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
    })

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
        if (collected_amount > detailsState?.details?.pending_collection_details[collectionIndex]?.invoice_collection_details[invoiceIndex]?.collection_amount)
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
        if (!payment_adjustment_approval_status_id) return 2;
        if (payment_adjustment_approval_status_id === 1) return 2;
        if (payment_adjustment_approval_status_id === 2) return 4;

        //reject cases
        if (payment_adjustment_approval_status_id === 5) return 2;
        if (payment_adjustment_approval_status_id === 7) return 4;
        return toast.error('Something went wrong!');
    }

    async function onApprove() {
        try {
            if (!validateCollectedAmount()) return toast.error('Collected amount is not equal to total adjusted amount!');
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
        if (!payment_adjustment_approval_status_id) return 3;
        if (payment_adjustment_approval_status_id === 1) return 3;
        if (payment_adjustment_approval_status_id === 2) return 5;
        toast.error('Something went wrong!');
        return null;
    }

    async function onReject() {
        try {
            const payment_adjustment_approval_status_id = getPaymentAdjustmentApprovalStatusIdForReject();
            if (!payment_adjustment_approval_status_id) return
            await updateAdjustmentStatus({
                uuid,
                deposit_auto_id,
                payment_adjustment_approval_status_id: payment_adjustment_approval_status_id,
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
            await notifyReject();
            navigate(-1);
        } catch (error) {
            console.log('error in reject', error);
            toast.error('Something went wrong!!!');
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

    // notifyReject()

    return (
        <Page title="Payment Adjustment Form | Extramarks" className="crm-page-wrapper">
            <div className="">
                <Typography component="h2" style={{ marginBottom: '20px' }}>Detailed View</Typography>

                <div className="mainContainer">
                    {/* <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 15,
                                marginBottom: 15,
                            }}
                        >
                            <Box
                                sx={{
                                    minWidth: '400px',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '5px',
                                    }}
                                >
                                    <Button variant="outlined" size="small" style={{ cursor: "pointer" }} onClick={onApprove}>Approve</Button>
                                    <Button variant="outlined" size="small" style={{ cursor: "pointer" }} onClick={onReject}>Reject</Button>
                                    <Button variant="outlined" size="small" style={{ cursor: "pointer" }} onClick={onSave}>Save</Button>
                                    <Button variant="outlined" size="small" style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>Cancel</Button>
                                </Box>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Mode of Payment</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Status</TableCell>
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
                                                                    <TableCell>{item?.payment_mode_name}</TableCell>
                                                                    <TableCell>Rs {item?.deposit_amount} /-</TableCell>
                                                                    <TableCell>{PAYMENT_STATUS_CODE_MAP[item?.payment_approval_status] || ''}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    )
                                            }
                                            <TableRow>
                                                <TableCell>Total Amount</TableCell>
                                                <TableCell>Rs {paymentApprovalDetailsState?.details?.total_amount} /-</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box> */}
                    <Grid container spacing={2.5} mb={3}>
                        <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item'>
                            <Typography component="h6">Total Invoice</Typography>
                            <Typography component="h4" >
                                {/* {CurrencySymbol?.India}{detailsState?.details?.total_invoice_amount}/- */}
                                {CurrencySymbol?.India}&nbsp;
                                {detailsState?.details?.total_invoice_amount ? Number(detailsState?.details?.total_invoice_amount)?.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                }) : 0}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item'>
                            <Typography component="h6">Total Outstanding</Typography>
                            <Typography component="h4" >
                                {/* {CurrencySymbol?.India}{detailsState?.details?.total_outstanding_amount}/- */}
                                {CurrencySymbol?.India}&nbsp;
                                {detailsState?.details?.total_outstanding_amount ? Number(detailsState?.details?.total_outstanding_amount)?.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                }) : 0}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item'>
                            <Typography component="h6">Total Contract Value</Typography>
                            <Typography component="h4" >
                                {/* {CurrencySymbol?.India}{detailsState?.details?.total_contract_amount || 0}/- */}

                                {CurrencySymbol?.India}&nbsp;
                                {detailsState?.details?.total_contract_amount ? Number(detailsState?.details?.total_contract_amount)?.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                }) : 0}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mb: '3rem' }}>
                        <TableContainer className='crm-table-container'>
                            <Table className='crm-table-size-md'>
                                <TableHead>
                                    <TableRow>
                                        {
                                            [
                                                "S.No.",
                                                "Mode of Payment",
                                                "Amount",
                                                "Status",
                                                "Payment Avidence"
                                            ].map((item, index) => (
                                                <TableCell key={`header-${index}`} style={{ fontWeight: '600', textAlign: (index == 4 ? 'right' : 'left') }}>{item}</TableCell>
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
                                                            <TableCell style={{ textAlign: 'left' }}>{index + 1}</TableCell>
                                                            <TableCell style={{ textAlign: 'left' }}>{item?.payment_mode_name}</TableCell>
                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                {/* {CurrencySymbol?.India}{item?.deposit_amount}/- */}
                                                                {CurrencySymbol?.India}&nbsp;
                                                                {item?.deposit_amount ? Number(item?.deposit_amount)?.toLocaleString("en-IN", {
                                                                    maximumFractionDigits: 2,
                                                                }) : 0}
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: 'left' }}>{PAYMENT_STATUS_CODE_MAP[item?.payment_approval_status] || ''}</TableCell>
                                                            <TableCell style={{ textAlign: 'right' }} >
                                                                <IconButton
                                                                    // payment_evidence_file_path
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => {
                                                                        const link = document.createElement('a');
                                                                        link.href = item?.payment_evidence_file_path;
                                                                        link.download = 'payment_evidence';
                                                                        link.target = '_blank';
                                                                        link.click();
                                                                    }}
                                                                >
                                                                    <IconDownload />
                                                                </IconButton>
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
                                        <TableCell colSpan={5} style={{ textAlign: 'right', fontSize: '1rem', fontWeight: '600', color: '#202124' }}>
                                            <span style={{ fontWeight: "normal", fontSize: '18px' }}>Total Amount:</span>
                                            {/* {paymentApprovalDetailsState?.details?.total_amount}/- */}

                                            {CurrencySymbol?.India}&nbsp;
                                            {paymentApprovalDetailsState?.details?.total_amount ? Number(paymentApprovalDetailsState?.details?.total_amount)?.toLocaleString("en-IN", {
                                                maximumFractionDigits: 2,
                                            }) : 0}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box sx={{ width: '100%', marginBottom: '20px' }}>
                        <Typography component="h2" >Software</Typography>
                    </Box>
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
                                            <TableCell key={`header-${index}`} style={{ fontWeight: '600', textAlign: (index == 9 ? 'right' : 'left') }}>{item}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    detailsState?.details?.pending_collection_details?.length === 0
                                        ? (
                                            <TableRow>
                                                <TableCell colSpan={10}>NA</TableCell>
                                            </TableRow>
                                        )
                                        : (
                                            <>
                                                {
                                                    detailsState?.details?.pending_collection_details?.map((item, collectionIndex) => {
                                                        if (item?.invoice_collection_details?.length < 2) {
                                                            return (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left' }} >{collectionIndex + 1}</TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }} >{item?.invoice_number}</TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }} >{item?.invoice_amount}/-</TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }} >{item?.products_name}</TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }} >
                                                                            {/* {CurrencySymbol?.India}{item?.late_fees_amount}/- */}
                                                                            {CurrencySymbol?.India}&nbsp;
                                                                            {item?.late_fees_amount ? Number(item?.late_fees_amount)?.toLocaleString("en-IN", {
                                                                                maximumFractionDigits: 2,
                                                                            }) : 0}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }} >
                                                                            {/* {CurrencySymbol?.India}{item?.outstanding_amount}/- */}
                                                                            {CurrencySymbol?.India}&nbsp;
                                                                            {item?.outstanding_amount ? Number(item?.outstanding_amount)?.toLocaleString("en-IN", {
                                                                                maximumFractionDigits: 2,
                                                                            }) : 0}
                                                                        </TableCell>
                                                                        {/*  */}
                                                                        <TableCell style={{ textAlign: 'left' }}>{item?.invoice_collection_details[0]?.collection_date}</TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }}>
                                                                            {/* {CurrencySymbol?.India}{item?.invoice_collection_details[0]?.collection_amount}/- */}
                                                                            {CurrencySymbol?.India}&nbsp;
                                                                            {item?.invoice_collection_details[0]?.collection_amount ? Number(item?.invoice_collection_details[0]?.collection_amount)?.toLocaleString("en-IN", {
                                                                                maximumFractionDigits: 2,
                                                                            }) : 0}

                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }}>
                                                                            <TextField
                                                                                className='crm-form-input dark width-150px'
                                                                                type="number"
                                                                                value={item?.invoice_collection_details[0]?.collected_amount}
                                                                                onChange={(e) => onCollectedAmountChange({ invoiceIndex: 0, collectionIndex, collected_amount: parseInt(e.target.value) })}
                                                                                InputProps={{
                                                                                    startAdornment: <InputAdornment position="start">{CurrencySymbol?.India}</InputAdornment>,
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'right', width: 'max-content' }}>
                                                                            {/* {CurrencySymbol?.India}{item?.invoice_collection_details[0]?.due_amount}/- */}
                                                                            {CurrencySymbol?.India}&nbsp;
                                                                            {item?.invoice_collection_details[0]?.due_amount ? Number(item?.invoice_collection_details[0]?.due_amount)?.toLocaleString("en-IN", {
                                                                                maximumFractionDigits: 2,
                                                                            }) : 0}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )
                                                        }

                                                        return item?.invoice_collection_details?.map((subItem, subItemIndex) => {
                                                            return (
                                                                <>
                                                                    <TableRow>
                                                                        {
                                                                            subItemIndex === 0 ?
                                                                                (
                                                                                    <>
                                                                                        <TableCell style={{ textAlign: 'left' }} >{collectionIndex + 1}</TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} >{item?.invoice_number}</TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} >{item?.invoice_amount}/-</TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} >{item?.products_name}</TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} >
                                                                                            {/* {CurrencySymbol?.India}{item?.late_fees_amount}/- */}
                                                                                            {CurrencySymbol?.India}&nbsp;
                                                                                            {item?.late_fees_amount ? Number(item?.late_fees_amount)?.toLocaleString("en-IN", {
                                                                                                maximumFractionDigits: 2,
                                                                                            }) : 0}
                                                                                        </TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} >
                                                                                            {/* {CurrencySymbol?.India}{item?.outstanding_amount}/- */}

                                                                                            {CurrencySymbol?.India}&nbsp;
                                                                                            {item?.outstanding_amount ? Number(item?.outstanding_amount)?.toLocaleString("en-IN", {
                                                                                                maximumFractionDigits: 2,
                                                                                            }) : 0}
                                                                                        </TableCell>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    <>
                                                                                        <TableCell style={{ textAlign: 'left' }} ></TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} ></TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} ></TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} ></TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} ></TableCell>
                                                                                        <TableCell style={{ textAlign: 'left' }} ></TableCell>
                                                                                    </>
                                                                                )
                                                                        }
                                                                        <TableCell style={{ textAlign: 'left' }}>{subItem?.collection_date}</TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }}>
                                                                            {/* {CurrencySymbol?.India}{subItem?.collection_amount}/- */}

                                                                            {CurrencySymbol?.India}&nbsp;
                                                                            {subItem?.collection_amount ? Number(subItem?.collection_amount)?.toLocaleString("en-IN", {
                                                                                maximumFractionDigits: 2,
                                                                            }) : 0}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left' }}>
                                                                            <TextField
                                                                                className='crm-form-input dark width-150px'
                                                                                type="number"
                                                                                value={subItem?.collected_amount}
                                                                                onChange={(e) => onCollectedAmountChange({ invoiceIndex: subItemIndex, collectionIndex, collected_amount: parseInt(e.target.value) })}
                                                                                InputProps={{
                                                                                    startAdornment: <InputAdornment position="start">{CurrencySymbol?.India}</InputAdornment>,
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'right', width: 'max-content' }}>
                                                                            {/* {CurrencySymbol?.India}{subItem?.due_amount}/- */}

                                                                            {CurrencySymbol?.India}&nbsp;
                                                                            {subItem?.due_amount ? Number(subItem?.due_amount)?.toLocaleString("en-IN", {
                                                                                maximumFractionDigits: 2,
                                                                            }) : 0}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {/* {
                                                                        item?.invoice_collection_details.map((collection, invoiceIndex) => {
                                                                            return (
                                                                                <TableRow key={`invoice_collection_details-${invoiceIndex}`}>
                                                                                    <TableCell style={{ textAlign: 'left' }}>{collection?.collection_date}</TableCell>
                                                                                    <TableCell style={{ textAlign: 'left' }}>{collection?.collection_amount}/-</TableCell>
                                                                                    <TableCell style={{ textAlign: 'left' }}>
                                                                                        <TextField
                                                                                            className='crm-form-input dark width-100px'
                                                                                            type="number"
                                                                                            value={collection?.collected_amount}
                                                                                            onChange={(e) => onCollectedAmountChange({ invoiceIndex, collectionIndex, collected_amount: parseInt(e.target.value) })}
                                                                                        // InputProps={{
                                                                                        //     startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                                                                                        // }}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell style={{ textAlign: 'right', width: 'max-content' }}>{collection?.due_amount}/-</TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        })
                                                                    } */}
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
                            marginTop: "30px",
                            marginBottom: "20px",
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: '400px',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button variant="outlined" size="medium" className='crm-btn crm-btn-outline crm-btn-lg mr-1'
                                style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>Cancel</Button>
                            <Button variant="outlined" size="medium" className='crm-btn crm-btn-outline crm-btn-lg mr-1'
                                style={{ cursor: "pointer" }} onClick={onReject}>Reject</Button>
                            <Button variant="outlined" size="medium" className='crm-btn crm-btn-outline crm-btn-lg mr-1'
                                style={{ cursor: "pointer" }} onClick={onApprove}>Approve</Button>
                            <Button variant="contained" size="medium" className='crm-btn crm-btn-lg'
                                style={{ cursor: "pointer" }} onClick={onSave}>Save</Button>
                        </Box>
                    </Box>
                </div>
            </div>
        </Page>
    )
}