import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Link, useLocation } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg';
import { getCreditDebitAmountLimit, voucherLogDetails, voucherViewDetails } from "../../config/services/packageBundle";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { useStyles } from "../../css/Quotation-css";
import { DisplayLoader } from "../../helper/Loader";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import VoucherLogsTable from "./voucherLogsTable";
import VoucherUpdateList from "./voucherUpdateTable";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";




export const VoucherUpdate = () => {
    const classes = useStyles();
    const location = useLocation();
    const [loader, setLoader] = useState(false);
    const [depositDate, setDepositDate] = useState(null);
    const [schoolName, setSchoolName] = useState("");
    const [voucherDetails, setVoucherDetails] = useState({})
    const [voucherLogDetail, setVoucherLogDetails] = useState([])
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [minCreditDate, setminCreditDate] = useState(null);
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    let { data } = location?.state ? location?.state : {};
    let schoolCodeList = data?.school_code
    var dateNew = data?.deposit_date ? new Date(data?.deposit_date) : null;


    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to="/authorised/voucher-list"
            className={classes.breadcrumbsClass}
        >
            Voucher Management
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            Voucher Update
        </Typography>,
    ];


    const handleStartDate = (date) => {
        setDepositDate(date);
    };


    const getVoucherDetails = async () => {
        let params = {
            uuid: uuid,
            voucher_status: [data?.voucher_status],
            voucher_auto_id: data?.voucher_auto_id,
            crn_drn_for: "SW"
        }
        try {
            const res = await voucherViewDetails(params);
            if (res) {
                if (data?.voucher_type_code !== "BDR") {
                    const result = await getCreditDebitAmount(res?.data?.voucher_details);
                    setminCreditDate(result);
                    setVoucherDetails(res?.data?.voucher_details);
                    setLoader(true);
                }
                else if(data?.voucher_type_code !== "CRN" || data?.voucher_type_code !== "DBN")
                {
                    setVoucherDetails(res?.data?.voucher_details);
                    setminCreditDate(null)
                    setLoader(true)
                }
            }
            else{
                setVoucherDetails({})
                setminCreditDate(null)
                setLoader(true)
            }
        } catch (err) {
            console.error(err);
        }

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
            voucher_auto_id: data?.voucher_auto_id,
            crn_dbn_for: "SW"
        }
        await voucherLogDetails(params)
            .then((res) => {
                let details = res?.data?.voucher_log_details;
                setVoucherLogDetails(details)
            })
            .catch((err) => console.error(err));
    };


    const getCreditDebitAmount = async (obj) => {
        try {
            let { credit_debit_details } = obj
            let params = {}

            if (data?.voucher_based === "Invoice") {

                params = {
                    uuid: uuid,
                    crn_dbn_for: "SW",
                    voucher_type_code: data?.voucher_type_code,
                    voucher_based: data?.voucher_based,
                    invoice_number: credit_debit_details[0]?.invoice_number

                }

            }
            else {
                params = {
                    uuid: uuid,
                    crn_dbn_for: "SW",
                    voucher_type_code: data?.voucher_type_code,
                    voucher_based: data?.voucher_based,
                    type: data?.type,
                    implementation_form_id: data?.implementation_form_id
                };

            }

            let res = await getCreditDebitAmountLimit(params);
            if (res) {
                let data = res?.data?.crndbn_limit_details
                var dateNew = new Date(data?.last_crndbn_date);
                return dateNew
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    useEffect(() => {
        getSchoolDetails()
        getVoucherDetails()
        fetchLogDetails()
    }, []);



    const accordionData = useMemo(() => [
        {
            title: "View Logs",
            detail: <VoucherLogsTable list={voucherLogDetail} />,
        },

    ], [voucherLogDetail]);


    useEffect(() => {
        setDepositDate(dateNew)
    }, [data]);


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
                                            <b>Voucher Based :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.voucher_based || "N/A"}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Product :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.product_name || "N/A"}
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
                                            <b>Amount :</b>
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
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Deposit Date</b>
                                        </Typography>
                                        <div className="boxLabel">
                                            <DatePicker
                                                className="dateInput"
                                                selected={depositDate}
                                                onChange={(date) => handleStartDate(date)}
                                                minDate={minCreditDate != null ? minCreditDate : new Date()}

                                            />
                                        </div>

                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Type:</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.type || "N/A"}
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Comment:</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.remark_text || "N/A"}
                                        </div>
                                    </Grid>

                                </Grid>
                            </Box>

                            <VoucherUpdateList voucherDetails={voucherDetails} date={depositDate} />

                        </Grid>


                    </>
                }

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
            </Page>
        </div>
    );
};
