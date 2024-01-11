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
    Checkbox,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { Formik, Form } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import { getImplementationById, getProductField, } from '../../config/services/implementationForm';
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { filter } from "lodash";
import ListActivatedPackagePopup from "./ListActivatedPackagePopup";
import { handleNumberKeyDown, handlePaste } from "../../helper/randomFunction";
import { DecryptData } from "../../utils/encryptDecrypt";
import { getLoggedInRole } from "../../utils/utils";
import { activatedPackageDetails, listActivatedPackageDetails, updateActivatedPackageDetails, updatePackageActivationStatus } from "../../config/services/activatedPackage";
import toast from "react-hot-toast";
import EditIcon from '@mui/icons-material/Edit';
import PauseIcon from '@mui/icons-material/Pause';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const styles = {
    tableContainer: {
        margin: "30px auto",
        borderRadius: "4px",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "20px",
    },
    dividerLine: {
        borderWidth: "1.4px",
        borderColor: "grey",
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
        backgroundColor: "#E2EBFF",
    },
    productSec: {
        // borderRight: "1px solid grey !important",
        padding: "16px 0",
    },
    borderShadow: {
        // boxShadow: "0px 3px 6px #00000029",

        borderRadius: "2px",
        "fieldset": { border: "2px solid #202124 !important" },
        "& input": { height: "0.5em !important", width: "40px", textAlign: "center" },
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
        textAlign: "right",
    },
    btn: { width: "100px", padding: "10px 15px", fontSize: "17px" },
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


const EditActivatedImp = () => {

    const ProductDetails = [
        {
            productKey: "esc_plus_basic",
            productName: "ESC Plus Basic",
            group_key: "esc_plus",
            group_name: "ESC PLUS",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "no_of_classroom",
                    isEditable: false,
                    value: "",
                    label: "No. Of Classroom",
                },
                {
                    field: "student_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
                {
                    field: "coordinator_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "No. Of Coordinatprs",
                },
                {
                    field: "teacher_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Teacher Count",
                },
            ],
        },
        {
            productKey: "esc_plus_pro",
            productName: "ESC Plus Pro",
            group_key: "esc_plus",
            group_name: "ESC PLUS",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "no_of_classroom",
                    isEditable: false,
                    value: "",
                    label: "No. Of Classroom",
                },
                {
                    field: "student_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
                {
                    field: "coordinator_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "No. Of Coordinatprs",
                },
                {
                    field: "teacher_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Teacher Count",
                },
            ],
        },
        {
            productKey: "esc_plus_advanced",
            productName: "ESC Plus Advanced",
            group_key: "esc_plus",
            group_name: "ESC PLUS",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "no_of_classroom",
                    isEditable: false,
                    value: "",
                    label: "No. Of Classroom",
                },
                {
                    field: "student_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
                {
                    field: "coordinator_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "No. Of Coordinatprs",
                },
                {
                    field: "teacher_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Teacher Count",
                },
            ],
        },
        {
            productKey: "sip_live_class",
            productName: "SIP-Live Class",
            group_key: "sip",
            group_name: "SIP",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Academic Year",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
            ],
        },
        {
            productKey: "retail_live_class",
            productName: "SIP-Retail Live Class",
            group_key: "sip",
            group_name: "SIP",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Academic Year",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
            ],
        },
        {
            productKey: "em_power",
            productName: "SIP-Em Power",
            group_key: "sip",
            group_name: "SIP",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "no_of_classroom",
                    isEditable: false,
                    value: "",
                    label: "No. Of Classroom",
                },
                {
                    field: "student_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
                {
                    field: "coordinator_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "No. Of Coordinatprs",
                },
                {
                    field: "teacher_count",
                    isEditable: true,
                    type: "number",
                    value: "",
                    label: "Teacher Count",
                },
            ],
        },
        {
            productKey: "self_study",
            productName: "SIP-Self Study",
            group_key: "sip",
            group_name: "SIP",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Academic Year",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
            ],
        },
        {
            productKey: "la",
            productName: "LA",
            group_key: "la",
            group_name: "LA",
            productDataList: [],
            productTable: [
                // {
                //     field: "grades",
                //     isEditable: false,
                //     value: "",
                //     label: "Grade",
                // },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    value: "",
                    label: "Student Count",
                    dynamicUnit: "true",
                },
                {
                    field: "students_to_be_implemented",
                    isEditable: true,
                    value: "",
                    label: "Student count to be implemented",
                },
                {
                    field: "boardName",
                    isEditable: false,
                    value: "",
                    label: "Board",
                },

                {
                    field: "duration",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
            ],
        },
        {
            productKey: "toa",
            productName: "TOA",
            group_key: "toa",
            group_name: "TOA",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
            ],
        },
        {
            productKey: "assessment_centre",
            productName: "Assessment Centre",
            group_key: "assement_centre",
            group_name: "Assessment Centre",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
            ],
        },
        {
            productKey: "teaching_app",
            productName: "Teaching App",
            group_key: "teaching_app",
            group_name: "Teaching App",
            productDataList: [],
            productTable: [
                {
                    field: "index",
                    isEditable: false,
                    value: "",
                    label: "S. No.",
                },
                {
                    field: "package_name",
                    isEditable: false,
                    value: "",
                    label: "Package Name",
                },
                {
                    field: "validity",
                    isEditable: false,
                    value: "",
                    label: "Duration",
                },
                {
                    field: "link",
                    isEditable: false,
                    value: "",
                    label: "Action",
                },
                {
                    field: "student_count",
                    isEditable: false,
                    type: "number",
                    value: "",
                    label: "Student Count",
                },
            ],
        },
    ];

    let location = useLocation();
    let { impFormNumber, schoolCode, subscribe } = location?.state

    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    const [implementationData, setImplementationData] = useState(null);
    const [productSchema, setProductSchema] = useState([])
    const [totalProductTable, setTotalProductTable] = useState([])
    const [hardwareProductTable, setHardwareProductTable] = useState([])
    const [serviceData, setServiceData] = useState([])


    const [activatedData, setActivatedData] = useState(null)
    const [schoolData, setSchoolData] = useState(null)
    const [packageDetail, setPackageDetail] = useState(null)
    const [open, setOpen] = useState(false)
    const [showBtn, setShowBtn] = useState(false)


    function doesObjectExistInArray(array, objectToFind) {
        return array.some(
            (item) => JSON.stringify(item) === JSON.stringify(objectToFind)
        );
    }

    const getImplementationDetail = async (impFormNumber, schoolCode) => {
        // let getPro = await getProductField()
        // let getProductTables = getPro?.result[0]?.productsField;
        let activatedPackageParams = {
            uuid: uuid,
            school_code: schoolCode,
            implementation_form_id: impFormNumber
        }

        let activatedPackage = await activatedPackageDetails(activatedPackageParams)
        activatedPackage = activatedPackage?.data

        if (activatedPackage.status == 1) {
            setActivatedData(activatedPackage)
            let school = await getSchoolBySchoolCode(activatedPackage?.school_code)
            school = school?.result || {}
            setSchoolData(school)
        }

        let productSchemaArr = []

        if (subscribe === 'manage') {

            ProductDetails?.map((product) => {
                let packageDataObj = []
                activatedPackage.activated_package_details.map((obj) => {
                    if (product.productKey === obj.product_code) {
                        product?.productTable?.map((field) => {
                            field.isEditable = false
                            return field
                        })
                        product.productId = obj.product_id
                        obj?.product_package_details?.map((item) => {
                            if (!doesObjectExistInArray(packageDataObj, item)) {
                                packageDataObj.push(item)
                            }
                        })
                        productSchemaArr.push(product)
                        return obj
                    }
                    return obj
                })
                product.productDataList = packageDataObj
                return product
            })
            setProductSchema(productSchemaArr)
        }


        if (subscribe === 'edit') {
            ProductDetails?.map((product) => {
                let packageDataObj = []
                activatedPackage?.activated_package_details?.map((obj) => {
                    if (product.productKey === obj.product_code) {
                        product.productId = obj.product_id
                        obj?.product_package_details?.map((item) => {
                            if (!doesObjectExistInArray(packageDataObj, item)) {
                                packageDataObj.push(item)
                            }
                        })
                        productSchemaArr.push(product)
                        return obj
                    }
                    return obj
                })
                product.productDataList = packageDataObj
                return product
            })
            setProductSchema(productSchemaArr)
        }
    };

    const [isLoading, setIsLoading] = useState(false)

    useEffect(async () => {
        await getImplementationDetail(impFormNumber, schoolCode);
        setIsLoading(false)
        console.log("++++++++++")
    }, [subscribe, isLoading]);

    const userRole = getLoggedInRole();

    const submitHandler = async () => {
        let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
        childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
        childRoleNames.push(userRole);
        if (subscribe === 'manage') {
            let updatedPackageIDs = []
            productSchema?.map((product) => {
                product?.productDataList?.map((obj) => {
                    console.log(obj, "???????????????")
                    if (obj['check']) {
                        updatedPackageIDs.push(obj.package_id)
                    }

                })
            })
            const updateStatusParams = {
                uuid: uuid,
                school_code: schoolCode,
                implementation_form_id: impFormNumber,
                activation_status: 2,
                package_ids: updatedPackageIDs,
                // user_hierarchy_json: childRoleNames
            };
            console.log(updateStatusParams)
            let res = await updatePackageActivationStatus(updateStatusParams)
            if (res?.data?.status == 1) {
                toast.success(res?.data?.message)
            }
            if (res?.data?.status == 0) {
                toast.success(res?.data?.message)
            }

        } else {
            let updatedPackageDetails = []
            productSchema?.map((product) => {
                product?.productDataList?.map((obj) => {
                    updatedPackageDetails.push({ package_id: obj.package_id, student_count: obj.student_count, teacher_count: obj.teacher_count, coordinator_count: obj.coordinator_count })
                })
            })

            const updatedDataParams = {
                uuid: uuid,
                school_code: schoolCode,
                implementation_form_id: impFormNumber,
                updated_package_details: updatedPackageDetails,
                // user_hierarchy_json: childRoleNames
            };
            let res = await updateActivatedPackageDetails(updatedDataParams)
            if (res?.data?.status == 1) {
                toast.success('Successfully Updated Package')
            }
        }
    }

    // let packageDetail

    const tableCheck = (col, index, obj) => {
        if (col === 'index') {
            return (
                <Box sx={styles.productSec}>
                    {index + 1}
                </Box>
            )
        }
        if (col === 'validity') {
            return (
                <Box sx={styles.productSec}>
                    {`${obj.package_valid_from.slice(0, 4)}-${obj.package_valid_to.slice(0, 4)}`}
                </Box>
            )
        }
        if (col === 'link') {
            return (
                <Box sx={{ ...styles.productSec, fontWeight: obj?.activation_status != 2 && 600, textDecoration: obj?.activation_status != 2 && "underline", color: obj?.activation_status != 2 && "#4482FB", cursor: obj?.activation_status != 2 ? "pointer" : "default" }} onClick={async () => {
                    if (obj?.activation_status != 2) {
                        let params = {
                            uuid: uuid,
                            page_offset: 0,
                            page_size: 10,
                            package_id: obj.package_id,
                            school_code: schoolCode,
                            implementation_form_id: impFormNumber
                        }
                        let packagePopupData = await listActivatedPackageDetails(params)
                        if (packagePopupData?.data?.status == 1) {
                            packagePopupData = packagePopupData?.data?.activated_package_details
                            // packageDetail=packagePopupData
                            setPackageDetail(packagePopupData)
                        }
                        setOpen(true)
                    }
                }}>
                    {"View Details"}
                </Box>
            )
        }
        else {
            return (
                <Box sx={styles.productSec}>
                    {obj[col]}
                </Box>
            )
        }

    }

    const changeHandler = (e, table, obj, row) => {
        let updatedActivatedData = productSchema?.map((product) => {
            if (table.productKey === product.productKey) {
                product?.productDataList?.map((item) => {
                    if (item.package_id === obj.package_id) {
                        obj[row.field] = Number(e.target.value)
                        return item
                    }
                    return item
                })
                return product
            }
            return product
        })
        setProductSchema(updatedActivatedData)
    }

    const playPauseHandler = async (obj, type) => {
        setIsLoading(true)
        const updateStatusParams = {
            uuid: uuid,
            school_code: schoolCode,
            implementation_form_id: impFormNumber,
            package_ids: [obj?.package_id],
            // user_hierarchy_json: childRoleNames
        };
        if (obj?.activation_status === 1) {
            updateStatusParams.activation_status = 0
        }
        if (obj?.activation_status === 0) {
            updateStatusParams.activation_status = 1
        }
        if (type === 'terminate') {
            updateStatusParams.activation_status = 2
        }
        let res = await updatePackageActivationStatus(updateStatusParams)
        if (res?.data?.status == 1) {
            toast.success(res?.data?.message)
        }
        if (res?.data?.status == 0) {
            toast.success(res?.data?.message)
        }
        setIsLoading(false)
    }


    const changeCheckboxHandler = (value, table, obj) => {

        let updatedActivatedData = productSchema?.map((product) => {
            if (table.productKey === product.productKey) {
                product?.productDataList?.map((item) => {
                    if (item.package_id === obj.package_id) {
                        obj['check'] = value
                        return item
                    }
                    return item
                })
                return product
            }
            return product
        })
        setProductSchema(updatedActivatedData)

        let condition = false
        productSchema?.map((product) => {
            product?.productDataList?.map((item) => {
                if (item?.check == true) {
                    condition = true
                    return;
                }
                return item
            })
            return product
        })
        setShowBtn(condition)
    }

    const checkDisable = (obj) => {
        if (obj?.activation_status == 2) {
            return true
        }
        return false
    }

    return (
        <Box sx={{ padding: "20px 25px" }}>
            <Box container sx={{ borderRadius: "8px", boxShadow: "0px 0px 8px #00000029", padding: "16px" }}>
                <Typography xs={12} sx={{ fontSize: "20px", fontWeight: "600" }}>{"Manage Activated school View"}</Typography>
                <Grid container sx={{ marginTop: "20px" }}>
                    <Grid xs={3}>
                        <Box sx={{ fontWeight: 700 }}>{'School Name'}</Box>
                        <Box sx={{ fontWeight: 400, marginTop: "5px" }}>{schoolData?.schoolName || "NA"}</Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ fontWeight: 700 }}>{'School Code'}</Box>
                        <Box sx={{ fontWeight: 400, marginTop: "5px" }}>{activatedData?.school_code || "NA"}</Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ fontWeight: 700 }}>{'Implementation ID'}</Box>
                        <Box sx={{ fontWeight: 400, marginTop: "5px" }}>{activatedData?.implementation_form_id || "NA"}</Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ fontWeight: 700 }}>{'Admin Name'}</Box>
                        <Box sx={{ fontWeight: 400, marginTop: "5px" }}>{activatedData?.school_admin_details?.admin_name || "NA"}</Box>
                    </Grid>

                    <Grid sx={{ marginTop: "20px" }} xs={3}>
                        <Box sx={{ fontWeight: 700 }}>{'Admin E-Mail'}</Box>
                        <Box sx={{ fontWeight: 400, marginTop: "5px" }}>{activatedData?.school_admin_details?.admin_email_id || "NA"}</Box>
                    </Grid>

                    <Grid sx={{ marginTop: "20px" }} xs={3}>
                        <Box sx={{ fontWeight: 700 }}>{'Admin Contact'}</Box>
                        <Box sx={{ fontWeight: 400, marginTop: "5px" }}>{activatedData?.school_admin_details?.admin_contact_no || "NA"}</Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Formik
                    // initialValues={{}}
                    // onSubmit={submitHandler}
                    // validationSchema={validationSchema}
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
                                {productSchema?.length && (
                                    <>
                                        {productSchema.map((table) => (
                                            <TableContainer component={Paper} sx={styles.tableContainer}>
                                                <Typography sx={styles.typoSec}>{table.productName}</Typography>
                                                <Table aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow>
                                                            {table?.productTable?.map((col, index) => (
                                                                <TableCell
                                                                    align="left"
                                                                    key={index}
                                                                    sx={{ ...styles.tableCell, padding: "16px" }}
                                                                >
                                                                    {col.label}
                                                                </TableCell>
                                                            ))}
                                                            {(subscribe === 'manage') &&
                                                                <TableCell sx={{ ...styles.tableCell, padding: "16px" }}>{'Status'}</TableCell>
                                                            }
                                                        </TableRow>

                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            table.productDataList.map((obj, index) => {
                                                                return (
                                                                    <TableRow key={index}
                                                                        sx={{
                                                                            // borderTop: "1px solid grey",
                                                                            "& td": styles.tableCell,
                                                                            backgroundColor: subscribe === 'manage' && (checkDisable(obj) ? "#F1F1F1" : "")
                                                                        }}
                                                                    >
                                                                        {/* {subscribe === 'manage' &&
                                                                            <TableCell align="left">
                                                                                {!(checkDisable(obj)) && <Checkbox
                                                                                    // checked={checked}
                                                                                    onChange={(e, value) => {
                                                                                        changeCheckboxHandler(value, table, obj)
                                                                                    }}
                                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                                />}
                                                                            </TableCell>
                                                                        } */}
                                                                        {
                                                                            table.productTable.map((row, j) => {
                                                                                return (
                                                                                    <>
                                                                                        {!row.isEditable ?
                                                                                            <TableCell align="left">
                                                                                                {tableCheck(row.field, index, obj) || "NA"}
                                                                                            </TableCell>
                                                                                            :
                                                                                            <TableCell align="left">
                                                                                                <TextField
                                                                                                    // disabled={checkDisable(obj, consumedProduct)}
                                                                                                    value={obj[row.field] || 0}
                                                                                                    onChange={(e) => {
                                                                                                        changeHandler(e, table, obj, row)
                                                                                                    }}
                                                                                                    sx={styles.borderShadow}
                                                                                                    onKeyDown={handleNumberKeyDown}
                                                                                                    onPaste={handlePaste}
                                                                                                    autoComplete="off"
                                                                                                    required={true}
                                                                                                />
                                                                                            </TableCell>
                                                                                        }
                                                                                    </>
                                                                                )
                                                                            })
                                                                        }

                                                                        {
                                                                            subscribe === 'manage' &&
                                                                            <TableCell sx={{ width: "8%" }} align="left">
                                                                                <Box sx={{ color: "#F45E29", cursor: "pointer", fontWeight: "700", fontSize: "16px", display: "flex" }}>
                                                                                    {obj?.activation_status == 0 && <Box sx={{ color: "orange", fontWeight: "600" }}>{'Pause'}</Box>}
                                                                                    {obj?.activation_status == 1 && <Box sx={{ color: "green", fontWeight: "600" }}>{'Active'}</Box>}
                                                                                    {obj?.activation_status == 2 && <Box sx={{ color: "red", fontWeight: "600" }}>{'Terminated'}</Box>}
                                                                                </Box>
                                                                            </TableCell>
                                                                        }

                                                                        {
                                                                            subscribe === 'manage' &&
                                                                            <TableCell sx={{ width: "15%" }} align="left">
                                                                                <Box sx={{ color: "#F45E29", cursor: "pointer", fontWeight: "700", fontSize: "16px", display: "flex" }}>
                                                                                    {obj?.activation_status == 0 && <PlayArrowIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={() => playPauseHandler(obj)} />}
                                                                                    {obj?.activation_status == 1 && <PauseIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={() => playPauseHandler(obj)} />}
                                                                                    {obj?.activation_status != 2 && <DeleteIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={() => playPauseHandler(obj, 'terminate')} />}
                                                                                </Box>
                                                                            </TableCell>
                                                                        }







                                                                        {/* {obj?.activation_status === 0 && subscribe === 'manage' &&
                                                                            <TableCell sx={{ width: "15%" }} align="left">
                                                                                <Box sx={{ color: "#F45E29", cursor: "pointer", fontWeight: "700", fontSize: "16px" }}>
                                                                                    <PlayArrowIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={() => playPauseHandler(obj)} />
                                                                                </Box>
                                                                            </TableCell>
                                                                        } */}

                                                                        {/* {obj?.activation_status === 1 && subscribe === 'manage' &&
                                                                            <TableCell sx={{ width: "15%" }} align="left">
                                                                                <Box sx={{ color: "#F45E29", cursor: "pointer", fontWeight: "700", fontSize: "16px" }}>
                                                                                    <PauseIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={() => playPauseHandler(obj)} />
                                                                                </Box>
                                                                            </TableCell>
                                                                        } */}
                                                                        {/* {subscribe === 'manage' && obj?.activation_status != 2 &&
                                                                            <TableCell sx={{ width: "15%" }} align="left">
                                                                                <Box sx={{ color: "#F45E29", cursor: "pointer", fontWeight: "700", fontSize: "16px" }}>
                                                                                    <ClearIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={() => playPauseHandler(obj, 'terminate')} />
                                                                                </Box>
                                                                            </TableCell>
                                                                        } */}





                                                                        {/* {obj?.activation_status === 2 &&
                                                                            <TableCell sx={{ width: "15%" }} align="left">
                                                                                <Box sx={{ color: "#F45E29", fontWeight: "600" }}>{'Deleted'}</Box>
                                                                            </TableCell>
                                                                        } */}
                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ))
                                        }
                                    </>
                                )}

                            </Form>
                        )}
                    </Formik>
                </LocalizationProvider>
                <Box sx={styles.btnSec}>
                    {subscribe === 'manage' ? (showBtn && <Button
                        variant="contained"
                        type="submit"
                        // disabled={isSubmitting}
                        onClick={submitHandler}
                        sx={styles.btn}
                    >
                        {"Delete"}
                    </Button>) : <Button
                        variant="contained"
                        type="submit"
                        // disabled={isSubmitting}
                        onClick={submitHandler}
                        sx={styles.btn}
                    >
                        {'Submit'}
                    </Button>}
                </Box>
            </Box>
            <Box>
                {
                    open && (
                        <ListActivatedPackagePopup open={open} setOpen={setOpen} packageDetail={packageDetail} />
                    )
                }
            </Box>
        </Box>
    )
}

export default EditActivatedImp