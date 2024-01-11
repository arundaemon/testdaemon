import { Box, Button, Grid } from "@mui/material";
import { NavigateTab } from "../../components/Calendar/NavigateTab";
import Page from "../../components/Page";
import { useStyles } from "../../css/SiteSurvey-css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { assignedEngineerType, fieldTab } from "../../constants/general";
import { Typography } from "antd";
import { getImplementationById } from "../../config/services/implementationForm";
import { useEffect, useState } from "react";
import QcFormTable from "../../components/QC Module/QCTable";
import QcDetailTable from "../../components/QC Module/QCDetail";

const QcDetailView = () => {
  const classes = useStyles();
  const { impCode } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [schoolCode, setSchoolCode] = useState(null);
  const [quotationData, setQuotationData] = useState(null);
  const location = useLocation();

  const { linkType } = location?.state ? location?.state : {};

  const handleClick = () => {
    navigate("/authorised/school-dashboard", {
      state: {
        referenceCode: impCode,
        referenceType: fieldTab?.isQC,
        schoolReferenceCode: schoolCode,
        productRefCode: quotationData?.productDetails?.map(
          (obj) => obj?.productCode
        )?.[0],
        allSchool: true
      },
    });
  };

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
        title="Extramarks | Site Survey"
        className="main-container myLeadPage datasets_container"
      >
        <div className="tableCardContainer">
          {linkType && impCode ? (
            <Box>
              <NavigateTab data={fieldTab?.isQC} pageCode={impCode} />
            </Box>
          ) : (
            ""
          )}
          <Box>
            <Grid container md={12} sx={{ m: 2 }}>
              <Grid item md={8}>
                <Typography className={classes.heading}>QC Form</Typography>
              </Grid>
              {quotationData?.status ===
                assignedEngineerType?.isQCEngineerStatus &&
                quotationData?.hardwareDetails?.length > 0 && (
                  <Grid item md={4}>
                    <Button
                      className={classes.submitBtn}
                      onClick={() => handleClick()}
                    >
                      Schedule a meeting
                    </Button>
                  </Grid>
                )}
            </Grid>
          </Box>
          <Box className={classes.borderBox}>
            <div className={classes.boxBlockBorder}>
              <QcDetailTable
                data={quotationData?.hardwareDetails}
                quotationCode={quotationData?.impFormNumber}
              />
            </div>
          </Box>
        </div>
      </Page>
    </>
  );
};

export default QcDetailView;
