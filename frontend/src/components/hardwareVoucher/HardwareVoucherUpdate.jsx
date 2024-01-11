import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import moment from 'moment';
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg';
import { addUpdateHardwareVoucher, voucherLogDetails, voucherViewDetails } from "../../config/services/packageBundle";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { useStyles } from "../../css/Quotation-css";
import { DisplayLoader } from "../../helper/Loader";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import HardwareVoucherLogsTable from "./HardwareLogDetails";
import HardwareVoucherUpdateDebitNoteTable from "./HardwareVoucherUpdateDebitNoteTable";
import HardwareVoucherUpdateTable from "./HardwareVoucherUpdateTable";





export const HardwareVoucherUpdate = () => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [depositDate, setDepositDate] = useState(null);
    const [schoolName, setSchoolName] = useState("");
    const [voucherDetails, setVoucherDetails] = useState({})
    const [voucherLogDetail, setVoucherLogDetails] = useState([])
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [hardwareInvoiceCreditDetails, setHardwareInvoiceCreditDetails] = useState([])
    const [formattedDepositDate, setFormattedDepositDate] = useState('');
    const [amount, setAmount] = useState("")
    const [creditData, setCreditData] = useState([])
    const [schoolCode, setSchoolCode] = useState("")
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    let { data } = location?.state ? location?.state : {};
    let schoolCodeList = data?.school_code
    var dateNew = new Date(data?.deposit_date);



    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to="/authorised/hardware-voucher-list"
            className={classes.breadcrumbsClass}
        >
            Hardware Voucher Management
        </Link>,
        <Typography key="2" color="text.primary" fontWeight="600" fontSize="14px">
            Hardware Voucher Update
        </Typography>,
    ];


    const handleStartDate = (date) => {
        setDepositDate(date);
    };


    const handlevoucherCancelHandler = () => {
        navigate("/authorised/hardware-voucher-list");
    };



    const handleVoucherSubmitHandler = async (e) => {
        e?.preventDefault();

        let obj = {};

        if (data?.voucher_type_code == "DBN") {
            obj = {
                uuid: uuid,
                crn_dbn_for: "HW",
                voucher_type: data?.voucher_type,
                voucher_type_code: data?.voucher_type_code,
                hw_voucher_auto_id: data?.hw_voucher_auto_id,
                voucher_status: 1,
                school_code: data?.school_code,
                crn_voucher_details: {},
                dbn_voucher_details: {
                    invoice_auto_id: 137,
                    implementation_form_id: data?.implementation_form_id,
                    debit_amount: parseFloat(amount),
                    deposit_date: moment(depositDate).format("YYYY-MM-DD"),

                }

            };
        }
        else {
            obj = {
                uuid: uuid,
                crn_dbn_for: "HW",
                hw_voucher_auto_id: data?.hw_voucher_auto_id,
                voucher_type: data?.voucher_type == "Credit note" ? "Credit Note" : "Debit Note",
                voucher_type_code: data?.voucher_type_code,
                voucher_status: 1,
                school_code: data?.school_code,
                crn_voucher_details: {
                    hw_invoice_auto_id: 137,
                    particular_details: creditData
                },
                dbn_voucher_details: {}

            };
        }

        try {
            const response = await addUpdateHardwareVoucher(obj);
            response.data.status === 1
                ? (toast.success(response?.data.message) && navigate("/authorised/hardware-voucher-list"))
                : toast.error(response?.data.message);
        } catch (err) {
            console.log("error in addVoucher: ", err);
            toast.error("***Error***");
        }

    };


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
                    let scode = res?.data?.school_code
                    setSchoolCode(scode)
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


    useEffect(() => {
        setDepositDate(dateNew)
    }, [data]);


    const handleCreditData = (data) => {
        if (data?.length > 0) {
            const result = data?.map(({ package_id, package_credit_amount }) => ({ package_id, package_credit_amount }));
            setCreditData(result)
        }

    };


    const handleAmountData = (data) => {
        if (data != "") {
            setAmount(data)
        }
    };


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
                                        <Typography>
                                            <b>Implementation ID :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {data?.implementation_form_id || "N/A"}
                                        </div>
                                    </Grid>


                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Invoice Id :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {/* {hardwareInvoiceCreditDetails?.hw_invoice_number || "N/A"} */}
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
                                                minDate={new Date()}
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                }}
                                                onChangeRaw={(e) => e.preventDefault()}
                                            />
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
                                </Grid>
                            </Box>


                            {data?.voucher_type_code == "CRN" ?
                                (
                                    <>
                                        <HardwareVoucherUpdateTable list={hardwareInvoiceCreditDetails} handleCreditData={handleCreditData} />
                                    </>
                                ) : (
                                    <>
                                        <HardwareVoucherUpdateDebitNoteTable list={hardwareInvoiceCreditDetails}
                                            handleAmountData={handleAmountData}
                                        />
                                    </>
                                )
                            }
                        </Grid>


                        <Grid className={classes.btnSection}>
                            <Button
                                style={{
                                    marginRight: "10px",
                                }}
                                className={classes.submitBtn}
                                onClick={() => handlevoucherCancelHandler()}
                            >
                                Cancel
                            </Button>

                            <Button className={classes.submitBtn} type="submit" onClick={() => handleVoucherSubmitHandler()}>
                                Update
                            </Button>
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
