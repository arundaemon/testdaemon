import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg';
import { voucherLogDetails, voucherViewDetails } from "../../config/services/packageBundle.jsx";
import { getSchoolBySchoolCode } from "../../config/services/school.jsx";
import { useStyles } from "../../css/Quotation-css.js";
import { DisplayLoader } from "../../helper/Loader.js";
import { getUserData } from "../../helper/randomFunction/localStorage.js";
import Page from "../Page.jsx";
import HardwareVoucherLogsTable from "./HardwareLogDetails.jsx";
import HardwareVoucherDetailsDebitNoteTable from "./HardwareVoucherDebitNoteDetailsTable.jsx";
import HardwareVoucherDetailsTable from "./HardwareVoucherDetailsTable.jsx";


export const HardwareVoucherDetails = () => {
    const classes = useStyles();
    const location = useLocation();
    const [loader, setLoader] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [schoolName, setSchoolName] = useState("");
    const [voucherDetails, setVoucherDetails] = useState({})
    const loginData = getUserData('loginData')
    const [voucherLogDetail, setVoucherLogDetails] = useState([])
    const uuid = loginData?.uuid
    const [hardwareInvoiceCreditDetails, setHardwareInvoiceCreditDetails] = useState({})
    let { data } = location?.state ? location?.state : {};
    let schoolCodeList = data?.school_code


    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to="/authorised/hardware-voucher-list"
            className={classes.breadcrumbsClass}
        >
            Voucher Management
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            Voucher Details
        </Typography>,
    ];


    const getVoucherDetails = async () => {
        let params = {
            uuid: uuid,
            voucher_status: [data?.voucher_status],
            voucher_auto_id: data?.hw_voucher_auto_id,
            crn_drn_for: "HW"
        }
        await voucherViewDetails(params)
            .then((res) => {
                if (res) {
                    let { hw_credit_debit_details } = res?.data?.voucher_details
                    setHardwareInvoiceCreditDetails(hw_credit_debit_details)
                    setVoucherDetails(res?.data?.voucher_details)
                    setLoader(true)
                }
                else {
                    setVoucherDetails({})
                }
            })
            .catch((err) => console.error(err));
    };


    const getSchoolDetails = async () => {
        await getSchoolBySchoolCode(schoolCodeList)
            .then((res) => {
                let details = res?.result?.schoolName;
                setSchoolName(details)
            })
            .catch((err) => console.error(err));
    };


    const fetchLogDetails = async () => {
        let params = {
            uuid: uuid,
            voucher_status: [1, 2],
            voucher_auto_id: data?.hw_voucher_auto_id,
            crn_dbn_for: "HW"
        }
        await voucherLogDetails(params)
            .then((res) => {
                let details = res?.data?.voucher_log_details;
                setVoucherLogDetails(details)
            })
            .catch((err) => console.error(err));
    };


    useEffect(() => {
        getSchoolDetails()
        getVoucherDetails()
        fetchLogDetails()
    }, []);



    const accordionData = useMemo(() => [
        {
            title: "View Logs",
            detail: <HardwareVoucherLogsTable list={voucherLogDetail ? voucherLogDetail : []} />,
        },

    ], [voucherLogDetail]);


    return (
        <div className="listing-containerPage">
            <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                separator={<img src={BredArrow} />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>


            <Page
                title="Extramarks | Voucher Details"
                className="main-container myLeadPage datasets_container"
            >
                {!loader ?

                    <div className={classes.loader}>
                        {DisplayLoader()}
                    </div>

                    :
                    <>
                        <>
                            <Grid className={classes.cusCard}>


                                <Box
                                    sx={{
                                        // backgroundColor: "#E2EBFF",
                                        padding: "30px 40px",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <Box sx={{ padding: "25px 0", marginTop: "-44px", marginBottom: '10px' }}>
                                        <h3>VOUCHER DETAILS</h3>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>Voucher Type :</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {voucherDetails?.voucher_type || "N/A"}
                                            </div>
                                        </Grid>


                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>School Name :</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {schoolName || "N/A"}

                                            </div>
                                        </Grid>


                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>School Code :</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {data?.school_code || "N/A"}

                                            </div>
                                        </Grid>


                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>Invoice Id :</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {hardwareInvoiceCreditDetails?.hw_invoice_number || "N/A"}
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>Implementation Id</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {data?.implementation_form_id || "N/A"}
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>Deposit Date:</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {data?.deposit_date || "N/A"}
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Typography className={classes.subTitle}>
                                                <b>Amount (INR 100000/- Max Amount):</b>
                                            </Typography>
                                            <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                {voucherDetails?.invoice_total_amount !== null ? (
                                                    <>
                                                        <CurrencyRupeeIcon
                                                            sx={{
                                                                position: "relative",
                                                                top: "2px",
                                                                fontSize: "16px",
                                                            }}
                                                        />
                                                        {Number(voucherDetails?.invoice_total_amount)?.toLocaleString("en-IN", {
                                                            maximumFractionDigits: 2,
                                                        })}
                                                        / -{" "}
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}

                                            </div>
                                        </Grid>

                                    </Grid>
                                </Box>


                                {data?.voucher_type_code == "CRN" ?
                                    (
                                        <>
                                            <HardwareVoucherDetailsTable list={hardwareInvoiceCreditDetails} />
                                        </>
                                    ) : (
                                        <>
                                            <HardwareVoucherDetailsDebitNoteTable list={hardwareInvoiceCreditDetails} />
                                        </>
                                    )
                                }


                            </Grid>

                        </>

                        <Grid className={classes.cusCard}>
                            <div className={classes.accordianPadding}>
                                {accordionData?.map((data, index) => {
                                    return (
                                        <Accordion
                                            key={index}
                                            className="cm_collapsable"
                                            expanded={activeAccordion === index}
                                            onChange={(prev) => {
                                                setActiveAccordion(index);
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                className="table-header"
                                            >
                                                <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                                                    {data?.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails className="listing-accordion-details">
                                                {data?.detail}
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </div>
                        </Grid>

                    </>
                }
            </Page>
        </div>
    );
};
