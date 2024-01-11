import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Breadcrumbs,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import moment from "moment";
import { Formik, Form, ErrorMessage } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createProductField, getImplementationById, getProductField, implementationCompleteForm, listBatchDetails, updateActivationPackage, updateImplementationByStatus } from "../../config/services/implementationForm";
import { Link, useLocation } from "react-router-dom";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import { fetchQuotationDetails } from "../../config/services/quotationMapping";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { getChildList } from "../../config/services/lead";
import { useNavigate } from "react-router-dom";
import PurchaseOrderDetail from "../../components/purchaseOrder/PurchaseOrderDetail";
import QuotationDetailForm from "../Quotation/QuotationDetailForm";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getUserData } from "../../helper/randomFunction/localStorage";
import * as Yup from "yup";
import {
  handleKeyDown,
  handleKeyTextDown,
  handleNumberKeyDown,
  handlePaste,
  handleTextPaste,
} from "../../helper/randomFunction";
import { getPurchaseOrderDetails, updatePurchaseOrderStatus } from "../../config/services/purchaseOrder";
import { toast } from "react-hot-toast";
import { assignApprovalRequest } from "../../config/services/salesApproval";
import { DisplayLoader } from "../../helper/Loader";
import MenuItem from '@mui/material/MenuItem';
import { packageActivation } from "../../config/services/packageBundle";
import Page from "../../components/Page";
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dropdown-2.svg";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
import { ReactComponent as IconRecordDelete } from "../../assets/icons/icon-quotation-row-delete.svg";
import { ReactComponent as IconRecordAdd } from "../../assets/icons/icon-quotation-row-add.svg";

const styles = {
  tableContainer: {
    margin: "30px auto",
    borderRadius: "8px",
    boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "20px",
  },
  dividerLine: {
    borderWidth: "1.4px",
    borderColor: "#00000029",
    width: "98%",
    margin: "20px 5px 20px 16px",
  },
  tableCell: {
    padding: "8px 0px 8px 16px !important",
    border: "none",
  },
  autoCompleteCss: {
    width: 250,
    borderRadius: "8px",
    boxShadow: "0px 3px 5px #00000029",
    "& label": {
      margin: "-5px !important",
      width: "80% !important",
    },
    "& .MuiInputBase-input": {
      height: "0.5rem !important",
    },
  },
  impForm: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
    paddingBottom: "70px !important",
  },
  impHead: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#707070",
    marginBottom: "20px",
  },
  mT: { marginTop: "20px" },
  accordion: {
    boxShadow: "0px 3px 6px #00000029",
    border: "1px solid #BEBEBE",
    background: "#FFFFF 0% 0% no-repeat padding-box",
  },
  typo: { fontSize: 20, fontWeight: 700, color: "#707070" },
  typoSec: {
    padding: "10px 16px",
    fontWeight: "700",
    fontSize: "18px",
    textDecoration: "underline",
    backgroundColor: "#FECB98",
  },
  productSec: {
    borderRight: "1px solid #00000029 !important",
    padding: "16px 0",
    marginRight: "5px"
  },
  borderShadow: {
    "& div": {
      boxShadow: "0px 3px 6px #00000029",
      borderRadius: "8px",
      "& input": { height: "0.5em !important" },
    }
  },
  borderShadowWidth: {
    width: "270px",
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: "8px",
    "& input": { height: "0.5em !important" },
  },
  spocSec: {
    borderRadius: "8px !important",
    boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "50px",
  },
  spocContent: {
    padding: "10px 16px",
    marginTop: "20px",
  },
  nameEmail: {
    width: "70px",
    display: "flex",
    alignItems: "center",
  },
  phone: {
    width: "105px",
    display: "flex",
    alignItems: "center",
  },
  mR: { marginRight: "30px" },
  btnSec: {
    marginTop: "20px",
    textAlign: "center",
  },
  btn: { width: "150px", marginRight: "50px" },
  dateSec: {
    borderRadius: "4px !important",
    boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "50px",
    marginTop: "50px",
  },
  dateHeading: {
    padding: "10px 16px",
    marginTop: "10px",
  },
  mT10: { marginTop: "10px" },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
};

// const ProductDetails = [
//   {
//     "productKey": "esc_plus_basic",
//     "productName": "ESC Plus Basic",
//     "group_key": "esc_plus",
//     "group_name": "ESC PLUS",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Product Details"
//       },
//       {
//         "field": "contractDuration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "escUnit",
//         "isEditable": false,
//         "value": "",
//         "label": "Units",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Units to be implemented"
//       },
//       {
//         "field": "studentCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Student Count"
//       },
//       {
//         "field": "teacherCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Teacher Count"
//       }
//     ]
//   },
//   {
//     "productKey": "esc_plus_pro",
//     "productName": "ESC Plus Pro",
//     "group_key": "esc_plus",
//     "group_name": "ESC PLUS",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Product Details"
//       },
//       {
//         "field": "contractDuration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "escUnit",
//         "isEditable": false,
//         "value": "",
//         "label": "Units",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Units to be implemented"
//       },
//       {
//         "field": "studentCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Student Count"
//       },
//       {
//         "field": "teacherCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Teacher Count"
//       }
//     ]
//   },
//   {
//     "productKey": "esc_plus_advanced",
//     "productName": "ESC Plus Advanced",
//     "group_key": "esc_plus",
//     "group_name": "ESC PLUS",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Product Details"
//       },
//       {
//         "field": "contractDuration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "escUnit",
//         "isEditable": false,
//         "value": "",
//         "label": "Units",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Units to be implemented"
//       },
//       {
//         "field": "studentCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Student Count"
//       },
//       {
//         "field": "teacherCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Teacher Count"
//       }
//     ]
//   },
//   {
//     "productKey": "sip_live_class",
//     "productName": "SIP-Live Class",
//     "group_key": "sip",
//     "group_name": "SIP",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Package Details"
//       },
//       {
//         "field": "boardName",
//         "isEditable": false,
//         "value": "",
//         "label": "Board"
//       },
//       {
//         "field": "className",
//         "isEditable": false,
//         "value": "",
//         "label": "Class"
//       },
//       {
//         "field": "duration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "studentUnit",
//         "isEditable": false,
//         "value": "",
//         "label": "Student Count",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "value": "",
//         "label": "Student units to be implemented"
//       },
//       {
//         "field": "academicYear",
//         "isEditable": false,
//         "value": "",
//         "label": "Academic year",
//         "type": "dropdown"
//       },
//       {
//         "field": "batchLanguage",
//         "isEditable": false,
//         "value": "",
//         "label": "Batch language",
//         "type": "dropdown"
//       },
//       {
//         "field": "batchTiming",
//         "isEditable": false,
//         "value": "",
//         "label": "Batch",
//         "type": "dropdown"
//       }
//     ]
//   },
//   {
//     "productKey": "retail_live_class",
//     "productName": "SIP-Retail Live Class",
//     "group_key": "sip",
//     "group_name": "SIP",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Package Details"
//       },
//       {
//         "field": "boardName",
//         "isEditable": false,
//         "value": "",
//         "label": "Board"
//       },
//       {
//         "field": "className",
//         "isEditable": false,
//         "value": "",
//         "label": "Class"
//       },
//       {
//         "field": "duration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "totalStudentForQuotation",
//         "isEditable": false,
//         "value": "",
//         "label": "Student Count"
//       },
//       {
//         "field": "studentUnitToBeImp",
//         "isEditable": true,
//         "value": "",
//         "label": "Student units to be implemented"
//       },
//       {
//         "field": "academicYear",
//         "isEditable": false,
//         "value": "",
//         "label": "Academic year",
//         "type": "dropdown"
//       },
//       {
//         "field": "batchLanguage",
//         "isEditable": true,
//         "value": "",
//         "label": "Batch language",
//         "type": "dropdown"
//       },
//       {
//         "field": "batch",
//         "isEditable": true,
//         "value": "",
//         "label": "Batch",
//         "type": "dropdown"
//       }
//     ]
//   },
//   {
//     "productKey": "em_power",
//     "productName": "SIP-Em Power",
//     "group_key": "sip",
//     "group_name": "SIP",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Product Details"
//       },
//       {
//         "field": "contractDuration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "escUnit",
//         "isEditable": false,
//         "value": "",
//         "label": "Units",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Units to be implemented"
//       },
//       {
//         "field": "studentCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Student Count"
//       },
//       {
//         "field": "teacherCount",
//         "isEditable": true,
//         "type": "number",
//         "value": "",
//         "label": "Teacher Count"
//       }
//     ]
//   },
//   {
//     "productKey": "self_study",
//     "productName": "SIP-Self Study",
//     "group_key": "sip",
//     "group_name": "SIP",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Package Details"
//       },
//       {
//         "field": "boardName",
//         "isEditable": false,
//         "value": "",
//         "label": "Board"
//       },
//       {
//         "field": "className",
//         "isEditable": false,
//         "value": "",
//         "label": "Class"
//       },
//       {
//         "field": "duration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "studentUnit",
//         "isEditable": false,
//         "value": "",
//         "label": "Student Count"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "value": "",
//         "label": "Student units to be implemented"
//       },
//       {
//         "field": "academicYear",
//         "isEditable": false,
//         "value": "",
//         "label": "Academic year",
//         "type": "dropdown"
//       },
//       {
//         "field": "batchLanguage",
//         "isEditable": true,
//         "value": "",
//         "label": "Batch language",
//         "type": "dropdown"
//       },
//       {
//         "field": "batch",
//         "isEditable": true,
//         "value": "",
//         "label": "Batch",
//         "type": "dropdown"
//       }
//     ]
//   },
//   {
//     "productKey": "la",
//     "productName": "LA",
//     "group_key": "la",
//     "group_name": "LA",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Package"
//       },
//       {
//         "field": "boardName",
//         "isEditable": false,
//         "value": "",
//         "label": "Board"
//       },
//       {
//         "field": "className",
//         "isEditable": false,
//         "value": "",
//         "label": "Grade"
//       },

//       {
//         "field": "duration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "numberOfUnits",
//         "isEditable": false,
//         "value": "",
//         "label": "Student Count",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "value": "",
//         "label": "Student count to be implemented"
//       },
//     ]
//   },
//   {
//     "productKey": "toa",
//     "productName": "TOA",
//     "group_key": "toa",
//     "group_name": "TOA",
//     "productDataList": [],
//     "productTable": []
//   },
//   {
//     "productKey": "assement_centre",
//     "productName": "Assement Centre",
//     "group_key": "assement_centre",
//     "group_name": "Assement Centre",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Package"
//       },
//       {
//         "field": "boardName",
//         "isEditable": false,
//         "value": "",
//         "label": "Board"
//       },
//       {
//         "field": "className",
//         "isEditable": false,
//         "value": "",
//         "label": "Grade"
//       },
//       {
//         "field": "duration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "teacherUnits",
//         "isEditable": false,
//         "value": "",
//         "label": "Teacher Count",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "value": "",
//         "label": "Teacher count to be implemented"
//       },

//     ]
//   },
//   {
//     "productKey": "teaching_app",
//     "productName": "Teaching App",
//     "group_key": "teaching_app",
//     "group_name": "Teaching App",
//     "productDataList": [],
//     "productTable": [
//       {
//         "field": "productItemName",
//         "isEditable": false,
//         "value": "",
//         "label": "Package"
//       },
//       {
//         "field": "boardName",
//         "isEditable": false,
//         "value": "",
//         "label": "Board"
//       },
//       {
//         "field": "className",
//         "isEditable": false,
//         "value": "",
//         "label": "Grade"
//       },
//       {
//         "field": "duration",
//         "isEditable": false,
//         "value": "",
//         "label": "Duration"
//       },
//       {
//         "field": "teacherUnits",
//         "isEditable": false,
//         "value": "",
//         "label": "Teacher Count",
//         "dynamicUnit": "true"
//       },
//       {
//         "field": "implementedUnit",
//         "isEditable": true,
//         "value": "",
//         "label": "Teacher count to be implemented"
//       },
//     ]
//   }
// ]



const ImplementationForm = () => {
  let location = useLocation();
  let { quotationCode, schoolCode, purchaseOrderDetail, schoolPath, schoolId } = location?.state ? location?.state : {};

  const [schoolDetail, setSchoolDetail] = useState({});
  const [contactDetails, setContactDetails] = useState([]);
  const [showAdminTextFields, setShowAdminTextFields] = useState(false);
  const [showImpTextFields, setShowImpTextFields] = useState(false);
  const [showPaymentTextFields, setShowPaymentTextFields] = useState(false);
  const [classSelectData, setClassSelectData] = useState([]);
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(purchaseOrderDetail?.purchaseOrderCode || null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(''); // To store the selected value (either 'Yes' or 'No')
  const [softwareProductTable, setSoftwareProductTable] = useState([])
  const [hardwareProductTable, setHardwareProductTable] = useState([])

  const [consumedProduct, setConsumeProduct] = useState([])

  const [consumedHardwareDetails, setConsumeHardwareDetails] = useState([])
  const [consumedHardwareContentDetails, setConsumedHardwareContentDetails] = useState([])
  const [quotationInfo, setQuotationInfo] = useState([])
  const [implementationList, setImplementationList] = useState([])
  const [dynamic, setDynamic] = useState([])
  const [serviceTable, setServiceTable] = useState([])


  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const loginData = getUserData('loginData')

  const uuid = loginData?.uuid

  const navigate = useNavigate();

  let initialValues = {
    implementationStartDate: null,
    implementationEndDate: null,
    schoolAdminSPOCName: null,
    schoolAdminSPOCPhnNo: null,
    schoolAdminSPOCEmail: null,
    isSchoolAdminSPOCFromMaster: true,
    schoolImplementationSPOCName: null,
    schoolImplementationSPOCPhnNo: null,
    schoolImplementationSPOCEmail: null,
    isSchoolImplementationSPOCFromMaster: true,
    isSchoolPaymentFromSPOCMaster: true,
    schoolPaymentSPOCName: null,
    schoolPaymentSPOCPhnNo: null,
    schoolPaymentSPOCEmail: null,
    noOfCordinators: "",
    schoolId: null,
    schoolCode: null,
    schoolName: null,
    schoolPinCode: null,
    schoolAddress: null,
    schoolEmailId: null,
    schoolCountryCode: null,
    schoolCountryName: null,
    schoolType: null,
    schoolStateCode: null,
    schoolStateName: null,
    schoolCityCode: null,
    schoolCityName: null,
    productDetails: [],
    hardwareContentDetails: [],
    hardwareDetails: [],
    serviceDetails: [],

    totalHardwareContractAmount: 0,
    totalServicesContractAmount: 0,
    totalSoftwareContractAmount: 0,
    totalContractAmount: 0,

    quotationCode: quotationCode || null,
    purchaseOrderCode: null,

    createdByName: getUserData("userData")?.name,
    createdByRoleName: getUserData("userData")?.crm_role,
    createdByProfileName: getUserData("userData")?.crm_profile,
    createdByEmpCode: getUserData("userData")?.employee_code,
    createdByUuid: getUserData("loginData")?.uuid,

    modifiedByName: getUserData("userData")?.name,
    modifiedByRoleName: getUserData("userData")?.crm_role,
    modifiedByProfileName: getUserData("userData")?.crm_profile,
    modifiedByEmpCode: getUserData("userData")?.employee_code,
    modifiedByUuid: getUserData("loginData")?.uuid,
    status: "",
    approvalStatus: ""
  };

  const HardwareConstant = [
    {
      productKey: '',
      productName: 'Hardware Details',
      productDataList: [],
      productTable: [
        { field: "productItemName", isEditable: false, value: '', label: "Product Details" },
        { field: 'productType', isEditable: false, value: '', label: "Product Type" },
        { field: 'productItemQuantity', isEditable: false, value: '', label: "Total Units" },
        { field: 'implementedUnit', isEditable: true, type: 'number', value: '', label: "Units to be Implemented" },
      ]
    },
    {
      productKey: '',
      productName: 'Hardware Content Details',
      productDataList: [],
      productTable: [
        { field: 'productItemName', isEditable: false, value: '', label: "Product Details" },
        { field: 'productType', isEditable: false, value: '', label: "Product Type" },
        { field: 'productUnit', isEditable: false, value: '', label: "Total Units to be Implemented" },
        { field: 'class', isEditable: false, type: "dropdown", value: '', label: "Class" },
        { field: 'implementedUnit', isEditable: true, type: 'number', value: '', label: "Units to be Implemented" },
      ]
    },
  ]

  const LicenseTable = ["Product Details", "Duration", "Units To Be Implemented"]


  const getChildListHandler = async () => {
    setIsLoading(true)
    let params = { params: { boardId: 180, syllabusId: 180 } };
    await getChildList(params)
      .then((res) => {
        let classFormattedData = [];
        res?.data?.data?.child_list.forEach((element) => {
          classFormattedData.push({
            value: element.syllabus_id,
            label: element.name,
            isDisabled: false,
          });
        });
        setClassSelectData(classFormattedData);
        setIsLoading(false)
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getChildListHandler();
        }
        console.error(err?.response);
      });
  };

  function doesObjectExistInArray(array, objectToFind) {
    return array.some(
      (item) => JSON.stringify(item) === JSON.stringify(objectToFind)
    );
  }

  const checkStatusValue = (arr, val_one, val_two) => {
    for (let i = 0; i < arr?.length; i++) {
      if (Number(i[val_one]) !== Number(i[val_two])) {
        return false
      }
    }
    return true
  }

  const [batchData, setBatchData] = useState([])

  let totalProductCode = []

  const fetchQuotation = async (quoteCode, quotationArr) => {
    setIsLoading(true)
    // let createProductFields = {
    //     createdByName: getUserData("userData")?.name,
    //     createdByRoleName: getUserData("userData")?.crm_role,
    //     createdByProfileName: getUserData("userData")?.crm_profile,
    //     createdByEmpCode: getUserData("userData")?.employee_code,
    //     createdByUuid: getUserData("loginData")?.uuid,
    //     modifiedByName: getUserData("userData")?.name,
    //     modifiedByRoleName: getUserData("userData")?.crm_role,
    //     modifiedByProfileName: getUserData("userData")?.crm_profile,
    //     modifiedByEmpCode: getUserData("userData")?.employee_code,
    //     modifiedByUuid: getUserData("loginData")?.uuid,
    //     productsField: ProductDetails

    //   }
    //   await createProductField(createProductFields)

    let getPro = await getProductField()
    let getProductTables = getPro?.result[0]?.productsField

    // console.log(getProductTables)

    let getTotalProductTable = []
    for (let i = 0; i < totalProductCode?.length; i++) {
      let table = getProductTables.find((table) => table.productKey === totalProductCode[i])
      getTotalProductTable.push(table)
    }

    let impResult = await fetchImplementationList(quoteCode);
    let { hardwareDetails, hardwareContentDetails, software, serviceData, implementationList } = impResult
    setConsumeProduct(software)
    setConsumeHardwareDetails(hardwareDetails)
    setConsumedHardwareContentDetails(hardwareContentDetails)
    setImplementationList(implementationList)

    let totalSoftwareProduct = []
    let softwares = [];
    let hardwares = [];
    let services = [];
    let count = 0;
    let totalProductTable = []
    let quotationList = []
    let hardwareDetailArr = []
    let hardwareContentDetailArr = []

    let academicStartYear = purchaseOrderDetail?.agreementStartDate?.slice(0, 4)
    let academicEndYear = purchaseOrderDetail?.agreementEndDate?.slice(0, 4)
    let academicYear = `${academicStartYear}-${academicEndYear}`

    quotationArr?.map(async (obj, index) => {
      let hardwareDetail = {
        productItemName: "",
        productType: "",
        implementedUnit: "",
        hardwareId: "",
        hardwareType: "Stand Alone",
        productName: 'Hardware Details',
        productItemQuantity: 0,
        productItemImpPrice: 0,
        productItemSalePrice: "",
        totalProductUnit: "",
        productItemTotalPrice: "",
        productItemMrp: "",
        productItemMop: "",
        quotationFor: "",
        itemVariantName: "",
        productItemRefId: ""

      };
      let hardwareContentDetail = {
        productItemName: "",
        productType: "Stand Alone",
        productName: 'Hardware Content Details',
        productUnit: "",
        class: "",
        hardwareId: "",
        position: 0,
        hardwareType: "",
        implementedUnit: "",
      };
      if (obj?.productItemCategory === "Service" && !doesObjectExistInArray(services, obj)) {
        let serviceDetail = {
          productItemMop: obj.productItemMop,
          productItemMrp: obj.productItemMrp,
          productItemName: obj.productItemName,
          productItemQuantity: obj?.productItemQuantity || 1,
          productItemDuration: obj?.productItemDuration || "",
          totalDurationUnits: obj?.productItemDuration,
          productItemSalePrice: Number(obj.productItemSalePrice),
          productItemTotalPrice: Number(obj.productItemTotalPrice),
          serviceId: obj._id,
          implementedUnit: "",
          productItemImpPrice: 0,
          quotationFor: obj.quotationFor,
          productItemCategory: obj.productItemCategory,
          productItemRefId: Number(obj.productItemRefId) || ""
        }
        if (!implementationList?.length) {
          serviceDetail.productItemDuration = Number(obj.productItemDuration)
        } else {
          serviceData?.map((product) => {
            if (product.id === obj._id) {
              serviceDetail.productItemDuration = Number(obj.productItemDuration) - Number(product.consumeUnits)
            }
          })
        }
        quotationList.push({ id: obj._id, totalUnit: serviceDetail.productItemQuantity })
        services.push(serviceDetail);
      }
      if (obj?.productItemCategory === "Software" && !doesObjectExistInArray(softwares, obj)) {
        // console.log(obj)
        let productFetched = getTotalProductTable.find((table) => table.productKey === obj?.productCode)
        let productObject = {}
        productObject.leadId = obj?.leadId
        productObject.productRefCode = obj?.productCode
        productObject.grades = obj?.grades
        productObject.payCount = obj?.payCount
        productObject.quotationFor = obj?.quotationFor
        productObject.productItemRefId = Number(obj?.productItemRefId) || '';
        productObject.productItemMop = Number(obj?.productItemMop);
        productObject.productItemMrp = Number(obj?.productItemMrp);
        productObject.productItemDiscount = Number(obj?.productItemDiscount);
        productObject.productItemDuration = Number(obj?.productItemDuration || obj.duration);
        productObject.boardID = obj?.boardID;
        productObject.classID = obj?.classID;
        productObject.className = obj?.className;
        productObject.ratePerUnit = obj?.ratePerMonth || obj?.ratePerUnit;
        productObject.productId = obj._id || "";
        productObject.groupName = obj?.groupName || '';
        productObject.productName = obj?.productName || '';
        productObject.productCode = obj?.productCode || '';
        productObject.groupCode = obj?.groupCode || '';
        productObject.productItemSalePrice = Number(obj?.productItemSalePrice) || '';
        productObject.productItemImpPrice = 0;
        productObject.productItemQuantity = "";
        productObject.productItemTotalPrice = Number(obj?.productItemTotalPrice) || '';
        productObject.academicYear = academicYear || "";
        productObject.batchLanguage = ""
        productObject.batchTiming = ""
        productObject.productItemCategory = obj.productItemCategory

        productFetched.productTable.map((table) => {
          if (!table.isEditable) {
            if (table.field === 'academicYear') {
              productObject[table.field] = academicYear
            } else {
              productObject[table.field] = obj[table.field]
            }
          } if (table.dynamicUnit) {
            setDynamic([...dynamic, table])
            productObject.productItemQuantity = obj[table.field] || 0
            if (!implementationList?.length) {
              productObject[table.field] = obj[table.field] || 0;
            } else {
              software.map((product) => {
                if (product.id === obj._id) {
                  productObject[table.field] = Number(obj[table.field]) - Number(product.consumeUnits)
                }
              })
            }
          }
        })
        quotationList.push({ id: obj._id, totalUnit: productObject.productItemQuantity })
        softwares.push(productObject);

        if (!totalSoftwareProduct.includes(obj.productName)) {
          totalSoftwareProduct.push(obj.productName)
        }

      }
      if (obj?.productItemCategory === "Hardware" && !doesObjectExistInArray(hardwares, obj)) {

        quotationList.push({ id: obj._id, totalUnit: obj?.productItemQuantity })
        hardwareDetail.productItemRefId = Number(obj?.productItemRefId) || '';
        hardwareDetail.productItemMrp = obj.productItemMrp;
        hardwareDetail.productItemMop = obj.productItemMop;
        hardwareDetail.quotationFor = obj.quotationFor;
        hardwareDetail.itemVariantName = obj.itemVariantName;
        hardwareDetail.productItemName = obj.productItemName;
        hardwareDetail.productType = "Stand Alone";
        hardwareDetail.hardwareId = obj._id;
        hardwareDetail.hardwareType = obj.hardwareItemProductType;
        hardwareDetail.totalProductUnit = Number(obj.productItemQuantity);
        hardwareDetail.productItemSalePrice = Number(obj?.productItemSalePrice) || '';
        hardwareDetail.productItemTotalPrice = Number(obj?.productItemTotalPrice) || '';
        hardwareDetail.productItemCategory = obj.productItemCategory

        if (!implementationList?.length) {
          hardwareDetail.productItemQuantity = Number(obj?.productItemQuantity) || 0;
        } else {
          hardwareDetails.map((product) => {
            if (product.id === obj._id) {
              hardwareDetail.productItemQuantity = Number(obj?.productItemQuantity) - Number(product.consumeUnits);
            }
          })
        }
        hardwareDetailArr.push(hardwareDetail)
        if (obj.hardwareItemProductType === 'Bundle') {
          hardwareContentDetail.productItemName = obj.productItemName;
          hardwareContentDetail.productType = "Stand Alone";
          hardwareContentDetail.hardwareId = obj._id;
          hardwareContentDetail.hardwareType = obj.hardwareItemProductType
          hardwareContentDetail.position = count++;
          hardwareContentDetailArr.push(hardwareContentDetail)
        }
      }

    });

    let academicDataArr = []

    let dummyAcademicData = [
      {
        batch_language: "English Medium",
        batch_details: [
          { batch_id: 33, batch_start_date: "2021-10-08" },
          { batch_id: 158, batch_start_date: "2020-07-15" },
          { batch_id: 174, batch_start_date: "2021-10-07" },
          { batch_id: 177, batch_start_date: "2020-08-19" },
          { batch_id: 198, batch_start_date: "2020-08-08" },
          { batch_id: 200, batch_start_date: "2020-08-09" },
          { batch_id: 201, batch_start_date: "2020-08-10" },
          { batch_id: 229, batch_start_date: "2021-09-09" },
          { batch_id: 248, batch_start_date: "2021-09-29" },
          { batch_id: 249, batch_start_date: "2020-11-02" },
        ],
      },
      {
        batch_language: "Bilingual Batch",
        batch_details: [
          { batch_id: 278, batch_start_date: "2021-04-30" },
          { batch_id: 282, batch_start_date: "2021-04-30" },
          { batch_id: 288, batch_start_date: "2021-04-30" },
          { batch_id: 297, batch_start_date: "2021-05-03" },
          { batch_id: 316, batch_start_date: "2021-05-10" },
          { batch_id: 317, batch_start_date: "2021-05-12" },
          { batch_id: 164, batch_start_date: "2020-07-22" },
          { batch_id: 219, batch_start_date: "2021-09-21" },
        ],
      },
    ]

    for (let i = 0; i < quotationArr?.length; i++) {

      if (quotationArr[i]?.groupCode === 'sip') {

        let academicDetail = {
          uuid: getUserData("userData")?.lead_id,
          package_id: quotationArr[i]?.productItemRefId,
          board_id: quotationArr[i]?.boardID,
          class_id: quotationArr[i]?.classID,
          academic_year: academicYear
        }

        if (quotationArr[i]?.productCode === 'sip_live_class') {

          academicDetail.batch_for = ["b2b", "hybrid"]

          if (quotationArr[i]?.quotationFor === "ACTUAL") {
            academicDetail.batch_category = ["live", "dual"]
          }

          if (quotationArr[i]?.quotationFor === "DEMO") {
            academicDetail.batch_category = ["demo"]
          }

          await listBatchDetails(academicDetail).then((res) => {
            if (res.data.status === 1) {
              academicDataArr.push({ productCode: quotationArr[i]?.productCode, productId: quotationArr[i]?._id, data: res?.data?.batch_list_details?.length ? res?.data?.batch_list_details : dummyAcademicData })
            }
          }).catch((e) => {
            console.log("ERROR", e)
          })
        }
        if (quotationArr[i]?.productCode === 'retail_live_class') {
          academicDetail.batch_for = ["retail"]

          if (quotationArr[i]?.quotationFor === "ACTUAL") {
            academicDetail.batch_category = ["live", "dual"]
          }
          if (quotationArr[i]?.quotationFor === "DEMO") {
            academicDetail.batch_category = ["demo"]
          }

          await listBatchDetails(academicDetail).then((res) => {
            if (res.data.status === 1) {
              academicDataArr.push({ productCode: quotationArr[i]?.productCode, productId: quotationArr[i]?._id, data: res?.data?.batch_list_details?.length ? res?.data?.batch_list_details : dummyAcademicData })
            }
          }).catch((e) => {
            console.log("ERROR", e)
          })
        }
      }
    }

    getProductTables.map((product) => {
      softwares.map((software) => {
        if (product.productKey === software.productCode) {
          product.productDataList.push(software)
        }
      })
    })

    getProductTables.map((product) => {
      if (totalSoftwareProduct.includes(product.productName)) {
        totalProductTable.push(product)
      }
    })

    let newArr = HardwareConstant.map((product) => {
      if (product.productName === 'Hardware Details') {
        product.productDataList.push(...hardwareDetailArr)
        return product
      }
      if (product.productName === 'Hardware Content Details') {
        product.productDataList.push(...hardwareContentDetailArr)
        return product
      }
    })

    totalProductTable.forEach((product) => {
      academicDataArr?.map((obj) => {
        if (product.productKey === obj.productCode) {
          product?.productDataList?.map((item) => {
            if (item.productId === obj.productId) {

              let batchLanguage = []
              let batchTiming = []

              obj?.data?.map((batch) => {
                batchLanguage.push(batch.batch_language)
                batchTiming.push(...batch.batch_details)
              })
              // setBatchLang(batchLanguage)
              // item.batchLanguage = batchLanguage
              item.duplicateBatchLang = batchLanguage
              item.duplicateBatchTiming = batchTiming
              return item
            }
            return item
          })
          return obj
        }
        return obj
      })
      return product
    })

    setBatchData(academicDataArr)
    setSoftwareProductTable(totalProductTable)
    setHardwareProductTable(newArr)
    setQuotationInfo(quotationList)
    setServiceTable(services)
    setIsLoading(false)

  };

  const productDropdownHandler = (e, val, obj, row) => {
    let batchTimingArr = []
    batchData?.map((batch) => {
      if (batch.productId === obj.productId) {
        batch.data.map((item) => {
          if (item['batch_language'] === val) {
            batchTimingArr.push(...item['batch_details'])
          }
        })
      }
    })

    let newProductArr = softwareProductTable.map((product) => {
      if (product.productKey === obj.productCode) {
        product.productDataList.map((item) => {
          if (item.productId === obj.productId) {
            if (row['field'] === "batchLanguage") {
              item[row['field']] = val
              item.batchTiming = batchTimingArr
            } else {
              item[row['field']] = val
            }
          }
        })
      }
      return product
    })
    setSoftwareProductTable(newProductArr)
  }

  const schoolInformation = async () => {
    setIsLoading(true)
    await getSchoolBySchoolCode(schoolCode)
      .then((res) => {
        setSchoolDetail(res?.result);
        if (Object.entries(res?.result?.contactDetails[0])?.length == 0) {
          setContactDetails(
            [
              { name: "Add More", editTextField: true },
            ] || []
          );
        } else {
          setContactDetails(
            [
              ...res?.result?.contactDetails,
              { name: "Add More", editTextField: true },
            ] || []
          );
        }

        setIsLoading(false)
      })
      .catch((e) => console.log(e));
  };

  const submitHandler = async (values, { isSubmitting }) => {
    let hardwareDetails = []
    let hardwareContentDetails = []

    hardwareProductTable?.map((hardware) => {
      if (hardware?.productName === "Hardware Details") {
        hardwareDetails.push(...hardware?.productDataList)
      }
      if (hardware?.productName === "Hardware Content Details") {
        hardwareContentDetails.push(...hardware?.productDataList)
      }
    })

    let newSoftwareContent = []

    softwareProductTable?.map((software) => {
      if (software?.productDataList?.length) {
        newSoftwareContent.push(...software?.productDataList)
      }
    })

    values.hardwareContentDetails = hardwareContentDetails
    values.hardwareDetails = hardwareDetails
    values.productDetails = newSoftwareContent
    values.serviceDetails = serviceTable

    values.productDetails.forEach((obj) => {
      obj.implementedUnit = Number(obj.implementedUnit)
      obj.productItemQuantity = Number(obj.productItemQuantity)
      obj.productItemImpPrice = Number(obj.productItemImpPrice)
    })

    values.hardwareDetails.forEach((obj) => {
      obj.implementedUnit = Number(obj.implementedUnit)
      obj.productItemQuantity = Number(obj.productItemQuantity)
      obj.productItemImpPrice = Number(obj.productItemImpPrice)
    })

    values.hardwareContentDetails.forEach((obj) => {
      obj.implementedUnit = Number(obj.implementedUnit)
      obj.productUnit = Number(obj.productUnit)
    })

    if (values) {
      values.noOfCordinators = Number(values.noOfCordinators)
      values.schoolCode = schoolDetail?.schoolCode || null;
      values.schoolName = schoolDetail?.schoolName || null;
      values.schoolPinCode = schoolDetail?.pinCode || null;
      values.schoolAddress = schoolDetail?.address || null;
      values.schoolEmailId = schoolDetail?.schoolEmailId || null;
      values.schoolCountryCode = schoolDetail?.countryCode || null;
      values.schoolCountryName = schoolDetail?.country || null;
      values.schoolType = schoolDetail?.typeOfInstitute || null;
      values.schoolStateCode = schoolDetail?.stateCode || null;
      values.schoolStateName = schoolDetail?.state || null;
      // values.schoolCityCode = "";
      values.schoolCityName = schoolDetail?.city || null;
      values.schoolId = schoolDetail?.leadId || null;
      values.purchaseOrderCode = purchaseOrderCode || null;
    }
    let implementationData = { ...values };
    let poData = await getPurchaseOrderDetails(purchaseOrderCode)
    poData = poData?.result
    let impCountValue = impCount + 1;
    let totalDigits = `${impCountValue}`?.length;
    let code;
    if (totalDigits < 2) {
      let paddedCount = `00${impCountValue}`;
      code = `IMP-${purchaseOrderCode.slice(0, 2) + purchaseOrderCode.slice(-3)}-${paddedCount}`;
    } else if (totalDigits < 3) {
      let paddedCount = `0${impCountValue}`;
      code = `IMP-${purchaseOrderCode.slice(0, 2) + purchaseOrderCode.slice(-3)}-${paddedCount}`;
    } else {
      code = `IMP-${purchaseOrderCode.slice(0, 2) + purchaseOrderCode.slice(-3)}-${impCountValue}`;
    }
    let impNumber = code
    let packageDetails = implementationData?.productDetails

    let packageActivationData = {
      school_code: implementationData?.schoolCode,
      implementation_id: impNumber,
      po_code: implementationData?.purchaseOrderCode,
      quotation_code: implementationData?.quotationCode,
      school_email: implementationData?.schoolAdminSPOCEmail,
      school_mobile: `+91-${implementationData?.schoolAdminSPOCPhnNo}`,
      lecture_mode: "impartus",
      coordinator_count: Number(implementationData?.noOfCordinators),
      city: implementationData?.schoolCityName,
      country: implementationData?.schoolCountryName || "India",
      country_code: 91,
      country_id: 99,
      state: implementationData?.schoolStateName,
      activation_type: packageDetails[0].quotationFor === 'ACTUAL' ? 1 : 2,
      package_details: [],
      uuid: getUserData("loginData")?.uuid
    }

    packageDetails.map((item) => {
      let agreementEnd = new Date(poData?.agreementEndDate)
      agreementEnd = agreementEnd.toISOString().split('T')[0];
      if (item.productCode === 'esc_plus_basic' || item.productCode === 'esc_plus_pro' || item.productCode === 'esc_plus_advanced') {
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          student_count: Number(item.studentCount),
          teacher_count: Number(item?.teacherCount) || 0,
          esc_count: Number(item.implementedUnit),
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: []
            }]
          }]
        }

        packageActivationData.package_details.push(productObject)
      } else if (item.productCode === 'sip_live_class') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: Number(item.implementedUnit),
          teacher_count: "",
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)
      } else if (item.productCode === 'retail_live_class') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: Number(item.implementedUnit),
          teacher_count: "",
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]
        }
        packageActivationData.package_details.push(productObject)

      } else if (item.productCode === 'em_power') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: Number(item.studentCount),
          teacher_count: Number(item.teacherCount),
          esc_count: Number(item.implementedUnit),
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)

      } else if (item.productCode === 'self_study') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: Number(item.implementedUnit),
          teacher_count: "",
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)

      } else if (item.productCode === 'la') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: Number(item.implementedUnit),
          teacher_count: "",
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)

      } else if (item.productCode === 'toa') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: Number(item.implementedUnit),
          teacher_count: "",
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)

      } else if (item.productCode === 'teaching_app') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: "",
          teacher_count: Number(item.implementedUnit),
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)

      } else if (item.productCode === 'assement_centre') {
        let batchId = item?.batchTiming?.batch_id || null
        let productObject = {
          product_code: item.productCode,
          package_id: item?.productItemRefId || '',
          validity: agreementEnd || poData?.agreementEndDate?.slice(0, 10),
          mrp: Number(item.productItemMrp),
          mop: Number(item.productItemMop),
          selling_price: Number(item.productItemSalePrice),
          version: "",
          student_count: "",
          teacher_count: Number(item.implementedUnit),
          esc_count: "",
          syllabus_details: [{
            board_id: item.boardID,
            class_details: [{
              class_id: item.classID,
              batch_ids: batchId ? [batchId] : []
            }]
          }]

        }
        packageActivationData.package_details.push(productObject)
      }
    })

    let new_package_details = packageActivationData?.package_details

    let packageActivationObj = {}

    for (let i = 0; i < new_package_details?.length; i++) {
      if (packageActivationObj.hasOwnProperty(new_package_details[i]?.package_id)) {
        packageActivationObj[new_package_details[i]?.package_id]['mrp'] += new_package_details[i].mrp
        packageActivationObj[new_package_details[i]?.package_id]['mop'] += new_package_details[i].mop
        packageActivationObj[new_package_details[i]?.package_id]['selling_price'] += new_package_details[i].selling_price
        packageActivationObj[new_package_details[i]?.package_id]['syllabus_details'] = [...packageActivationObj[new_package_details[i]?.package_id]['syllabus_details'], ...new_package_details[i].syllabus_details]
        let syllabusDetails = packageActivationObj[new_package_details[i]?.package_id]['syllabus_details']
        let syllabusObj = {}
        for (let i = 0; i < syllabusDetails?.length; i++) {
          if (syllabusObj.hasOwnProperty(syllabusDetails[i].board_id)) {
            syllabusObj[syllabusDetails[i].board_id]['class_details'] = [...syllabusObj[syllabusDetails[i].board_id]['class_details'], ...syllabusDetails[i].class_details]
          } else {
            syllabusObj[syllabusDetails[i].board_id] = syllabusDetails[i]
          }
        }
        syllabusObj = Object.values(syllabusObj)
        packageActivationObj[new_package_details[i]?.package_id]['syllabus_details'] = [...syllabusObj]
        if (new_package_details[i].product_code === 'esc_plus_basic' || new_package_details[i].product_code === 'esc_plus_pro' || new_package_details[i].product_code === 'esc_plus_advanced') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
          packageActivationObj[new_package_details[i]?.package_id]['teacher_count'] += Number(new_package_details[i].teacher_count)
          packageActivationObj[new_package_details[i]?.package_id]['esc_count'] += new_package_details[i].esc_count
        }
        else if (new_package_details[i].product_code === 'sip_live_class') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
        }
        else if (new_package_details[i].product_code === 'retail_live_class') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
        }
        else if (new_package_details[i].product_code === 'em_power') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
          packageActivationObj[new_package_details[i]?.package_id]['teacher_count'] += Number(new_package_details[i].teacher_count)
          packageActivationObj[new_package_details[i]?.package_id]['esc_count'] += new_package_details[i].esc_count
        }
        else if (new_package_details[i].product_code === 'self_study') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
        }
        else if (new_package_details[i].product_code === 'la') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
        }
        else if (new_package_details[i].product_code === 'toa') {
          packageActivationObj[new_package_details[i]?.package_id]['student_count'] += new_package_details[i].student_count
        }
        else if (new_package_details[i].product_code === 'teaching_app') {
          packageActivationObj[new_package_details[i]?.package_id]['teacher_count'] += Number(new_package_details[i].teacher_count)
        }
        else if (new_package_details[i].product_code === 'assement_centre') {
          packageActivationObj[new_package_details[i]?.package_id]['teacher_count'] += Number(new_package_details[i].teacher_count)
        }
      } else {
        packageActivationObj[new_package_details[i]?.package_id] = new_package_details[i]
      }
    }

    packageActivationObj = Object.values(packageActivationObj)
    packageActivationData.package_details = packageActivationObj
    let packageActivatedStatus = await packageActivation(packageActivationData)

    if (packageActivatedStatus?.data?.status === 0) {
      toast.error(packageActivatedStatus?.data?.message)
      isSubmitting(false);
    }
    if (packageActivatedStatus?.data?.status === 1) {

      hardwareContentDetails.forEach((obj) => {
        delete obj.productName
        delete obj.position
        return obj
      })

      let totalHardwareAmount = 0

      hardwareDetails.forEach((obj) => {
        obj.productItemQuantity = obj.totalProductUnit;
        obj.productItemImpPrice = Number(((Number(obj.productItemSalePrice) * Number(obj.implementedUnit)) / Number(obj.productItemQuantity)).toFixed(2))
        totalHardwareAmount = totalHardwareAmount + obj.productItemImpPrice
        delete obj.totalProductUnit
        delete obj.productName
        return obj
      })

      let teacherCountObj = {}

      let totalSoftwareAmount = 0

      newSoftwareContent.forEach((obj) => {
        if (obj?.teacherCount) {
          teacherCountObj[obj?.productItemRefId] = obj?.teacherCount
        }
        obj[dynamic[0].field] = obj.productItemQuantity;
        obj.productItemImpPrice = Number(((Number(obj.productItemSalePrice) * Number(obj.implementedUnit)) / Number(obj.productItemQuantity)).toFixed(2))
        totalSoftwareAmount = totalSoftwareAmount + obj.productItemImpPrice

        if ('studentCount' in obj) {
          obj['studentCount'] = Number(obj['studentCount'])
        }
        if ('teacherCount' in obj) {
          obj['teacherCount'] = Number(obj['teacherCount'])
        }
        if ('escUnit' in obj) {
          obj['escUnit'] = Number(obj['escUnit'])
        }
        if ('numberOfUnits' in obj) {
          obj['numberOfUnits'] = Number(obj['numberOfUnits'])
        }
        if ('duration' in obj) {
          obj['duration'] = Number(obj['duration'])
        }
        if ('studentUnit' in obj) {
          obj['studentUnit'] = Number(obj['studentUnit'])
        }
        if ('payCount' in obj) {
          obj['payCount'] = Number(obj['payCount'])
        }
        if ('teacherUnits' in obj) {
          obj['teacherUnits'] = Number(obj['teacherUnits'])
        }
        delete obj.duplicateBatchLang
        delete obj.duplicateBatchTiming
        return obj
      })

      let teacherCountArr = Object.entries(teacherCountObj).map(([key, value]) => ({ [key]: value }));

      let totalServiceAmount = 0

      serviceTable.forEach((obj) => {
        obj.productItemDuration = Number(obj.totalDurationUnits);
        obj.implementedUnit = Number(obj.implementedUnit);
        obj.productItemImpPrice = Number(((Number(obj.productItemSalePrice) * Number(obj.implementedUnit)) / Number(obj.productItemQuantity)).toFixed(2))
        totalServiceAmount = totalServiceAmount + obj.productItemImpPrice

        delete obj.totalDurationUnits
        return obj
      })

      newSoftwareContent.forEach((obj) => {
        for (let i = 0; i < teacherCountArr.length; i++) {
          if (!obj?.teacherCount && teacherCountArr[i].hasOwnProperty([obj.productItemRefId])) {
            obj.teacherCount = teacherCountArr[i][obj.productItemRefId]
          }
        }
        return obj
      })

      let totalAmount = totalHardwareAmount + totalServiceAmount + totalSoftwareAmount

      implementationData.hardwareContentDetails = hardwareContentDetails
      implementationData.hardwareDetails = hardwareDetails
      implementationData.productDetails = newSoftwareContent
      implementationData.serviceDetails = serviceTable
      implementationData.totalHardwareContractAmount = totalHardwareAmount
      implementationData.totalServicesContractAmount = totalServiceAmount
      implementationData.totalSoftwareContractAmount = totalSoftwareAmount
      implementationData.totalContractAmount = totalAmount

      if (poData.approvalStatus === "Approved") {
        if(implementationData.productDetails.length>1 && implementationData.hardwareDetails.length>1){
          implementationData.status = "Pending for Engineer Assignment"
          implementationData.stage ="Site Survey"
        }else{
          implementationData.status = "Software Activated"
          implementationData.stage ="Implementation"
        }
        implementationData.approvalStatus = "Approved"
        implementationData.activationResponse = [packageActivatedStatus?.data]
        implementationData.packageActivation = true
        implementationData.impFormNumber = impNumber

        await implementationCompleteForm(implementationData)
          .then(async (res) => {
            let impResult = await fetchImplementationList(quotationCode, 'noLoop');
            let { hardwareDetails, software, serviceData, implementationList } = impResult
            let checkHardwareDetails = isImplementationCompletelyFilled(hardwareDetails)
            let checkSoftware = isImplementationCompletelyFilled(software)
            let checkService = isImplementationCompletelyFilled(serviceData)

            let updatePOData = {
              referenceCode: purchaseOrderCode,
              modifiedByName: getUserData("userData")?.name,
              modifiedByRoleName: getUserData("userData")?.crm_role,
              modifiedByProfileName: getUserData("userData")?.crm_profile,
              modifiedByEmpCode: getUserData("userData")?.employee_code,
              modifiedByUuid: getUserData("loginData")?.uuid,
            }
            if (checkHardwareDetails && checkSoftware && checkService) {
              updatePOData.status = "Filled"
            } else {
              updatePOData.status = "Partially Implemented"
            }
            await updatePurchaseOrderStatus(updatePOData).then((res) => console.log("Success")).catch((e) => console.log(e))
          })
          .catch((e) => console.log(e));
      }
      navigate("/authorised/implementationList");
    }

  };


  const isImplementationCompletelyFilled = (arr) => {
    for (let i = 0; i < arr?.length; i++) {
      let quote = quotationInfo?.find((obj => obj.id === arr[i].id))
      if (Number(quote.totalUnit) !== Number(arr[i].consumeUnits)) {
        return false
      }
    }
    return true
  }

  const newlyAddedRow = (row) => {
    let newProductDataList = []
    hardwareProductTable.map((product) => {
      if (product.productName === row.productName) {
        newProductDataList.push(...product.productDataList)
      }
    })

    for (let i = 0; i < newProductDataList?.length; i++) {
      if (!newProductDataList[i].class && !newProductDataList[i].implementedUnit) {
        toast.error("Please Fill Both Fields");
        return;
      }
    }

    let totalImpUnit = newProductDataList
      .filter((obj) => obj.hardwareId === row.hardwareId)
      .reduce((sum, obj) => Number(sum) + Number(obj.implementedUnit), 0);

    if (totalImpUnit < Number(row.productUnit)) {

      let newRow = {
        ...row,
        implementedUnit: "",
        class: "",
        position: row.position + 1,
      };
      newProductDataList.splice(row.position + 1, 0, newRow);
      let newArrHardwareBundle = newProductDataList.map(
        (bundle, index) => {
          let newBundle = { ...bundle };
          newBundle.position = index;
          return newBundle;
        }
      );
      let newHardwareProTable = hardwareProductTable.map((product) => {
        if (product.productName === row.productName) {
          product.productDataList = newArrHardwareBundle
        }
        return product
      })
      setHardwareProductTable([...newHardwareProTable]);
    } else {
      toast.error("Total Units are all covered");
    }

  }

  const addNewRow = (row) => {
    if (Number(row.implementedUnit) === 0) {
      toast.error("Implementation Could Not be 0");
      return;
    }

    if (!row.implementedUnit || !row.class) {
      toast.error("Please Fill Both Fields");
      return;
    }
    else {
      newlyAddedRow(row)
    }
  };

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const validationSchema = Yup.object().shape({
    // contractSigningdate: Yup.date()
    //   .nullable()
    //   .required("contractSigningdate is required"),
    // billingDate: Yup.date().nullable().required("billingDate is required"),
    schoolPaymentSPOCName: Yup.string()
      .matches(/^[a-zA-Z]+[a-zA-Z. ]*$/, 'Invalid format').required('Input field is required'),
    schoolImplementationSPOCName: Yup.string()
      .matches(/^[a-zA-Z]+[a-zA-Z. ]*$/, 'Invalid format').required('Input field is required'),
    schoolAdminSPOCName: Yup.string()
      .matches(/^[a-zA-Z]+[a-zA-Z. ]*$/, 'Invalid format').required('Input field is required'),
    schoolAdminSPOCEmail: Yup.string().matches(emailRegex, 'Invalid email address').required('Email is required'),
    schoolImplementationSPOCEmail: Yup.string().matches(emailRegex, 'Invalid email address').required('Email is required'),
    schoolPaymentSPOCEmail: Yup.string().matches(emailRegex, 'Invalid email address').required('Email is required'),

    schoolAdminSPOCPhnNo: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),

    schoolImplementationSPOCPhnNo: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),

    schoolPaymentSPOCPhnNo: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),

    implementationStartDate: Yup.date()
      .nullable()
      .required("implementationStartDate is required"),

    implementationEndDate: Yup.date()
      .nullable()
      .required("implementationEndDate is required"),
  });


  const handleLicenseChange = (e, row, fieldName) => {
    let newArr = softwareProductTable.map((product) => {
      if (product.productName === row.productName) {
        product.productDataList.map((obj) => {
          if (row.productId === obj.productId) {
            if (fieldName === 'implementedUnit') {
              if (Number(row['numberofClassroom']) < Number(e.target.value)) {
                toast.error(`${row['numberofClassroom']} Unit Only Have`);
                return
              }
              else if (Number(row[dynamic[0]?.field]) < Number(e.target.value)) {
                toast.error(`${Number(row[dynamic[0].field])} Unit Only Have`);
                return
              } else {
                obj[fieldName] = Number(e.target.value);
              }

            } else {
              obj[fieldName] = Number(e.target.value);
            }
          }
          return obj
        })
      }
      return product;
    });
    setSoftwareProductTable([...newArr]);
  };

  const handleImplementedUnit = (e, row, fieldName) => {
    if (row.productUnit) {
      hardwareProductTable.map((product) => {
        if (row.productName === product.productName) {
          let newProductDataList = product?.productDataList
          let totalImpUnit = newProductDataList
            .filter((obj) => obj.hardwareId === row.hardwareId)
            .reduce((sum, obj) => Number(sum) + Number(obj.implementedUnit), 0);

          if (totalImpUnit + Number(e.target.value) > Number(row.productUnit)) {
            toast.error(`${Number(row.productUnit) - Number(totalImpUnit)} Implemented Unit only left`);
          } else {
            let newArr = newProductDataList.map((hardware) => {
              if (row.position === hardware.position) {
                hardware["implementedUnit"] = e.target.value;
                return hardware
              }
              return hardware;
            });
            let newHardwareProTable = hardwareProductTable.map((product) => {
              if (row.productName === product.productName) {
                product.productDataList = newArr
              }
              return product
            })
            setHardwareProductTable([...newHardwareProTable]);
          }
        }
      })
    } else {
      let newArr = hardwareProductTable.map((product) => {
        if (row.productName === product.productName) {
          product.productDataList.map((obj) => {
            if (row.hardwareId === obj.hardwareId) {
              if (Number(e.target.value) > Number(row?.productItemQuantity)) {
                toast.error(`${Number(row?.productItemQuantity)} Implemented Unit only have`);
                return;
              }
              else {
                obj[fieldName] = e.target.value;
                hardwareProductTable.forEach((pro) => {
                  if (pro.productName === 'Hardware Content Details') {
                    pro.productDataList.map((obj) => {
                      if (row.hardwareId === obj.hardwareId) {
                        obj['productUnit'] = e.target.value
                      }
                    })
                  }
                })
              }
            }
          })
        }
        return product
      })
      setHardwareProductTable([...newArr]);
    }
  };

  const renderClassOption = (props, option) => (
    <MenuItem
      {...props}
      key={option.value}
      disabled={option.isDisabled}
    >
      {option.label}
    </MenuItem>
  );

  const handleClass = (e, value, row) => {
    let newArr = hardwareProductTable.map((hardware) => {
      if (hardware.productName === row.productName) {
        hardware.productDataList.map((obj) => {
          if (obj.position === row.position) {
            obj['class'] = value.label
          }
        })
      }
      return hardware;
    });
    setHardwareProductTable([...newArr]);
    // let newClassSet = classSelectData.map((obj) => {
    //   if (value.label === obj.label) {
    //     obj.isDisabled = true
    //     return obj
    //   }
    //   return obj
    // })
    // setClassSelectData(newClassSet)
  };

  const adminHandler = (e, value, setFieldValue) => {
    if (value?.emailId) {
      setShowAdminTextFields(true);
      setFieldValue("isSchoolAdminSPOCFromMaster", true);
      setFieldValue("schoolAdminSPOCName", value.name);
      setFieldValue("schoolAdminSPOCPhnNo", value.mobileNumber);
      setFieldValue("schoolAdminSPOCEmail", value.emailId);
    } else if (value?.editTextField) {
      setShowAdminTextFields(true);
      setFieldValue("isSchoolAdminSPOCFromMaster", false);
      setFieldValue("schoolAdminSPOCName", "");
      setFieldValue("schoolAdminSPOCPhnNo", "");
      setFieldValue("schoolAdminSPOCEmail", "");
    } else {
      setShowAdminTextFields(false);
      setFieldValue("schoolAdminSPOCName", "");
      setFieldValue("schoolAdminSPOCPhnNo", "");
      setFieldValue("schoolAdminSPOCEmail", "");
    }
  }

  const impHandler = (e, value, setFieldValue) => {
    if (value?.emailId) {
      setShowImpTextFields(true);
      setFieldValue(
        "isSchoolImplementationSPOCFromMaster",
        true
      );
      setFieldValue("schoolImplementationSPOCName", value.name);
      setFieldValue(
        "schoolImplementationSPOCPhnNo",
        value.mobileNumber
      );
      setFieldValue(
        "schoolImplementationSPOCEmail",
        value.emailId
      );
    } else if (value?.editTextField) {
      setShowImpTextFields(true);
      setFieldValue(
        "isSchoolImplementationSPOCFromMaster",
        false
      );
      setFieldValue("schoolImplementationSPOCName", "");
      setFieldValue("schoolImplementationSPOCPhnNo", "");
      setFieldValue("schoolImplementationSPOCEmail", "");
    } else {
      setShowImpTextFields(false);
      setFieldValue("schoolImplementationSPOCName", "");
      setFieldValue("schoolImplementationSPOCPhnNo", "");
      setFieldValue("schoolImplementationSPOCEmail", "");
    }
  }

  const paymentHandler = (e, value, setFieldValue) => {
    if (value?.emailId) {
      setShowPaymentTextFields(true);
      setFieldValue("isSchoolPaymentFromSPOCMaster", true);
      setFieldValue("schoolPaymentSPOCName", value.name);
      setFieldValue(
        "schoolPaymentSPOCPhnNo",
        value.mobileNumber
      );
      setFieldValue("schoolPaymentSPOCEmail", value.emailId);
    } else if (value?.editTextField) {
      setShowPaymentTextFields(true);
      setFieldValue("isSchoolPaymentFromSPOCMaster", false);
      setFieldValue("schoolPaymentSPOCName", "");
      setFieldValue("schoolPaymentSPOCPhnNo", "");
      setFieldValue("schoolPaymentSPOCEmail", "");
    } else {
      setShowPaymentTextFields(false);
      setFieldValue("schoolPaymentSPOCName", "");
      setFieldValue("schoolPaymentSPOCPhnNo", "");
      setFieldValue("schoolPaymentSPOCEmail", "");
    }
  }

  const [impCount, setImpCount] = useState(null)

  const fetchImplementationList = async (quotationCode, type) => {
    let impResult = await getImplementationById(quotationCode)
    let implementationList = impResult?.result
    if (!type) {
      setImpCount(implementationList?.length)
    }
    let finalProductDetailsArr = []
    let hardwareDetails = []
    let serviceArr = []

    implementationList?.map((imp) => {
      imp.productDetails?.map((currentItem) => {
        const existingItem = finalProductDetailsArr?.find(item => item.id === currentItem.productId);
        if (existingItem) {
          existingItem.consumeUnits = Number(existingItem.consumeUnits) + Number(currentItem.implementedUnit);
        } else {
          finalProductDetailsArr?.push({ id: currentItem.productId, consumeUnits: Number(currentItem.implementedUnit) })
        }
      })

      imp.hardwareDetails?.map((currentItem) => {
        const existingItem = hardwareDetails?.find(item => item.id === currentItem.hardwareId);
        if (existingItem) {
          existingItem.consumeUnits = Number(existingItem.consumeUnits) + Number(currentItem.implementedUnit);
        } else {
          hardwareDetails?.push({ id: currentItem.hardwareId, consumeUnits: Number(currentItem.implementedUnit) })
        }
      })

      imp.serviceDetails?.map((currentItem) => {
        const existingItem = serviceArr?.find(item => item.id === currentItem.serviceId);
        if (existingItem) {
          existingItem.consumeUnits = Number(existingItem.consumeUnits) + Number(currentItem.implementedUnit);
        } else {
          serviceArr?.push({ id: currentItem.serviceId, consumeUnits: Number(currentItem.implementedUnit) })
        }
      })
    })

    return {
      hardwareDetails: hardwareDetails,
      software: finalProductDetailsArr,
      serviceData: serviceArr,
      implementationList: implementationList
    }
  }


  let quotationArr = []

  const getTotalProductCode = async (quoteCode) => {
    await fetchQuotationDetails(quoteCode).then(async (res) => {
      quotationArr = res?.result
      res?.result?.map((obj) => {
        if (obj.productItemCategory === 'Software' && !totalProductCode.includes(obj.productCode)) {
          totalProductCode.push(obj.productCode)
        }
      })
    })
    await fetchQuotation(quotationCode, quotationArr);
  }

  useEffect(async () => {
    await getTotalProductCode(quotationCode)
    await schoolInformation();
    await getChildListHandler();
    setPurchaseOrderCode(purchaseOrderDetail?.purchaseOrderCode)
  }, [quotationCode]);


  const checkDisable = (row, arr, type) => {
    if (arr === consumedProduct && Number(row[dynamic[0]?.field]) === 0) {
      if (Number(row[dynamic[0]?.field]) === 0) {
        return true
      }
      return false
    }
    if (type === 'batch') {
      if (Number(row[dynamic[0]?.field]) === 0 || Number(row?.implementedUnit) === 0 || !row?.hasOwnProperty('implementedUnit')) {
        return true
      }
      return false
    }
    if (arr === 'hardware') {
      if (Number(row?.productItemQuantity) === 0) {
        return true
      }
      if (row?.productName === "Hardware Content Details" && !row?.productItemQuantity && (!row?.productUnit || Number(row?.productUnit) == 0)) {
        return true
      }
      return false
    }
    if (arr === 'class') {
      if (row.productUnit === "" || Number(row?.productUnit) == 0) {
        return true
      }
      return false
    }
    if (arr === 'service') {
      if (!row?.productItemDuration) {
        return true
      }
      return false
    }
  }


  const renderTeacherCount = (obj, row, data, proIndex) => {
    const existingIds = data.map(item => item.productItemRefId);
    const previousRender = existingIds.slice(0, proIndex)
    if (!previousRender.includes(obj?.productItemRefId)) {
      return <TextField
        disabled={checkDisable(obj, consumedProduct)}
        value={obj[row.field] || ""}
        onChange={(e) =>
          handleLicenseChange(e, obj, row.field)
        }
        onKeyDown={handleNumberKeyDown}
        onPaste={handlePaste}
        autoComplete="off"
        required={!checkDisable(obj, consumedProduct)}
        className="crm-form-input dark"
      />;
    }
    return;
  };


  return (
    <Page
      title="Implementation | Extramarks"
      className="crm-page-wrapper crm-page-quotation-implementation"
    >

      <Breadcrumbs
        className="crm-breadcrumbs"
        separator={<img src={IconBreadcrumbArrow} />}
        aria-label="breadcrumbs"
      >
        <Link
          underline="hover"
          key="1"
          color="inherit"
          to={`${schoolPath}`}
          className="crm-breadcrumbs-item breadcrumb-link"
        >
          {schoolDetail?.schoolName || 'School'}
        </Link>

        <Typography
          key="3"
          component="span"
          className="crm-breadcrumbs-item breadcrumb-active"
        >
          Implementation Form
        </Typography>
      </Breadcrumbs>

      <Box>
        {
          !isLoading ?
            <>
              <SchoolDetailBox schoolCode={schoolCode} />
              {/* --------------QUOTATION---------------- */}
              <Box sx={{ mb: '20px' }}>
                <Accordion sx={styles.accordion} className="crm-page-accordion-container">
                  <AccordionSummary
                    expandIcon={<IconDropdown />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="table-header"
                  >
                    <Typography component={"h3"} >{"Quotation"}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="listing-accordion-details">
                    <QuotationDetailForm isQuotationID={quotationCode} />
                  </AccordionDetails>
                </Accordion>
              </Box>
              {/* -----------PurchaseOrder---------------- */}
              <Box sx={{ mb: '20px' }}>
                <Accordion sx={styles.accordion} className="crm-page-accordion-container">
                  <AccordionSummary
                    expandIcon={<IconDropdown />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="table-header"
                  >
                    <Typography component={"h3"} >{"PO Details"}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="listing-accordion-details">
                    <PurchaseOrderDetail code={quotationCode || purchaseOrderDetail?.purchaseOrderCode} />
                  </AccordionDetails>
                </Accordion>
              </Box>
              {/* -----------IMPLEMENTATION FORM------------- */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={submitHandler}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                  }) => (
                    <Form>
                      {/*--------------- SOFTWARE TABLE-------------- */}

                      {softwareProductTable?.map((table) => {
                        return (
                          table?.productDataList?.length > 0 &&
                          <TableContainer component={Paper} className="crm-page-implementation-details-table crm-table-container">
                            <Typography component={"h3"}>{table.productName}</Typography>
                            <Table aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {table.productTable.map((col, index) => (
                                    <TableCell
                                      align="left"
                                      key={index}
                                      sx={{ textAlign: col.field === 'teacherCount' ? "center" : "" }}
                                    >
                                      {col.label}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {
                                  table.productDataList.map((obj, index) => {
                                    return (
                                      <TableRow key={index}
                                        sx={{
                                          backgroundColor: checkDisable(obj, consumedProduct) ? "#F1F1F1" : ""
                                        }}
                                      >
                                        {
                                          table.productTable.map((row, proIndex) => {
                                            return (
                                              <Fragment key={proIndex}>
                                                {!row.isEditable ?
                                                  <TableCell align="left">
                                                    {
                                                      row['type'] === 'dropdown' ?
                                                        <>
                                                          {row.field === 'batchLanguage' && (
                                                            <Autocomplete
                                                              //disablePortal
                                                              menuI
                                                              id="combo-box-demo"
                                                              options={obj?.duplicateBatchLang}
                                                              getOptionLabel={(option) => option}
                                                              onChange={(e, value) => {
                                                                productDropdownHandler(e, value, obj, row)
                                                              }}
                                                              // value={"" || obj?.batchLanguage}
                                                              sx={{ backgroundColor: checkDisable(obj, consumedProduct, 'batch') ? "#F1F1F1" : "" }}
                                                              disabled={checkDisable(obj, consumedProduct, 'batch')}
                                                              renderInput={(params) => (
                                                                <TextField
                                                                  {...params}
                                                                  placeholder="Select"
                                                                  required={true}
                                                                  disabled={checkDisable(obj, consumedProduct, 'batch')}
                                                                  className="crm-form-input crm-form-autocomplete dark"
                                                                />
                                                              )}
                                                              popupIcon={<DropDownIcon />}
                                                              classes={{
                                                                listbox: "crm-form-autocomplete-menuitem",
                                                              }}
                                                            />
                                                          )}
                                                          {row.field === 'batchTiming' && (
                                                            <Autocomplete
                                                              //disablePortal
                                                              id="combo-box-demo"
                                                              options={obj?.duplicateBatchTiming}
                                                              getOptionLabel={(option) => option.batch_start_date}
                                                              disabled={checkDisable(obj, consumedProduct, 'batch')}
                                                              onChange={(e, value) => {
                                                                productDropdownHandler(e, value, obj, row)
                                                              }}
                                                              // value={obj.batchTiming || ""}
                                                              // sx={{ ...styles.autoCompleteCss }}
                                                              sx={{ backgroundColor: !obj?.batchLanguage?.length ? "#F1F1F1" : "" }}
                                                              renderInput={(params) => (
                                                                <TextField
                                                                  {...params}
                                                                  placeholder="Select"
                                                                  required={true}
                                                                  disabled={checkDisable(obj, consumedProduct, 'batch')}
                                                                  className="crm-form-input crm-form-autocomplete dark"
                                                                />
                                                              )}
                                                              popupIcon={<DropDownIcon />}
                                                              classes={{
                                                                listbox: "crm-form-autocomplete-menuitem",
                                                              }}
                                                            />
                                                          )}

                                                        </>
                                                        :
                                                        <>
                                                          {row.field === "productItemName" ?
                                                            <Box className="crm-page-table-cell-plain">
                                                              <Box>
                                                                {obj[row['field']]}
                                                              </Box>
                                                              <Box sx={{ marginLeft: "30px" }}>
                                                                {obj?.className}
                                                              </Box>
                                                            </Box> :
                                                            <Box className="crm-page-table-cell-plain">
                                                              {obj[row['field']] ? obj[row['field']] : 0}
                                                            </Box>
                                                          }
                                                        </>

                                                    }
                                                  </TableCell> :
                                                  <>
                                                    {
                                                      row.field === "teacherCount" && (obj?.productCode === 'esc_plus_pro' || obj?.productCode === 'esc_plus_basic' || obj?.productCode === 'esc_plus_advanced' || obj?.productCode === 'em_power') ?
                                                        <TableCell align="center">
                                                          {/* <TextField
                                                            disabled={checkDisable(obj, consumedProduct)}
                                                            value={obj[row.field] || ""}
                                                            onChange={(e) =>
                                                              handleLicenseChange(e, obj, row.field)
                                                            }
                                                            onKeyDown={handleNumberKeyDown}
                                                            onPaste={handlePaste}
                                                            autoComplete="off"
                                                            required={!checkDisable(obj, consumedProduct)}
                                                            className="crm-form-input dark"
                                                          /> */}
                                                          {renderTeacherCount(obj, row, table.productDataList, index)}
                                                        </TableCell>
                                                        :
                                                        <TableCell align="left" sx={{ borderTop: row.field !== "teacherCount" ? "1px solid #00000029 !important" : "", borderLeft: row.field == "teacherCount" ? "1px solid #00000029 !important" : "" }}>
                                                          {
                                                            row.field !== "teacherCount" && <TextField
                                                              disabled={checkDisable(obj, consumedProduct)}
                                                              value={obj[row.field] || ""}
                                                              onChange={(e) =>
                                                                handleLicenseChange(e, obj, row.field)
                                                              }
                                                              onKeyDown={handleNumberKeyDown}
                                                              onPaste={handlePaste}
                                                              autoComplete="off"
                                                              required={!checkDisable(obj, consumedProduct)}
                                                              className="crm-form-input dark"
                                                            />
                                                          }
                                                        </TableCell>
                                                    }
                                                  </>

                                                }
                                              </Fragment>
                                            )
                                          })
                                        }
                                      </TableRow>
                                    )
                                  })
                                }
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )
                      })}

                      {/* -------Hardware Content Deatils */}

                      {hardwareProductTable?.map((table) => {
                        return (
                          table?.productDataList?.length > 0 &&
                          <TableContainer component={Paper} className="crm-page-implementation-details-table crm-table-container">
                            <Typography component={"h3"}>{table.productName}</Typography>
                            <Table aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {table?.productTable?.map((col, index) => (
                                    <TableCell
                                      align="left"
                                      key={index}
                                    >
                                      {col.label}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {
                                  table?.productDataList?.map((obj, index) => {
                                    return (
                                      <TableRow key={index}
                                      // sx={{
                                      //   backgroundColor: checkDisable(obj, 'hardware') ? "#F1F1F1" : ""
                                      // }}
                                      >
                                        {
                                          table?.productTable?.map((row, index) => {
                                            return (
                                              <Fragment>
                                                {!row.isEditable ?
                                                  <TableCell align="left">
                                                    {
                                                      row['type'] === 'dropdown' ?
                                                        <Autocomplete
                                                          key={`dropdown-${index}`}
                                                          //disablePortal
                                                          id="combo-box-demo"
                                                          options={classSelectData}
                                                          // getOptionLabel={(option) => option}
                                                          onChange={(e, value) => {
                                                            if (value) {
                                                              handleClass(e, value, obj)
                                                            } else {
                                                              handleClass(e, { label: '' }, obj)
                                                            }

                                                          }}
                                                          value={obj.class || null}
                                                          renderOption={renderClassOption}
                                                          disabled={checkDisable(obj, 'class')}
                                                          renderInput={(params) => (
                                                            <TextField
                                                              {...params}
                                                              placeholder="Select"
                                                              required={!checkDisable(obj, 'class')}
                                                              className="crm-form-input dark"
                                                            />
                                                          )}
                                                          popupIcon={<DropDownIcon />}
                                                          classes={{
                                                            listbox: "crm-form-autocomplete-menuitem",
                                                          }}
                                                        />
                                                        :
                                                        <Box className="crm-page-table-cell-plain">
                                                          {obj[row['field']] ? obj[row['field']] : 0}
                                                        </Box>
                                                    }
                                                  </TableCell> :
                                                  <TableCell align="left">
                                                    <TextField
                                                      value={obj[row.field] || ""}
                                                      disabled={checkDisable(obj, 'hardware')}
                                                      onChange={(e) => handleImplementedUnit(e, obj, row.field)}
                                                      onKeyDown={handleNumberKeyDown}
                                                      onPaste={handlePaste}
                                                      autoComplete="off"
                                                      required={!checkDisable(obj, 'hardware')}
                                                      className="crm-form-input dark"
                                                    />
                                                  </TableCell>
                                                }
                                              </Fragment>
                                            )
                                          })
                                        }
                                        {table.productName === 'Hardware Content Details' &&
                                          <TableCell align="left">
                                            <Box sx={{ display: "flex" }}>
                                              <IconRecordAdd title={checkDisable(obj, 'hardware') ? 'Disabled' : ``}
                                                // disabled={checkDisable(obj, 'hardware')}
                                                className="mr-1 cursor-pointer"
                                                onClick={() => !checkDisable(obj, 'hardware') && addNewRow(obj)}
                                              />
                                              <IconRecordDelete title={checkDisable(obj, 'hardware') ? 'Disabled' : ``}
                                                // disabled={checkDisable(obj, 'hardware')}
                                                className="mr-1 cursor-pointer"
                                                onClick={() => {
                                                  // console.log(obj)
                                                  if (!checkDisable(obj, 'hardware')) {
                                                    let newProductDataList = []
                                                    hardwareProductTable.map((product) => {
                                                      if (product.productName === obj.productName) {
                                                        newProductDataList.push(...product.productDataList)
                                                      }
                                                    })
                                                    if (newProductDataList.length >1) {
                                                      let updatedHardwareList = newProductDataList?.filter((item) => item?.position !== obj?.position)
                                                      let newArrHardwareBundle = updatedHardwareList.map((bundle, index) => {
                                                        let newBundle = { ...bundle };
                                                        newBundle.position = index;
                                                        return newBundle;
                                                      });
                                                      let newHardwareProTable = hardwareProductTable.map((product) => {
                                                        if (product.productName === obj.productName) {
                                                          product.productDataList = newArrHardwareBundle
                                                        }
                                                        return product
                                                      })
                                                      setHardwareProductTable([...newHardwareProTable]);
                                                    }
                                                  }
                                                }}
                                              />
                                            </Box>
                                          </TableCell>

                                        }
                                      </TableRow>
                                    )
                                  })
                                }
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )
                      })}

                      {/* -------------LICENSE TABLE--------- */}

                      {serviceTable?.length > 0 && (
                        <TableContainer component={Paper} className="crm-page-implementation-details-table crm-table-container">
                          <Typography component={"h3"}>{"Service Details"}</Typography>
                          <Table aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                {LicenseTable.map((col, index) => (
                                  <TableCell
                                    align="left"
                                    key={index}
                                  >
                                    {col}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                serviceTable.map((obj, index) => {
                                  return (
                                    <TableRow key={index}
                                    // sx={{
                                    //   backgroundColor: checkDisable(obj, 'service') ? "#F1F1F1" : ""
                                    // }}
                                    >
                                      <TableCell align="left">{obj?.productItemName}</TableCell>
                                      <TableCell align="left">{obj?.productItemDuration || "0"}</TableCell>
                                      <TableCell align="left">
                                        <TextField
                                          value={obj?.implementedUnit || ""}
                                          onChange={(e) => {
                                            if (Number(obj?.productItemDuration) < Number(e.target.value)) {
                                              toast.error(`${Number(obj?.productItemDuration)} Unit Only Have`);
                                              return;
                                            }
                                            let updatedArr = serviceTable.map((service) => {
                                              if (service.serviceId === obj.serviceId) {
                                                service.implementedUnit = e.target.value
                                                return service
                                              }
                                              return service
                                            })
                                            setServiceTable(updatedArr)
                                          }}
                                          disabled={checkDisable(obj, 'service')}
                                          onKeyDown={handleNumberKeyDown}
                                          onPaste={handlePaste}
                                          autoComplete="off"
                                          required={!checkDisable(obj, 'service')}
                                          className="crm-form-input dark"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                })
                              }
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}


                      {/* -------------SPOC Deatils */}
                      <Box className="crm-page-implementation-details-info ">
                        <Typography component={"h3"}>{"SPOC Details"}</Typography>
                        <Box sx={{ boxShadow: "0px 0px 8px #00000029", padding: '20px' }}>
                          <Grid container spacing={2.5} >

                            <Grid item container spacing={2.5} xs={12}>
                              <Grid item xs={6} sx={{ display: "grid", alignItems: "center" }}>
                                {"School Admin Details*"}
                              </Grid>
                              <Grid item xs={6}>
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={contactDetails}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e, value) => adminHandler(e, value, setFieldValue)}
                                  renderInput={(params) => (
                                    <TextField {...params} placeholder="Select" required className="crm-form-input dark" />
                                  )}
                                  popupIcon={<DropDownIcon />}
                                  classes={{
                                    listbox: "crm-form-autocomplete-menuitem",
                                  }}
                                />
                              </Grid>
                            </Grid>

                            {showAdminTextFields && (
                              <Grid item container xs={12} spacing={2.5} >
                                <Grid item xs={6} sx={styles.nameEmail}>{"Name :"}</Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    value={values.schoolAdminSPOCName || ""}
                                    required
                                    onChange={(e) => {
                                      if (!values.isSchoolAdminSPOCFromMaster) {
                                        setFieldValue("schoolAdminSPOCName", (e.target.value).replace(/\s+/g, ' '));
                                      }
                                    }}
                                    type="text"
                                    onKeyDown={handleKeyTextDown}
                                    onPaste={handleTextPaste}
                                    autoComplete="off"
                                    error={Boolean(errors.schoolAdminSPOCName && touched.schoolAdminSPOCName)}
                                    helperText={<ErrorMessage name="schoolAdminSPOCName" />}
                                    className="crm-form-input dark"
                                  />
                                </Grid>
                                <Grid item xs={6} sx={styles.phone}>{"Phone No. :"}</Grid>
                                <Grid item xs={6} >
                                  <TextField
                                    required
                                    value={values.schoolAdminSPOCPhnNo || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolAdminSPOCFromMaster) {
                                        let number = e.target.value
                                        if (number?.length <= 10) {
                                          setFieldValue("schoolAdminSPOCPhnNo", e.target.value);
                                        }
                                      }
                                    }}
                                    onKeyDown={handleNumberKeyDown}
                                    onPaste={handlePaste}
                                    autoComplete="off"
                                    error={Boolean(errors.schoolAdminSPOCPhnNo && touched.schoolAdminSPOCPhnNo)}
                                    helperText={<ErrorMessage name="schoolAdminSPOCPhnNo" />}
                                    className="crm-form-input dark"
                                  />
                                </Grid>
                                <Grid item xs={6} sx={styles.nameEmail}>{"Email :"}</Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    required
                                    value={values.schoolAdminSPOCEmail || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolAdminSPOCFromMaster) {
                                        setFieldValue("schoolAdminSPOCEmail", e.target.value);
                                      }
                                    }}
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    className="crm-form-input dark"
                                  />
                                  {touched.schoolAdminSPOCEmail && errors.schoolAdminSPOCEmail ? (
                                    <Box sx={{ color: "red", marginTop: '5px' }}>{errors.schoolAdminSPOCEmail}</Box>
                                  ) : null}
                                </Grid>
                              </Grid>
                            )}

                            <Divider sx={styles.dividerLine} />

                            <Grid item container spacing={2.5} >
                              <Grid item xs={6} sx={{ display: "grid", alignItems: "center" }}>
                                {"School Implementation SPOC*"}
                              </Grid>
                              <Grid item xs={6}>
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={contactDetails}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e, value) => impHandler(e, value, setFieldValue)}
                                  renderInput={(params) => (
                                    <TextField {...params} placeholder="Select" required className="crm-form-input dark" />
                                  )}
                                  popupIcon={<DropDownIcon />}
                                  classes={{
                                    listbox: "crm-form-autocomplete-menuitem",
                                  }}
                                />
                              </Grid>
                            </Grid>

                            {showImpTextFields && (
                              <Grid item container spacing={2.5}>
                                <Grid item xs={6} sx={styles.nameEmail}>{"Name :"}</Grid>
                                <Grid item xs={6} >
                                  <TextField
                                    required
                                    value={values.schoolImplementationSPOCName || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolImplementationSPOCFromMaster) {
                                        setFieldValue("schoolImplementationSPOCName", (e.target.value).replace(/\s+/g, ' '));
                                      }
                                    }}
                                    type="text"
                                    onKeyDown={handleKeyTextDown}
                                    onPaste={handleTextPaste}
                                    autoComplete="off"
                                    error={Boolean(errors.schoolImplementationSPOCName && touched.schoolImplementationSPOCName)}
                                    helperText={<ErrorMessage name="schoolImplementationSPOCName" />}
                                    className="crm-form-input dark"
                                  />
                                </Grid>
                                <Grid item xs={6} sx={styles.phone}>{"Phone No. :"}</Grid>
                                <Grid item xs={6} >
                                  <TextField
                                    required
                                    value={values.schoolImplementationSPOCPhnNo || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolImplementationSPOCFromMaster) {
                                        let number = e.target.value
                                        if (number?.length <= 10) {
                                          setFieldValue("schoolImplementationSPOCPhnNo", number);
                                        }
                                      }
                                    }}
                                    type="number"
                                    onKeyDown={handleKeyDown}
                                    onPaste={handlePaste}
                                    autoComplete="off"
                                    error={Boolean(errors.schoolImplementationSPOCPhnNo && touched.schoolImplementationSPOCPhnNo)}
                                    helperText={<ErrorMessage name="schoolImplementationSPOCPhnNo" />}
                                    className="crm-form-input dark"
                                  />
                                </Grid>
                                <Grid item xs={6} sx={styles.nameEmail}>{"Email :"}</Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    required
                                    value={values.schoolImplementationSPOCEmail || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolImplementationSPOCFromMaster) {
                                        setFieldValue(
                                          "schoolImplementationSPOCEmail",
                                          e.target.value
                                        );
                                      }
                                    }}
                                    autoComplete="off"
                                    className="crm-form-input dark"
                                  />
                                  {touched.schoolImplementationSPOCEmail && errors.schoolImplementationSPOCEmail ? (
                                    <Box sx={{ color: "red", marginTop: '5px' }}>{errors.schoolImplementationSPOCEmail}</Box>
                                  ) : null}
                                </Grid>
                              </Grid>
                            )}

                            <Divider sx={styles.dividerLine} />

                            <Grid item container spacing={2.5}>
                              <Grid item xs={6} sx={{ display: "grid", alignItems: "center" }}>
                                {"School Payment SPOC*"}
                              </Grid>
                              <Grid item xs={6}>
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={contactDetails}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e, value) => paymentHandler(e, value, setFieldValue)}
                                  renderInput={(params) => (
                                    <TextField {...params} placeholder="Select" required className="crm-form-input dark" />
                                  )}
                                  popupIcon={<DropDownIcon />}
                                  classes={{
                                    listbox: "crm-form-autocomplete-menuitem",
                                  }}
                                />
                              </Grid>
                            </Grid>

                            {showPaymentTextFields && (
                              <Grid item container spacing={2.5}>
                                <Grid item xs={6} sx={styles.nameEmail}>{"Name :"}</Grid>
                                <Grid item xs={6} >
                                  <TextField
                                    required
                                    value={values.schoolPaymentSPOCName || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolPaymentFromSPOCMaster) {
                                        setFieldValue("schoolPaymentSPOCName", (e.target.value).replace(/\s+/g, ' '));
                                      }
                                    }}
                                    type="text"
                                    onKeyDown={handleKeyTextDown}
                                    onPaste={handleTextPaste}
                                    autoComplete="off"
                                    error={Boolean(errors.schoolPaymentSPOCName && touched.schoolPaymentSPOCName)}
                                    helperText={<ErrorMessage name="schoolPaymentSPOCName" />}
                                    className="crm-form-input dark"
                                  />
                                </Grid>
                                <Grid item xs={6} sx={styles.phone}>{"Phone No. :"}</Grid>
                                <Grid item xs={6} >
                                  <TextField
                                    required
                                    value={values.schoolPaymentSPOCPhnNo || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolPaymentFromSPOCMaster) {
                                        let number = e.target.value
                                        if (number?.length <= 10) {
                                          setFieldValue("schoolPaymentSPOCPhnNo", number);
                                        }
                                      }
                                    }}
                                    type="number"
                                    onKeyDown={handleKeyDown}
                                    onPaste={handlePaste}
                                    autoComplete="off"
                                    error={Boolean(errors.schoolPaymentSPOCPhnNo && touched.schoolPaymentSPOCPhnNo)}
                                    helperText={<ErrorMessage name="schoolPaymentSPOCPhnNo" />}
                                    className="crm-form-input dark"
                                  />
                                </Grid>
                                <Grid item xs={6} sx={styles.nameEmail}>{"Email :"}</Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    required
                                    value={values.schoolPaymentSPOCEmail || ""}
                                    onChange={(e) => {
                                      if (!values.isSchoolPaymentFromSPOCMaster) {
                                        setFieldValue("schoolPaymentSPOCEmail", e.target.value);
                                      }
                                    }}
                                    autoComplete="off"
                                    className="crm-form-input dark"
                                  />
                                  {touched.schoolPaymentSPOCEmail && errors.schoolPaymentSPOCEmail ? (
                                    <Box sx={{ color: "red", marginTop: '5px' }}>{errors.schoolPaymentSPOCEmail}</Box>
                                  ) : null}
                                </Grid>
                              </Grid>
                            )}
                            <Divider sx={styles.dividerLine} />

                            <Grid item container spacing={2.5}>
                              <Grid item xs={6} sx={{ display: "grid", alignItems: "center" }}>
                                {"No. of coordinators*"}
                              </Grid>
                              <Grid item xs={6} >
                                <TextField
                                  required
                                  value={values?.noOfCordinators || ""}
                                  onChange={(e) => {
                                    let number = e.target.value
                                    if (number?.length < 4) {
                                      setFieldValue("noOfCordinators", number)
                                    }
                                  }}
                                  // type="number"
                                  onKeyDown={handleNumberKeyDown}
                                  onPaste={handlePaste}
                                  autoComplete="off"
                                  className="crm-form-input dark"
                                />
                              </Grid>
                            </Grid>

                          </Grid>
                        </Box>
                      </Box>
                      {/* Important dates */}

                      <Box className="crm-page-implementation-details-info ">
                        <Typography component={"h3"}>{"Important Dates"}</Typography>
                        <Box sx={{ boxShadow: "0px 0px 8px #00000029", padding: '20px' }}>
                          <Grid container spacing={2.5}>

                            <Grid item xs={6} sx={styles.dateHeading}>
                              {"Implementation Start Date"}
                            </Grid>
                            <Grid item xs={6} >
                              <Stack >
                                <DesktopDatePicker
                                  className="customDatePicker"
                                  inputFormat="DD/MM/YYYY"
                                  value={values.implementationStartDate}
                                  maxDate={values?.implementationEndDate || ""}
                                  onChange={(value) => {
                                    setFieldValue("implementationStartDate", value)
                                  }
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} required className="crm-form-input dark" />
                                  )} t
                                  autoComplete="off"
                                />
                              </Stack>
                            </Grid>

                            <Grid item xs={6} sx={styles.dateHeading}>
                              {"Implementation End Date"}
                            </Grid>
                            <Grid item xs={6} >
                              <Stack >
                                <DesktopDatePicker
                                  className="customDatePicker"
                                  inputFormat="DD/MM/YYYY"
                                  value={values?.implementationEndDate}
                                  minDate={values?.implementationStartDate}
                                  onChange={(value) =>
                                    setFieldValue("implementationEndDate", value)
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} required className="crm-form-input dark" />
                                  )}
                                  autoComplete="off"
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>

                      {/* ----------Final Submit BUtton----------------- */}

                      <Box display={'flex'} justifyContent={'flex-end'}>
                        <Button
                          className="crm-btn crm-btn-outline crm-btn-lg mr-1"
                          onClick={() => {
                            navigate(`${schoolPath}`)
                          }}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="crm-btn crm-btn-lg"
                        >
                          Submit
                        </Button>

                      </Box>
                    </Form>
                  )}
                </Formik>
              </LocalizationProvider>{" "}
            </> :
            <div style={styles.loader}>
              {DisplayLoader()}
            </div>
        }
      </Box>
    </Page>
  );
};

export default ImplementationForm;
