import Revenue from "../MyLeads/Revenue";
import Slider from "../MyLeads/Slider";
import Page from "../Page";
import { useStyles } from "../../css/Dasboard-css";
import { Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import Iframe from "react-iframe";
import settings from "../../config/settings";
import Attendance from "../bdeDashboard/Attendance";
import { TodayMeeting } from "../SchoolDashboard/TodayMeeting";
import { MissedMeeting } from "../SchoolDashboard/MissedMeeting";
import { UpcomingMeeting } from "../SchoolDashboard/UpcomingMeeting";
import { CollectionMeeting } from "../SchoolDashboard/CollectionMeeting";
import { RenewalMeeting } from "../SchoolDashboard/RenewalMeeting";
import { SchoolTarget } from "../SchoolDashboard/SchoolTarget";
import SchoolRevenue from "../MyLeads/SchoolRevenue";
import ApprovalRequest from "../SchoolDashboard/ApprovalRequest";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import { getLoginUserData } from "../../helper/randomFunction";
import { getAttendanceData } from "../../config/services/attendance";
import {
  getActivityMaxScore,
  getAddendancePoint,
} from "../../helper/DataSetFunction";
import CubeDataset from "../../config/interface";
import { MeetingPlanner } from "../SchoolDashboard/MeetingPlanner";
import { DecryptData } from "../../utils/encryptDecrypt";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getOwnerInterestList } from "../../config/services/leadInterest";
import {
  checkLeadStageStatus,
  getBdeActivitiesByDate,
} from "../../config/services/bdeActivities";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Statistics } from "../SchoolDashboard/Statistics";
import { sendEventToAppPlatform } from "../../helper/randomFunction/activityData";
import { getServerTime } from "../../config/services/config";
import { useLocation } from "react-router-dom";
import FooterMenu from "../../theme/FooterMenu";
import { DashboardClaimsMobile } from "../SchoolDashboard/DashboardClaimsMobile";
import { DashboardMetricsMobile } from "../SchoolDashboard/DashboardMetricsMobile";
import SchoolList from "../school/SchoolList";
//import { appReducerActions } from "../../redux/reducers/appReducer";
import { ReactComponent as IconEndDay } from './../../assets/icons/icon-log-activity-end.svg';

export const SchoolDashboard = () => {
  const classes = useStyles();
  const location = useLocation();
  const appEvents = useSelector(state => state.appEvents)
  const dispatch = useDispatch()
  //console.log(appEvents)
  //const dispatch = useDispatch()
  const loginUserData = getLoginUserData();
  const roleName = loginUserData?.userData?.crm_role;
  const profileName = loginUserData?.userData?.crm_profile;
  const [currentTab, setCurrentTab] = useState(0);
  const [schoolMeeting, setSchoolMeeting] = useState([]);
  const [plannerDate, setPlannerDate] = useState(moment().format("YYYY-MM-DD"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [dashboardUrl, setDashboardUrl] = useState(null);
  const [isActivityLog, setActivityLog] = useState(false)
  const [filterValue, setFilterValue] = useState('This Year')

  let roleList = localStorage.getItem("childRoles")
    ? DecryptData(localStorage.getItem("childRoles"))?.length
      ? DecryptData(localStorage.getItem("childRoles"))?.map(
          (obj) => obj?.roleName
        )
      : [getUserData("userData")?.crm_role]
    : [];

  const [ownerInterest, setOwnerInterest] = useState([]);
  const [leadStatus, setLeadStatus] = useState(false);


  useEffect(() => {
    document.body.classList.remove("crm-is-inner-page");
  }, []);

  const {referenceCode, referenceType, schoolReferenceCode, productRefCode, allSchool} = location.state ? location.state : {}

  const getOwnerInt = async (data) => {
    let params = {
      childRoleNames: data,
    };
    try {
      let res = await getOwnerInterestList(params);
      if (res?.result) {
        //createStageStatus(res?.result);
        setOwnerInterest(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendAppEvent = async (type) => {
    let serverTime = await getServerTime();
    let loginData = DecryptData(localStorage.getItem("userData"));
    loginData = loginData ? JSON.parse(loginData) : null;
    if (type === "start") {
      let eventType = "startMyDay";
      let uuid = "";
      let role = "";
      if (loginData) {
        uuid = loginData.employee_code ?? loginData.lead_id;
        role = loginData.crm_role;
      }
      sendEventToAppPlatform(eventType, {
        uuid: uuid,
        role: role,
        serverTime: serverTime.dateTime,
      }); 
      //dispatch(appReducerActions.eventTrigger({eventFlag: true}))          
    } else {
      let eventType = "endMyDay";
      let selectedDate = moment().format("YYYY-MM-DD");
      let meetingPlan = [];
      if (selectedDate != plannerDate) {
        meetingPlan = await getPlannerActivity(selectedDate, true);
      } else {
        meetingPlan = JSON.parse(JSON.stringify(schoolMeeting));
      }
      meetingPlan = meetingPlan.map((obj) => {
        let newObj = {
          uuid: loginData?.employee_code ?? loginData?.lead_id,
          role: loginData?.crm_role,
          schoolCode: obj.schoolCode,
          dateTime: obj.meetingDate[0],
          latitude: obj.lat,
          longitude: obj.long,
          geoTagId: obj.geoTag,
        };
        return newObj;
      });
      let uuid = "";
      let role = "";
      if (loginData) {
        uuid = loginData.employee_code ?? loginData.lead_id;
        role = loginData.crm_role;
      }
      let eventObj = {
        uuid: uuid,
        role: role,
        meetingPlan: meetingPlan,
        serverTime: serverTime.dateTime,
      };
      sendEventToAppPlatform(eventType, eventObj);
    }
  };

  const getPlannerActivity = useCallback(
    async (meetingDate, setFlag = false) => {
      setPlannerDate(meetingDate);
      let params = {
        roleName: getUserData("userData")?.crm_role,
        meetingDate: moment(meetingDate).format("YYYY-MM-DD"),
      };

      try {
        let data;
        let res = await getBdeActivitiesByDate(params);
        data = res?.result;
        if (setFlag) {
          return data?.length > 0 ? data : [];
        } else {
          if (data?.length > 0) {
            setSchoolMeeting(data);
          } else {
            setSchoolMeeting([]);
          }
        }
      } catch (err) {
        if (setFlag) {
          return [];
        } else {
          setSchoolMeeting([]);
        }
        console.error(err);
      }
    }
  );

  const createStageStatus = async (data) => {
    let params = {
      interest: data,
    };
    try {
      let res = await checkLeadStageStatus(params);
      if (res) {
        // setLeadStatus(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let loginData = DecryptData(localStorage.getItem("userData"));
    loginData = loginData ? JSON.parse(loginData) : null;
    if (roleList) {
      getOwnerInt(roleList);
    }
    if (loginData) {
      const url = `${settings.REPORT_ENGINE_URL}/setcreds/${loginData.crm_role}?role=EM_CRM&redirectURL=/embedDashboard/${settings.SCHOOL_DASHBOARD_KEY}&lang=en&app=crm`;
      setDashboardUrl(url);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const addLogActivity = (status) => {
    setActivityLog(status)
  }

  const handleFilterChange = (e) =>{
    setFilterValue(e)
  }

  return (
    <>
      <Page title="Dashboard">
        <Grid className="crm-sd-wrapper" sx={{ px: "20px", py: "20px" }}>
          {isMobile ? (
            <>
              {/* <Box className="crm-tabs theme1-tabs">
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  TabIndicatorProps={{
                    sx: {
                      backgroundColor: "transparent",
                    },
                    children: <span />,
                  }}
                  allowScrollButtonsMobile
                >
                  {[
                    { tabName: "Dashboard", id: 1 },
                    { tabName: "Planner", id: 2 },
                  ]?.map((tab, i) => (
                    <Tab
                      key={i}
                      className="tab-item"
                      value={tab.id}
                      label={
                        <Grid
                          container
                          alignItems="center"
                          justify="center"
                          className="tab-item-box"
                        >
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="h5" className="tab-item-label">
                              {" "}
                              {tab.tabName}
                            </Typography>
                          </Box>
                        </Grid>
                      }
                    />
                  ))}
                </Tabs>
              </Box>

              {currentTab === 1 ? (
                <>
                  <Box className="crm-sd-heading">
                    <Typography component="h2">My Team Revenue</Typography>
                  </Box>
                </>
              ) : null}
               */}

              {(currentTab === 0) ? (
                <>
                  <Box className="crm-sd-revenue-mobile">
                    <Box className="crm-sd-heading">
                      <Typography component="h2">Revenue Summary</Typography>
                      <Typography component="p">Quick glimpse on your targets and achievements</Typography>
                    </Box>
                    <SchoolRevenue handleFilterChange={handleFilterChange}/>
                  </Box>
                  <Box className="crm-sd-meetings-mobile">
                    <MeetingPlanner
                      getPlannerActivity={getPlannerActivity}
                      schoolMeeting={schoolMeeting}
                      isLogActivityStatus={addLogActivity}
                      referenceCode={referenceCode}
                      referenceType={referenceType}
                      schoolReferenceCode={schoolReferenceCode}
                      productRefCode={productRefCode}
                      allSchool={allSchool}
                      currentTabType={'dashboard-mobile'}
                    />
                  </Box>

                  



                  <Box className="crm-sd-claims-mobile">
                    <DashboardClaimsMobile filterValue={filterValue} />
                  </Box>
                  <Box className="crm-sd-performance-mobile">
                    <DashboardMetricsMobile filterValue={filterValue} />
                  </Box>
                </>
              ) 
              
              : (currentTab === 1) ?
                  <>
                    <Box className="crm-sd-missed-meetings-mobile">
                      <MissedMeeting isLogActivityStatus={addLogActivity} isLogActivity={isActivityLog} />
                    </Box>
                    <Box className="crm-sd-meetings-mobile">
                      <MeetingPlanner
                        getPlannerActivity={getPlannerActivity}
                        schoolMeeting={schoolMeeting}
                        isLogActivityStatus={addLogActivity}
                        referenceCode={referenceCode}
                        referenceType={referenceType}
                        schoolReferenceCode={schoolReferenceCode}
                        productRefCode={productRefCode}
                        allSchool={allSchool}
                        currentTabType="planner-mobile"
                      />
                    </Box>
                  </>
                  : (currentTab === 2)  ?
                      <>
                        <SchoolList currentTabType="dashboard-schools-mobile" />
                      </>

                    : null
              
              }
              {appEvents.appPlatform && ( 
                <Box className="crm-sd-floater-bottom">
                  {appEvents.eventFlag ? (
                    <a
                      onClick={(e) => sendAppEvent("end")}
                      className="crm-sd-floater-bottom-icon"
                      title="End my day"
                    >
                      <IconEndDay />
                    </a>
                  ) : (
                    <Box sx={{mb: 3}}>
                      <a
                        onClick={(e) => sendAppEvent("start")}
                        className="crm-sd-floater-bottom-label"
                      >
                        Start my day
                      </a>
                    </Box>                    
                  )}
                </Box>
              )}
            </>
          ) : null}

          {!isMobile ? (
            <>
              
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={8}>
                  <Box className={`crm-sd-revenue`}>
                    <SchoolRevenue />
                  </Box>
                  <Box className="crm-sd-card-container">
                    {dashboardUrl && (
                      <Iframe
                        src={dashboardUrl}
                        width="100%"
                        styles={{
                          border: "none",
                          minHeight: "800px",
                          marginLeft: "10px",
                          marginRight: "25px",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <MeetingPlanner
                    getPlannerActivity={getPlannerActivity}
                    schoolMeeting={schoolMeeting}
                    isLogActivityStatus={addLogActivity}
                    referenceCode={referenceCode}
                    referenceType={referenceType}
                    productRefCode={productRefCode}
                    allSchool={allSchool}
                    schoolReferenceCode={schoolReferenceCode}
                  />
                  {/* <TodayMeeting /> */}
                  <Grid className="crm-sd-card-container" sx={{ mt: "20px" }}>
                    <MissedMeeting  isLogActivityStatus={addLogActivity} isLogActivity={isActivityLog}/>
                  </Grid>
                  {/* <Grid className={`${classes.cusCard}`} sx={{ mt: "16px" }}>
                          <UpcomingMeeting />
                        </Grid>
                        <Grid className={`${classes.cusCard}`} sx={{ mt: "16px" }}>
                          <CollectionMeeting />
                        </Grid>
                        <Grid className={`${classes.cusCard}`} sx={{ mt: "16px" }}>
                          <RenewalMeeting />
                        </Grid>
                        <Grid>
                          <ApprovalRequest/>
                        </Grid> */}
                </Grid>
              </Grid>
            </>
            ) : null
            
            
          }


          <FooterMenu activeKey={currentTab} updateTabChange={(id) => setCurrentTab(id)} />
        </Grid>
      </Page>
    </>
  );
};
