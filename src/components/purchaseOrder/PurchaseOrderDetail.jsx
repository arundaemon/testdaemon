import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Grid, Modal, TextField, Typography, } from "@mui/material";
import { style, } from "../../css/SchoolDetail-css";
import { downloadPO, getPurchaseOrderDetails } from '../../config/services/purchaseOrder';
import moment from 'moment';
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { makeStyles } from "@mui/styles";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import JSZip from 'jszip';

const useStyles = makeStyles((theme) => ({
    cusCard: {
        padding: "18px",
        boxShadow: "0px 0px 8px #00000029",
        borderRadius: "8px",
        margin: "0.5rem 1rem",
    },
    title: {
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "16px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "6px",
    },
    inputStyle: {
        fontSize: "1rem",
        padding: "8.8px",
        width: "100%",
        borderRadius: "4px",
        border: "1px solid #DEDEDE",
    },
    btnSection: {
        padding: "1rem 1rem 2rem 1rem",
        textAlign: "right",
    },
    submitBtn: {
        backgroundColor: "#f45e29",
        border: "1px solid #f45e29",
        borderRadius: "4px !important",
        color: "#ffffff !important",
        padding: "6px 16px !important",
        "&:hover": {
            color: "#f45e29 !important",
        },
    },
    rowBtn: {
        position: "absolute",
        right: "-1.7rem",
        top: "2.1rem",
        width: "1.2rem !important",
        cursor: "pointer",
        opacity: "0.3",
        "&:hover": {
            opacity: "0.6",
        },
    },
    CstmBoxGrid: {
        padding: "0 !important",
        position: "relative",
    },
    spanColor: {
        color: 'red'
    }
}));


const PurchaseOrderDetail = ({ code }) => {
    const classes = useStyles();
    const [poDetails, setPoDetails] = useState({})
    const [loaderPO, setLoaderPO] = useState(false)
    const [loaderPaymentProof, setLoaderPaymentProof] = useState(false)

    const getPoDetails = () => {
        getPurchaseOrderDetails(code)
            .then((res) => {
                let details = res?.result
                setPoDetails(details)
            })
            .catch(err => console.error(err))
    }

    const formatUrl = (url) => {
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        return lastPart

    }

    const handleDownloadValidation = (data, type) => {
        if (type === "paymentProof") {
            if (!data?.advanceDetailsMode || data?.advanceDetailsMode?.length == 0) {
                toast.dismiss()
                toast.error('No Payment Proof found!')
                return false
            }

            if (data?.advanceDetailsMode?.length == 1) {
                handleDownloadPO(data, "paymentProof")
                return false
            }

            if (loaderPaymentProof) return false
        }

        else if (type === "po") {
            if (!data?.purchaseOrderFile || data?.purchaseOrderFile?.length == 0) {
                toast.dismiss()
                toast.error('No File found!')
                return false
            }
            if (loaderPO) return false
        }
        return true
    }

    const handleDownloadPO = (data, type) => {
        const validation = handleDownloadValidation(data, "po")
        if (!validation) return
        let fileUrl = data?.purchaseOrderFile
        let fileName;
        if (type === "po") {
            fileName = `${data?.purchaseOrderCode}`
        }

        if (type === "paymentProof") {
            fileUrl = data?.advanceDetailsMode?.[0]?.paymentProofUrl
            fileName = `${data?.purchaseOrderCode} | PaymentMode-${data?.advanceDetailsMode?.[0]?.paymentMode}`
            setLoaderPaymentProof(true)
        }
        try {
            setLoaderPO(true)
            let params = { fileUrl, fileName }
            setTimeout(async () => {
                await downloadPO(params)
                setLoaderPO(false)
                setLoaderPaymentProof(false)
                toast.success('File downloaded successfully!')
            }, 1000)
        } catch (error) {
            console.error('Error downloading the file:', error);
            toast.error('Error in downloading')
            setLoaderPO(false)
        }
    };

    const handleZipDownload = async (data) => {
        const validation = handleDownloadValidation(data, "paymentProof")
        if (!validation) return

        const zip = new JSZip();
        setLoaderPaymentProof(true);
        const detailsModeArray = data?.advanceDetailsMode;

        try {
            // Using Promise.all to wait for all fetch operations to complete
            await Promise.all(
                detailsModeArray?.map(async (detailMode) => {
                    try {
                        const response = await fetch(detailMode?.paymentProofUrl);
                        const blob = await response.blob();
                        const fileName = `${data?.purchaseOrderCode} | ${detailMode?.paymentMode}_${detailMode?.paymentProofFileName}`;
                        zip.file(fileName, blob);
                    } catch (error) {
                        console.error(`Error downloading`);
                    }
                })
            );

            setTimeout(async () => {
                // Generate the zip file after all files are added
                const content = await zip.generateAsync({ type: 'blob' });

                // Create a download link
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${data?.purchaseOrderCode}_payment_proof.zip`;

                // Append the link to the body and trigger the download
                document.body.appendChild(link);
                link.click();

                // Remove the link after the download
                document.body.removeChild(link);

                setLoaderPaymentProof(false);
                toast.success('File downloaded successfully!');
            }, 500);
        } catch (error) {
            console.error(`Error in handleZipDownload: ${error.message}`);
            setLoaderPaymentProof(false);
            toast.error('Error generating zip file.');
        }
    };

    useEffect(() => {
        getPoDetails()
    }, [code]);

    return (

        <>
            <Grid className={classes.cusCard + ` crm-product-order-details-container`}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: "30px 0", marginTop: "-20px", marginBottom: '10px' }}>
                    <Typography component={"h3"}>License Details</Typography>
                    <div >
                        {/* <Button className="crm-btn crm-btn-outline mr-1" style={{ cursor: loaderPaymentProof ? 'wait' : 'pointer' }} onClick={() => handleZipDownload(poDetails)}>Download Payment Proof</Button> */}
                        <a className="crm-btn" href={poDetails?.purchaseOrderFile} target='_blank'>Download PO</a>
                    </div>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6} className='crm-product-order-details-header-item'>
                        <b>Particular</b>
                    </Grid>
                    <Grid item xs={6} className='crm-product-order-details-header-item'>
                        <b>Details of Agreement</b>
                    </Grid>
                </Grid>
                <Grid container className="crm-product-order-details-content mt-1">

                    <Grid item xs={6}>
                        Agreement Start Date<span style={{ color: 'red' }}> *</span>
                    </Grid>
                    <Grid item xs={6}>
                        <strong>{moment(poDetails?.agreementStartDate).format('DD-MM-YYYY')}</strong>
                    </Grid>
                    <Grid item xs={6}>
                        Agreement End Date<span style={{ color: 'red' }}> *</span>
                    </Grid>
                    <Grid item xs={6}>
                        <strong>{moment(poDetails?.agreementEndDate).format('DD-MM-YYYY')}</strong>
                    </Grid>
                    <Grid item xs={6} sx={{ marginTop: '5px' }}>
                        Agreement Tenure<span style={{ color: 'red' }}> *</span>
                    </Grid>
                    <Grid item xs={6}>
                        <strong>{poDetails?.agreementTenure} Months</strong>
                    </Grid>
                    <Grid item xs={6}>
                        Payment Terms<span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={5.4}>
                        <strong>{poDetails?.paymentTerm}</strong>
                    </Grid>
                    <Grid item xs={6}>
                        Agreement Payable Months<span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={6}>
                        <strong>{poDetails?.agreementPayableMonth}</strong>
                    </Grid>
                    <Grid item xs={6}>
                        Total Contract Value<span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={6}>
                        <strong>
                            <CurrencyRupeeIcon
                                sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                            />
                            {Number(poDetails?.overallContractValue)?.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                            })
                            }
                        </strong>
                    </Grid>
                    <Grid item xs={6}>
                        Payment Schedule and PDC's (If any) Attachment<span className={classes.spanColor}>**</span>
                    </Grid>
                    <Grid item xs={6}>
                        {
                            poDetails?.paymentScheduleFileName ?
                                <a className='crm-anchor' href={poDetails?.paymentScheduleFileURL} target='_blank'>{poDetails?.paymentScheduleFileName}</a>
                                :
                                "NA"
                        }
                    </Grid >
                    <Grid item xs={6}>
                        Advance<span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={6}>
                        <strong>{poDetails?.isAdvance ? "Yes" : "No"}</strong>
                    </Grid>
                    {
                        poDetails?.isAdvance &&
                        <>
                            <Grid item xs={6} sm={6} md={6} lg={6} >
                                Total Advance amount
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <strong>
                                    <CurrencyRupeeIcon
                                        sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                                    />
                                    {Number(poDetails?.totalAdvanceSoftwareAmount + poDetails?.totalAdvanceHardwareAmount)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })
                                    }
                                </strong>

                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                Total Amount Software<span className={classes.spanColor}> *</span>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <strong>
                                    <CurrencyRupeeIcon
                                        sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                                    />
                                    {Number(poDetails?.totalAdvanceSoftwareAmount)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })
                                    }
                                </strong>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                Total Amount Hardware<span className={classes.spanColor}> *</span>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <strong>
                                    <CurrencyRupeeIcon
                                        sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                                    />
                                    {Number(poDetails?.totalAdvanceHardwareAmount)?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })
                                    }
                                </strong>
                            </Grid>
                            {poDetails?.advanceDetailsMode?.map((item, index) => {
                                return (
                                    <div key={index} style={{ marginLeft: '20px' }} >
                                        {
                                            <div style={{ marginTop: '35px' }}>
                                            </div>
                                        }
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                Advance Details Mode<span className={classes.spanColor}> *</span>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <strong>{item?.["paymentMode"]}</strong>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Advance Details Ref No.<span className={classes.spanColor}> *</span>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <strong>{item?.["advanceDetailsRefNo"]}</strong>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Payment Date (As mentioned)<span className={classes.spanColor}> *</span>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <strong>{moment(item?.["paymentDate"]).format('DD-MM-YYYY')}</strong>
                                            </Grid>

                                            <Grid item xs={6}>
                                                Upload Payment Proof<span className={classes.spanColor}> *</span>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <strong><a className='crm-anchor' href={item?.["paymentProofUrl"]} target='_blank'>
                                                    {item?.["paymentProofFileName"]}
                                                </a></strong>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Receiver's Bank Details<span className={classes.spanColor}> *</span>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <strong>{item?.["reciever_bank_name"] + " - " + item?.["reciever_bank_account_number"]}</strong>
                                            </Grid>
                                            {
                                                item?.["paymentMode"] != "cash" &&
                                                <>
                                                    <Grid item xs={6}>
                                                        Issuer's Bank Details<span className={classes.spanColor}> *</span>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <strong>{item?.["issue_bank_name"] ?? "NA"}</strong>
                                                    </Grid>
                                                </>
                                            }
                                            <Grid item xs={6}>
                                                Amount<span className={classes.spanColor}> *</span>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <strong>
                                                    <CurrencyRupeeIcon
                                                        sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                                                    />
                                                    {Number(item?.["bankAmount"])?.toLocaleString("en-IN", {
                                                        maximumFractionDigits: 2,
                                                    })
                                                    }
                                                </strong>
                                            </Grid>
                                        </Grid >
                                    </div >
                                )
                            })}

                        </>
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12} className='crm-product-order-details-subheader'><i>** To be attached in the annexure</i></Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <strong>Details of the Admin/s <span className={classes.spanColor}>*</span></strong><br />
                        (Required for the activation of Admin Panel/Solution)
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        Name<span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <strong>{poDetails?.adminName}</strong>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        Contact Number <span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <strong>{poDetails?.adminContactNumber}</strong>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        Email ID <span className={classes.spanColor}> *</span>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <strong>{poDetails?.adminEmailId}</strong>
                    </Grid>
                </Grid >
            </Grid >
        </>

    )
}

export default PurchaseOrderDetail
