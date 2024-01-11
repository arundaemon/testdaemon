import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { useStyles } from "../../css/Quotation-css";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled as CustomStyled } from '@mui/material/styles';

export const InvoiceDetailBox = ({ schoolCode, data }) => {
  const classes = useStyles();
  const [schoolDetails, setSchoolDetails] = useState(null);

  const getSchoolDetails = () => {
    getSchoolBySchoolCode(schoolCode)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getSchoolDetails();
  }, [schoolCode]);

  const TooltipInterface = CustomStyled(({ ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: 'crm-tooltip-wrapper' }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#CFE0FF',
      fontSize: 16,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#CFE0FF',
      color: '#202124',
      padding: '6px',
      fontSize: '10px',
      borderRadius: '4px',
      // marginTop: '4px',
    },
  }));


  let schoolClasses = schoolDetails?.classes?.map((obj) => obj?.[0]);

  return (
    <Box
      className="crm-school-quotation-school-details"
    >
      <Grid container spacing={2.5} className="crm-school-quotation-school-details-list">
        <Grid item md={3} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle} >
               Company Name
            </Typography>
            <Typography component={"p"} className={classes.subTitle} >
              {data?.company_name || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={3} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle} >
              Financial Year
            </Typography>
            <Typography component={"p"} className={classes.subTitle} >
              {data?.financial_year || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={3} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle} >
              Ledger Start 
            </Typography>
            <Typography component={"p"} className={classes.subTitle} >
              {data?.ledger_start_date || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={3} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle} >
              Ledger End
            </Typography>
            <Typography component={"p"} className={classes.subTitle} >
              {data?.ledger_end_date || "N/A"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
