import { Box } from "@mui/material";
import Page from "../../components/Page";
import { useStyles } from "../../css/SiteSurvey-css";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import { NavigateTab } from "../../components/Calendar/NavigateTab";
import QcFormTable from "../../components/QC Module/QCTable";
import { getImplementationById } from "../../config/services/implementationForm";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const QcImplementForm = () => {
  const classes = useStyles();
  const { impCode } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [schoolCode, setSchoolCode] = useState(null);
  const [quotationData, setQuotationData] = useState(null);
  const location = useLocation();

  const { isShowQCForm, linkType } = location?.state ? location?.state : {};

  const getImplementationDetail = async (code) => {
    setIsLoading(true);
    await getImplementationById(code)
      .then((res) => {
        setQuotationData(res?.result[0]);
        setSchoolCode(res?.result[0]?.schoolCode);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  };


  useEffect(() => {
    if (impCode) {
      getImplementationDetail(impCode);
    }
  }, [impCode]);

  return (
    <>
      <Page
        title="Extramarks | QC Form"
        className="main-container myLeadPage datasets_container"
      >
        <div className="tableCardContainer">
          {linkType && isShowQCForm && impCode ? (
            <Box>
              <NavigateTab
                data={linkType}
                pageCode={impCode}
                isShowQCForm={isShowQCForm}
              />
            </Box>
          ) : (
            ""
          )}
          <Box>
            <SchoolDetailBox schoolCode={schoolCode} />
          </Box>
          <Box className={classes.BoxHeader}>{"List Component for QC"}</Box>
          <Box className={classes.borderBox}>
            <QcFormTable
              data={quotationData?.hardwareDetails}
              impCode={quotationData?.impFormNumber}
            />
          </Box>
        </div>
      </Page>
    </>
  );
};

export default QcImplementForm;
