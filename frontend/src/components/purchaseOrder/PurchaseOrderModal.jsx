import { Alert, Box, Button, CircularProgress, Divider, FormControlLabel, Grid, Modal, Radio, RadioGroup, TextField, Typography, } from "@mui/material";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import { masterDataList } from "../../config/services/packageBundle";
import { createPurchaseOrder, listIssuingBank, receivingBankDetails, uploadPurchaseOrderFile } from "../../config/services/purchaseOrder";
import { assignApprovalRequest } from "../../config/services/salesApproval";
import { useStyles, POModalStyle, style } from "../../css/SchoolDetail-css";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getProductSalePriceSum, getQuotationDetails, getQuotationWithoutPO } from "../../config/services/quotationCRM";
import { round } from "lodash";
import { handleAlphaNumericPaste, handleAlphaNumericText } from "../../helper/randomFunction";
import { ReactComponent as IconCancel } from '../../assets/icons/icon_close.svg';
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";

export const PurchaseOrderModal = ({ leadObj, modal1, setModal1, quotationData, modal2, setModal2, modal3Status = false, page1Details }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [active, setActive] = useState(false)
  const [inActive, setInActive] = useState(true)
  const [tenure, setTenure] = useState('')
  const [collectionTerms, setCollectionTerms] = useState()
  const [invoiceTerms, setInvoiceTerms] = useState()
  const [payableMonths, setPayableMonths] = useState()
  const [invoiceValue, setInvoiceValue] = useState()
  const [contractValue, setContractValue] = useState()
  const [name, setName] = useState()
  const [contactNumber, setContactNumber] = useState()
  const [emailId, setEmailId] = useState()
  const [dropDownValues, setDropDownValues] = useState([])
  const [modal3, setModal3] = useState(modal3Status)
  const [modal4, setModal4] = useState(false)
  const [totalAdvanceAmount, setTotalAdvanceAmount] = useState(0)
  const [advanceAmountHardware, setAdvanceAmountHardware] = useState(0)
  const [advanceAmountSoftware, setAdvanceAmountSoftware] = useState(0)
  const [hardwareCategoryPrice, setHardwareCategoryPrice] = useState(null)
  const [softwareCategoryPrice, setSoftwareCategoryPrice] = useState(null)
  const [detailsMode, setDetailsMode] = useState('')
  const [detailsModeOptions, setDetailsModeOptions] = useState([])
  const [bankOptions, setBankOptions] = useState([])
  const [issueBankOptions, setIssueBankOptions] = useState([])
  const [quotationList, setQuotationList] = useState([])
  const [selectedQuotation, setSelectedQuoation] = useState({ label: 'Search Quotation' })
  const [loggedInUser] = useState(getUserData("loginData")?.uuid);
  const [empCode] = useState(getUserData("userData")?.username);
  const [createdByName] = useState(getUserData("userData")?.name);
  const [createdByProfileName] = useState(getUserData("userData")?.crm_profile)
  const [createdByRoleName] = useState(getUserData("userData")?.crm_role)
  const [detailsModeArray, setDetailModeArray] = useState([])
  const [paymentProofFile, setPaymentProofFile] = useState([])
  const [paymentScheduleFile, setPaymentScheduleFile] = useState([])
  const [paymentScheduleUrl, setPaymentScheduleUrl] = useState([])
  const [selectedIssueBank, setSelectIssueBank] = useState([])
  const [selectedRecieverBank, setSelectRecieverBank] = useState([])
  const [approvalModalStatus, setApprovalModalStatus] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  const validateContactNumber = (mobile) => {
    const mobileRegex = new RegExp('^[0-9]{10}$');
    return mobileRegex.test(mobile);
  }

  const handleEmail = (e) => {
    let email = e.target.value
    setEmailId(email)
  }

  const uploadPaymentProof = (e, i) => {
    const fileName = e.target.files[0].name
    const fileExtension = fileName.replace(/^.*\./, "")
    const file = e.target?.files?.[0]

    if (fileExtension === 'pdf' || fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
      const formData = new FormData();
      formData.append("image", file);
      let previousPaymentProofFile = [...paymentProofFile]
      previousPaymentProofFile[i] = { value: fileName }
      setPaymentProofFile([...paymentProofFile, { value: fileName }])
      onPaymentProofUpload(formData, i, fileName)
    }
    else {
      toast.error('File format not supported')
      return false
    }
  }

  const uploadPaymentSchedule = (e) => {
    const fileName = e.target.files[0].name
    const fileExtension = fileName.replace(/^.*\./, "")
    const file = e.target?.files?.[0]

    if (fileExtension === 'pdf') {
      setPaymentScheduleFile(e.target?.files?.[0])
      const formData = new FormData();
      formData.append("image", file);
      onPaymentSchedule(formData)
    }
    else {
      toast.error('File format not supported')
      return false
    }
  }

  const onPaymentSchedule = async (data) => {
    try {
      const response = await uploadPurchaseOrderFile(data);
      if (response?.result) {
        const fileUrl = response?.result;
        setPaymentScheduleUrl(fileUrl)
        toast.success(response?.message)
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong')
    }
  };

  const getDropDownValues = () => {
    let params = {
      status: [1],
      master_data_type: "payment_schedule",
      uuid: loggedInUser
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        let dropDownValue = list?.map(item => ({
          label: item?.name,
          value: item?.name
        }))
        setDropDownValues(dropDownValue)

      }).catch(err => console.error(err))

  }

  const getBankDetails = () => {
    let params = {
      uuid: loggedInUser,
      status: [1]
    }
    receivingBankDetails(params)
      .then((res) => {
        let list = res?.data?.bank_details
        let newList = list?.map(details => ({
          ...details,
          label: `${details?.bank_name} (${details?.bank_account_number})`,
          value: details?.bank_account_number,
        }))
        setBankOptions(newList)
      })
      .catch(err => console.error(err))
  }

  const getIssuingBankDetails = () => {
    let params = {
      uuid: loggedInUser,
      status: [1]
    }
    listIssuingBank(params)
      .then((res) => {
        let list = res?.data?.bank_details
        let newList = list?.map(details => ({
          ...details,
          label: `${details?.bank_name}`,
          value: details?.bank_id,
        }))
        setIssueBankOptions(newList)
      })
      .catch(err => console.error(err))
  }

  const getDetailsMode = () => {
    let params = {
      status: [1],
      master_data_type: "payment_mode",
      uuid: loggedInUser
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list;
        let options = list?.map(item => ({
          label: item?.name,
          value: item?.name,
          paymentModeId: item?.id
        }))
        setDetailsModeOptions(options);
      }).catch(err => console.error(err))
  }

  const onPaymentProofUpload = async (data, i, fileName) => {
    try {
      const response = await uploadPurchaseOrderFile(data);
      if (response?.result) {
        const fileUrl = response?.result;
        let prevData = [...detailsModeArray]
        prevData[i].paymentProofUrl = fileUrl
        prevData[i].paymentProofFileName = fileName
        setDetailModeArray(prevData)
        toast.success(response?.message)
      }
    } catch (error) {
      console.error(error);
    }
  };



  const emptyModal3 = () => {
    setStartDate(null)
    setEndDate(null)
    setCollectionTerms('')
    setInvoiceTerms('')
    setPayableMonths('')
    setInvoiceValue('')
    if (hardwareCategoryPrice) setAdvanceAmountHardware(0)
    if (softwareCategoryPrice) setAdvanceAmountSoftware(0)
    setSelectedQuoation({ label: 'Search Quotation', value: null })
    setTotalAdvanceAmount(0)
    setDetailsMode()
    setName('')
    setContactNumber('')
    setEmailId('')
    setActive(false)
    setInActive(false)
    setDetailModeArray([])
  }

  const submitValidation = () => {
    if (!startDate) {
      toast.dismiss()
      toast.error('Select Agreement Start Date!')
      return false
    }

    if (!collectionTerms) {
      toast.dismiss()
      toast.error('Select Payment terms!')
      return false
    }

    if (!payableMonths) {
      toast.dismiss()
      toast.error('Enter Agreement Payable Months!')
      return false
    }

    if (active) {
      if (!totalAdvanceAmount) {
        toast.dismiss()
        toast.error('Enter Total Advance Amount!')
        return false
      }

      if (parseFloat(totalAdvanceAmount) < parseFloat(advanceAmountHardware)) {
        toast.dismiss()
        toast.error('Hardware Amount can not be greater than Total Amount')
        return false
      }

      if (parseFloat(totalAdvanceAmount) < parseFloat(advanceAmountSoftware)) {
        toast.dismiss()
        toast.error('Software Amount can not be greater than Total Amount')
        return false
      }

      if (parseFloat(totalAdvanceAmount) != (parseFloat(advanceAmountHardware) + parseFloat(advanceAmountSoftware))) {
        toast.dismiss()
        toast.error('Sum of Hardware & Software Amount must be equal to Total Amount')
        return false
      }

      if (detailsMode?.length == 0) {
        toast.dismiss()
        toast.error('Select Advance Details Mode!')
        return false
      }
      let totalBankAmount = 0
      for (let i = 0; i < detailsMode?.length; i++) {
        let detailsModeItem = capitalizeFirstLetter(detailsMode?.[i]?.label)
        totalBankAmount += parseFloat(detailsModeArray?.[i]?.bankAmount)
        if (!detailsModeArray?.[i]?.advanceDetailsRefNo) {
          toast.dismiss()
          toast.error(`Enter Advance Details Ref No. for ${detailsModeItem}!`)
          return false;
        }

        if (detailsModeArray?.[i]?.advanceDetailsRefNo?.length > 40) {
          toast.dismiss()
          toast.error(`${detailsModeItem} Advance Details Ref No. can not be greater than 40`)
          return false;
        }



        if (!isAlphanumeric(detailsModeArray?.[i]?.advanceDetailsRefNo)) {
          toast.dismiss()
          toast.error(`${detailsModeItem} Advance Details Ref No. should be Alphanumeric!`)
          return false;
        }

        if (!detailsModeArray?.[i]?.paymentDate) {
          toast.dismiss()
          toast.error(`Select Payment Date for ${detailsModeItem}`)
          return false;
        }

        if (!detailsModeArray?.[i].paymentProofUrl) {
          toast.dismiss()
          toast.error(`Upload Payment Proof for ${detailsModeItem}!`)
          return false;
        }

        if (!detailsModeArray?.[i]?.reciever_bank_name) {
          toast.dismiss()
          toast.error(`Select Receiver's Bank Details for ${detailsModeItem}!`)
          return false;
        }

        if (!detailsModeArray?.[i]?.bankAmount) {
          toast.dismiss()
          toast.error(`Enter Amount for ${detailsModeItem}!`)
          return false;
        }

        if (detailsModeArray?.[i]?.bankAmount < 0) {
          toast.dismiss()
          toast.error(`Enter Valid Amount for ${detailsModeItem}`)
          return false;
        }
      };

      if (parseFloat(totalBankAmount) > parseFloat(totalAdvanceAmount)) {
        toast.dismiss()
        toast.error(`Sum of all Amounts must be equal to Total Advance Amount!`)
        return
      }
    }

    if (!name || name?.trim()?.length == 0) {
      toast.dismiss()
      toast.error('Enter Name!')
      return false
    }

    if (!contactNumber || contactNumber?.trim()?.length == 0) {
      toast.dismiss()
      toast.error('Enter Contact Number!')
      return false
    }

    if (!emailId || emailId?.trim()?.length == 0) {
      toast.dismiss()
      toast.error('Enter Email Id!')
      return false
    }

    if (parseInt(payableMonths) <= 0) {
      toast.dismiss()
      toast.error('Agreement Payable Months must be greater than 0')
      return false
    }
    if (parseInt(payableMonths) > parseInt(tenure)) {
      toast.dismiss()
      toast.error('Agreement Payable Months can not be greater than Agreement Tenure Months')
      return false
    }
    if (!validateContactNumber(contactNumber)) {
      toast.dismiss()
      toast.error('Enter Valid Contact Number')
      return false
    }

    if (!validateEmail(emailId)) {
      toast.dismiss()
      toast.error('Enter Valid email')
      return false
    }
    return true
  }


  const submitPurchaseOrder = async () => {
    let checkValidation = submitValidation()
    if (checkValidation) {
      let params = {
        quotationCode: quotationData?.quotationCode,
        quotationAmount: page1Details?.quoteValue,
        poAmount: page1Details?.poAmount,
        approvalStatus: "",
        status: "New",
        purchaseOrderFile: page1Details?.uploadUrl,
        agreementStartDate: startDate,
        agreementEndDate: endDate,
        agreementTenure: tenure,
        paymentTerm: collectionTerms?.value,
        invoiceTerms: invoiceTerms?.value,
        agreementPayableMonth: payableMonths,
        overallContractValue: contractValue,
        totalAdvanceAmount: totalAdvanceAmount,
        advanceDetailsMode: detailsModeArray,
        adminName: name,
        adminContactNumber: contactNumber,
        adminEmailId: emailId,
        schoolCode: quotationData?.schoolData?.schoolCode,
        schoolName: quotationData?.schoolData?.schoolName,
        product: quotationData?.productDetails,
        createdByUuid: loggedInUser,
        createdByEmpcode: empCode,
        createdByName: createdByName,
        createdByRoleName: createdByRoleName,
        createdByProfileName: createdByProfileName,
        totalAdvanceHardwareAmount: advanceAmountHardware,
        totalAdvanceSoftwareAmount: advanceAmountSoftware,
        modifiedByName: createdByName,
        modifiedByRoleName: createdByRoleName,
        modifiedByProfileName: createdByProfileName,
        modifiedByEmpCode: empCode,
        modifiedByUuid: loggedInUser,
        isAdvance: active === true ? active : false,
        groupCode: quotationData?.productDetails?.[0]?.groupCode,
      }

      let assignApprovalData = {
        approvalType: "PO",
        groupCode: quotationData?.productDetails?.[0]?.groupCode,
        groupName: quotationData?.productDetails?.[0]?.groupName,
        createdByRoleName: createdByRoleName,
        data: {
          quotationCode: quotationData?.quotationCode,
          quotationAmount: page1Details?.quoteValue,
          poAmount: page1Details?.poAmount,
          purchaseOrderFile: page1Details?.uploadUrl,
          product: quotationData?.productDetails?.[0]?.groupCode,
          agreementStartDate: startDate,
          agreementEndDate: endDate,
          agreementTenure: tenure,
          paymentTerm: collectionTerms?.value,
          invoiceTerms: invoiceTerms?.value,
          agreementPayableMonth: payableMonths,
          overallContractValue: contractValue,
          advanceAmount: totalAdvanceAmount,
          advanceDetailsMode: detailsModeArray,
          adminName: name,
          adminContactNumber: contactNumber,
          adminEmailId: emailId,
          schoolCode: quotationData?.schoolData?.schoolCode,
          schoolName: quotationData?.schoolData?.schoolName,
          totalAdvanceHardwareAmount: advanceAmountHardware,
          totalAdvanceSoftwareAmount: advanceAmountSoftware,
          isAdvance: active === true ? active : false,
          createdByUuid: loggedInUser,
          createdByEmpcode: empCode,
          createdByName: createdByName,
          createdByRoleName: createdByRoleName,
          createdByProfileName: createdByProfileName,
        },
      };
      params = { ...params, assignApprovalData }
      if (paymentScheduleUrl?.length > 0)
        params = {
          ...params, paymentScheduleFileURL: paymentScheduleUrl, paymentScheduleFileName: paymentScheduleFile?.name,
          assignApprovalData: {
            ...params.assignApprovalData,
            data: {
              ...params.assignApprovalData.data,
              paymentScheduleFileURL: paymentScheduleUrl,
              paymentScheduleFileName: paymentScheduleFile?.name
            }
          }
        }
      try {
        const response = await createPurchaseOrder(params);
        if (response?.data) {
          let { error } = response?.data
          if (error) {
            let { errorMessage } = error
            toast.dismiss()
            toast.error(errorMessage)
            return
          }
        }
        let { message } = response
        toast.success(message)
        navigate("/authorised/purchase-order-list")
        emptyModal3()
        setModal4(false)
        setModal3(false)
      }
      catch (error) {
        console.error(error);
      }
    }

  }

  const fetchProductSalePriceSum = () => {
    let quotationId = quotationData?.quotationCode
    getProductSalePriceSum(quotationId)
      .then(res => {
        let data = res?.result
        setContractValue(data?.productItemSalePriceSum)
        setTenure(data?.maxProductItemDuration)
        setHardwareCategoryPrice(data?.Hardware)
        setSoftwareCategoryPrice(data?.Software)
      })
      .catch(err => {
        console.error(err, "Error while fetching getProductSum")
      })
  }

  const fetchQuotationWithoutPO = () => {
    let schoolCode = leadObj?.schoolCode
    getQuotationWithoutPO(schoolCode)
      .then(res => {
        let data = res?.result;
        let list = data?.map(obj => {
          return {
            ...obj,
            label: "Quotation : " + obj?._id,
            // value: obj?._id
          }
        })
        setQuotationList(list);
      })
      .catch(err => {
        console.error(err, 'Error while fetching Quotation without PO')
      })
  }

  const getQuotation = () => {
    navigate("/authorised/edit-quotation", {
      state: {
        schoolCode: quotationData?.schoolData?.schoolCode,
        quotationCode: quotationData?.quotationCode,
      },
    });
  }

  const handleSelectQuotation = (item) => {
    setSelectedQuoation(item)
  }

  const emptyPaymentProof = (i) => {
    let previousPaymentProofFile = [...paymentProofFile]
    previousPaymentProofFile[i] = 'Select attach file'
    setPaymentProofFile(previousPaymentProofFile);
    delete detailsModeArray?.[i].paymentProofUrl
    delete detailsModeArray?.[i].paymentProofFileName
  }


  const emptyPaymentSchedule = (i) => {
    setPaymentScheduleFile('Select Attach File');
    setPaymentScheduleUrl([])
  }

  const handleActive = (e) => {
    setActive(e.target.checked)
    if (e.target.checked) setInActive(false)
  }

  const handleNotActive = (e) => {
    setInActive(e.target.checked)
    if (e.target.checked) setActive(false)
  }

  const handleCollectionTerms = (data) => {
    let selectedValue = data?.label
    if ((selectedValue === "Quarterly" && tenure < 3) || (selectedValue === "Half Yearly" && tenure < 6) || (selectedValue === "Yearly" && tenure < 12)) {
      toast.dismiss()
      toast.error("Payment Terms can only be less than or equal to " + tenure)
      setCollectionTerms('')
      return
    }
    setCollectionTerms(data)
  }

  const handleAdvanceAmount = (e) => {
    let { value } = e.target;
    setTotalAdvanceAmount(value)
    if (value) {
      if (hardwareCategoryPrice && softwareCategoryPrice) {
        let hardwareAmount = 0;
        let softwareAmount = 0;
        if (value > hardwareCategoryPrice) {
          hardwareAmount = hardwareCategoryPrice;
          softwareAmount = value - hardwareAmount
        }
        else {
          hardwareAmount = Math.round(value / 2);
          softwareAmount = value - hardwareAmount

        }
        setAdvanceAmountHardware(hardwareAmount)
        setAdvanceAmountSoftware(softwareAmount)
      }
      else if (hardwareCategoryPrice) {
        setAdvanceAmountHardware(value)
      }
      else {
        setAdvanceAmountSoftware(value)
      }
    }
    else {
      if (hardwareCategoryPrice) setAdvanceAmountHardware(0)
      if (softwareCategoryPrice) setAdvanceAmountSoftware(0)
    }
  }

  const handleStartDate = (date) => {
    const copyDate = new Date(date);
    const startMonth = copyDate.getMonth()
    const startYear = copyDate.getFullYear()
    setStartDate(copyDate);
    date.setMonth(date.getMonth() + tenure);
    setEndDate(date);

    let financialYearEnd;

    if (startMonth > 3) {
      financialYearEnd = new Date(`02-31-${startYear + 1}`)
    }
    else {
      financialYearEnd = new Date(`02-31-${startYear}`)
    }

    const endYear = financialYearEnd.getFullYear();
    const endMonth = financialYearEnd.getMonth()

    let FYDiffernce = (endYear - startYear) * 12 + (endMonth - startMonth);
    if (tenure < FYDiffernce) {
      FYDiffernce = tenure
    }

    //logic for Total Invoice Value
    let invoiceValuePerMonth = contractValue / tenure
    setInvoiceValue(invoiceValuePerMonth * FYDiffernce)
  }

  const handlePayableMonths = (e) => {
    let { value } = e.target
    setPayableMonths(value)
  }

  const handleDetailMode = (data) => {
    let dataLength = data?.length;
    let lastEntry = data?.[dataLength - 1]
    setDetailsMode(data)
    setDetailModeArray([...detailsModeArray, { paymentMode: lastEntry?.value, paymentModeId: lastEntry?.paymentModeId }])
  }


  const handleRemoveDetailMode = (data) => {
    const removedIndex = detailsMode?.findIndex(item => item?.paymentModeId === data?.paymentModeId)
    const updatedDetailsModeOptions = [...detailsMode]
    const updatedDetailsModeData = [...detailsModeArray];
    const updatedPaymentProof = [...paymentProofFile]
    const updatedIssueBank = [...selectedIssueBank]
    updatedDetailsModeData.splice(removedIndex, 1);
    updatedDetailsModeOptions.splice(removedIndex, 1);
    updatedPaymentProof.splice(removedIndex, 1)
    updatedIssueBank.splice(removedIndex, 1)
    setDetailModeArray(updatedDetailsModeData);
    setDetailsMode(updatedDetailsModeOptions)
    setPaymentProofFile(updatedPaymentProof)
    setSelectIssueBank(updatedIssueBank)
  };

  const handleModal1 = () => {
    if (selectedQuotation.label == 'Search Quotation') {
      toast.dismiss()
      toast.error('Please Select Quotation')
      return;
    }
    setModal1(!modal1);
    navigate("/authorised/quotation-detail", {
      state: {
        quotationCode: selectedQuotation._id,
        checkQuotation: true,
        routeType: "page"
      },
    });
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const isAlphanumeric = (inputText) => {
    let alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(inputText);
  }

  useEffect(() => {
    if (leadObj != null)
      fetchQuotationWithoutPO()
  }, [leadObj]);

  useEffect(() => {
    if (quotationData != null) {
      getDropDownValues()
      getBankDetails()
      getIssuingBankDetails()
      getDetailsMode()
      fetchProductSalePriceSum()
    }
  }, [quotationData])

  return (
    <div>
      <Modal
        open={modal1}
        aria-labelledby="modal-modal-title"
        className="crm-school-generate-quote-modal crm-school-upload-po-modal"
      >
        <Box className="crm-modal-basic-content">
          <Box className="crm-modal-close" onClick={() => { setModal1(!modal1); }}>
            <IconCancel />
          </Box>
          <Typography component={"h3"} className="crm-quotes-modal-form-label">
            Select Quotation{" "}
          </Typography>

          {quotationList?.length > 0 ? (
            <>
              <div className="crm-school-upload-po-modal-container" >
                <Box >
                  <RadioGroup
                    aria-label="referredBy"
                    id={`selectedQuotation`}
                    name={'selectedQuotation'}
                    value={selectedQuotation?._id}
                    onChange={(event) => {
                      handleSelectQuotation(quotationList.filter(obj => obj?._id === event.target.value)[0])
                    }}
                  >
                    {quotationList?.map(obj => (
                      <FormControlLabel
                        className="crm-form-input-radio"
                        value={obj._id}
                        control={
                          <Radio sx={{ color: "rgba(0,0,0,0.8)" }} />
                        }
                        label={obj?.label}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 25,
                  marginRight: '-40px'
                }}
              >
                <Button
                  className="crm-btn"
                  onClick={handleModal1}
                  disabled={quotationList?.length === 0 ? true : false}
                >
                  Save & Next
                </Button>

              </div>
            </>

          ) :
            <p style={{ marginTop: '30px', marginBottom: '10px' }}>No Quotation found!</p>
          }


        </Box>
      </Modal>

      <Modal
        hideBackdrop={true}
        open={modal3}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="targetModal1"
      >
        <>
          <Box
            className="crm-contract-confirm-modal-container"
            style={{ borderRadius: "8px", width: "fit-content !important", }}
          >
            <div className="crm-contract-confirm-modal-title">
              Do you want to edit the Final Quotation?
            </div>
            <div style={{ display: "flex", justifyContent: 'center', marginTop: "30px" }}>
              <Button
                onClick={() => {
                  setModal4(!modal4)
                }}
                className="crm-btn crm-btn-outline crm-btn-small mr-1"
              >
                No
              </Button>
              <Button
                className="crm-btn crm-btn-small"
                onClick={() => getQuotation()}
              >
                Yes
              </Button>
            </div>
          </Box>
        </>
      </Modal>
      <Modal
        hideBackdrop={true}
        open={modal4}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="targetModal1 crm-contract-license-modal"
      >
        <>
          <Box
            sx={POModalStyle}
            className="modalContainer"
            style={{ borderRadius: "8px", width: "min-content", width: '50%', overflow: 'auto', height: '80%' }}
          >
            <Box className="crm-contract-license-modal-title">
              <h2>License Details</h2>
            </Box>
            <Box >
              <Grid container >
                <Grid item xs={12} md={6}  >
                  <h4 className="crm-contract-license-modal-header">Particular</h4>
                </Grid>
                <Grid item xs={12} md={6}  >
                  <h4 className="crm-contract-license-modal-header">Details of Agreement</h4>
                </Grid>
              </Grid>
              <Grid container spacing={2.5} className="mt-0">
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Agreement Start Date<span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    className={'crm-form-input dark'}
                    selected={startDate}
                    onChange={(date) => handleStartDate(date)}
                    // minDate={new Date()}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    onChangeRaw={(e) => e.preventDefault()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Agreement End Date<span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    className='crm-form-input dark'
                    selected={endDate}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Agreement Tenure Months<span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className='crm-form-input dark'
                    type="text"
                    variant="outlined"
                    placeholder="Month"
                    value={tenure}
                    disabled={true}
                    sx={{
                      width: "300px",
                      // marginTop: '-15px',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Payment Terms<span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Select
                    className='crm-form-input crm-react-select dark'
                    name="color"
                    options={dropDownValues}
                    onChange={handleCollectionTerms}
                    value={collectionTerms}
                    classNamePrefix="select"
                    components={{ DropdownIndicator }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Agreement Payable Months<span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className='crm-form-input dark'
                    type="number"
                    value={payableMonths}
                    onWheel={e => e.target.blur()}
                    onChange={(e) => handlePayableMonths(e)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Total Contract Value <span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className='crm-form-input dark'
                    type="number"
                    value={contractValue}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Payment Schedule and PDC's (If any) Attachment <span style={{ color: 'red' }}> **</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="crm-form-file dark" style={{ marginLeft: '0' }}>
                    <label className={paymentScheduleFile?.length <= 26 ? classes.placeholder : classes.bigFileName}>{paymentScheduleFile?.name ?? "Select attach file"}</label>
                    {!paymentScheduleFile?.name ?
                      <div className={classes.uploaderFileBtn} id="outlined-basic">
                        <input
                          className='crm-form-input dark'
                          style={{ display: 'none' }}
                          id="uploadPaymentSchedule"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => uploadPaymentSchedule(e)}
                        />
                        <label className={classes.browse} htmlFor="uploadPaymentSchedule">Browse</label>
                      </div>
                      :
                      <Button className={classes.emptyPdf} style={{ color: 'black' }} onClick={() => emptyPaymentSchedule()}>
                        X
                      </Button>
                    }
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className={classes.labelDiv} style={{
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <div style={{ display: 'flex', }}>
                      <label className={classes.label} style={{
                        letterSpacing: "0px",
                      }}>Advance</label>

                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <label style={{ marginRight: '40px' }}>
                    <input type="radio" className="crm-form-input-radio" style={{ marginRight: "5px" }} checked={active} onChange={handleActive} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" className="crm-form-input-radio" style={{ marginRight: "5px" }} checked={inActive} onChange={handleNotActive} />
                    No
                  </label>
                </Grid>
                {active &&
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography component={'label'}>Total Advance amount <span style={{ color: 'red' }}> *</span></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        className='crm-form-input dark'
                        type="number"
                        onWheel={e => e.target.blur()}
                        value={totalAdvanceAmount}
                        onChange={(e) => handleAdvanceAmount(e)}
                      />
                    </Grid>
                    {softwareCategoryPrice != null &&
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography component={'label'}>Advance Amount Software <span style={{ color: 'red' }}> *</span></Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            className='crm-form-input dark'
                            type="number"
                            onWheel={e => e.target.blur()}
                            value={advanceAmountSoftware}
                            onChange={e => setAdvanceAmountSoftware(e.target.value)}
                          />
                        </Grid>
                      </>
                    }
                    {hardwareCategoryPrice != null &&
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography component={'label'}>Advance Amount Hardware <span style={{ color: 'red' }}> *</span></Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            className='crm-form-input dark'
                            type="number"
                            onWheel={e => e.target.blur()}
                            value={advanceAmountHardware}
                            onChange={e => setAdvanceAmountHardware(e.target.value)}
                          />
                        </Grid>
                      </>
                    }
                    <Grid item xs={12} md={6}>
                      <Typography component={'label'}>Advance Details Mode <span style={{ color: 'red' }}> *</span></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Select
                        className='crm-form-input crm-react-select crm-form-select-multi dark'
                        name="color"
                        isMulti
                        options={detailsModeOptions}
                        onChange={handleDetailMode}
                        value={detailsMode}
                        classNamePrefix="select"
                        components={{
                          DropdownIndicator,
                          MultiValueRemove: ({ innerProps, data }) => (
                            <div {...innerProps} onClick={() => handleRemoveDetailMode(data)}>
                              &times;
                            </div>
                          ),
                        }}
                      />
                    </Grid>
                    {detailsMode?.length > 0 &&
                      detailsMode?.map((item, index) => {
                        {
                          let key = item?.value
                          let capitalFirstLetterKey = capitalizeFirstLetter(key)
                          return (
                            <>
                              <Grid item xs={12} md={12}  >
                                <h4 className="crm-contract-license-modal-header">{capitalFirstLetterKey}</h4>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography component={'label'}>
                                  Advance Details Ref No.<span style={{ color: 'red' }}> *</span>
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  className='crm-form-input dark'
                                  type="text"
                                  InputProps={{
                                    onKeyDown: handleKeyDown,
                                  }}
                                  value={detailsModeArray?.[index]?.advanceDetailsRefNo}
                                  onKeyDown={handleAlphaNumericText}
                                  onPaste={handleAlphaNumericPaste}
                                  onChange={(e) => {
                                    let newArray = [...detailsModeArray]
                                    let { value } = e.target
                                    if (value?.length <= 40) {
                                      newArray[index].advanceDetailsRefNo = value
                                      setDetailModeArray(newArray)
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography component={'label'}>Payment Date (As mentioned) <span style={{ color: 'red' }}> *</span></Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <DatePicker
                                  className='crm-form-input dark'
                                  selected={detailsModeArray?.[index]?.["paymentDate"]}
                                  onChange={(date) => {
                                    let newArray = [...detailsModeArray]
                                    newArray[index].paymentDate = date
                                    setDetailModeArray(newArray)
                                  }}
                                  onKeyDown={(e) => {
                                    e.preventDefault();
                                  }}
                                  onChangeRaw={(e) => e.preventDefault()}
                                  minDate={new Date(quotationData?.createdDate)}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography component={'label'}>Upload Payment Proof <span style={{ color: 'red' }}> *</span></Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <div className="crm-form-file dark" style={{ marginLeft: '0' }}>
                                  <label className={paymentProofFile?.[index]?.["value"]?.length <= 26 ? classes.placeholder : classes.bigFileName}>{detailsModeArray?.[index]?.paymentProofFileName ?? "Select attach file"}</label>
                                  {!detailsModeArray?.[index]?.paymentProofFileName ?
                                    <div className={classes.uploaderFileBtn} id="outlined-basic">
                                      <input
                                        className='crm-form-input dark'
                                        style={{ display: 'none' }}
                                        id={`upload${index}`}
                                        type="file"
                                        accept=".pdf, .jpg, .png, .jpeg"
                                        onChange={(e) => uploadPaymentProof(e, index)}
                                      />
                                      <label className={classes.browse} htmlFor={`upload${index}`}>Browse</label>
                                    </div>
                                    :
                                    <Button className={classes.emptyPdf} style={{ color: 'black' }} onClick={() => emptyPaymentProof(index)}>
                                      X
                                    </Button>
                                  }
                                </div>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography component={'label'}>Receiver's Bank Details <span style={{ color: 'red' }}> *</span></Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Select
                                  className='crm-form-input crm-react-select dark'
                                  name="color"
                                  options={bankOptions}
                                  onChange={(value) => {
                                    let previousData = [...detailsModeArray]
                                    let prevBank = [...selectedRecieverBank]
                                    prevBank[index] = { mode: key, bank_name: value?.bank_name, bank_account_number: value?.bank_account_number }
                                    setSelectRecieverBank(prevBank)
                                    previousData[index].reciever_bank_name = value?.bank_name
                                    previousData[index].reciever_bank_account_number = value?.bank_account_number
                                    previousData[index].reciever_bank_id = value?.bank_id
                                    setDetailModeArray(previousData)
                                  }}
                                  // value={selectedRecieverBank?.[index]?.["value"]}
                                  classNamePrefix="select"
                                  components={{ DropdownIndicator }}
                                />
                              </Grid>
                              {key != "cash" &&
                                <>
                                  <Grid item xs={12} md={6}>
                                    <Typography component={'label'}>Issuer's Bank Details</Typography>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Select
                                      className='crm-form-input crm-react-select dark'
                                      name="color"
                                      options={issueBankOptions}
                                      onChange={(value) => {
                                        let previousData = [...detailsModeArray]
                                        let prevBank = [...selectedIssueBank]
                                        prevBank[index] = { mode: key, bank_name: value?.bank_name, bank_account_number: value?.bank_id }
                                        setSelectIssueBank(prevBank)
                                        previousData[index].issue_bank_name = value?.bank_name
                                        previousData[index].issue_bank_id = value?.bank_id
                                        setDetailModeArray(previousData)
                                      }}
                                      // value={selectedIssueBank?.[index]}
                                      classNamePrefix="select"
                                      components={{ DropdownIndicator }}
                                    />
                                  </Grid>
                                </>
                              }
                              <Grid item xs={12} md={6} >
                                <Typography component={'label'}>Amount <span style={{ color: 'red' }}> *</span></Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  className='crm-form-input dark'
                                  type="number"
                                  value={detailsModeArray?.[index]?.bankAmount}
                                  onWheel={e => e.target.blur()}
                                  onChange={(e) => {
                                    let newArray = [...detailsModeArray]
                                    newArray[index].bankAmount = e.target.value
                                    setDetailModeArray(newArray)
                                  }}
                                />
                              </Grid>
                            </>
                          )
                        }
                      })}
                  </>
                }

                <Grid item xs={12} md={12}>
                  <div className="crm-contract-license-modal-heading" style={{ marginBottom: '20px' }}>** To be attached in the annexure</div>
                  <Typography component={'label'}> <div style={{ textDecoration: 'underline' }}>Details of the Admin/s <span style={{ color: 'red' }}>*</span></div></Typography>
                  <div className="crm-contract-license-modal-subheading">(Required for the activation of Admin Panel/Solution)</div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Name <span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className='crm-form-input dark'
                    type="text"
                    value={name}
                    onChange={(e) => {
                      let { value } = e?.target
                      let newValue = value?.trimStart().replace(/\s+/g, ' ')
                      setName(newValue)
                    }}

                    onKeyDown={handleAlphaNumericText}
                    onPaste={handleAlphaNumericPaste}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Contact Number <span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className='crm-form-input dark'
                    type="number"
                    value={contactNumber}
                    onWheel={e => e.target.blur()}
                    InputProps={{
                      onKeyDown: handleKeyDown,
                    }}
                    onChange={(e) => {
                      let number = e.target.value
                      if (number.length <= 10)
                        setContactNumber(number)
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component={'label'}>Email ID <span style={{ color: 'red' }}> *</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className='crm-form-input dark'
                    type="text"
                    value={emailId}
                    InputProps={{
                      onKeyDown: handleKeyDown,
                    }}
                    onChange={handleEmail}
                  />
                </Grid>
              </Grid>
            </Box>

            <div style={{ display: "flex", float: "right", marginTop: "25px" }}>

              <Button
                onClick={() => {
                  setModal4(!modal4)
                  setModal2(!modal2)
                  emptyModal3()
                }}
                className="crm-btn crm-btn-outline mr-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitPurchaseOrder}
                // onClick={() => {

                //   // setApprovalModalStatus(true)
                // }}
                className="crm-btn"
              >
                Submit
              </Button>
            </div>
          </Box>
        </>
      </Modal>

      <Modal
        open={approvalModalStatus}
        aria-labelledby="modal-modal-title"
        className="crm-school-generate-quote-modal crm-school-upload-po-modal"
      >
        <Box className="crm-modal-basic-content">
          <Box className="crm-modal-close" onClick={() => { setApprovalModalStatus(!approvalModalStatus); }}>
            <IconCancel />
          </Box>
          <Typography component={"h3"} className="crm-contract-send-approval-modal-title">
            Are you sure you want to raise this for approval?
          </Typography>

          <Box className="crm-contracy-send-approval-modal-formitem" sx={{ minWidth: '360px' }} >
            <Typography component={"label"}>Remarks</Typography>
            <textarea
              multi
              type="text"
              name="remarks"
              className="crm-form-input-textarea"
              rows={5}
            //value={}
            //onChange={}
            />
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <Button
              className="crm-btn"
              onClick={() => {
                setApprovalModalStatus(true);
                submitPurchaseOrder();
              }}
            >
              Raise a request
            </Button>

          </div>
        </Box>
      </Modal>
    </div >
  )
}

