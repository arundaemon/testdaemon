import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getImplementationById } from "../../config/services/implementationForm";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import Page from "../../components/Page";
import { DisplayLoader } from "../../helper/Loader";
import { Tabs } from "../../components/Calendar/Tabs";
import SiteSurveyForm from "./SiteSurveyForm";
import { NavigateTab } from "../../components/Calendar/NavigateTab";
import { getPrevSsrFormData } from "../../config/services/siteSurvey";
import { fieldTab } from "../../constants/general";

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
  buttonWidth: {
    boxShadow: "0px 3px 6px #00000029",
    // border: "1px solid #FFFF",
    background: "#FFFFF 0% 0% no-repeat padding-box",
    width: "150px",
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    width: "100%",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
      backgroundColor: "#fff",
    },
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "16px",
    padding: "10px 0 20px 0",
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
    color: "#4482FF",
  },
  {
    label: "PO",
    color: "#80CC8C",
  },
  {
    label: "Implementation",
    color: "#F44040",
  },
  {
    label: "SSR",
    color: "#F44040",
  },
];

const ImplementationSurveyDetail = () => {
  let location = useLocation(); 
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
  const [activeTab, setActiveTab] = useState(TAB_1);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadConsent, setUploadConsent] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const navigate = useNavigate();
  const { linkType, isShowSSRForm } = location?.state ? location?.state : {};
  const [isSiteSurveyExist, setSiteSurvey] = useState("");
  const [isVisibleSSRForm, setSSRForm] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getSSRFormData = async () => {
    let params = {
      leadId: impFormNumber,
      leadType: fieldTab?.implementation,
    };
    try {
      let res = await getPrevSsrFormData(params);
      if (res?.result) {
        setSiteSurvey(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (impFormNumber) {
      getSSRFormData();
    }
  }, [impFormNumber]);

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

  const handleClick = (type) => {
    setActive(type);
  };

  useEffect(() => {
    if (linkType) {
      setActiveTab(linkType);
      setSSRForm(isShowSSRForm);
    }
  }, [linkType, isShowSSRForm]);

  const handleUploadFile = (e) => {
    setSelectedFileName(e.target.files[0].name);
    setUploadConsent(e.target.files[0]);
  };

  return (
    <Page
      title="Extramarks | Site Survey Dash"
      className="main-container myLeadPage datasets_container"
    >
      {!isLoading ? (
        <Box sx={styles.padding}>
          <Box sx={styles.implementationForm}>{"SSR FORM"}</Box>
          {linkType && isVisibleSSRForm ? (
            <Box>
              <NavigateTab
                data={activeTab}
                pageCode={impFormNumber}
                isShowSSRForm={isVisibleSSRForm}
              />
            </Box>
          ) : (
            ""
          )}
          <SchoolDetailBox schoolCode={schoolCode} />

          <Grid container md={12} spacing={3} py={4}>
            {/* <Grid item md={3}>
              <Button
                sx={styles.submitBtn}
                onClick={() => handleClick("SSR")}
                variant={active === "SSR" ? "contained" : "text"}
              >
                Fill SSR
              </Button>
            </Grid> */}
            <Grid item md={3}>
              {/* <Button
                sx={styles.submitBtn}
                onClick={() => handleOpen()}
                variant={active === "EXCEL" ? "contained" : "text"}
              >
                Upload Excel
              </Button> */}
            </Grid>
            {/* <Grid item md={3}>
              <Button
                sx={styles.submitBtn}
                // onClick={() => handleClick("CONSENT")}
                variant={active === "CONSENT" ? "contained" : "text"}
              >
                Download Sample
              </Button>
            </Grid> */}
          </Grid>

          {
            <SiteSurveyForm
              implementationData={implementationData}
              isSiteSurveyExist={isSiteSurveyExist}
            />
          }
        </Box>
      ) : (
        <div style={styles.loader}>{DisplayLoader()}</div>
      )}

      {
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" sx={styles.title}>
              Upload
            </Typography>
            <TextField
              autoComplete="off"
              disabled
              className="crm-form-input dark"
              type="upload"
              placeholder={selectedFileName ?? "Upload here"}
              value=""
              InputProps={{
                endAdornment: (
                  <IconButton
                    component="label"
                    className="crm-form-input-upload"
                  >
                    <input
                      styles={{ display: "none" }}
                      type="file"
                      hidden
                      onChange={(e) => handleUploadFile(e)}
                      // accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                    />
                    Browse
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Modal>
      }
    </Page>
  );
};

export default ImplementationSurveyDetail;
