import { Box, InputAdornment, Paper, TextField, Typography } from '@material-ui/core';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addUpdateSchoolPayment, pendingCollectionDetail } from '../../config/services/paymentCollectionManagment';
import { getUserData } from '../../helper/randomFunction/localStorage';
import Page from '../Page';
import { updateBdeActivity } from '../../config/services/bdeActivities';
import { getHierachyDetails } from '../../config/services/hierachy';
import moment from 'moment';

export default function PaymentAdjustmentForm() {
    const uuid = getUserData("loginData")?.uuid;
    const navigate = useNavigate();
    let location = useLocation();
    const params = useParams();
    let { prevPageData } = location?.state ? location?.state : {};
    const [detailsState, setDetailsState] = useState(null);
    const fetchHierarchyDetail = () => {
        let params = {
            roleName: getUserData("userData").crm_role,
        };
        return getHierachyDetails(params)
            .then((res) => {
                if (res.result) {
                    return res.result;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function validateCollectedAmount() {
        const currentCollectionTotalAmount = prevPageData?.amtDeposit;
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
        return currentCollectionTotalAmount >= adjustedTotalAmount - noChangeTotalAmount;
    }

    async function getDetailsData(schoolCode) {
        setDetailsState({ ...detailsState, loading: true });
        try {
            const response = await pendingCollectionDetail({
                uuid,
                seach_by: "school_code",
                search_val: schoolCode,
                // search_val: 'UP3137',
                // search_val: 'UP3138',
            });
            setDetailsState({ ...detailsState, details: structuredClone(response.data), noChangeDetails: structuredClone(response.data), loading: false });
        } catch (error) {
            setDetailsState({ ...detailsState, error: error.message, loading: false });
        }
    }

    async function onCollectedAmountChange({ invoiceIndex, collectionIndex, collected_amount_value }) {
        let collected_amount = (collected_amount_value && collected_amount_value !== "") ? parseInt(collected_amount_value) : 0;
        if (isNaN(collected_amount)) return;
        if (collected_amount < 0) return toast.error('Collected amount cannot be negative!');
        if (collected_amount > detailsState?.details?.pending_collection_details[collectionIndex]?.invoice_collection_details[invoiceIndex]?.collection_amount)
            return toast.error('Total collected amount must be equal to ajusted amount!');
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

    async function onSubmit() {
        try {
            if (!validateCollectedAmount()) return toast.error('Collected amount is not equal to total adjusted amount!');
            //save
            const user_hierarchy_json = await fetchHierarchyDetail();
            let payment_deposit_details = [];
            if (prevPageData?.cashDeposit) {
                payment_deposit_details.push({
                    payment_mode_id: 1,
                    payment_evidence_file_path: prevPageData?.evidenceFilesUrls?.uploadData,
                    deposit_amount: prevPageData?.cashDeposit,
                    payment_evidence_no: prevPageData?.receiptNumber,
                    bank_id: prevPageData?.selectedBankForCash?.bank_id,
                    payment_approval_status: 1,
                })
            }
            if (prevPageData?.chequeDeposit) {
                payment_deposit_details.push({
                    payment_mode_id: 3,
                    payment_evidence_file_path: prevPageData?.evidenceFilesUrls?.uploadChequeData,
                    deposit_amount: prevPageData?.chequeDeposit,
                    payment_evidence_no: prevPageData?.chequeNumber,
                    bank_id: prevPageData?.selectedBankForCheque?.bank_id,
                    payment_approval_status: 1,
                })
            }
            if (prevPageData?.onlineDeposit) {
                payment_deposit_details.push({
                    payment_mode_id: 4,
                    payment_evidence_file_path: prevPageData?.evidenceFilesUrls?.uploadOnlineData,
                    deposit_amount: prevPageData?.onlineDeposit,
                    payment_evidence_no: prevPageData?.referenceID,
                    bank_id: prevPageData?.selectedBank?.bank_id,
                    payment_approval_status: 1,
                })
            }
            if (prevPageData?.ddAmtDeposit) {
                payment_deposit_details.push({
                    payment_mode_id: 2,
                    payment_evidence_file_path: prevPageData?.evidenceFilesUrls?.uploadDDData,
                    deposit_amount: prevPageData?.ddAmtDeposit,
                    payment_evidence_no: prevPageData?.demandDraftNumber,
                    bank_id: prevPageData?.selectedBankForDD?.bank_id,
                    payment_approval_status: 1,
                })
            }
            const _params = {
                uuid,
                school_code: prevPageData?.schoolCode || params?.id,
                payment_adjustment_approval_status_id: prevPageData?.resubmit ? 8 : 1,
                product_codes: prevPageData?.productSelected,
                total_deposit_amount: prevPageData?.amtDeposit,
                payment_deposit_details,
                updated_invoice_collection_details: detailsState?.details?.pending_collection_details?.reduce((acc, collection) => {
                    return acc.concat(collection?.invoice_collection_details?.filter(item => item.collection_amount)?.map(item => {
                        return {
                            invoice_auto_id: collection?.invoice_auto_id,
                            collection_auto_id: item?.collection_auto_id,
                            updated_collected_amount: item?.collected_amount,
                        }
                    })).filter(item => item?.updated_collected_amount > 0)
                }, []),
                partial_payment_reason: [],
                status: 1,
                show_in_collection: "yes",
                user_hierarchy_json: JSON.stringify(user_hierarchy_json),
            }
            if (prevPageData?.resubmit) {
                _params.deposit_auto_id = prevPageData?.deposit_auto_id;
            }
            await addUpdateSchoolPayment(_params);
            await updateBdeActivity({
                idList: [prevPageData?.paymentActivityId],
            });
            toast.success('Payment adjustment form submitted successfully!');
            navigate('/authorised/manage-payments');
        } catch (error) {
            // console.log(error);
            toast.error('Something went wrong!');
        }
    }

    useEffect(() => {
        getDetailsData(params?.id);
    }, [params?.id]);

    return (
        <Page title="Payment Adjustment Form | Extramarks" className="crm-page-wrapper">
            <div className="">
                <Box className="crm-sd-heading">
                    <Typography component="h2">Collected Amount Adjustment {params?.id && prevPageData?.schoolName ? `(${prevPageData.schoolName}, ${params.id})` : ""}</Typography>
                </Box>
                <div className="mainContainer">

                    {/* <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '5px',
                                }}
                            >
                                <Button variant="outlined" size="small" style={{ cursor: "pointer" }}>Approve</Button>
                                <Button variant="outlined" size="small" style={{ cursor: "pointer" }}>Reject</Button>
                                <Button variant="outlined" size="small" style={{ cursor: "pointer" }}>Save</Button>
                                <Button variant="outlined" size="small" style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>Cancel</Button>
                            </Box> */}
                    {/* <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mode of Payment</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Cash</TableCell>
                                            <TableCell>Rs 50000 /-</TableCell>
                                            <TableCell>Approved</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Online Paymens</TableCell>
                                            <TableCell>Rs 50000 /-</TableCell>
                                            <TableCell>Rejected</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total Amount</TableCell>
                                            <TableCell>Rs 50000 /-</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer> */}

                    <Grid container spacing={2.5} mb={2.5}>
                        {
                            prevPageData?.cashDeposit > 0 && (
                                <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                                    <Typography component="h6" variant="body2" >Cash</Typography>
                                    <Typography component="h4" >{prevPageData?.cashDeposit}/-</Typography>
                                </Grid>
                            )
                        }
                        {
                            prevPageData?.ddAmtDeposit > 0 && (
                                <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                                    <Typography component="h6" variant="body2" >Demand draft</Typography>
                                    <Typography component="h4" >{prevPageData?.ddAmtDeposit}/-</Typography>
                                </Grid>
                            )
                        }
                        {
                            prevPageData?.onlineDeposit > 0 && (
                                <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                                    <Typography component="h6" variant="body2" >Online payment</Typography>
                                    <Typography component="h4" >{prevPageData?.onlineDeposit}/-</Typography>
                                </Grid>
                            )
                        }
                        {
                            prevPageData?.chequeDeposit > 0 && (
                                <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                                    <Typography component="h6" variant="body2" >Cheque</Typography>
                                    <Typography component="h4" >{prevPageData?.chequeDeposit}/-</Typography>
                                </Grid>
                            )
                        }
                    </Grid>
                    <Grid container spacing={2.5} mb={4.5}>
                        <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                            <Typography component="h6" variant="body2" >Total Deposit Amount</Typography>
                            <Typography component="h4" >{prevPageData?.amtDeposit}/-</Typography>
                        </Grid>
                        <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                            <Typography component="h6" variant="body2" >Total Outstanding</Typography>
                            <Typography component="h4" >{detailsState?.details?.total_outstanding_amount}/-</Typography>
                        </Grid>
                        <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item' >
                            <Typography component="h6" variant="body2" >Total Contract Value</Typography>
                            <Typography component="h4" >{detailsState?.details?.total_contract_amount}/-</Typography>
                        </Grid>
                    </Grid>


                    <Typography component="h2" style={{ marginBottom: '15px' }} >Software</Typography>
                    <TableContainer className="crm-table-container">
                        <Table className='crm-table-size-md' >
                            <TableHead>
                                <TableRow className="cm_table_head">
                                    <TableCell >S.No.</TableCell>
                                    <TableCell >Invoice Number</TableCell>
                                    <TableCell >Invoice Amount</TableCell>
                                    <TableCell >Product</TableCell>
                                    <TableCell >Late Fees</TableCell>
                                    <TableCell >Outstading Amount</TableCell>
                                    <TableCell >Collection Date</TableCell>
                                    <TableCell >Collection Amount</TableCell>
                                    <TableCell sx={{ minWidth: "180px" }}>Collected Amount</TableCell>
                                    <TableCell >Due Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    detailsState?.details?.pending_collection_details?.length === 0 || !detailsState?.details?.pending_collection_details
                                        ? (
                                            <TableCell colspan="10">
                                                NA
                                            </TableCell>
                                        )
                                        : (
                                            <>
                                                {
                                                    detailsState?.details?.pending_collection_details?.map((item, collectionIndex) => {
                                                        if (item?.invoice_collection_details.length < 2) {
                                                            return (
                                                                <TableRow key={`collection-${collectionIndex}`}>
                                                                    <TableCell>{collectionIndex + 1}</TableCell>
                                                                    <TableCell>{item?.invoice_number}</TableCell>
                                                                    <TableCell>{item?.invoice_amount}/-</TableCell>
                                                                    <TableCell>{item?.products_name}</TableCell>
                                                                    <TableCell>{item?.late_fees_amount}/-</TableCell>
                                                                    <TableCell>{item?.outstanding_amount}/-</TableCell>

                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                item?.invoice_collection_details.length === 0
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        item?.invoice_collection_details?.map(invoice => {
                                                                                            return (
                                                                                                <>{invoice?.collection_date ? moment(invoice?.collection_date).format('DD-MM-YYYY') : ""}</>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                item?.invoice_collection_details.length === 0
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        item?.invoice_collection_details?.map(invoice => {
                                                                                            return (
                                                                                                <>{invoice?.collection_amount}/-</>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                item?.invoice_collection_details.length === 0
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        item?.invoice_collection_details?.map((invoice, invoiceIndex) => {
                                                                                            return (
                                                                                                <TextField
                                                                                                    className='crm-form-input dark'
                                                                                                    disabled={invoice?.collection_amount === 0}
                                                                                                    key={`invoice-collection-${collectionIndex}-collected_amount`}
                                                                                                    variant='outlined'
                                                                                                    size='small'
                                                                                                    style={{ marginTop: '4px', marginBottom: '4px', maxWidth: '180px' }}
                                                                                                    value={invoice?.collected_amount || 0}
                                                                                                    onChange={(e) => onCollectedAmountChange({ invoiceIndex, collectionIndex, collected_amount_value: e.target.value })}
                                                                                                    InputProps={{
                                                                                                        startAdornment: <InputAdornment position='start'>Rs</InputAdornment>,
                                                                                                        endAdornment: <InputAdornment position='end'>/-</InputAdornment>
                                                                                                    }}
                                                                                                    type='text'
                                                                                                />
                                                                                            )
                                                                                        })
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                item?.invoice_collection_details.length === 0
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        item?.invoice_collection_details?.map(invoice => {
                                                                                            return (
                                                                                                <>{invoice?.due_amount}/-</>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        }
                                                        return item?.invoice_collection_details?.map((subItem, subItemIndex) => {
                                                            return (
                                                                <TableRow key={`collection-${collectionIndex}`}>
                                                                    {
                                                                        subItemIndex === 0
                                                                            ? (
                                                                                <>
                                                                                    <TableCell>{collectionIndex + 1}</TableCell>
                                                                                    <TableCell>{item?.invoice_number}</TableCell>
                                                                                    <TableCell>{item?.invoice_amount}/-</TableCell>
                                                                                    <TableCell>{item?.products_name}</TableCell>
                                                                                    <TableCell>{item?.late_fees_amount}/-</TableCell>
                                                                                    <TableCell>{item?.outstanding_amount}/-</TableCell>
                                                                                </>
                                                                            )
                                                                            : (
                                                                                <>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                </>
                                                                            )
                                                                    }

                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                !subItem
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        <>{subItem?.collection_date ? moment(subItem?.collection_date).format('DD-MM-YYYY') : ""}</>
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                !subItem
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        <>{subItem?.collection_amount}/-</>
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                !subItem
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        <TextField
                                                                                            className='crm-form-input dark'
                                                                                            disabled={subItem?.collection_amount === 0}
                                                                                            key={`invoice-collection-${collectionIndex}-collected_amount`}
                                                                                            variant='outlined'
                                                                                            size='small'
                                                                                            style={{ marginTop: '4px', marginBottom: '4px', maxWidth: '180px' }}
                                                                                            value={subItem?.collected_amount || 0}
                                                                                            onChange={(e) => onCollectedAmountChange({ invoiceIndex: subItemIndex, collectionIndex, collected_amount_value: e.target.value })}
                                                                                            InputProps={{
                                                                                                startAdornment: <InputAdornment position='start'>Rs</InputAdornment>,
                                                                                                endAdornment: <InputAdornment position='end'>/-</InputAdornment>
                                                                                            }}
                                                                                            type='text'
                                                                                        />
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                            }}
                                                                        >
                                                                            {
                                                                                item?.invoice_collection_details.length === 0
                                                                                    ? (
                                                                                        <Typography style={{ marginTop: '8px', marginBottom: '8px' }}>NA</Typography>
                                                                                    )
                                                                                    : (
                                                                                        <>{subItem?.due_amount}/-</>
                                                                                    )
                                                                            }
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
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
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px',
                        marginBottom: '20px'
                    }}
                >
                    <Button className='crm-btn crm-btn-lg' disabled={detailsState?.details?.pending_collection_details?.length === 0 || !detailsState?.details?.pending_collection_details} variant="outlined" size="medium" style={{ cursor: "pointer" }} onClick={onSubmit}>Submit</Button>
                </Box>
            </div>
        </Page>
    )
}