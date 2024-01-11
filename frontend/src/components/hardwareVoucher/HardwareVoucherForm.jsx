import {
    Breadcrumbs,
    Button,
    FormControlLabel,
    Grid,
    Radio, RadioGroup,
    Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import React, { useEffect, useState  } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-hot-toast";
import { Link, useNavigate , useLocation } from "react-router-dom";
import ReactSelect from "react-select";
import BredArrow from '../../assets/image/bredArrow.svg';
import Page from "../Page";
import {
    addUpdateHardwareVoucher,
    hardwareInvoiceCreditDetail,
    listHardwareInvoice
} from "../../config/services/packageBundle";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { DisplayLoader } from "../../helper/Loader";
import { getUserData } from "../../helper/randomFunction/localStorage";
import HardwareVoucherFormTable from "./HardwareVoucherFormTable";
import { handleNumberInputFieldWithDecimal } from "../../helper/randomFunction";


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
    autoResizeTextarea: {
        resize: "vertical" /* Allow vertical resizing */,
        minHeight: "50px" /* Set the minimum height */,
        maxHeight: "200px" /* Set the maximum height if needed */,
        width: "100%" /* Adjust the width as desired */,
        overflow: "auto" /* Enable scrolling if the content exceeds the height */,
    },
}));

export default function HardwareVoucherForm() {
    const classes = useStyles();
    const location = useLocation();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [hardwareInvoiceDetails, setHardwareInvoiceDetails] = useState([])
    const [hardwareInvoiceCreditDetails, setHardwareInvoiceCreditDetails] = useState({})
    const [options, setOptions] = useState([])
    const [invoiceOptions, setInvoiceOptions] = useState([])
    const [selectedImpId, setSelectedImpId] = useState(null)
    const [selectedSchool, setSelectedSchool] = useState({})
    const [creditData, setCreditData] = useState([])
    const [schoolList, setSchoolList] = useState([])
    const [schoolCode, setSchoolCode] = useState("")
    const [selectedInvoiceId, setSelectedInvoiceId] = useState({})
    const [depositDate, setDepositDate] = useState(null);
    const [voucherType, setVoucherType] = useState({ label: '', value: '' });
    const [type, setType] = useState("")
    const loggedInUser = getUserData('loginData')
    let { data } = location?.state ? location?.state : {};
    const uuid = loggedInUser?.uuid
    let invoiceAutoId = data?.hw_invoice_auto_id

    const voucherCancelHandler = () => {
        navigate("/authorised/hardware-voucher-list");
    };


    const getHardwareInvoiceDetails = async () => {
        try {

            let params = {
                uuid: uuid,
                hw_invoice_auto_id: invoiceAutoId,
                hw_invoice_for: ["SCHOOL", "OFFICE"],
            };
            let res = await listHardwareInvoice(params);
            if (res) {
                let { hw_invoice_details } = res?.data
                setHardwareInvoiceDetails(hw_invoice_details)
                setSchoolCode(hw_invoice_details[0]?.school_code)

                let invoiceValue = {
                    value: hw_invoice_details[0]?.invoice_details?.transaction_type,
                    label: hw_invoice_details[0]?.invoice_details?.transaction_type
                }
                setSelectedInvoiceId(invoiceValue)

                let implementationFormValue = {
                    value: hw_invoice_details[0]?.implementation_id,
                    label: hw_invoice_details[0]?.implementation_id

                }

                setSelectedImpId(implementationFormValue)
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    const getHardwareInvoiceCreditDetails = async () => {
        try {

            let params = {
                uuid: uuid,
                hw_invoice_auto_id: invoiceAutoId,

            };
            let res = await hardwareInvoiceCreditDetail(params);
            if (res && res?.data) {
                let scode = res?.data?.school_code
                setSchoolCode(scode)
                setHardwareInvoiceCreditDetails(res?.data)
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };




    const getSchoolDetails = async () => {
        await getSchoolBySchoolCode(schoolCode)
            .then((res) => {
                let details = res?.result?.schoolName;
                if (details) {
                    let selected = {
                        label: details,
                        value: schoolCode
                    }
                    setSelectedSchool(selected)
                }

            })
            .catch((err) => console.error(err));
    };


    const voucherSubmitHandler = async (e) => {
        e.preventDefault();

        if (voucherType.value === '') {
            toast.error("Voucher Type is Required!");
            return;
        }


        
        let obj = {};

        if (voucherType?.value == "DBN") {
            obj = {
                uuid: uuid,
                crn_dbn_for: "HW",
                voucher_type: voucherType?.label,
                voucher_type_code: voucherType?.value,
                voucher_status: 1,
                school_code: schoolCode,
                crn_voucher_details: {},
                dbn_voucher_details: {
                    invoice_auto_id: invoiceAutoId,
                    implementation_form_id: selectedImpId?.value,
                    debit_amount: parseFloat(amount),
                    deposit_date: moment(startDate).format("YYYY-MM-DD"),
                    remark_text: comment
                }

            };
        }
        else {
            obj = {
                uuid: uuid,
                crn_dbn_for: "HW",
                voucher_type: voucherType?.label,
                voucher_type_code: voucherType?.value,
                voucher_status: 1,
                school_code: schoolCode,
                crn_voucher_details: {
                    hw_invoice_auto_id: invoiceAutoId,
                    deposit_date: moment(depositDate).format("YYYY-MM-DD"),
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


    const mapValueToLabel = (value) => ({
        "CRN": "Credit Note",
        "DBN": "Debit Note",
    }[value] || '');



    const handleSelectVoucherType = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = mapValueToLabel(selectedValue);
        setVoucherType({
            label: selectedLabel,
            value: selectedValue,
        });
    };


    const handleStartDate = (date) => {
        setStartDate(date)
    };



    const handleDepositDate = (date) => {
        setDepositDate(date)
    };


    const handleCreditData = (data) => {
        if (data?.length > 0) {
            const result = data?.map(({ package_id, package_credit_amount }) => ({
                package_id,
                package_credit_amount: parseFloat(package_credit_amount)
            }));

            setCreditData(result)
        }

    };


    useEffect(() => {
        if (voucherType?.value === "CRN") {
            getHardwareInvoiceCreditDetails()
        }
        else if (voucherType?.value === "DBN") {
            getHardwareInvoiceDetails()
        }

    }, [voucherType]);


    useEffect(() => {
        if (schoolCode !== "") {
            getSchoolDetails()
        }
    }, [schoolCode]);

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
        <Typography key="2" color="text.primary" fontWeight="600" fontSize="14px">
            Generate Voucher
        </Typography>,
    ];


    return (
        <>
            <div className="listing-containerPage">
                <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                    separator={<img src={BredArrow} />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>

                <Page
                    title="Extramarks | Service management"
                    className="main-container myLeadPage datasets_container"
                >
                    {!loading ?

                        <div className={classes.loader}>
                            {DisplayLoader()}
                        </div>

                        :

                        <>
                            <div>
                                <form onSubmit={(e) => voucherSubmitHandler(e)}>
                                    <Grid className={classes.cusCard}>
                                        <Grid container spacing={4} mb={2}>
                                            <Grid item lg={3}>
                                                <Typography className={classes.label}>
                                                    Voucher Type<span style={{ color: "red" }}>*</span>
                                                </Typography>
                                            </Grid>

                                        </Grid>

                                        <Grid container mb={2}>
                                            <RadioGroup
                                                row
                                                name={voucherType.label}
                                                value={voucherType.value}
                                                onChange={handleSelectVoucherType}

                                            >
                                                <FormControlLabel value="CRN" control={<Radio />} label="Credit Note" />
                                                <FormControlLabel value="DBN" control={<Radio />} label="Debit Note" />

                                            </RadioGroup>
                                        </Grid>


                                        {voucherType?.value === 'CRN' ? (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6} sm={3}>
                                                        <Typography className={classes.subTitle}>
                                                            <b>School Code:</b>
                                                        </Typography>
                                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                            {schoolCode || "N/A"}

                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Typography className={classes.subTitle}>
                                                            <b>School Name :</b>
                                                        </Typography>
                                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                            {selectedSchool?.label || "N/A"}

                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Typography className={classes.subTitle}>
                                                            <b>Implementation Id :</b>
                                                        </Typography>
                                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                            {hardwareInvoiceCreditDetails?.implementation_form_id || "N/A"}
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Typography className={classes.subTitle}>
                                                            <b>Invoice Amount</b>
                                                        </Typography>
                                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                            {hardwareInvoiceCreditDetails?.hw_total_invoice_amount || "N/A"}
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Typography className={classes.subTitle}>
                                                            <b>Invoice Id:</b>
                                                        </Typography>
                                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                                            {hardwareInvoiceCreditDetails?.hw_invoice_number || "N/A"}
                                                        </div>
                                                    </Grid>


                                                    <Grid item xs={6} sm={3}>
                                                        <Typography className={classes.subTitle}>
                                                            <b>Deposit Date:</b><span style={{ color: "red" }}>*</span>
                                                        </Typography>
                                                        <DatePicker
                                                            className="dateInput"
                                                            selected={depositDate}
                                                            onChange={(date) => handleDepositDate(date)}
                                                            minDate={new Date()}
                                                        />
                                                    </Grid>
                                                </Grid>




                                                <HardwareVoucherFormTable obj={hardwareInvoiceCreditDetails} handleCreditData={handleCreditData} />
                                            </>
                                        ) : (

                                            <>
                                            </>

                                        )}

                                        {voucherType?.value === 'DBN' ? (
                                            <Grid container spacing={2}>
                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>
                                                        School Code/Name <span style={{ color: "red" }}>*</span>
                                                    </Typography>
                                                    <ReactSelect
                                                        classNamePrefix="select"
                                                        options={schoolList}
                                                        value={selectedSchool}
                                                        isDisabled={true}
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                backgroundColor: '#f2f2f2',
                                                                borderColor: '#e0e0e0',
                                                                cursor: 'not-allowed',
                                                            }),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>
                                                        Implementation Id <span style={{ color: "red" }}>*</span>
                                                    </Typography>
                                                    <ReactSelect
                                                        classNamePrefix="select"
                                                        options={options}
                                                        value={selectedImpId}
                                                        isDisabled={true}
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                backgroundColor: '#f2f2f2',
                                                                borderColor: '#e0e0e0',
                                                                cursor: 'not-allowed',
                                                            }),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>
                                                        Invoice Id <span style={{ color: "red" }}>*</span>
                                                    </Typography>
                                                    <ReactSelect
                                                        classNamePrefix="select"
                                                        options={invoiceOptions}
                                                        value={selectedInvoiceId}
                                                        isDisabled={true}
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                backgroundColor: '#f2f2f2',
                                                                borderColor: '#e0e0e0',
                                                                cursor: 'not-allowed',
                                                            }),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>
                                                        Amount<span style={{ color: "red" }}>*</span>
                                                    </Typography>
                                                    <input
                                                        className={classes.inputStyle}
                                                        name="Amount"
                                                        type="text"
                                                        placeholder="Amount"
                                                        maxLength="50"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        onKeyDown={handleNumberInputFieldWithDecimal}
                                                    />
                                                </Grid>

                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>
                                                        Deposit Date<span style={{ color: "red" }}>*</span>
                                                    </Typography>
                                                    <DatePicker
                                                        className="dateInput"
                                                        selected={startDate}
                                                        onChange={(date) => handleStartDate(date)}
                                                        minDate={new Date()}
                                                        onKeyDown={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                        onChangeRaw={(e) => e.preventDefault()}
                                                    />
                                                </Grid>

                                                <Grid container spacing={4}>
                                                    <Grid item md={8} xs={8}>
                                                        <Typography className={classes.label}>Comments</Typography>
                                                        <textarea
                                                            className={classes.inputStyle}
                                                            name="name"
                                                            type="text"
                                                            rows={7}
                                                            placeholder="Enter Comment Here"
                                                            maxLength="500"
                                                            value={comment}
                                                            onChange={(e) => setComment(e?.target?.value)}

                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <>
                                            </>
                                        )}

                                    </Grid>

                                    <Grid className={classes.btnSection}>
                                        <Button
                                            style={{
                                                marginRight: "10px",
                                            }}
                                            className={classes.submitBtn}
                                            onClick={() => voucherCancelHandler()}
                                        >
                                            Cancel
                                        </Button>

                                        <Button className={classes.submitBtn} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                </form>
                            </div>
                        </>
                    }

                </Page>
            </div>

        </>
    );
}
