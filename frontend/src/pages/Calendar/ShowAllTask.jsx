import React, { useState } from "react";
import Page from "../../components/Page";
import { Box, Container } from "@mui/system";
import { Tabs } from "../../components/Calendar/Tabs";
import { useEffect } from "react";
import { Task } from "../../components/Calendar/TaskEvent";
import { monthActivityData } from "../../helper/DataSetFunction";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import {
  activityCompleted,
  activityMissed,
  activityUpcomming,
} from "../../helper/randomFunction/activityData";
import { useNavigate } from "react-router-dom";
import { getBdeActivitiesByRoleName } from "../../config/services/bdeActivities";
import { getUserData } from "../../helper/randomFunction/localStorage";
import CubeDataset from "../../config/interface";
import DatePicker from "react-datepicker";
import { Button, Typography } from "@mui/material";
import { toast } from "react-hot-toast";

const [TAB_1, TAB_2, TAB_3] = [
  {
    label: "Upcoming",
    color: "#4482FF",
  },
  {
    label: "Completed",
    color: "#80CC8C",
  },
  {
    label: "Missed",
    color: "#F44040",
  },
];
const useStyles = makeStyles((theme) => ({
  cusCard: {
    margin: "20px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    padding: "20px",
    [theme.breakpoints.down("md")]: {
      marginTop: "70px",
      boxShadow: "none",
      margin: "0",
    },
  },
  headerContainer: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    width: "100%",
    display: "flex",
    boxShadow: "0px 1px 4px #20212429",
    padding: "20px",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "1000",
    background: "white",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginLeft: "10px",
  },

  tabContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "initial",
      justifyContent: "initial",
    },
  },

  showAllHeading: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  showAllActivityContainer: {
    [theme.breakpoints.down("md")]: {
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: "8px",
      padding: "10px",
      marginTop: "20px",
    },
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "12px !important",
      padding: "4px !important",
      height: 36,
    },
  },
  dateFilterBox: {
    display: "flex",
    gap: "10px",
    [theme.breakpoints.down("md")]: {
      marginTop: 20,
    },
  },
  dateInput: {
    height: "48px",
    width: "150px",
    padding: "10px 20px",
    [theme.breakpoints.down("md")]: {
      padding: "5px 10px",
      width: 100,
      height: 36,
    },
  },
}));
const ShowALLTask = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [all_activity, setAllActivity] = useState([]);

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [reset_filter, setResetFilter] = useState(null);

  const [update_filter, setUpdateFilter] = useState(false);

  const [searchFlag, setSearchFlag] = useState(false);

  const getTaskData = (
    activeTab,
    complete_activity,
    missed_activity,
    upcoming_activity
  ) => {
    let { label, color } = activeTab;
    let data;

    if (label === "Missed") {
      return (
        <Task.Missed
          color={color}
          data={missed_activity}
          removeFilter={update_filter}
          searchFlag={searchFlag}
        />
      );
    } else if (label === "Completed") {
      return (
        <Task.Completed
          color={color}
          data={complete_activity}
          removeFilter={update_filter}
          searchFlag={searchFlag}
        />
      );
    } else {
      return (
        <>
          <Task.Upcoming
            color={color}
            data={upcoming_activity}
            removeFilter={update_filter}
            searchFlag={searchFlag}
          />
        </>
      );
    }
  };

  const [activeTab, setActiveTab] = useState(TAB_1);

  let complete_activity = all_activity;

  let missed_activity = all_activity.filter(
    (obj) =>
      moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) < moment().utc()
  );

  let upcoming_activity = all_activity.filter(
    (obj) =>
      moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) >= moment().utc()
  );

  const getActivityStatus = () => {
    let { label } = activeTab;

    if (label === "Completed") {
      return "Complete";
    } else {
      return "Pending";
    }
  };

  const getAllActivity = async () => {
    let evtValidate;

    let start_date = moment(startDate).format("YYYY-MM-DD");
    let end_date = moment(endDate).format("YYYY-MM-DD 23:59:59");

    let params = {
      status: getActivityStatus(),
      createdByRoleName: getUserData("userData")?.crm_role,
      startDateTime: { $gt: new Date(start_date), $lt: new Date(end_date) },
    };

    let dateValidate = () => {
      if ((startDate && endDate == null) || (startDate == null && endDate)) {
        toast.error("Please Select Date");
        return false;
      } else if (startDate == null && endDate == null) {
        return false;
      } else {
        return true;
      }
    };

    if (dateValidate()) {
      try {
        let res = await getBdeActivitiesByRoleName(params);
        if (
          !(startDate == null) &&
          !(endDate == null) &&
          res?.result?.length == 0
        ) {
          // toast.error(`No Data Present On These Dates`)
          setSearchFlag(true);
          setResetFilter(true);
          setAllActivity([]);
        }
        if (res?.result?.length > 0) {
          setSearchFlag(true);
          evtValidate = checkEvtValidate(res?.result);
          setResetFilter(true);

          if (evtValidate) {
            setAllActivity(res?.result);
          } else {
            setAllActivity([]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const checkEvtValidate = (data) => {
    let res;
    let { label } = activeTab;

    if (label === "Upcoming") {
      res = data.filter(
        (obj) =>
          moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) >=
          moment().utc()
      );

      res = res?.length > 0 ? true : false;
      return res;
    } else if (label === "Missed") {
      res = data.filter(
        (obj) =>
          moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) <
          moment().utc()
      );

      res = res?.length > 0 ? true : false;
      return res;
    } else {
      return true;
    }
  };

  const getActivity = () => {
    setUpdateFilter(false);
    getAllActivity();
  };

  const filterReset = () => {
    setUpdateFilter(true);
    setResetFilter(false);
    setStartDate(null);
    setEndDate(null);
    setAllActivity([]);
    setSearchFlag(false);
  };

  useEffect(() => {
    getTaskData(activeTab);
    getAllActivity();
  }, [activeTab]);

  useEffect(() => {
    let top_header = document.querySelector(".main-header.mobile-header");
    if (top_header && window.innerWidth <= 1024)
      top_header.style.display = "none";
  }, []);

  const { label } = activeTab;

  return (
    <Page
      title="Extramarks | All Task Show"
      className="main-container datasets_container"
    >
      <div className={classes.cusCard}>
        <div className={classes.headerContainer}>
          <img src="/back arrow.svg" onClick={() => navigate(-1)} />
          <div className={classes.headerTitle}>Calendar</div>
        </div>
        <div className="cstm_table_width">
          <h3
            className={classes.showAllHeading}
            style={{ padding: "10px 0 20px 0" }}
          >
            My All Task
          </h3>
          <div className={classes.tabContainer}>
            <Tabs>
              {[TAB_1, TAB_2, TAB_3].map((item, index) => {
                return (
                  <>
                    <Tabs.Item
                      key={index}
                      active={item.label === activeTab.label}
                      onClick={() => {
                        setActiveTab(item);
                        setStartDate(null);
                        setEndDate(null);
                        setResetFilter(false);
                        setAllActivity([]);
                        setUpdateFilter(false);
                        setSearchFlag(false);
                      }}
                    >
                      {item.label}
                      {item.color}
                    </Tabs.Item>
                  </>
                );
              })}
            </Tabs>
            <div className={classes.dateFilterBox}>
              <Box>
                <DatePicker
                  className={classes.dateInput}
                  selected={startDate}
                  placeholderText="Start Date"
                  onChange={(date) => {
                    setStartDate(date);
                    setEndDate("");
                    setUpdateFilter(false);
                  }}
                />
              </Box>
              <Box>
                <DatePicker
                  className={classes.dateInput}
                  disabled={startDate ? false : true}
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                  minDate={startDate}
                  placeholderText="End Date"
                />
              </Box>
              <Button className={classes.submitBtn} onClick={getActivity}>
                Search Activity
              </Button>
              {/* {
								reset_filter && ((upcoming_activity.length > 0 && label === 'Upcoming') || (missed_activity?.length > 0 && label === 'Missed') || (complete_activity.length > 0 && label === 'Completed')) ?
									<Button className={classes.submitBtn} onClick={filterReset}>Reset</Button> : ''
							} */}

              {reset_filter ? (
                <Button className={classes.submitBtn} onClick={filterReset}>
                  Reset
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={classes.showAllActivityContainer}>
            {getTaskData(
              activeTab,
              complete_activity,
              missed_activity,
              upcoming_activity
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ShowALLTask;
