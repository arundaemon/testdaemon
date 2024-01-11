import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Modal, Typography } from "@mui/material";
import { getBdeActivities } from "../../config/services/school";
import moment from "moment";
import CrossIcon from "../../assets/image/crossIcn.svg";
import { DisplayLoader } from "../../helper/Loader";
import _ from "lodash";
import IconActivityCardPhone from './../../assets/icons/icon-school-activity-phone.png';
import {ReactComponent as IconSchoolActivityPhone} from './../../assets/icons/icon-school-details-activity-phone.svg';
import useMediaQuery from "@mui/material/useMediaQuery";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};
const SchoolBDEActivities = ({ interest }) => {
  const [bdeActivities, setBdeActivities] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [indexData, setIndexData] = useState([]);
  const [loader, setLoader] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const getBdeRecentActivityDetails = async () => {
    let leadIds = interest?.map((item) => item?.leadId);

    if (leadIds?.length > 0) {
      let params = { leadIds };
      setLoader(false);
      try {
        const res = await getBdeActivities(params);
        let data = res?.result;
        setBdeActivities(data);
        setLoader(true);
      } catch (err) {
        console.error(err, "Error while fetching BDE Activities");
        setLoader(true);
      }
    }
    setLoader(true);
  };

  const handleViewDetails = (data) => {
    setViewDetails(!viewDetails);
    setIndexData(data);
  };

  useEffect(() => {
    getBdeRecentActivityDetails();
  }, [interest != undefined]);


  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      {loader ? (
        <div
          className="allCardContaienr"
        >
          <section>
            {bdeActivities?.map((data, i) => {
              return (
                <>
                {
                  isMobile
                    ? <div
                        key={i}
                        className="crm-school-lead-activity-card"
                      >
                        <div className="crm-school-lead-activity-card-container" >
                          <div className="crm-school-lead-activity-card-header">
                            <div className="crm-school-lead-activity-card-header-item">
                              <div className="crm-school-lead-activity-card-phone-icon">
                                <img src={IconActivityCardPhone} title="" />
                              </div>
                              <div className="crm-school-lead-activity-card-title">
                                <Typography component={"h3"} >{data?.contactDetails?.[0]?.[0]?.name ?? "NA"}</Typography>
                                <Typography component={"p"} >Mob: {data?.contactDetails?.[0]?.[0]?.mobileNumber ?? "NA"} |</Typography>
                              </div>
                            </div>
                            <div className="">
                              <div
                                className="crm-anchor crm-anchor-small crm-school-lead-activity-details"
                                onClick={() => handleViewDetails(data)}
                                
                              >
                                Complete Activity
                              </div>
                            </div>
                          </div>
      
                          <Typography className="crm-school-lead-activity-card-info" component={"p"} >Email: <b>{data?.contactDetails?.[0]?.[0]?.emailId ?? "NA"}</b></Typography>
                          <Typography className="crm-school-lead-activity-card-info" component={"p"} >Meeting Status: <b>{data?.meetingStatus?.[0] ?? "NA"} {"|"}</b></Typography>
                          <Typography className="crm-school-lead-activity-card-info" component={"p"} >Product: <b>{data?.name?.join(", ") ?? "NA"} {"|"}</b></Typography>
                          <Typography className="crm-school-lead-activity-card-info" component={"p"} >Created Date & Time: 
                            <b>
                              {data?.activityDate?.[0]
                                ? moment
                                    .utc(data?.activityDate?.[0])
                                    .format("DD-MM-YYYY - hh:mm A")
                                : "NA"}
                            </b>
                          </Typography>
                          <Typography className="crm-school-lead-activity-card-info" component={"p"} >
                            {data?.comments?.[0] && (
                              <div>{data?.comments?.[0]} </div>
                            )}
                          </Typography>
                        </div>
                      </div>
                      
                    : <div
                        key={i}
                        style={{
                          border: "1px solid #DEDEDE",
                          borderRadius: "4px",
                          padding: "15px",
                          marginBottom: "10px",
                          marginTop: "10px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            float: "right",
                          }}
                          className="crm-anchor crm-anchor-small"
                          onClick={() => handleViewDetails(data)}
                        >
                          Activity Details
                        </div>
                        <div className="crm-school-details-activity-content-wrapper">
                          <div className="">
                            <IconSchoolActivityPhone />
                          </div>
                          <div className="crm-school-details-activity-content">
                            <div className="crm-school-details-activity-title" >
                                Conversation with:{" "}
                                {data?.contactDetails?.[0]?.[0]?.name ?? "NA"}
                              </div>
                              <div className="crm-school-details-activity-info">
                                Mob: {data?.contactDetails?.[0]?.[0]?.mobileNumber ?? "NA"}{" "}
                                {"|"} Email:{" "}
                                {data?.contactDetails?.[0]?.[0]?.emailId ?? "NA"}{" "}
                              </div>
                              <div className="crm-school-details-activity-info">
                                Meeting Status: {data?.meetingStatus?.[0] ?? "NA"} {"|"}{" "}
                                Product: {data?.name?.join(", ") ?? "NA"}{" "}
                              </div>
                              <div className="crm-school-details-activity-info">
                                Created Date & Time:{" "}
                                {data?.activityDate?.[0]
                                  ? moment
                                      .utc(data?.activityDate?.[0])
                                      .format("DD-MM-YYYY - hh:mm A")
                                  : "NA"}{" "}
                              </div>
                              {data?.comments?.[0] && (
                                <div className="crm-school-details-activity-info">Comments: {data?.comments?.[0]} </div>
                              )}
                            </div>
                        </div>
                      </div>
                }
                </>
              );
            })}
          </section>
          {bdeActivities?.length === 0 && interest?.length === 0 && (
            <b style={{ marginLeft: "10px" }}>No Activities data found </b>
          )}
        </div>
      ) : (
        <div style={{ marginLeft: "12px", marginTop: "12px" }}>
          {DisplayLoader()}
        </div>
      )}
      {viewDetails && (
        <Modal
          hideBackdrop={true}
          open={handleViewDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="targetModal1"
        >
          {
            isMobile
              ? <Box
                  sx={style}
                  className="modalContainer"
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "30px 22px" : "32px",
                    width: (window.innerWidth < 1024) ? '90%' : "70%",
                    height: (window.innerWidth < 1024) ? '80%' : "50%",
                    // marginLeft: "30px",
                    overflow: "scroll",
                    outline: "0"
                  }}
                >
                  <p
                    className="crm-school-lead-activity-modal-heading"
                  >
                    Activity Details
                  </p>
                  <div style={{ marginBottom: "10px", overflow: "scroll" }} className="crm-school-lead-activity-modal-content">
                    <img
                      onClick={handleViewDetails}
                      className="crossIcon"
                      src={CrossIcon}
                      alt=""
                    />
                    <Typography component="p" >Conversation with: <b>{indexData?.contactDetails?.[0]?.[0]?.name ?? "NA"}</b></Typography>
                    <Typography component="p" >Mob: <b>{indexData?.contactDetails?.[0]?.[0]?.mobileNumber ?? "NA"}</b></Typography>
                    <Typography component="p" >Email: <b>{indexData?.contactDetails?.[0]?.[0]?.emailId ?? "NA"}</b></Typography>
                    <Typography component="p" >Meeting Status: <b>{indexData?.meetingStatus?.[0] ?? "NA"} {"|"}</b></Typography>
                    <Typography component="p" >Product: <b>{indexData?.name?.join(", ") ?? "NA"}</b></Typography>
                    <Typography component="p" >
                      Created Date & Time: <b>{indexData?.activityDate?.[0]
                        ? moment
                            .utc(indexData?.activityDate?.[0])
                            .format("DD-MM-YYYY - hh:mm A")
                        : "NA"}</b>
                    </Typography>
                    
                  </div>
                  <Divider />
                  <div style={{ marginBottom: "10px", overflow: "scroll" }} className="crm-school-lead-activity-modal-content">
                    {indexData?.name?.map((name, i) => {
                      return (
                        <React.Fragment key={i}>
                          <div style={{ paddingBottom: '10px', marginTop: "10px", marginBottom: "10px" }} >
                            <Typography component="h4">{name}</Typography>
                            <Typography component="p" >Customer Response: <b>{indexData?.customerResponse?.[i] ?? "NA"}</b></Typography>
                            <Typography component="p" >
                              Stage: <b>{indexData?.leadStage?.[i] ?? "NA"}</b>
                              {" | "}
                              Status: <b>{indexData?.leadStatus?.[i]}</b>
                            </Typography>
                            <Typography component="p" >Next Meeting Date: 
                              <b>
                                {indexData?.nextMeetingDate?.[i]
                                  ? moment
                                      .utc(indexData?.nextMeetingDate?.[i])
                                      .format("DD/MM/YYYY - hh:mm A")
                                  : "NA"}
                              </b>
                            </Typography>
                            <Typography component="p" >
                              Priority: <b>{indexData?.priority?.[i] ?? "NA"}</b>
                              {" | "}
                              {indexData?.subject?.[i] ? (
                                <>
                                  Subject: <b>{indexData?.subject?.[i]}</b> {" | "}
                                </>
                              ) : null}
                            </Typography>
                            {indexData?.productType?.[i] 
                              ? <Typography component="p" >Product Type: <b>{indexData?.productType?.[i] ?? "NA"}</b></Typography>
                              : null}
                            {indexData?.escUnit?.[i] 
                              ? <Typography component="p" >ESC Unit: <b>{indexData?.escUnit?.[i] ?? "NA"}</b></Typography>
                              : null}
                             {indexData?.duration?.[i] 
                              ? <Typography component="p" >Contract Duration: <b>{indexData?.duration?.[i] ?? "NA"}</b></Typography>
                              : null}
                            {indexData?.ratePerStudent?.[i] 
                              ? <Typography component="p" >Rate/Student: <b>{indexData?.ratePerStudent?.[i] ?? "NA"}</b></Typography>
                              : null}
                            {indexData?.ratePerClassroom?.[i] 
                              ? <Typography component="p" >Rate Classroom: <b>{indexData?.ratePerClassroom?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.paymentSchedule?.[i] 
                              ? <Typography component="p" >Payment Schedule: <b>{indexData?.paymentSchedule?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.edc?.[i] 
                              ? <Typography component="p" >EDC Date: <b>{indexData?.edc?.[i] ? moment(indexData?.edc?.[i])?.format( "DD-MM-YYYY" ) : "NA"}</b></Typography>
                              : null}
                              {indexData?.netMonthlyInvoicing?.[i] 
                              ? <Typography component="p" >Monthly Invoice: <b>{indexData?.netMonthlyInvoicing?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.softwareContractValue?.[i] 
                              ? <Typography component="p" >Software Contract Value: <b>{indexData?.softwareContractValue?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.totalContractValue?.[i] 
                              ? <Typography component="p" >Total Contract Value: <b>{indexData?.totalContractValue?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.grossRatePerUnit?.[i] 
                              ? <Typography component="p" >Gross Rate Per Unit: <b>{indexData?.grossRatePerUnit?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.netRatePerUnit?.[i] 
                              ? <Typography component="p" >Net Rate per Unit: <b>{indexData?.netRatePerUnit?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.grades?.[i] 
                              ? <Typography component="p" >Grade/s: <b>{indexData?.grades?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.units?.[i] 
                              ? <Typography component="p" >Units: <b>{indexData?.units?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.grossContractValue?.[i] 
                              ? <Typography component="p" >Gross Contract Value: <b>{indexData?.grossContractValue?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.grossSellingPricePerStudent?.[i] 
                              ? <Typography component="p" >Gross Selling Price per Student: <b>{indexData?.grossSellingPricePerStudent?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.weeklyExclusiveDoubtSession?.[i] 
                              ? <Typography component="p" >Weekly Exclusive Doubt Session: <b>{indexData?.weeklyExclusiveDoubtSession?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.weeklyExclusiveDoubtSession?.[i] 
                              ? <Typography component="p" >Weekly Exclusive Doubt Session: <b>{indexData?.weeklyExclusiveDoubtSession?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.assessmentCentrePricePerStudent?.[i] 
                              ? <Typography component="p" >Assessment Centre Price per Student: <b>{indexData?.assessmentCentrePricePerStudent?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.testPrepPackageSellingPricePerStudent?.[i] 
                              ? <Typography component="p" >Test Prep Package Selling Price per Student: <b>{indexData?.testPrepPackageSellingPricePerStudent?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.numberOfStudentsPerBatch?.[i] 
                              ? <Typography component="p" >Number of Students per Batch: <b>{indexData?.numberOfStudentsPerBatch?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.numberOfBatches?.[i] 
                              ? <Typography component="p" >Number of Batches: <b>{indexData?.numberOfBatches?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.assessmentCenter?.[i] 
                              ? <Typography component="p" >Assessment Center: <b>{indexData?.assessmentCenter?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.offeringType?.[i] 
                              ? <Typography component="p" >Offering type: <b>{indexData?.offeringType?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.lectureDeliveryType?.[i] 
                              ? <Typography component="p" >Lecture Delivery Type: <b>{indexData?.lectureDeliveryType?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.course?.[i] 
                              ? <Typography component="p" >Course: <b>{indexData?.course?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.studentUnit?.[i] 
                              ? <Typography component="p" >Student Unit: <b>{indexData?.studentUnit?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.hardwareContractValue?.[i] 
                              ? <Typography component="p" >Hardware Contract Value: <b>{indexData?.hardwareContractValue?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.hardwareProduct?.[i] 
                              ? <Typography component="p" >Hardware Product: <b>{indexData?.hardwareProduct?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.hardware?.[i] 
                              ? <Typography component="p" >Hardware: <b>{indexData?.hardware?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.monthlyInvoice?.[i] 
                              ? <Typography component="p" >Monthly Invoice: <b>{indexData?.monthlyInvoice?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.contactDurationInMonths?.[i] 
                              ? <Typography component="p" >Contact Duration (in months): <b>{indexData?.contactDurationInMonths?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.visitOutcome?.[i] 
                              ? <Typography component="p" >Visit Outcome: <b>{indexData?.visitOutcome?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.numberofStudent?.[i] 
                              ? <Typography component="p" >Number of Students: <b>{indexData?.numberofStudent?.[i] ?? "NA"}</b></Typography>
                              : null}
                              {indexData?.units?.[i] 
                              ? <Typography component="p" >Units: <b>{indexData?.units?.[i] ?? "NA"}</b></Typography>
                              : null}
                            
                          </div>
                          <Divider />
                        </React.Fragment>
                      );
                    })}
                    {indexData?.minutesOfMeeting?.[0] && (
                      <>
                        <p style={{ fontWeight: "600" }}>Minutes of Meetings</p>
                        <p>{indexData?.minutesOfMeeting?.[0]}</p>
                      </>
                    )}
                  </div>
                </Box>

              : <Box
                  sx={style}
                  className="modalContainer"
                  style={{
                    borderRadius: "8px",
                    width: (window.innerWidth < 1024) ? '90%' : "70%",
                    height: (window.innerWidth < 1024) ? '80%' : "50%",
                    // marginLeft: "30px",
                    overflow: "scroll",
                    outline: "0"
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "26px",
                      marginBottom: "15px",
                    }}
                  >
                    Activity Details
                  </p>
                  <div style={{ marginBottom: "10px", overflow: "scroll" }}>
                    <img
                      onClick={handleViewDetails}
                      className="crossIcon"
                      src={CrossIcon}
                      alt=""
                    />
                    <div style={{ fontWeight: "600", fontSize: "18px" }}>
                      Conversation with:{" "}
                      {indexData?.contactDetails?.[0]?.[0]?.name ?? "NA"}
                    </div>
                    <div>
                      Mob: {indexData?.contactDetails?.[0]?.[0]?.mobileNumber ?? "NA"}{" "}
                      {"|"} Email:{" "}
                      {indexData?.contactDetails?.[0]?.[0]?.emailId ?? "NA"}
                    </div>
                    <div>
                      Meeting Status: {indexData?.meetingStatus?.[0] ?? "NA"} {"|"}{" "}
                      Product: {indexData?.name?.join(", ") ?? "NA"}
                    </div>
                    <div>
                      Created Date & Time:{" "}
                      {indexData?.activityDate?.[0]
                        ? moment
                            .utc(indexData?.activityDate?.[0])
                            .format("DD-MM-YYYY - hh:mm A")
                        : "NA"}
                    </div>
                  </div>
                  <Divider />
                  {indexData?.name?.map((name, i) => {
                    return (
                      <>
                        <div
                          key={i}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <p style={{ fontWeight: "600" }}>{name}</p>
                          <div style={{ marginBottom: "20px", width: "fit-content" }}>
                            Customer Response:{" "}
                            <b>{indexData?.customerResponse?.[i] ?? "NA"}</b> {"| "}
                            Stage: <b>{indexData?.leadStage?.[i]}</b> {"|"}
                            Status: <b>{indexData?.leadStatus?.[i]}</b> {"|"}
                            Next Meeting Date:{" "}
                            <b>
                              {indexData?.nextMeetingDate?.[i]
                                ? moment
                                    .utc(indexData?.nextMeetingDate?.[i])
                                    .format("DD/MM/YYYY - hh:mm A")
                                : "NA"}
                            </b>{" "}
                            {"| "}
                            Priority: <b>{indexData?.priority?.[i] ?? "NA"}</b> {"| "}
                            {indexData?.subject?.[i] ? (
                              <>
                                Subject: <b>{indexData?.subject?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.productType?.[i] ? (
                              <>
                                Product Type: <b>{indexData?.productType?.[i]}</b>{" "}
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.escUnit?.[i] ? (
                              <>
                                ESC Unit: <b>{indexData?.escUnit?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.duration?.[i] ? (
                              <>
                                Contract Duration: <b>{indexData?.duration?.[i]}</b>{" "}
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.ratePerStudent?.[i] ? (
                              <>
                                Rate/Student: <b>{indexData?.ratePerStudent?.[i]}</b>{" "}
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.ratePerClassroom?.[i] ? (
                              <>
                                Rate Classroom:{" "}
                                <b>{indexData?.ratePerClassroom?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.paymentSchedule?.[i] ? (
                              <>
                                Payment Schedule:{" "}
                                <b>{indexData?.paymentSchedule?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.edc?.[i] ? (
                              <>
                                EDC Date:{" "}
                                <b>
                                  {indexData?.edc?.[i]
                                    ? moment(indexData?.edc?.[i])?.format(
                                        "DD-MM-YYYY"
                                      )
                                    : "NA"}
                                </b>{" "}
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.netMonthlyInvoicing?.[i] ? (
                              <>
                                Monthly Invoice:{" "}
                                <b>{indexData?.netMonthlyInvoicing?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.softwareContractValue?.[i] ? (
                              <>
                                Software Contract Value:{" "}
                                <b>{indexData?.softwareContractValue?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.totalContractValue?.[i] ? (
                              <>
                                Total Contract Value:{" "}
                                <b>{indexData?.totalContractValue?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.grossRatePerUnit?.[i] ? (
                              <>
                                Gross Rate Per Unit:{" "}
                                <b>{indexData?.grossRatePerUnit?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.netRatePerUnit?.[i] ? (
                              <>
                                Net Rate per Unit:{" "}
                                <b>{indexData?.netRatePerUnit?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.grades?.[i] ? (
                              <>
                                Grade/s: <b>{indexData?.netRatePerUnit?.[i]}</b>{" "}
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.units?.[i] ? (
                              <>
                                Units: <b>{indexData?.units?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.grossContractValue?.[i] ? (
                              <>
                                Gross Contract Value:{" "}
                                <b>{indexData?.grossContractValue?.[i]}</b> {"| "}
                              </>
                            ) : null}
                            {indexData?.grossSellingPricePerStudent?.[i] ? (
                              <>
                                Gross Selling Price per Student:{" "}
                                <b>{indexData?.grossSellingPricePerStudent?.[i]} </b>{" "}
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.weeklyExclusiveDoubtSession?.[i] ? (
                              <>
                                Weekly Exclusive Doubt Session:{" "}
                                <b>{indexData?.weeklyExclusiveDoubtSession?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.assessmentCentrePricePerStudent?.[i] ? (
                              <>
                                Assessment Centre Price per Student:{" "}
                                <b>
                                  {indexData?.assessmentCentrePricePerStudent?.[i]}{" "}
                                </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.testPrepPackageSellingPricePerStudent?.[i] ? (
                              <>
                                Test Prep Package Selling Price per Student:{" "}
                                <b>
                                  {
                                    indexData
                                      ?.testPrepPackageSellingPricePerStudent?.[i]
                                  }{" "}
                                </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.numberOfStudentsPerBatch?.[i] ? (
                              <>
                                Number of Students per Batch:{" "}
                                <b>{indexData?.numberOfStudentsPerBatch?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.numberOfBatches?.[i] ? (
                              <>
                                Number of Batches:{" "}
                                <b>{indexData?.numberOfBatches?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.assessmentCenter?.[i] ? (
                              <>
                                Assessment Center:{" "}
                                <b>{indexData?.assessmentCenter?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.offeringType?.[i] ? (
                              <>
                                Offering type: <b>{indexData?.offeringType?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.lectureDeliveryType?.[i] ? (
                              <>
                                Lecture Delivery Type:{" "}
                                <b>{indexData?.lectureDeliveryType?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.course?.[i] ? (
                              <>
                                Course: <b>{indexData?.course?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.studentUnit?.[i] ? (
                              <>
                                Student Unit: <b>{indexData?.studentUnit?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.hardwareContractValue?.[i] ? (
                              <>
                                Hardware Contract Value:{" "}
                                <b>{indexData?.hardwareContractValue?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.hardwareProduct?.[i] ? (
                              <>
                                Hardware Product:{" "}
                                <b>{indexData?.hardwareProduct?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.hardware?.[i] ? (
                              <>
                                Hardware: <b>{indexData?.hardware?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.monthlyInvoice?.[i] ? (
                              <>
                                Monthly Invoice:{" "}
                                <b>{indexData?.monthlyInvoice?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.contactDurationInMonths?.[i] ? (
                              <>
                                Contact Duration (in months):{" "}
                                <b>{indexData?.contactDurationInMonths?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.visitOutcome?.[i] ? (
                              <>
                                Visit Outcome: <b>{indexData?.visitOutcome?.[i]} </b>
                                {"| "}
                              </>
                            ) : null}
                            {indexData?.numberofStudent?.[i] ? (
                              <>
                                Number of Students: <b>{indexData?.numberofStudent?.[i]}</b>{" "}
                                {"| "}
                              </>
                            ) : null}
                          </div>
                          <Divider />
                        </div>
                      </>
                    );
                  })}
                  {indexData?.minutesOfMeeting?.[0] && (
                    <>
                      <p style={{ fontWeight: "600" }}>Minutes of Meetings</p>
                      <p>{indexData?.minutesOfMeeting?.[0]}</p>
                    </>
                  )}
      
                </Box>
          }
          
        </Modal>
      )}
    </Grid>
  );
};

export default SchoolBDEActivities;
