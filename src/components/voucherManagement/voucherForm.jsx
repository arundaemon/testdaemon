import {
    Button,
    FormControlLabel,
    Grid,
    Radio, RadioGroup,
    Tooltip,
    Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import Page from "../../components/Page";
import { fetchImplementationList } from "../../config/services/implementationForm";
import {
    addVoucher,
    getCreditDebitAmountLimit,
    getImplementationListWithInvoice,
    listFormInvoices
} from "../../config/services/packageBundle";
import { getSchoolList } from "../../config/services/school";
import { DisplayLoader } from "../../helper/Loader";
import { handleNumberInputFieldWithDecimal } from "../../helper/randomFunction";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { ReactComponent as HelperIcon } from '../../assets/image/helper.svg'


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
    loader: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

export default function VoucherForm() {
    const classes = useStyles();
    const [amount, setAmount] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [getImplementationId, setGetImplementationId] = useState(false)
    const [creditDebitLimitDetails, setCreditDebitLimitDetails] = useState({})
    const [amountError, setAmountError] = useState(false)
    const [options, setOptions] = useState([])
    const [invoiceOptions, setInvoiceOptions] = useState([])
    const [servicePeriod, setServicePeriod] = useState([])
    const [selectedImpId, setSelectedImpId] = useState(null)
    const [selectedSchool, setSelectedSchool] = useState({})
    const [schoolList, setSchoolList] = useState([])
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
    const [voucherType, setVoucherType] = useState({ label: '', value: '' });
    const [voucherBased, setVoucherBased] = useState({ label: '', value: '' })
    const [type, setType] = useState("")
    const loggedInUser = getUserData('loginData')
    const uuid = loggedInUser?.uuid
    const [minCreditDate, setminCreditDate] = useState(null);




    const getImplementationList = async () => {
        try {

            let params = {
                uuid: uuid, // Mandatory 
                school_code: selectedSchool?.value, // Mandatory 
                type: "SW" // Mandatory value will be SW OR HW 
            };
            let res = await getImplementationListWithInvoice(params);
            if (res) {
                let forms = res?.data?.implementation_forms
                let dropdownData = forms.map(obj => ({
                    label: obj,
                    value: obj
                }));
                setOptions(dropdownData)
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };




    const getCreditDebitAmount = async () => {
        try {

            let params = {}

            if (voucherBased?.value === "Invoice") {

                params = {
                    uuid: uuid,
                    crn_dbn_for: "SW",
                    voucher_type_code: voucherType?.value,
                    voucher_based: voucherBased?.value,
                    invoice_number: selectedInvoiceId?.label
                }

            }
            else if (voucherType?.value === "CRN" && voucherBased?.value === "Amount") {
                params = {
                    uuid: uuid,
                    crn_dbn_for: "SW",
                    voucher_type_code: voucherType?.value,
                    voucher_based: voucherBased?.value,
                    implementation_form_id: selectedImpId?.value
                };
            }
            else {
                params = {
                    uuid: uuid,
                    crn_dbn_for: "SW",
                    voucher_type_code: voucherType?.value,
                    voucher_based: voucherBased?.value,
                    type: type,
                    implementation_form_id: selectedImpId?.value
                };

            }

            let res = await getCreditDebitAmountLimit(params);
            if (res) {
                let data = res?.data?.crndbn_limit_details
                setCreditDebitLimitDetails(data)
                var dateNew = new Date(data?.last_crndbn_date);
                setminCreditDate(dateNew)
                if (data?.max_crndbn_amount != null) {
                    setAmount(data?.max_crndbn_amount.toString())
                }
                else {
                    setAmount("")
                }

            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };



    const fetchSchoolList = async () => {
        try {
            let res = await getSchoolList();
            if (res?.result) {
                let dropdownData = (res?.result)?.map(obj => ({
                    label: obj?.school_info?.schoolName,
                    value: obj?.school_info?.schoolCode
                }));
                setSchoolList(dropdownData);
                setLoading(true)
            }
        } catch (err) {
            console.error(err);
        }
    };


    const getInvoicesList = async () => {
        try {

            let params = {
                uuid: uuid,
                crn_dbn_for: "SW",
                voucher_type_code: voucherType?.value,
                implementation_form_id: selectedImpId?.value
            };
            let res = await listFormInvoices(params);
            if (res) {
                let dropdownData = (res?.data?.form_invoice_details)?.map(obj => ({
                    label: obj?.invoice_number,
                    value: obj?.invoice_number,
                    key: obj?.service_period_start_date
                }));
                setInvoiceOptions(dropdownData)
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };



    const voucherCancelHandler = () => {
        navigate("/authorised/voucher-list");
    };


    const voucherSubmitHandler = async (e) => {
        e.preventDefault();
        if (voucherType.value === '') {
            toast.error("Voucher Type is Required!");
            return;
        }
        if (voucherBased.value === '') {
            toast.error("Voucher Based is Required!");
            return;
        }

        if (voucherType.value === 'CRN' && voucherBased?.value === "Amount" && type === '') {
            toast.error("Type is Required!");
            return;
        }

        if (selectedSchool?.value === '') {
            toast.error("School Code is Required!");
            return;
        }


        if (voucherType.value !== 'BDR' && selectedImpId == null) {
            toast.error("Implementation Id is Required!");
            return;
        }

        if (amount === "") {
            toast.error("Amount is Required!");
            return;
        }
        if (creditDebitLimitDetails?.max_crndbn_amount != null && parseFloat(amount) > creditDebitLimitDetails?.max_crndbn_amount) {
            toast.error("Amount cannot exceed Max Amount!");
            return;
        }

        if (startDate === null) {
            toast.error("Deposit Date is Required!");
            return;
        }
        let obj

        if (voucherType?.value == "CRN" && voucherBased?.value == "Amount") {
            obj = {
                uuid: uuid,
                crn_dbn_for: "SW",
                voucher_type: voucherType?.label,
                voucher_type_code: voucherType?.value,
                voucher_based: voucherBased?.value,
                voucher_status: 1,
                invoice_based_voucher_details: {},
                amount_based_voucher_details: {
                    type: type,
                    school_code: selectedSchool?.value,
                    implementation_form_id: selectedImpId?.value,
                    credit_debit_amount: parseFloat(amount),
                    deposit_date: moment(startDate).format("YYYY-MM-DD"),
                    remark_text: comment
                }
            };
        }
        else if (voucherBased?.value == "Invoice") {
            obj = {
                uuid: uuid,
                crn_dbn_for: "SW",
                voucher_type: voucherType?.label,
                voucher_type_code: voucherType?.value,
                voucher_based: voucherBased?.value,
                voucher_status: 1,
                invoice_based_voucher_details: {
                    school_code: selectedSchool?.value,
                    implementation_form_id: selectedImpId?.value,
                    service_period: selectedInvoiceId?.key,
                    invoice_number: selectedInvoiceId?.label,
                    credit_debit_amount: parseFloat(amount),
                    deposit_date: moment(startDate).format("YYYY-MM-DD"),
                    remark_text: comment
                },
                amount_based_voucher_details: {}
            };
        }
        else {
            obj = {
                uuid: uuid,
                crn_dbn_for: "SW",
                voucher_type: voucherType?.label,
                voucher_type_code: voucherType?.value,
                voucher_based: voucherBased?.value,
                voucher_status: 1,
                invoice_based_voucher_details: {},
                amount_based_voucher_details: {
                    school_code: selectedSchool?.value,
                    implementation_form_id: selectedImpId?.value ? selectedImpId?.value : "",
                    credit_debit_amount: parseFloat(amount),
                    deposit_date: moment(startDate).format("YYYY-MM-DD"),
                    remark_text: comment
                }
            };

        }


        try {
            const response = await addVoucher(obj);
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

    };


    const mapValueToLabel = (value) => ({
        "CRN": "Credit Note",
        "DBN": "Debit Note",
        "BDR": "Bad Debt",
    }[value] || '');


    const mapValueToLabelVoucherBased = (value) => ({
        "Amount": "Amount Based",
        "Invoice": "Invoice Based",
    }[value] || '');



    const handleSelectVoucherType = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = mapValueToLabel(selectedValue);
        setVoucherType({
            label: selectedLabel,
            value: selectedValue,
        });

        setVoucherBased({ label: '', value: '' })
        setType("")
        setSelectedSchool({})
        setSelectedImpId(null)
        setSelectedInvoiceId(null)
        setStartDate(null)
        setCreditDebitLimitDetails({})
        setminCreditDate(null)
        setAmount("")
        setInvoiceOptions([])
        setOptions([])

    };

    const handleSelectVoucherBased = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = mapValueToLabelVoucherBased(selectedValue);
        setVoucherBased({
            label: selectedLabel,
            value: selectedValue,
        });
        // setVoucherType({ label: '', value: '' })
        setType("")
        setSelectedSchool({})
        setSelectedImpId(null)
        setSelectedInvoiceId(null)
        setStartDate(null)
        setCreditDebitLimitDetails({})
        setAmount("")
        setminCreditDate(null)
        setInvoiceOptions([])
        setOptions([])

    }


    const handleSelect = (selectedOption) => {
        setSelectedImpId(selectedOption);
        setSelectedInvoiceId(null)

    };

    const handleInvoiceSelect = (selectedOption) => {
        setSelectedInvoiceId(selectedOption);
    };



    const handleSchoolSelect = (selectedOption) => {
        setSelectedSchool(selectedOption);
        setSelectedImpId(null)
        setSelectedInvoiceId({})
        setCreditDebitLimitDetails({})
        setAmount('')
        setStartDate(null)
        setInvoiceOptions([])
        setminCreditDate(null)

    };

    const handleStartDate = (date) => {
        setStartDate(date)
    };


    useEffect(() => {
        if (Object?.entries(selectedSchool)?.length !== 0) {
            getImplementationList()
        }
    }, [selectedSchool]);


    useEffect(() => {
        fetchSchoolList()
    }, []);


    useEffect(() => {
        if (selectedImpId !== null && voucherBased?.value === "Invoice") {
            getInvoicesList()
        }
        if (selectedImpId !== null && voucherBased?.value === "Amount" && voucherType?.value != "BDR") {
            getCreditDebitAmount()
        }
    }, [selectedImpId]);



    useEffect(() => {
        if (selectedImpId !== null && selectedInvoiceId !== null && voucherBased?.value === "Invoice") {
            getCreditDebitAmount()
        }
    }, [selectedInvoiceId]);



    const handleOnTaxChange = (e) => {
        const input = e?.target?.value;

        if (input.includes("e")) {
            e?.preventDefault();
        }

        setAmount(input);
    }


    return (
        <>
            <Page
                title="Extramarks | Voucher Management"
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
                                            <FormControlLabel value="BDR" control={<Radio />} label="Bad Debt" />
                                        </RadioGroup>
                                    </Grid>


                                    <Grid container spacing={4} mb={2}>
                                        <Grid item lg={3}>
                                            <Typography className={classes.label}>
                                                Voucher Based<span style={{ color: "red" }}>*</span>
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container mb={2}>
                                        <RadioGroup
                                            row
                                            name={voucherBased.label}
                                            value={voucherBased.value}
                                            onChange={handleSelectVoucherBased}
                                        >
                                            {voucherType?.value == "" || voucherType?.value == "CRN" || voucherType?.value == "BDR"
                                                ?
                                                <FormControlLabel value="Amount" control={<Radio />}
                                                    label={
                                                        <div>
                                                            Amount Based
                                                            <Tooltip title="Vouchers created on amount based will be adjusted on FIFO approach" arrow>
                                                                <span>
                                                                    <HelperIcon />
                                                                </span>
                                                            </Tooltip>

                                                        </div>
                                                    }
                                                />
                                                :
                                                <></>}


                                            {voucherType?.value == "" || voucherType?.value == "DBN" || voucherType?.value == "CRN" ?
                                                <FormControlLabel value="Invoice" control={<Radio />}
                                                    label={
                                                        <div>
                                                            Invoice Based
                                                            <Tooltip title="Vouchers created based on invoice will be based on invoice adjustment" arrow>
                                                                <span>
                                                                    <HelperIcon />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    }
                                                />
                                                :
                                                <></>
                                            }

                                        </RadioGroup>
                                    </Grid>


                                    {voucherType?.value == "" || (voucherType?.value == "CRN" && (voucherBased?.value == "" || voucherBased?.value === "Amount")) ?
                                        <>
                                            <Grid container spacing={4} mb={2}>
                                                <Grid item lg={3}>
                                                    <Typography className={classes.label}>
                                                        Type<span style={{ color: "red" }}>*</span>
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Grid container mb={2}>
                                                <RadioGroup row
                                                    aria-label="Type"
                                                    name="Type"
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}>
                                                    <FormControlLabel value="Single" control={<Radio />}
                                                        label={
                                                            <div>
                                                                Single
                                                                <Tooltip title="Voucher created will be adjusted against single invoice" arrow>
                                                                    <span>
                                                                        <HelperIcon />
                                                                    </span>
                                                                </Tooltip>

                                                            </div>
                                                        }
                                                    />
                                                    <FormControlLabel value="Multiple" control={<Radio />}
                                                        label={
                                                            <div>
                                                                Multiple
                                                                <Tooltip title="Voucher created will be adjusted against multiple invoices" arrow>
                                                                    <span>
                                                                        <HelperIcon />
                                                                    </span>
                                                                </Tooltip>
                                                            </div>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                        </>
                                        : (
                                            <></>
                                        )}


                                    <Grid container spacing={2} >
                                        <Grid item md={4} xs={3}>
                                            <Typography className={classes.label}>
                                                School Code/Name <span style={{ color: "red" }}>*</span></Typography>
                                            <ReactSelect
                                                classNamePrefix="select"
                                                options={schoolList}
                                                value={selectedSchool}
                                                onChange={handleSchoolSelect}
                                            />
                                        </Grid>

                                        {voucherBased?.value === "" || voucherBased?.value === "Amount" ? (
                                            <>
                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>Implementation Id
                                                        {voucherType?.value !== "BDR" ?
                                                            <span
                                                                style={{ color: "red" }}>*
                                                            </span>
                                                            : <span></span>
                                                        }
                                                    </Typography>
                                                    <ReactSelect
                                                        classNamePrefix="select"
                                                        options={options}
                                                        value={selectedImpId}
                                                        onChange={handleSelect}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>Implementation Id
                                                        {voucherType?.value !== "BDR" ?
                                                            <span
                                                                style={{ color: "red" }}>*
                                                            </span>
                                                            : <span></span>
                                                        }

                                                    </Typography>
                                                    <ReactSelect
                                                        classNamePrefix="select"
                                                        options={options}
                                                        value={selectedImpId}
                                                        onChange={handleSelect}
                                                    />
                                                </Grid>

                                                <Grid item md={4} xs={3}>
                                                    <Typography className={classes.label}>Invoice Id <span style={{ color: "red" }}>*</span></Typography>
                                                    <ReactSelect
                                                        classNamePrefix="select"
                                                        options={invoiceOptions}
                                                        value={selectedInvoiceId}
                                                        onChange={handleInvoiceSelect}

                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item md={4} xs={3}>
                                            <Typography className={classes.label}>
                                                Amount
                                                {Object.entries(creditDebitLimitDetails)?.length > 0 && (
                                                    <>
                                                        {" (Max Amount: " + (creditDebitLimitDetails?.max_crndbn_amount !== null ? creditDebitLimitDetails?.max_crndbn_amount + " INR/-)" : "N/A)")}
                                                    </>
                                                )}
                                                <span style={{ color: "red" }}>*</span>
                                            </Typography>

                                            <input
                                                className={classes.inputStyle}
                                                name="Amount"
                                                type="text"
                                                placeholder="Amount"
                                                maxLength="50"
                                                value={amount}
                                                // onChange={(e) => setAmount(e.target.value)}
                                                onChange={handleOnTaxChange}
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
                                                minDate={minCreditDate != null ? minCreditDate : null}

                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Grid>
                                            <Typography className={classes.label}>Comments</Typography>
                                            <textarea
                                                className={classes.inputStyle}
                                                name="name"
                                                type="text"
                                                rows={7}
                                                placeholder="Enter Comment Here"
                                                maxLength="250"
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e?.target?.value)
                                                }

                                            />
                                        </Grid>
                                    </Grid>

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
        </>
    );
}
