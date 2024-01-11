import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getImplementationById } from "../../config/services/implementationForm";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import Page from "../../components/Page";
import { DisplayLoader } from "../../helper/Loader";
import { Tabs } from "../../components/Calendar/Tabs";
import ImplementationDetails from "./ImplementationDetails";
import { NavigateTab } from "../../components/Calendar/NavigateTab";
import { useStyles } from "../../css/SiteSurvey-css";
import BredArrow from "../../assets/image/bredArrow.svg";
import { assignedEngineerType, fieldTab } from "../../constants/general";

const styles = {
  implementationForm: {
    color: "#707070",
    fontWeight: "700",
    fontSize: "22px",
    margin: "0 0 20px 0",
  },
  mT: { marginTop: "20px" },
  accordion: {
    boxShadow: "0px 3px 6px #00000029",
    border: "1px solid #BEBEBE",
    background: "#FFFFF 0% 0% no-repeat padding-box",
  },
  typo: { fontSize: 20, fontWeight: 700, color: "#707070" },
  padding: { padding: "30px" },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const ProductDetails = [
  {
    productKey: "esc_plus_basic",
    productName: "ESC Plus Basic",
    group_key: "esc_plus",
    group_name: "ESC PLUS",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productItemDuration",
        isEditable: false,
        value: "",
        label: "Duration",
      },
      { field: "productItemMrp", isEditable: false, value: "", label: "Cost" },
      {
        field: "productItemSalePrice",
        isEditable: false,
        value: "",
        label: "Total Price",
      },
      { field: "escUnit", isEditable: false, value: "", label: "Units" },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be implemented",
      },
      {
        field: "studentCount",
        isEditable: false,
        type: "number",
        value: "",
        label: "Student Count",
      },
      {
        field: "teacherCount",
        isEditable: false,
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
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productItemDuration",
        isEditable: false,
        value: "",
        label: "Duration",
      },
      { field: "productItemMrp", isEditable: false, value: "", label: "Cost" },
      {
        field: "productItemSalePrice",
        isEditable: false,
        value: "",
        label: "Total Price",
      },
      { field: "escUnit", isEditable: false, value: "", label: "Units" },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be implemented",
      },
      {
        field: "studentCount",
        isEditable: false,
        type: "number",
        value: "",
        label: "Student Count",
      },
      {
        field: "teacherCount",
        isEditable: false,
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
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productItemDuration",
        isEditable: false,
        value: "",
        label: "Duration",
      },
      { field: "productItemMrp", isEditable: false, value: "", label: "Cost" },
      {
        field: "productItemSalePrice",
        isEditable: false,
        value: "",
        label: "Total Price",
      },
      { field: "escUnit", isEditable: false, value: "", label: "Units" },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be implemented",
      },
      {
        field: "studentCount",
        isEditable: false,
        type: "number",
        value: "",
        label: "Student Count",
      },
      {
        field: "teacherCount",
        isEditable: false,
        type: "number",
        value: "",
        label: "Teacher Count",
      },
    ],
  },
  {
    group_key: "sip",
    group_name: "SIP",
    productKey: "sip_live_class",
    productName: "SIP-Live Class",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        lable: "Package Details",
      },
      { field: "boardName", isEditable: false, value: "", lable: "Board" },
      { field: "className", isEditable: false, value: "", lable: "Class" },
      {
        field: "academicYear",
        isEditable: false,
        value: "",
        lable: "Academic year",
      },
      {
        field: "totalStudentForQuotation",
        isEditable: false,
        value: "",
        lable: "Student Count",
      },
      {
        field: "studentUnitToBeImp",
        isEditable: false,
        value: "",
        lable: "Student units to be implemented",
      },
      {
        field: "batchLanguage",
        isEditable: false,
        value: "",
        lable: "Batch language",
      },
      {
        field: "batchTiming",
        isEditable: false,
        value: "",
        lable: "Batch Timing",
      },
    ],
  },
  {
    group_key: "sip",
    group_name: "SIP",
    productKey: "retail_live_class",
    productName: "SIP-Retail Live Class",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        lable: "Package Details",
      },
      { field: "boardName", isEditable: false, value: "", lable: "Board" },
      { field: "className", isEditable: false, value: "", lable: "Class" },
      {
        field: "academicYear",
        isEditable: false,
        value: "",
        lable: "Academic year",
      },
      {
        field: "totalStudentForQuotation",
        isEditable: false,
        value: "",
        lable: "Student Count",
      },
      {
        field: "studentUnitToBeImp",
        isEditable: false,
        value: "",
        lable: "Student units to be implemented",
      },
      {
        field: "batchLanguage",
        isEditable: false,
        value: "",
        lable: "Batch language",
      },
      { field: "batch", isEditable: false, value: "", lable: "Batch" },
    ],
  },
  {
    group_key: "sip",
    group_name: "SIP",
    productKey: "em_power",
    productName: "SIP-Em Power",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        lable: "Package Details",
      },
      { field: "boardName", isEditable: false, value: "", lable: "Board" },
      { field: "className", isEditable: false, value: "", lable: "Class" },
      {
        field: "classroomUnit",
        isEditable: false,
        value: "",
        label: "Classroom Units",
      },
      {
        field: "unitsToBeImp",
        isEditable: false,
        value: "",
        label: "Units to be Implemented",
      },
      {
        field: "totalSubject",
        isEditable: false,
        value: "",
        label: "Total Subjects",
      },
      {
        field: "totalStudentForQuotation",
        isEditable: false,
        value: "",
        label: "Total Students",
      },
      {
        field: "studentUnitToBeImp",
        isEditable: false,
        value: "",
        label: "Student units to be implemented",
      },
    ],
  },
  {
    group_key: "sip",
    group_name: "SIP",
    productKey: "self_study",
    productName: "SIP-Self Study",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        lable: "Package Details",
      },
      { field: "boardName", isEditable: false, value: "", lable: "Board" },
      { field: "className", isEditable: false, value: "", lable: "Class" },
      {
        field: "academicYear",
        isEditable: false,
        value: "",
        lable: "Academic year",
      },
      {
        field: "totalStudentForQuotation",
        isEditable: false,
        value: "",
        lable: "Student Count",
      },
      {
        field: "studentUnitToBeImp",
        isEditable: false,
        value: "",
        lable: "Student units to be implemented",
      },
    ],
  },
  {
    group_key: "la",
    group_name: "LA",
    productKey: "la",
    productName: "LA",
    productDataList: [],
    productTable: [
      { field: "grade", isEditable: false, value: "", label: "Grade" },
      {
        field: "totalStudentForQuotation",
        isEditable: false,
        value: "",
        label: "Student Count",
      },
      {
        field: "studentUnitToBeImp",
        isEditable: false,
        value: "",
        label: "Student count to be implemented",
      },
      { field: "boardName", isEditable: false, value: "", label: "Board" },
      { field: "package", isEditable: false, value: "", label: "Package" },
      {
        field: "productItemDuration",
        isEditable: false,
        value: "",
        label: "Duration",
      },
    ],
  },
  {
    group_key: "toa",
    group_name: "TOA",
    productKey: "toa",
    productName: "TOA",
    productDataList: [],
    productTable: [],
  },
  {
    group_key: "assement_centre",
    group_name: "Assement Centre",
    productKey: "assement_centre",
    productName: "Assessment Centre",
    productDataList: [],
    productTable: [],
  },
  {
    group_key: "teaching_app",
    group_name: "Teaching App",
    productKey: "teaching_app",
    productName: "Teaching App",
    productDataList: [],
    productTable: [
      { field: "grade", isEditable: false, value: "", label: "Grade" },
      {
        field: "teacherCount",
        isEditable: false,
        value: "",
        label: "Teacher Count",
      },
      {
        field: "teacherCountToBeImp",
        isEditable: false,
        value: "",
        label: "Teacher count to be implemented",
      },
      { field: "boardName", isEditable: false, value: "", label: "Board" },
      { field: "package", isEditable: false, value: "", label: "Package" },
      {
        field: "productItemDuration",
        isEditable: false,
        value: "",
        label: "Duration",
      },
      { field: "productItemMrp", isEditable: false, value: "", label: "Cost" },
      {
        field: "productItemSalePrice",
        isEditable: false,
        value: "",
        label: "Total Price",
      },
    ],
  },
];

const HardwareConstant = [
  {
    productKey: "",
    productName: "Hardware Details",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productType",
        isEditable: false,
        value: "",
        label: "Product Type",
      },
      {
        field: "productItemQuantity",
        isEditable: false,
        value: "",
        label: "Total Units",
      },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be Implemented",
      },
    ],
  },
  {
    productKey: "",
    productName: "Hardware Content Details",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productType",
        isEditable: false,
        value: "",
        label: "Product Type",
      },
      {
        field: "productUnit",
        isEditable: false,
        value: "",
        label: "Total Units to be Implemented",
      },
      {
        field: "class",
        isEditable: false,
        type: "dropdown",
        value: "",
        label: "Class",
      },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be Implemented",
      },
    ],
  },
];

const ImplementationSurveyDetail = () => {
  let location = useLocation();
  const classes = useStyles();
  const { impFormNumber } = useParams();
  const [implementationData, setImplementationData] = useState(null);
  const [quotationCode, setQuotationCode] = useState(null);
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(null);
  const [schoolCode, setSchoolCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [softwareProductTable, setSoftwareProductTable] = useState([]);
  const [hardwareProductTable, setHardwareProductTable] = useState([]);
  const [productList, setProductList] = useState([]);
  const [totalProductTable, setTotalProductTable] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const { linkType } = location?.state ? location?.state : {};
 
  

  const getImplementationDetail = async (code) => {
    setIsLoading(true);

    await getImplementationById(code)
      .then((res) => {
        setImplementationData(res?.result[0]);
        setQuotationCode(res?.result[0]?.quotationCode);
        setPurchaseOrderCode(res?.result[0]?.purchaseOrderCode);
        setSchoolCode(res?.result[0]?.schoolCode);
        setTotalProductTable(res?.result[0]?.productDetails);
        let newAr = HardwareConstant.map((product) => {
          if (product.productName === "Hardware Details") {
            product.productDataList = res?.result[0]?.hardwareDetails;
            return product;
          }
          if (product.productName === "Hardware Content Details") {
            product.productDataList = res?.result[0]?.hardwareContentDetails;
            return product;
          }
        });
        setHardwareProductTable(newAr);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getImplementationDetail(impFormNumber);
  }, [impFormNumber]);

  

  useEffect(() => {
    if (linkType) {
      setActiveTab(linkType);
    }
  }, [linkType]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/school-list"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Listing Detail
    </Typography>,
  ];

  const handleClick = () => {
    navigate("/authorised/school-dashboard", {
      state: {
        referenceCode: impFormNumber,
        referenceType: fieldTab?.Implementation?.toUpperCase(),
        schoolReferenceCode:schoolCode,
        productRefCode: implementationData?.productDetails?.map(obj => obj?.productCode)?.[0],
        allSchool: true
      },
    });
  };


  return (
    <Page
      title="Extramarks | Site Survey"
      className="main-container myLeadPage datasets_container"
    >
      {!isLoading ? (
        <Box sx={styles.padding}>
          <Box sx={styles.implementationForm}>{"IMPLEMENTATION FORM"}</Box>
          <Box>
            <NavigateTab data={activeTab} pageCode={impFormNumber}/>
          </Box>
          <SchoolDetailBox schoolCode={schoolCode} />

          <Grid container md={12} margin={3}>
            <Grid item md={8}>
              <Typography sx={styles.implementationForm}>
                Implementation Details
              </Typography>
            </Grid>
            {/* {implementationData?.status === assignedEngineerType?.isSSREngineerStatus && <Grid item md={4}>
              <Button  className={classes.submitBtn} onClick={() => handleClick()}>
                Schedule a meeting
              </Button>
            </Grid>} */}
             <Button  className={classes.submitBtn} onClick={() => handleClick()}>
                Schedule a meeting
              </Button>
          </Grid>

          <ImplementationDetails impFormNumber={impFormNumber} />
        </Box>
      ) : (
        <div style={styles.loader}>{DisplayLoader()}</div>
      )}
    </Page>
  );
};

export default ImplementationSurveyDetail;
