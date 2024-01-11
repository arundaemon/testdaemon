import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import QuotationDetailForm from "../Quotation/QuotationDetailForm";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getImplementationById } from "../../config/services/implementationForm";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import { useStyles } from "../../css/Quotation-css";
import { NavigateTab } from "../../components/Calendar/NavigateTab";

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
  typo: { fontSize: 20, fontWeight: 700, color: "#707070", marginTop: "10px" },
  padding: { padding: "30px" },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const QuotationDetail = () => {
  const classes = useStyles();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [implementationData, setImplementationData] = useState(null);
  const [quotationCode, setQuotationCode] = useState(null);
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(null);
  const [schoolCode, setSchoolCode] = useState(null);

  const { linkType, impFormNumber } = location?.state ? location?.state : {};

  const getImplementationDetail = async (code) => {
    await getImplementationById(code)
      .then((res) => {
        setImplementationData(res?.result[0]);
        setQuotationCode(res?.result[0]?.quotationCode);
        setPurchaseOrderCode(res?.result[0]?.purchaseOrderCode);
        setSchoolCode(res?.result[0]?.schoolCode);
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

  return (
    <>
      <Grid className={classes.cusCard}>
       <Box sx={styles.implementationForm}>{`Quotation`}</Box>
        <Box>
          <NavigateTab
            data={activeTab}
            pageCode={impFormNumber}
          />
        </Box>
        <SchoolDetailBox schoolCode={schoolCode} />
        <Box>
          <QuotationDetailForm isQuotationID={quotationCode} />
        </Box>
      </Grid>
    </>
  );
};

export default QuotationDetail;
