import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { useStyles } from "../../css/Quotation-css";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled as CustomStyled } from "@mui/material/styles";

export const SchoolDetailBox = ({ schoolCode, getSchoolData }) => {
  const classes = useStyles();  
  const [schoolDetails, setSchoolDetails] = useState(null);

  const getSchoolDetails = () => {
    getSchoolBySchoolCode(schoolCode)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
        getSchoolData(details)
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if(schoolCode){
      getSchoolDetails();
    }
  }, [schoolCode]);

  const TooltipInterface = CustomStyled(({ ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: "crm-tooltip-wrapper" }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#CFE0FF",
      fontSize: 16,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#CFE0FF",
      color: "#202124",
      padding: "6px",
      fontSize: "10px",
      borderRadius: "4px",
      // marginTop: '4px',
    },
  }));

  function isSingleDimensionalArray(arr) {
    return arr?.every((element) => !Array.isArray(element));
  }

  let schoolClasses = isSingleDimensionalArray(schoolDetails?.classes)
    ? schoolDetails?.classes?.map((obj) => obj)
    : schoolDetails?.classes?.flat()?.map((obj) => obj);

  return (
    <Box className="crm-school-quotation-school-details">
      <Typography component={"h2"} className="crm-page-list-heading ">
        {schoolDetails?.schoolName}
      </Typography>
      <Grid
        container
        spacing={2.5}
        className="crm-school-quotation-school-details-list"
      >
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              School Code
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.schoolCode || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Type of Institute
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.typeOfInstitute || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Email
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.schoolEmailId
                ? schoolDetails?.schoolEmailId
                : "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Country
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.country || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              State
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.state || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              City
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.city || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Pin Code
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.pinCode || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Address
            </Typography>

            <TooltipInterface
              className="crm-tooltip"
              title={schoolDetails?.address}
            >
              <Typography
                component={"p"}
                className={"crm-school-quotation-school-details-info-address"}
              >
                {schoolDetails?.address || "N/A"}
              </Typography>
            </TooltipInterface>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Total Student
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.totalStudent ?? "NA"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Total Teacher
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.totalTeacher ?? "NA"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Board
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolDetails?.board || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box className="crm-school-quotation-school-details-info">
            <Typography component={"h3"} className={classes.subTitle}>
              Classes
            </Typography>
            <Typography component={"p"} className={classes.subTitle}>
              {schoolClasses?.map((obj) => obj?.value).join(", ")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
