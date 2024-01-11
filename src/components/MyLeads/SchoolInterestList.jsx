import React, { useEffect, useState } from 'react'
import { Box, Divider, Grid, Modal, Typography } from "@mui/material";
import { getBdeActivities } from '../../config/services/school';
import moment from 'moment';
import CrossIcon from "../../assets/image/crossIcn.svg"
import { DisplayLoader } from "../../helper/Loader";
import { useParams } from 'react-router-dom';
import FilterIcon from "../../assets/image/filterIcon.svg";
import LeadFilter from "../leadFilters/LeadFilter";
import { toast } from "react-hot-toast";
import _ from "lodash";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { makeStyles } from "@mui/styles";
import { getBdeActivitiesData } from '../../helper/DataSetFunction';
import { getCurrentActivities } from '../../config/services/bdeActivities';
import CubeDataset from '../../config/interface';
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

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  submitBtn: {
    fontWeight: "400 !important",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginLeft: "10px",
    "&:hover": {
      color: "#f45e29 !important",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  cusSelect: {
    width: "100%",
    fontSize: "14px",
    marginLeft: "1rem",
    borderRadius: "4px",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  mbForMob: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "1rem",
    },
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
  },
  noData: {
    // height: "50vh",
    // width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
}));

//http://localhost:3001/bdeActivities/getCurrentActivities?leadId=6492df25739262536eb851d1

const SchoolInterestList = () => {
  const classes = useStyles();
  const [bdeActivities, setBdeActivities] = useState([])
  const [viewDetails, setViewDetails] = useState(false)
  const [indexData, setIndexData] = useState([])
  const [loader, setLoader] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const { school_id, interest_id } = useParams()
  const [role] = useState('BDE_ACTIVITY')
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const getBdeRecentActivityDetails = async () => {
    let params = { leadId: interest_id }
    setLoader(false)
    try {
      const res = await getCurrentActivities(params)
      let data = res?.result
      setBdeActivities(data)
      setLoader(true)
    } catch (err) {
      console.error(err, 'Error while fetching BDE Activities')
      setLoader(true)
    }
    setLoader(true)
  }

  const getReportData = () => {
    setLoader(false)
    getBdeActivitiesData({ leadId: interest_id, filtersApplied })
      .then(res => {
        let data = res?.loadResponses?.[0]?.data
        setBdeActivities(data)
      })
      .catch(err => {
        console.error(err, 'Error in getBdeActivitiesData')
      })
    setLoader(true)

  }

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = "desc";
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("BdeActivityFilter", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setFilterAnchor(null);
  };

  const addFilter = () => {
    let filtersCopy = _.cloneDeep(filters);
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("First fill empty filter");
      return;
    }
    filtersCopy?.unshift({ label: "Select Filter" });
    setFilters(filtersCopy);
  };

  const removeFilter = (filterIndex) => {
    let filtersCopy = _.cloneDeep(filters);
    if (filters[0]?.label === 'Select Filter') {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
    }
    else {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
      setFiltersApplied(filtersCopy);
    }
    // setCheckedLeads([]);
    localStorage.setItem("BdeActivityFilter", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      // sortObj.sortKey = dataSetIndex.updatedAt;
      // sortObj.sortOrder = -1;
      localStorage.removeItem("BdeActivityFilter");
    }
  };

  const removeAllFilters = () => {
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = -1;
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("BdeActivityFilter");
  };

  const handleViewDetails = (data) => {
    setViewDetails(!viewDetails);
    setIndexData(data);
  };

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("BdeActivityFilter"));
    if (applyFilter === null) {
      getBdeRecentActivityDetails()
    }
    else if (filtersApplied?.length > 0) {
      getReportData()
    }
  }, [filtersApplied, interest_id])

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("BdeActivityFilter"));
    if (applyFilter) {
      setFiltersApplied(applyFilter)
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }
  }, [])


  console.log(indexData, '.............indexedData')

  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      <div className={classes.filterSection}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "100px", marginBottom: '12px' }} onClick={handleFilter}>
            <div className="filterContainer" style={{
              alignItems: 'center',
              border: '1px solid #dedede',
              borderRadius: '4px',
              color: '#85888a',
              cursor: 'pointer',
              display: 'flex',
              fontSize: '14px',
              height: '38px',
              justifyContent: 'center',
              width: '100px',
              marginBottom: '-10px'
            }}>
              <img src={FilterIcon} alt="FilterIcon" />
              <div style={{ marginLeft: '10px' }}>Filter</div>
            </div>
          </div>
        </div>
      </div>

      <LeadFilter
        applyFilters={applyFilters}
        filterAnchor={filterAnchor}
        setFilterAnchor={setFilterAnchor}
        addFilter={addFilter}
        filters={filters}
        setFilters={setFilters}
        removeAllFilters={removeAllFilters}
        removeFilter={removeFilter}
        role={role}
      />
      {
        loader ?
          (bdeActivities?.length > 0 ?
            <div div className="allCardContaienr" style={{ height: isMobile ? 'auto' : '518px', overflow: 'scroll', marginTop: '10px' }}>
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
                                <div className="crm-school-lead-activity-card-title ml-0">
                                  <Typography component={"h3"} >{data?.subject ?? data?.[CubeDataset.Bdeactivities.subject]}</Typography>
                                </div>
                              </div>
                              <Typography className="crm-school-lead-activity-card-info" component={"p"} >Product: <b>{data?.name ?? data?.[CubeDataset.Bdeactivities.name]} </b></Typography>
                              <Typography className="crm-school-lead-activity-card-info" component={"p"} >Conversation with: <b>{data?.name ?? data?.[CubeDataset.Bdeactivities.contactDetails]} </b></Typography>
                              <Typography className="crm-school-lead-activity-card-info" component={"p"} >Done by: <b>{data?.name ?? data?.[CubeDataset.Bdeactivities.createdByName]} </b></Typography>
                            </div>

                          </div>
                          : <div key={i} style={{
                            border: "1px solid #DEDEDE",
                            borderRadius: "4px",
                            padding: "15px",
                            marginBottom: "10px",
                            width: "100%"
                          }}>

                            <div
                              style={{
                                float: "right",
                              }}
                              className="crm-anchor crm-anchor-small"
                              onClick={() => handleViewDetails(data)}
                            >
                              Activity Details
                            </div>

                            <div style={{ fontWeight: '600', fontSize: '18px', marginTop: '-1px', marginBottom: '6px' }}>{data?.subject ?? data?.[CubeDataset.Bdeactivities.subject]}</div>

                            <div style={{ marginBottom: '3px' }}>
                              Product: {data?.name ?? data?.[CubeDataset.Bdeactivities.name]} {" | "}
                              Conversation with: {data?.contactDetails?.[0]?.name || (data?.[CubeDataset.Bdeactivities.contactDetails] && JSON.parse(data?.["Bdeactivities.contactDetails"])?.[0]?.name)}
                            </div>

                            <div>Done by: {data?.createdByName ?? data?.[CubeDataset.Bdeactivities.createdByName]} </div>
                            <div style={{ float: 'right', marginTop: '-43px' }}>
                              {data?.createdAt &&
                                moment.utc(data?.createdAt).local().format("DD-MM-YYYY - hh:mm A")
                              }
                              {data?.[CubeDataset.Bdeactivities.createdAt] &&
                                moment.utc(data?.[CubeDataset.Bdeactivities.createdAt]).local().format("DD-MM-YYYY - hh:mm A")
                              }
                            </div>



                          </div>
                      }
                    </>
                  );
                })}
              </section>
              {(bdeActivities?.length === 0) &&
                <b style={{ marginLeft: '10px' }}>No Activities data found </b>}
            </div >
            :
            <>
              <div className={classes.noData}>
                <p>No Activities Found</p>
              </div>
            </>)
          :
          <div style={{ marginLeft: "12px", marginTop: '12px' }}>
            {DisplayLoader()}
          </div>
      }

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
                  <Typography component="p" >Conversation with: <b>{indexData?.contactDetails?.[0]?.name ?? "NA"}</b></Typography>
                  <Typography component="p" >Mob: <b>{indexData?.contactDetails?.[0]?.mobileNumber ?? "NA"}</b></Typography>
                  <Typography component="p" >Email: <b>{indexData?.contactDetails?.[0]?.emailId ?? "NA"}</b></Typography>
                  {/* <Typography component="p" >Meeting Status: <b>{indexData?.meetingStatus?.[0] ?? "NA"} {"|"}</b></Typography> */}
                  <Typography component="p" >Product: <b>{indexData?.name ?? "NA"}</b></Typography>
                  <Typography component="p" >
                    Created Date & Time: <b>{indexData?.startDateTime
                      ? moment
                        .utc(indexData?.startDateTime)
                        .format("DD-MM-YYYY - hh:mm A")
                      : "NA"}</b>
                  </Typography>

                </div>
                <Divider />
                <div style={{ marginBottom: "10px", overflow: "scroll" }} className="crm-school-lead-activity-modal-content">
                  {indexData?.name?.map((name, i) => {
                    return (
                      <>
                        <div
                          key={i}
                          style={{ paddingBottom: '10px', marginTop: "10px", marginBottom: "10px" }}
                        >
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
                            ? <Typography component="p" >EDC Date: <b>{indexData?.edc?.[i] ? moment(indexData?.edc?.[i])?.format("DD-MM-YYYY") : "NA"}</b></Typography>
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
                      </>
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
                    {indexData?.contactDetails?.[0]?.name ?? "NA"}
                  </div>
                  <div>
                    Mob: {indexData?.contactDetails?.[0]?.mobileNumber ?? "NA"}{" "}
                    {"|"} Email:{" "}
                    {indexData?.contactDetails?.[0]?.emailId ?? "NA"}
                  </div>
                  <div>
                    Meeting Status: {indexData?.meetingStatus ?? "NA"} {"|"}{" "}
                    {/* Product: {indexData?.name?.join(", ") ?? "NA"} */}
                  </div>
                  <div>
                    Created Date & Time:{" "}
                    {indexData?.startDateTime
                      ? moment
                        .utc(indexData?.startDateTime)
                        .format("DD-MM-YYYY - hh:mm A")
                      : "NA"}
                  </div>
                </div>
                <Divider />

                <>
                  <div
                    // key={i}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <p style={{ fontWeight: "600" }}>{indexData?.name}</p>
                    <div style={{ marginBottom: "20px", width: "fit-content" }}>
                      Customer Response:{" "}
                      <b>{indexData?.customerResponse ?? "NA"}</b> {"| "}
                      Stage: <b>{indexData?.leadStage}</b> {"|"}
                      Status: <b>{indexData?.leadStatus}</b> {"|"}
                      Next Meeting Date:{" "}
                      <b>
                        {indexData?.followUpDateTime
                          ? moment
                            .utc(indexData?.followUpDateTime)
                            .format("DD/MM/YYYY - hh:mm A")
                          : "NA"}
                      </b>{" "}
                      {"| "}
                      Priority: <b>{indexData?.priority ?? "NA"}</b> {"| "}
                      {indexData?.subject ? (
                        <>
                          Subject: <b>{indexData?.subject}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.productType ? (
                        <>
                          Product Type: <b>{indexData?.productType}</b>{" "}
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.escUnit ? (
                        <>
                          ESC Unit: <b>{indexData?.escUnit}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.duration ? (
                        <>
                          Contract Duration: <b>{indexData?.duration}</b>{" "}
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.ratePerStudent ? (
                        <>
                          Rate/Student: <b>{indexData?.ratePerStudent}</b>{" "}
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.ratePerClassroom ? (
                        <>
                          Rate Classroom:{" "}
                          <b>{indexData?.ratePerClassroom}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.paymentSchedule ? (
                        <>
                          Payment Schedule:{" "}
                          <b>{indexData?.paymentSchedule}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.edc ? (
                        <>
                          EDC Date:{" "}
                          <b>
                            {indexData?.edc
                              ? moment(indexData?.edc)?.format(
                                "DD-MM-YYYY"
                              )
                              : "NA"}
                          </b>{" "}
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.netMonthlyInvoicing ? (
                        <>
                          Monthly Invoice:{" "}
                          <b>{indexData?.netMonthlyInvoicing}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.softwareContractValue ? (
                        <>
                          Software Contract Value:{" "}
                          <b>{indexData?.softwareContractValue}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.totalContractValue ? (
                        <>
                          Total Contract Value:{" "}
                          <b>{indexData?.totalContractValue}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.grossRatePerUnit ? (
                        <>
                          Gross Rate Per Unit:{" "}
                          <b>{indexData?.grossRatePerUnit}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.netRatePerUnit ? (
                        <>
                          Net Rate per Unit:{" "}
                          <b>{indexData?.netRatePerUnit}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.grades ? (
                        <>
                          Grade/s: <b>{indexData?.netRatePerUnit}</b>{" "}
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.units ? (
                        <>
                          Units: <b>{indexData?.units}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.grossContractValue ? (
                        <>
                          Gross Contract Value:{" "}
                          <b>{indexData?.grossContractValue}</b> {"| "}
                        </>
                      ) : null}
                      {indexData?.grossSellingPricePerStudent ? (
                        <>
                          Gross Selling Price per Student:{" "}
                          <b>{indexData?.grossSellingPricePerStudent} </b>{" "}
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.weeklyExclusiveDoubtSession ? (
                        <>
                          Weekly Exclusive Doubt Session:{" "}
                          <b>{indexData?.weeklyExclusiveDoubtSession} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.assessmentCentrePricePerStudent ? (
                        <>
                          Assessment Centre Price per Student:{" "}
                          <b>
                            {indexData?.assessmentCentrePricePerStudent}{" "}
                          </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.testPrepPackageSellingPricePerStudent ? (
                        <>
                          Test Prep Package Selling Price per Student:{" "}
                          <b>
                            {
                              indexData
                                ?.testPrepPackageSellingPricePerStudent
                            }{" "}
                          </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.numberOfStudentsPerBatch ? (
                        <>
                          Number of Students per Batch:{" "}
                          <b>{indexData?.numberOfStudentsPerBatch} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.numberOfBatches ? (
                        <>
                          Number of Batches:{" "}
                          <b>{indexData?.numberOfBatches} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.assessmentCenter ? (
                        <>
                          Assessment Center:{" "}
                          <b>{indexData?.assessmentCenter} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.offeringType ? (
                        <>
                          Offering type: <b>{indexData?.offeringType} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.lectureDeliveryType ? (
                        <>
                          Lecture Delivery Type:{" "}
                          <b>{indexData?.lectureDeliveryType} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.course ? (
                        <>
                          Course: <b>{indexData?.course} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.studentUnit ? (
                        <>
                          Student Unit: <b>{indexData?.studentUnit} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.hardwareContractValue ? (
                        <>
                          Hardware Contract Value:{" "}
                          <b>{indexData?.hardwareContractValue} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.hardwareProduct ? (
                        <>
                          Hardware Product:{" "}
                          <b>{indexData?.hardwareProduct} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.hardware ? (
                        <>
                          Hardware: <b>{indexData?.hardware} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.monthlyInvoice ? (
                        <>
                          Monthly Invoice:{" "}
                          <b>{indexData?.monthlyInvoice} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.contactDurationInMonths ? (
                        <>
                          Contact Duration (in months):{" "}
                          <b>{indexData?.contactDurationInMonths} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.visitOutcome ? (
                        <>
                          Visit Outcome: <b>{indexData?.visitOutcome} </b>
                          {"| "}
                        </>
                      ) : null}
                      {indexData?.numberofStudent ? (
                        <>
                          Number of Students: <b>{indexData?.numberofStudent}</b>{" "}
                          {"| "}
                        </>
                      ) : null}
                    </div>
                    <Divider />
                  </div>
                </>






                {/* {indexData?.name?.map((name, i) => {
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
                })} */}
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
    </Grid >
  )
}

export default SchoolInterestList

