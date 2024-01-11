import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Page from "../../components/Page";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import { DisplayLoader } from "../../helper/Loader";
// import ImplementationDetails from "./ImplementationDetails";
import BredArrow from "../../assets/image/bredArrow.svg";
import { NavigateTab } from "../../components/Calendar/NavigateTab";
import { getSiteSurveyDetails } from "../../config/services/siteSurvey";
import { useStyles } from "../../css/SiteSurvey-css";
import SiteSurveyDetailPage from "./SiteSurveyDetailPage";

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

const [TAB_1, TAB_2, TAB_3, TAB_4] = [
  {
    label: "Quotation",
  },
  {
    label: "PO",
  },
  {
    label: "Implementation",
  },
  {
    label: "SSR",
  },
];

const SiteSurveyDetail = () => {
  const classes = useStyles();
  const { siteSurveyCode } = useParams();
  const location = useLocation();
  const [quotationCode, setQuotationCode] = useState(null);
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(null);
  const [schoolCode, setSchoolCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hardwareProductTable, setHardwareProductTable] = useState([]);
  const [totalProductTable, setTotalProductTable] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [implementationCode, setImplementationCode] = useState();

  const { linkType } = location?.state ? location?.state : {};

  const fetchSiteSurveyDetails = async (code) => {
    setIsLoading(true);

    let params = {
      implementationCode: code,
    };

    await getSiteSurveyDetails(params)
      .then((res) => {
        setImplementationCode(res?.result?.implementationCode);
        setQuotationCode(res?.result?.quotationCode);
        setPurchaseOrderCode(res?.result?.purchaseOrderCode);
        setSchoolCode(res?.result?.schoolCode);
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
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    fetchSiteSurveyDetails(siteSurveyCode);
  }, [siteSurveyCode]);

  const AccordionData = ({ heading, component }) => {
    return (
      <div style={styles.mT}>
        <Accordion sx={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className="table-header"
          >
            <Typography style={styles.typo}>{heading}</Typography>
          </AccordionSummary>
          <AccordionDetails className="listing-accordion-details">
            {component}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

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

  return (
    <Page
      title="Extramarks | Site Survey Detail"
      className="main-container myLeadPage datasets_container"
    >
      {!isLoading ? (
        <>
          <Box sx={styles.padding}>
            <Box sx={styles.implementationForm}>{"SSR FORM DETAILS"}</Box>
            <Box>
              <NavigateTab data={activeTab} pageCode={siteSurveyCode} />
            </Box>
          </Box>
          {schoolCode ? (
            <>
              <Box sx={styles.padding}>
                <SchoolDetailBox schoolCode={schoolCode} />
                <AccordionData
                  heading={"Site Survey"}
                  component={
                    <SiteSurveyDetailPage siteSurveyCode={siteSurveyCode} />
                  }
                />
              </Box>
            </>
          ) : (
            <div className={classes.noData}>
              <p>No Data</p>
            </div>
          )}
        </>
      ) : (
        <div style={styles.loader}>{DisplayLoader()}</div>
      )}
    </Page>
  );
};

export default SiteSurveyDetail;
