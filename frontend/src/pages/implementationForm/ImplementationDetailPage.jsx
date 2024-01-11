import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getImplementationById, getProductField } from "../../config/services/implementationForm";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import PurchaseOrderDetail from "../../components/purchaseOrder/PurchaseOrderDetail";
import QuotationDetailForm from "../Quotation/QuotationDetailForm";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Page from "../../components/Page";
import { ProductDataTable } from "./ProductDataTable";
import ImplementationHardwareDetails from "./ImplementationHardwareDetails";
import { DisplayLoader } from "../../helper/Loader";
import ImplementationDetails from "./ImplementationDetails";
import { checkLead } from "../../config/services/implementationForm";

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
  padding: { padding: "20px 30px" },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
};



const ImplementationDetailPage = ({ impFormCode, impData }) => {
  let location = useLocation();
  const { impFormNumber } = location?.state ? location?.state : {};
  const [quotationCode, setQuotationCode] = useState(impData?.quotationCode || null);
  const [purchaseOrderCode, setPurchaseOrderCode] = useState(impData?.purchaseOrderCode || null);
  const [schoolCode, setSchoolCode] = useState(impData?.schoolCode || null);
  const [isLoading, setIsLoading] = useState(false);
  const getImplementationDetail = async (code) => {
    setIsLoading(true)
    await getImplementationById(code)
      .then((res) => {
        setQuotationCode(res?.result[0]?.quotationCode);
        setPurchaseOrderCode(res?.result[0]?.purchaseOrderCode);
        setSchoolCode(res?.result[0]?.schoolCode);
        setIsLoading(false)
      })
      .catch((e) => console.log(e));
  };

  const updateImpStageStatus = async (code) => {
    let params = {
      leadId: [code],
      leadType: 'IMPLEMENTATION'
    }
    checkLead(params);
  }

  useEffect(() => {
    getImplementationDetail(impFormNumber || impFormCode);
    updateImpStageStatus(impFormNumber);
  }, [impFormNumber]);


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


  return (
    <Page
      title="Extramarks | Quotation Table"
      className="main-container myLeadPage datasets_container"
    >
      {!isLoading ?
        <Box sx={styles.padding}>
          <Box sx={styles.implementationForm}>
            {impFormCode ? "EDIT-IMPLEMENTATION-FORM" : "IMPLEMENTATION FORM DETAILS"}
          </Box>
          <SchoolDetailBox schoolCode={schoolCode} />
          <AccordionData
            heading={"Quotation"}
            component={<QuotationDetailForm isQuotationID={quotationCode} />}
          />
          <AccordionData
            heading={"PO Details"}
            component={
              <PurchaseOrderDetail code={quotationCode || purchaseOrderCode} />
            }
          />
          <AccordionData
            heading={"Implementation Details"}
            component={
              <ImplementationDetails impFormNumber={impFormNumber || impFormCode} />
            }
          />
        </Box>
        :
        <div style={styles.loader}>
          {DisplayLoader()}
        </div>
      }
    </Page>
  );
};

export default ImplementationDetailPage;
