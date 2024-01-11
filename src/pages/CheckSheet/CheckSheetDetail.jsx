import { Box } from "@mui/material";
import Page from "../../components/Page";
import { useState } from "react";
import { NavigateTab } from "../../components/Calendar/NavigateTab";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import { useLocation } from "react-router-dom";
import { DisplayLoader } from "../../helper/Loader";
import { useStyles } from "../../css/SiteSurvey-css";
import { CheckCheetForm } from "../../components/CheckSheet/CheckSheetForm";

const CheckSheetDetail = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();

  const { schoolCode, implementationCode, linkType } = location?.state
    ? location?.state
    : {};

  return (
    <Page
      title="Extramarks | CheckSheet Detail"
      className="main-container myLeadPage datasets_container"
    >
      <div className="tableCardContainer">
        {!isLoading ? (
          <>
            <Box>
              {linkType && (
                <Box>
                  <NavigateTab data={linkType} pageCode={implementationCode} />
                </Box>
              )}
            </Box>
            <Box>
              <SchoolDetailBox schoolCode={schoolCode} />
            </Box>
            <Box>
              <CheckCheetForm/>
            </Box>
          </>
        ) : (
          <div className={classes.loader}>{DisplayLoader()}</div>
        )}
      </div>
    </Page>
  );
};

export default CheckSheetDetail;
