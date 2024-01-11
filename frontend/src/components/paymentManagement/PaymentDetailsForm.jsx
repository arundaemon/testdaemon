import {
    Autocomplete,
    Box,
    Button,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllProductList } from "../../config/services/packageBundle";
import { listReceivingBank, uploadCollectionEvidence } from "../../config/services/paymentCollectionManagment";
import { handleNumberKeyDown, handlePaste } from "../../helper/randomFunction";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import FormMultiSelect from "../../theme/form/theme2/FormMultiSelect";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";

const PaymentDetailsForm = () => {
    let location = useLocation();
    let { collectedPayment, deposit_for, schoolCode, resubmit = false, deposit_auto_id, schoolName, paymentActivityId } = location?.state ? location?.state : {};
    const [amtDeposit, setAmtDeposit] = useState(collectedPayment || "")

    const navigate = useNavigate();
    const loginData = getUserData('loginData');
    const userData = getUserData('userData');
    const uuid = loginData?.uuid

    const [productList, setProductList] = useState([])
    const [productSelected, setProductSelected] = useState((Array.isArray(deposit_for) ? deposit_for : [deposit_for]) || [])

    const [paymentmode, setPaymentmode] = useState([])
    const [bankMode, setBankMode] = useState([])

    const [bankList, setBankList] = useState([])
    const [selectedBank, setSelectedBank] = useState(null)

    const [receiptNumber, setReceiptNumber] = useState("")
    const [cashDeposit, setCashDeposit] = useState(0)

    const [demandDraftNumber, setDemandDraftNumber] = useState("")
    const [ddAmtDeposit, setDDAmtDeposit] = useState(0)

    const [chequeNumber, setChequeNumber] = useState("")
    const [chequeDeposit, setChequeDeposit] = useState(0)

    const [referenceID, setReferenceID] = useState("")
    const [onlineDeposit, setOnlineDeposit] = useState(0)


    const [uploadData, setUpload] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const [uploadDDData, setUploadDD] = useState(null);
    const [selectedDDFileName, setSelectedDDFileName] = useState(null);

    const [uploadChequeData, setUploadCheque] = useState(null);
    const [selectedChequeFileName, setSelectedChequeFileName] = useState(null);

    const [selectedBankForCash, setSelectedBankForCash] = useState(null)
    const [selectedBankForDD, setSelectedBankForDD] = useState()
    const [selectedBankForCheque, setSelectedBankForCheque] = useState()



    const [uploadOnlineData, setUploadOnline] = useState()
    const [onlineSelectedFileName, setOnlineSelectedFileName] = useState()

    const getProductList = async () => {
        let params = {
            status: [1],
            uuid: uuid,
            master_data_type: 'package_products'
        }
        await getAllProductList(params)
            .then(res => {
                let data = res?.data?.master_data_list
                let tempArray = data?.map(obj => ({
                    label: obj?.name,
                    value: obj?.name,
                    groupkey: obj?.group_key,
                    groupName: obj?.group_name,
                    productID: obj?.id,
                    productCode: obj?.product_key
                }))
                tempArray = tempArray?.filter(obj => ((obj?.groupName) && (obj?.groupkey)))
                setProductList(tempArray)
            })
            .catch(err => {
                console.error(err, 'Error while fetching product list')
            })
    }

    const getPaymentMode = async () => {
        let params = {
            status: [1],
            uuid: uuid,
            master_data_type: 'payment_mode'
        }
        await getAllProductList(params)
            .then(res => {
                let data = (res?.data?.master_data_list)?.map(item => ({ ...item, name: item?.name?.toLowerCase(), label: item?.name }));
                console.log(data)
                setPaymentmode(data)
            })
            .catch(err => {
                console.error(err, 'Error while fetching product list')
            })
    }

    const getBankList = async () => {
        let params = {
            status: [1],
            uuid: uuid,
        }
        await listReceivingBank(params)
            .then(res => {
                let data = res?.data?.bank_details
                setBankList(data)
            })
            .catch(err => {
                console.error(err, 'Error while fetching product list')
            })
    }

    useEffect(async () => {
        await getProductList()
        await getPaymentMode()
        await getBankList()
    }, [])

    const handleUploadFile = (e, mode) => {
        if (e.target.files[0]?.type === 'application/vnd.ms-excel' || e.target.files[0]?.type === 'text/csv') {
            // file is invalid, do not upload
            alert('Invalid file type');
            setUpload(null)
        }
        else {
            if (mode === "cash") {
                setSelectedFileName(e.target.files[0].name);
                setUpload(e.target.files[0])
            } else if (mode === "dd") {
                setSelectedDDFileName(e.target.files[0].name);
                setUploadDD(e.target.files[0])
            } else if (mode === "cheque") {
                setSelectedChequeFileName(e.target.files[0].name);
                setUploadCheque(e.target.files[0])
            } else {
                setOnlineSelectedFileName(e.target.files[0].name);
                setUploadOnline(e.target.files[0])
            }
        }
    }

    const handleNextPage = async () => {
        let prevPageData = {
            productSelected: productSelected,
            bankMode: bankMode,
            selectedBank: selectedBank,
            receiptNumber: receiptNumber,
            cashDeposit: cashDeposit,
            referenceID: referenceID,
            onlineDeposit: onlineDeposit,
            amtDeposit: amtDeposit,
            uploadData: uploadData,
            uploadOnlineData: uploadOnlineData,
            demandDraftNumber: demandDraftNumber,
            ddAmtDeposit: ddAmtDeposit,
            chequeNumber: chequeNumber,
            chequeDeposit: chequeDeposit,
            uploadDDData: uploadDDData,
            uploadChequeData: uploadChequeData,
            selectedBankForCash,
            selectedBankForDD,
            selectedBankForCheque,
            resubmit,
            deposit_auto_id,
            schoolName,
            paymentActivityId
        }
        if (bankMode.length) {
            if (bankMode.includes('cash') && (receiptNumber.length == 0 || Number(cashDeposit) == 0 || uploadData == null || !selectedBankForCash)) {
                return toast.error('Fill All Fields From Cash')
            }
            if (bankMode.includes('demand draft') && (demandDraftNumber.length == 0 || Number(ddAmtDeposit) == 0 || uploadDDData == null || !selectedBankForDD)) {
                return toast.error('Fill All Fields From Demand Draft')
            }
            if (bankMode.includes('cheque') && (chequeNumber.length == 0 || Number(chequeDeposit) == 0 || uploadChequeData == null || !selectedBankForCheque)) {
                return toast.error('Fill All Fields From Cheque')
            }
            if (bankMode.includes('online') && (referenceID.length == 0 || Number(onlineDeposit) == 0 || uploadOnlineData == null)) {
                return toast.error('Fill All Fields From Online Payment')
            }
            if (bankMode.includes('online') && !selectedBank) {
                return toast.error('Select Atleast One Bank')
            } else {
                const evindenceFilesUrls = await Promise.all([{ uploadData }, { uploadDDData }, { uploadChequeData }, { uploadOnlineData }]
                    .filter((item) => Object.values(item)[0])
                    .map(async (item) => {
                        const [key, value] = Object.entries(item)[0];
                        const formData = new FormData();
                        formData.append('empCode', userData?.employee_code);
                        formData.append('file', value);
                        const imageResponse = await uploadCollectionEvidence(formData);
                        return { [key]: imageResponse?.result }
                    }))
                prevPageData.evidenceFilesUrls = evindenceFilesUrls.reduce((acc, item) => {
                    return { ...acc, ...item }
                }, {});
                return navigate(`/authorised/manage-payments/adjustment-form/${schoolCode}`, { state: { prevPageData } })
            }
        } else {
            return toast.error('Select the Mode Of Payment')
        }
    }

    const onBankModeChange = (e, value, reason) => {
        const removedItem = bankMode.filter(item => !value.includes(item))?.[0];
        if (removedItem) {
            switch (removedItem) {
                case 'cash':
                    setReceiptNumber('')
                    setCashDeposit(0)
                    setUpload(null)
                    setSelectedBankForCash(null)
                    break;
                case 'demand draft':
                    setDemandDraftNumber('')
                    setDDAmtDeposit(0)
                    setUploadDD(null)
                    setSelectedBankForDD(null)
                    break;
                case 'cheque':
                    setChequeNumber('')
                    setChequeDeposit(0)
                    setUploadCheque(null)
                    setSelectedBankForCheque(null)
                    break;
                case 'online':
                    setReferenceID('')
                    setOnlineDeposit(0)
                    setUploadOnline(null)
                    setSelectedBank(null)
                    break;
                default:
                    break;
            }
        }
        setBankMode(value)
    }
    return (
        <Page title="Payment Details Form | Extramarks" className="crm-page-wrapper">
            <Box className="crm-page-payment-details-form-wrapper">
                <Typography component={"h2"}>{"Payment Deposit Details"}</Typography>
                <Box className="crm-page-payment-details-form-deposit-item">

                    <Grid container spacing={2.5}>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Total Amount Deposited'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        className="crm-form-input dark"
                                        value={amtDeposit}
                                        onChange={(e) => {
                                            setAmtDeposit(e.target.value)
                                        }}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Deposit for'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    {/* <Autocomplete
                                        disablePortal
                                        multiple
                                        id="combo-box-demo"
                                        options={productList.map((option) => option.label)}
                                        onChange={(e, value) => setProductSelected(value)}
                                        value={productSelected || ""}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                sx={{ "& fieldset": { borderRadius: "2px" } }}
                                                placeholder="Select"
                                                className="crm-form-input dark"
                                            />
                                        )}
                                    /> */}
                                    <FormMultiSelect
                                        placeholder={'Select'}
                                        options={productList}
                                        optionsLabels={{ label: 'label', value: 'value' }}
                                        handleSelectedValue={(value) => setProductSelected(value?.map(i => i?.value))}
                                        value={productSelected || ""}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Mode of Payment'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    {/* <Autocomplete
                                        disablePortal
                                        multiple
                                        id="combo-box-demo"
                                        options={paymentmode.map((option) => option.name)}
                                        onChange={onBankModeChange}
                                        value={bankMode || ""}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                sx={{ "& fieldset": { borderRadius: "2px" } }}
                                                placeholder="Select"
                                                className="crm-form-input dark"
                                            />
                                        )}
                                    /> */}
                                    <FormMultiSelect
                                        placeholder={'Select'}
                                        options={paymentmode}
                                        optionsLabels={{ label: 'label', value: 'name' }}
                                        handleSelectedValue={(value) => onBankModeChange(null, value?.map(i => i?.name), null)}
                                        value={bankMode || ""}
                                    />

                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>

                {/* MOP  Cash*/}

                {(bankMode?.includes("cash")) && <Box className="crm-page-payment-details-form-payment-item">
                    <Box className="crm-page-payment-details-form-payment-item-header">
                        <Typography component={'h3'}>{"MOP Cash"}</Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Upload Evidence'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box className="crm-form-file dark">
                                    <label >{selectedFileName ?? "Upload here"}</label>
                                    <input
                                        className='crm-form-input dark'
                                        style={{ display: 'none' }}
                                        type="file"
                                        onChange={(e) => handleUploadFile(e, "cash")}
                                        accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                        required={true}
                                        id={'mopcashpayment'}
                                    />
                                    <label className="crm-anchor crm-anchor-small" htmlFor="mopcashpayment">Browse</label>
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Cash Receipt No.'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={receiptNumber}
                                        onChange={(e) => {
                                            const regex = /^[A-Za-z0-9]*$/;
                                            if ((e.target.value === '' || regex.test(e.target.value)) && e.target.value.length <= 40) {
                                                setReceiptNumber(e.target.value)
                                            }
                                        }}
                                        // onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                        inputProps={{
                                            maxLength: 40,
                                        }}
                                    />
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Amount Deposited'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={cashDeposit}
                                        onChange={(e) => {
                                            let totalAmt = Number(onlineDeposit) + Number(ddAmtDeposit) + Number(chequeDeposit) + Number(e.target.value)
                                            if (totalAmt > amtDeposit) {
                                                toast.error(`Amount exceeds with ${amtDeposit}`)
                                            } else {
                                                setCashDeposit(e.target.value)
                                            }
                                        }}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />

                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Receiving Bank'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={bankList}
                                        getOptionLabel={(option) => option.bank_name}
                                        onChange={(e, value) => setSelectedBankForCash(value)}
                                        value={selectedBankForCash || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select"
                                                required
                                                className="crm-form-input dark"
                                            />
                                        )}
                                        popupIcon={<DropDownIcon />}
                                    />

                                </Box>
                            </Box>

                        </Grid>

                    </Grid>
                </Box>}

                {/* demand draft*/}

                {(bankMode?.includes("demand draft")) && <Box className="crm-page-payment-details-form-payment-item">
                    <Box className="crm-page-payment-details-form-payment-item-header">
                        <Typography component={'h3'}>{"Demand Draft"}</Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Upload Evidence'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box className="crm-form-file dark">
                                    <label >{selectedDDFileName ?? "Upload here"}</label>
                                    <input
                                        className="crm-form-input dark"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleUploadFile(e, "dd")}
                                        accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                        required
                                        id="demanddraftpayment"
                                    />
                                    <label className="crm-anchor crm-anchor-small" htmlFor="demanddraftpayment">Browse</label>
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Demand Draft No.'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={demandDraftNumber}
                                        onChange={(e) => {
                                            const regex = /^[A-Za-z0-9]*$/;
                                            if ((e.target.value === '' || regex.test(e.target.value)) && e.target.value.length <= 40) {
                                                setDemandDraftNumber(e.target.value)
                                            }
                                        }}
                                        // onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Amount Deposited'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={ddAmtDeposit}
                                        onChange={(e) => {
                                            let totalAmt = Number(onlineDeposit) + Number(cashDeposit) + Number(chequeDeposit) + Number(e.target.value)
                                            if (totalAmt > amtDeposit) {
                                                toast.error(`Amount exceeds with ${amtDeposit}`)
                                            } else {
                                                setDDAmtDeposit(e.target.value)
                                            }
                                        }}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />

                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Receiving Bank'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={bankList}
                                        getOptionLabel={(option) => option.bank_name}
                                        onChange={(e, value) => setSelectedBankForDD(value)}
                                        value={selectedBankForDD || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select"
                                                required
                                                className="crm-form-input dark"
                                            />
                                        )}
                                        popupIcon={<DropDownIcon />}
                                    />

                                </Box>
                            </Box>

                        </Grid>

                    </Grid>
                </Box>}

                {/* cheque*/}

                {(bankMode?.includes("cheque")) && <Box className="crm-page-payment-details-form-payment-item">
                    <Box className="crm-page-payment-details-form-payment-item-header">
                        <Typography component={'h3'}>{"Cheque"}</Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Upload Evidence'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box className="crm-form-file dark">
                                    <label >{selectedChequeFileName ?? "Upload here"}</label>
                                    <input
                                        className="crm-form-input dark"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleUploadFile(e, "cheque")}
                                        accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                        required
                                        id="checkpayment"
                                    />
                                    <label className="crm-anchor crm-anchor-small" htmlFor="checkpayment">Browse</label>
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Cheque No.'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={chequeNumber}
                                        onChange={(e) => {
                                            const regex = /^[A-Za-z0-9]*$/;
                                            if ((e.target.value === '' || regex.test(e.target.value)) && e.target.value.length <= 40) {
                                                setChequeNumber(e.target.value)
                                            }
                                        }}
                                        // onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Amount Deposited'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={chequeDeposit}
                                        onChange={(e) => {
                                            let totalAmt = Number(onlineDeposit) + Number(ddAmtDeposit) + Number(cashDeposit) + Number(e.target.value)
                                            if (totalAmt > amtDeposit) {
                                                toast.error(`Amount exceeds with ${amtDeposit}`)
                                            } else {
                                                setChequeDeposit(e.target.value)
                                            }
                                        }}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />

                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Receiving Bank'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={bankList}
                                        getOptionLabel={(option) => option.bank_name}
                                        onChange={(e, value) => setSelectedBankForCheque(value)}
                                        value={selectedBankForCheque || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                sx={{ "& fieldset": { borderRadius: "2px" } }}
                                                placeholder="Select"
                                                required
                                                className="crm-form-input dark"
                                            />
                                        )}
                                        popupIcon={<DropDownIcon />}
                                    />

                                </Box>
                            </Box>

                        </Grid>

                    </Grid>
                </Box>}

                {/* MOP Online Payment */}

                {bankMode?.includes("online") && <Box className="crm-page-payment-details-form-payment-item">
                    <Box className="crm-page-payment-details-form-payment-item-header">
                        <Typography component={'h3'}>{"MOP Online Payment"}</Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Upload Evidence'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box className="crm-form-file dark">
                                    <label >{onlineSelectedFileName ?? "Upload here"}</label>
                                    <input
                                        className="crm-form-input dark"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleUploadFile(e, "online")}
                                        accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                        required
                                        id="moponlinepayment"
                                    />
                                    <label className="crm-anchor crm-anchor-small" htmlFor="moponlinepayment">Browse</label>
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Reference ID'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={referenceID}
                                        onChange={(e) => {
                                            const regex = /^[A-Za-z0-9]*$/;
                                            if ((e.target.value === '' || regex.test(e.target.value)) && e.target.value.length <= 40) {
                                                setReferenceID(e.target.value)
                                            }
                                        }}
                                        // onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />
                                </Box>
                            </Box>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Amount Deposited'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <TextField
                                        value={onlineDeposit}
                                        onChange={(e) => {
                                            let totalAmt = Number(cashDeposit) + Number(e.target.value)
                                            if (totalAmt > amtDeposit) {
                                                toast.error(`Amount exceeds with ${amtDeposit}`)
                                            } else {
                                                setOnlineDeposit(e.target.value)
                                            }
                                        }}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handlePaste}
                                        autoComplete="off"
                                        required
                                        className="crm-form-input dark"
                                    />

                                </Box>
                            </Box>

                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box className="crm-page-payment-details-form-item">
                                <Typography component={'label'}>{'Receiving Bank'} <span style={{ color: 'red' }}>*</span></Typography>
                                <Box>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={bankList}
                                        getOptionLabel={(option) => option.bank_name}
                                        onChange={(e, value) => setSelectedBank(value)}
                                        value={selectedBank || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select"
                                                required
                                                className="crm-form-input dark"
                                            />
                                        )}
                                        popupIcon={<DropDownIcon />}
                                    />

                                </Box>
                            </Box>

                        </Grid>

                    </Grid>
                </Box>}

                <Box sx={{ textAlign: "right" }}>
                    <Button className="crm-btn crm-btn-lg" onClick={handleNextPage}>{"Next"}</Button>
                </Box>

            </Box>

        </Page>
    )
}


export default PaymentDetailsForm
// function Forms({ formType,
//     bankList,
//     setSelectedBank,
//     handleUploadFile,
//     receiptNumber,
//     setReceiptNumber,
//     cashDeposit,
//     setCashDeposit,
// }) {

//     if (formType === 'CASH') {
//         return (
//             <>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         fontWeight: 'bold',
//                         color: 'darkgrey'
//                     }}
//                 >
//                     MOP - CASH
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Upload Evidence</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <input
//                             style={{ width: "100%", height: "100%" }}
//                             type="file"
//                             // hidden
//                             onChange={(e) => handleUploadFile(e)}
//                             accept=".png,.jpg,.pdf,!.csv,!.xlsx"
//                         />
//                     </Box>
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Cash Receipt Number</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <TextField
//                             value={receiptNumber}
//                             onChange={(e) => {
//                                 setReceiptNumber(e.target.value)
//                             }}
//                             sx={styles.borderShadow}
//                             onKeyDown={handleNumberKeyDown}
//                             onPaste={handlePaste}
//                             autoComplete="off"
//                         />
//                         {/* <input type="number" style={{ width: "100%", height: "100%" }} name="cash_receipt_number" /> */}
//                     </Box>
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Amount Deposited</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <TextField
//                             value={cashDeposit}
//                             onChange={(e) => {
//                                 setCashDeposit(e.target.value)
//                             }}
//                             sx={styles.borderShadow}
//                             onKeyDown={handleNumberKeyDown}
//                             onPaste={handlePaste}
//                             autoComplete="off"
//                         />
//                         {/* <input type="number" style={{ width: "100%", height: "100%" }} name="cash_receipt_number" /> */}
//                     </Box>
//                 </Box>
//             </>
//         )
//     }
//     if (formType === "ONLINE_PAYMENT") {
//         return (
//             <>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         fontWeight: 'bold',
//                         color: 'darkgrey'
//                     }}
//                 >
//                     MOP - ONLINE PAYMENT
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Upload Evidence</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <input
//                             style={{ width: "100%", height: "100%" }}
//                             type="file"
//                             // hidden
//                             onChange={(e) => handleUploadFile(e)}
//                             accept=".png,.jpg,.pdf,!.csv,!.xlsx"
//                         />
//                     </Box>
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Amount Deposited</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <input type="number" style={{ width: "100%", height: "100%" }} name="amount_deposited" />
//                     </Box>
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Reference Id</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <input type="number" style={{ width: "100%", height: "100%" }} name="amount_deposited" />
//                     </Box>
//                 </Box>
//                 <Box
//                     as="li"
//                     sx={{
//                         display: 'flex',
//                         padding: '1rem',
//                         borderBottom: '1px solid #E2EBFF',
//                     }}
//                 >
//                     <Box sx={{ width: '25%', borderRight: '1px solid', py: '5px', px: '5px' }}>Receiving Bank</Box>
//                     <Box sx={{ width: '75%', px: '20px', py: '5px' }}>
//                         <Autocomplete
//                             id="combo-box-demo"
//                             options={bankList}
//                             getOptionLabel={(option) => option.bank_name}
//                             onChange={(e, value) => setSelectedBank(value)}
//                             sx={styles.autoCompleteCss}
//                             renderInput={(params) => (
//                                 <TextField {...params} placeholder="Select" required />
//                             )}
//                         />
//                     </Box>
//                 </Box>
//             </>
//         )
//     }
//     return null
// }