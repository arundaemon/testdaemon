import React, { useState } from "react";
import Page from "../../components/Page";
import { Grid, Paper, styled, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Revenue from "../../components/MyLeads/Revenue";
import Slider from "../../components/MyLeads/Slider";
import PendingTask from "../../components/bdeDashboard/PendingTask";
import TaskCompleted from "../../components/bdeDashboard/TaskCompleted";
import MyTargets from "../../components/bdeDashboard/MyTargets";
import Attendance from "../../components/bdeDashboard/Attendance";
import { DayCalendar } from "../../components/Calendar/Schedules/DaySchedule";
import {
  ActivityData,
  getActivityMaxScore,
  getActivityPoint,
  getAddendancePoint,
  getCallTarget,
  getStateData,
  getTaskDate,
} from "../../helper/DataSetFunction";
import { getAttendancePoint } from "../../config/services/bdeActivities";
import { getAttendanceData } from "../../config/services/attendance";
import { NotifyAlert } from "../../components/Calendar/NotifyBox";
import moment from "moment";
import { useEffect } from "react";
import { getCubeBdActivity } from "../../config/services/cubeBdActivity";
import { getLoginUserData, getTaskSortData } from "../../helper/randomFunction";
import CubeDataset from "../../config/interface";
import { getBdeActivitiesByRoleName } from "../../config/services/bdeActivities";
import { activityLogger } from "../../config/services/activities";
import { getSortData } from "../../helper/randomFunction";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const useStyles = makeStyles((theme) => ({
  prevPointer: {
    fontSize: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  activePointer: {
    fontSize: "14px",
    fontWeight: "600",
  },
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  cusCard1: {
    [theme.breakpoints.down("md")]: {
      boxShadow: "none",
    },
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  subTitle: {
    fontSize: "14px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  selectSection: {
    borderRadius: "0",
    paddingBottom: "0",
    paddingTop: "1px",
  },
  borderRight: {
    borderRight: "1px solid #DEDEDE",
  },
  weekGrdBox: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    marginTop: "20px",
  },
  cardContainer: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  shuffleCard: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
    },
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#202124",
  },
  cardSubTitle: {
    fontSize: "12px",
    marginBottom: "10px",
  },
  lastCardWeb: {
    marginBottom: "50px",
    [theme.breakpoints.down("md")]: {
      marginBottom: "initial",
    },
  },
}));

export const BDEDashboard = () => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view_task, setTaskView] = useState("Today");
  const [view_target, setTargetView] = useState("Today");
  const [getScore, setScore] = useState(null);
  const [getMinMaxAttendance, setgetMinMaxAttendance] = useState([]);
  const [getCurrentValue, setGetCurrentValue] = useState([]);
  const [bd_activity, setBdActivity] = useState([]);
  const [my_target, setMyTarget] = useState([]);
  const [activity_point, setActivityPoint] = useState([]);
  const [page_reload, setPageReload] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [dataId, seDataId] = useState([]);
  const [attendanceActivities, setAttendanceActivities] = useState([]);
  const [pendingActivities, setPendingActivity] = useState([]);
  const [upcomingActivities, setUpcomingActivity] = useState([]);
  const [task_complete, setMyTaskComplete] = useState([]);

  const loginUserData = getLoginUserData();
  const roleName = loginUserData?.userData?.crm_role;
  const profileName = loginUserData?.userData?.crm_profile;

  const getReportingData = (fn) => {
    const { resultSet, error, isLoading, progress, refetch } = fn();

    if (isLoading) {
      return [];
    }

    if (error) {
      return [];
    }

    if (!resultSet) {
      return [];
    }

    return resultSet.rawData();
  };

  const AttendanceData = () => {
    let params = {
      role_name: roleName,
      profile_name: profileName,
    };
    getAttendanceData(params).then((res) => {
      setgetMinMaxAttendance(res?.result);
    });
  };

  const getActivityByRoleName = async () => {
    let params = {
      createdByRoleName: roleName,
      status: "Pending",
    };
    try {
      let res = await getBdeActivitiesByRoleName(params);
      setBdActivity(res?.result);
    } catch (err) {
      console.error(err);
    }
  };

  const getAttendancePointData = async () => {
    try {
      let res = await getAddendancePoint();
      let data = res?.rawData();
      setGetCurrentValue(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMyTargetData = async () => {
    try {
      let res = await getCallTarget();
      let data = res?.decompose();
      data = data.map((obj) => obj.rawData());
      setMyTarget(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getActivityPointData = async () => {
    try {
      let res = await getActivityPoint(dataId, view_target);
      setActivityPoint(res?.loadResponses?.[0]?.data);
    } catch (err) {}
  };

  const getTargetChange = (task) => {
    setTargetView(task);
  };

  const getTaskChange = (task) => {
    setTaskView(task);
  };

  const getMaxScore = async () => {
    try {
      const res = await getActivityMaxScore();
      setScore(res?.loadResponses?.[0]?.data);
    } catch (err) {
      console.error(err?.response);
    }
  };

  const getCubeBDActivity = async () => {
    let params = {
      key: "Bdeactivities",
    };
    try {
      const res = await getCubeBdActivity(params);
    } catch (err) {
      console.error(err?.response);
    }
  };

  const getTaskCompleteData = async () => {
    try {
      let res = await getTaskDate(view_task);
      setMyTaskComplete(res?.loadResponses?.[0]?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getPointData = () => {
    getMaxScore();
    getAttendancePointData();
  };

  const getPointScore = (activity_id, activity_score) => {
    let sum = 0;
    let maxScore;

    if (getScore?.length > 0) {
      maxScore = getScore?.filter(
        (data) => data?.[CubeDataset.ActivitiesBq.Id] === activity_id
      );
      maxScore = maxScore?.[0]?.[CubeDataset.ActivitiesBq.maxScore];
      maxScore = maxScore ? maxScore : 0;
      if (maxScore > activity_score) {
        sum += activity_score;
      } else {
        sum += parseFloat(maxScore);
      }
      return sum;
    } else {
      getPointData();
    }
  };

  const crrAttendancePoint = () => {
    let activity_id;
    let activity_score;
    let scoreData;
    let currentPoint = [];
    if (getCurrentValue?.length > 0) {
      getCurrentValue?.map((data) => {
        activity_id = data?.[CubeDataset.BdeactivitiesBq.activityId];
        activity_score = data?.[CubeDataset.BdeactivitiesBq.totalActivityScore];
        scoreData = getPointScore(activity_id, activity_score);
        currentPoint.push(scoreData);
      });
    }

    return currentPoint;
  };

  useEffect(() => {
    let getCurrentPoint = crrAttendancePoint();

    getCurrentPoint = getCurrentPoint?.reduce(function (x, y) {
      let sum;
      sum = x + y;
      return parseFloat(sum.toFixed(2));
    }, 0);
    setCurrentPoint(getCurrentPoint);
  }, [getCurrentValue]);

  useEffect(() => {
    let activityPending =
      bd_activity?.length > 0
        ? bd_activity?.filter(
            (obj) =>
              moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) <
              moment().utc()
          )
        : [];

    let dayActivity =
      bd_activity?.length > 0
        ? bd_activity?.filter(
            (obj) =>
              moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) >=
              moment().utc()
          )
        : [];
    setPendingActivity(activityPending);
    setUpcomingActivity(dayActivity);
  }, [bd_activity]);

  useEffect(() => {
    let attendanceActivities = [];
    if (my_target.length > 0) {
      let resData1 = my_target[0];
      let activityName = resData1?.map(
        (obj) => obj[CubeDataset.RolebasedattendanceactivitymodelsBq.activityId]
      );
      let resData2 = my_target[1]?.filter(
        (obj) =>
          activityName?.indexOf(
            obj[CubeDataset.RolebasedattendanceactivitymodelsBq.activityId]
          ) < 0
      );

      attendanceActivities = [...resData1, ...resData2];

      setAttendanceActivities(attendanceActivities);
    }
  }, [my_target]);

  useEffect(() => {
    let getDataID = attendanceActivities.map(
      (data) =>
        data?.[CubeDataset.RolebasedattendanceactivitymodelsBq.activityId]
    );
    seDataId(getDataID);
  }, [attendanceActivities]);

  useEffect(() => {
    getActivityPointData();
  }, [dataId, view_target]);

  useEffect(() => {
    getTaskCompleteData();
  }, [view_task]);

  // useEffect( () => {
  //   getAttendancePointData()
  // }, [getMinMaxAttendance])

  useEffect(() => {
    getMaxScore();
    getCubeBDActivity();
    AttendanceData();
    getActivityByRoleName();
    getMyTargetData();
    getAttendancePointData();
    let data = loginUserData.userData;
    let activityData = {
      empCode: data.employee_code,
      landing_page: "BDE Dashboard Page",
      action: "BDE Dashboard",
      event_type: "View BDE Dashboard",
      eventStep: "View BDE Dashboard",
      click_type: "View BDE Dashboard",
      eventData: data,
    };
    activityLogger(activityData);
  }, []);

  const getChangeDate = (start_date, end_date) => {
    setStartDate(start_date);
    setEndDate(end_date);
  };

  let taskCompleteData = task_complete ? getTaskSortData(task_complete) : [];

  let myTargetData = activity_point ? getSortData(activity_point) : [];

  return (
    <div className="BdaDashboardPage">
      <Page title="Dashboard">
        <Grid sx={{ px: "20px", py: "12px" }}>
          <Grid container spacing={2} className={classes.shuffleCard}>
            <Grid item xs={12} md={6}>
              <div className={classes.cardContainer}>
                <Typography className={classes.cardTitle}>Revenue</Typography>
              </div>
              <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                <Revenue />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                <Slider />
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: "0px" }}>
            <Grid item xs={12} md={7.5}>
              <Grid className={`${classes.cusCard} ${classes.cusCard1} `}>
                <Attendance
                  data={getMinMaxAttendance}
                  getCurrentValue={currentPoint}
                />
              </Grid>
              <Grid
                className={`${classes.cusCard} ${classes.cusCard1}`}
                sx={{ mt: "16px" }}
              >
                <MyTargets
                  data={attendanceActivities}
                  getTargetChange={getTargetChange}
                  getCurrentTarget={myTargetData}
                />
              </Grid>
              <Grid
                className={`${classes.cusCard} ${classes.cusCard1} ${classes.lastCardWeb}`}
                sx={{ mt: "16px" }}
              >
                <TaskCompleted
                  getTaskChange={getTaskChange}
                  data={taskCompleteData}
                />
              </Grid>
            </Grid>
            <Grid item md={4.5} xs={12}>
              <Grid className={`${classes.cusCard} ${classes.cusCard1}`}>
                <PendingTask data={pendingActivities} title="Pending" />
              </Grid>
              <Grid
                className={`${classes.cusCard} ${classes.cusCard1}`}
                sx={{ mt: "20px" }}
              >
                <PendingTask data={upcomingActivities} title="Upcoming" />
              </Grid>
              <Grid className={classes.weekGrdBox}>
                <div className="gridWeek hd_header_bar">
                  <NotifyAlert count={upcomingActivities?.length} />
                  <DayCalendar
                    data={upcomingActivities}
                    getChangeDate={() => getChangeDate()}
                  />
                </div>
              </Grid>
              {/* <Grid className={classes.weekGrdBox}>
                <div className='gridWeek'>
                  <EventCalendar />
                </div>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Page>
    </div>
  );
};
