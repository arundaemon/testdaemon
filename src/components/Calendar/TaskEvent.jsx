import { Box } from "@mui/system";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { makeStyles } from "@mui/styles";
import DateIcon from "../../assets/image/dateIcon.svg";
import {
  getEndDateTime,
  getStarDateTime,
  getTimeDuration,
} from "../../helper/randomFunction";
import CubeDataset from "../../config/interface";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getBdeActivitiesByRoleName } from "../../config/services/bdeActivities";
import InfiniteScroll from "react-infinite-scroll-component";
import { DisplayLoader } from "../../helper/Loader";

const useStyles = makeStyles((theme) => ({
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "50vh",
    alignItems: "center",
    fontStyle: "italic",
    fontSize: "30px",
  },
}));
const useStylesCompleted = makeStyles((theme) => ({
  headerHeading: {
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
      fontWeight: "600",
    },
  },
  headeImage: {
    width: "40px",
    height: "40px",
    [theme.breakpoints.down("md")]: {
      height: "20px",
      width: "20px",
      content: `url(${DateIcon})`,
      marginLeft: "initial  ",
    },
  },
  headerContainer: {
    marginTop: "20px",
    color: "#202124",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    [theme.breakpoints.down("md")]: {
      "&:nth-child(1)": {
        marginTop: "0",
      },
    },
  },
  cardHeading: {
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "normal",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      marginBottom: "5px",
    },
  },
  cardMainHeading: {
    fontSize: "16px",
    fontWeight: "600",
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
      marginBottom: "5px",
    },
  },
  itemConteiner: {
    height: "100%",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      alignItems: "initial",
      flexDirection: "column",
      marginTop: "8px",
    },
  },
  itemParagraph: {
    fontWeight: "600",
    color: "#202124",
    fontSize: "16px",
    paddingRight: "10px",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      fontWeight: "normal",
    },
  },
}));
const useStylesMissed = makeStyles((theme) => ({
  headerHeading: {
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
      fontWeight: "600",
    },
  },
  headeImage: {
    width: "40px",
    height: "40px",
    marginLeft: "-10px",
    [theme.breakpoints.down("md")]: {
      height: "20px",
      width: "20px",
      content: `url(${DateIcon})`,
      marginLeft: "initial",
    },
  },
  headerContainer: {
    marginTop: "20px",
    color: "#202124",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    [theme.breakpoints.down("md")]: {
      "&:nth-child(1)": {
        marginTop: "0",
      },
    },
  },
  cardHeading: {
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "normal",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      marginBottom: "5px",
    },
  },
  cardMainHeading: {
    fontSize: "16px",
    fontWeight: "600",
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
      marginBottom: "5px",
    },
  },
  itemConteiner: {
    height: "100%",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      alignItems: "initial",
      flexDirection: "column",
      marginTop: "8px",
    },
  },
  itemParagraph: {
    fontWeight: "600",
    color: "#202124",
    fontSize: "16px",
    paddingRight: "10px",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      fontWeight: "normal",
    },
  },
  buttonContainer: {
    [theme.breakpoints.down("md")]: {
      padding: "0",
      width: "100%",
      flexDirection: "row-reverse",
    },
  },
  callBtn: {
    width: "130px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      padding: "5px 10px !important",
    },
  },
}));
const useStylesUpcomming = makeStyles((theme) => ({
  headerHeading: {
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
      fontWeight: "600",
    },
  },
  headeImage: {
    width: "40px",
    height: "40px",
    marginLeft: "-10px",
    [theme.breakpoints.down("md")]: {
      height: "20px",
      width: "20px",
      content: `url(${DateIcon})`,
      marginLeft: "initial",
    },
  },
  headerContainer: {
    marginTop: "20px",
    color: "#202124",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    [theme.breakpoints.down("md")]: {
      "&:nth-child(1)": {
        marginTop: "0",
      },
    },
  },
  cardHeading: {
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "normal",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      marginBottom: "5px",
    },
  },
  cardMainHeading: {
    fontSize: "16px",
    fontWeight: "600",
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
      marginBottom: "5px",
    },
  },
  itemConteiner: {
    height: "100%",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      alignItems: "initial",
      flexDirection: "column",
      marginTop: "8px",
    },
  },
  itemParagraph: {
    fontWeight: "600",
    color: "#202124",
    fontSize: "16px",
    paddingRight: "10px",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      fontWeight: "normal",
    },
  },
  buttonContainer: {
    [theme.breakpoints.down("md")]: {
      padding: "0",
      width: "100%",
      flexDirection: "row-reverse",
    },
  },
  callBtn: {
    width: "130px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      padding: "5px 10px !important",
    },
  },
}));
export const Task = () => <></>;

const Upcoming = ({ color, data, removeFilter, searchFlag }) => {
  const classes = useStyles();
  const UpcommingClassStyle = useStylesUpcomming();

  const [upcoming_activity, setActivity] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(31, "days").format("YYYY-MM-DD 23:59:59")
  );
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);
  const [upcoming_data, setActivityData] = useState(data ? data : []);

  const uniqueActivity = () => {
    let key = CubeDataset.Bdeactivities.Id;
    let activityData;

    activityData = [
      ...new Map(upcoming_activity?.map((item) => [item[key], item])).values(),
    ];

    activityData = activityData.filter(
      (obj) =>
        moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) >=
        moment().utc()
    );

    return activityData;
  };

  const groupByDate = (
    !upcoming_data.length > 0 ? uniqueActivity() : upcoming_data
  )?.reduce((group, data) => {
    let date_value = moment(
      data?.[`${CubeDataset.Bdeactivities.startDateTime}`]
    ).format("YYYY-MM-DD 00:00");
    group[date_value] = group[date_value] ?? [];
    group[date_value].push(data);
    return group;
  }, {});

  let checkObject = Object.keys(groupByDate ? groupByDate : {}).length;

  const setTimeRange = (data) => {
    let lastRecord = data[data.length - 1];
    lastRecord = lastRecord?.[`${CubeDataset.Bdeactivities.startDateTime}`];
    setStartDate(moment(lastRecord).format("YYYY-MM-DD"));
    setEndDate(moment(lastRecord).add(31, "days").format("YYYY-MM-DD"));
  };

  const getMonthData = (data) => {
    let startDT;
    let endDT;
    if (count == 1) {
      startDT = moment(new Date()).format("YYYY-MM-DD");
      endDT = moment(new Date()).add(91, "days").format("YYYY-MM-DD 23:59:59");
      getAllActivity(startDT, endDT);
    }
  };

  const getAllActivity = async (startDT, endDT) => {
    let startGTRange = !startDT ? new Date(startDate) : new Date(startDT);
    let startLTRange = !endDT ? new Date(endDate) : new Date(endDT);

    let params = {
      createdByRoleName: getUserData("userData")?.crm_role,
      startDateTime: { $gt: startGTRange, $lt: startLTRange },
      status: { $in: ["Pending"] },
      limit: 100,
    };
    setLoader(true);
    try {
      let res = await getBdeActivitiesByRoleName(params);

      setLoader(false);
      if (res?.result?.length == 0 && !(count === 1)) {
        setCount(count + 1);
        getMonthData(res?.result);
      }
      if (res?.result?.length > 0) {
        setTimeRange(res?.result);
        setActivity([...upcoming_activity, ...res?.result]);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  useEffect(() => {
    let startDT;
    let endDT;
    if (removeFilter) {
      setActivityData([]);
      startDT = moment(new Date()).format("YYYY-MM-DD");
      endDT = moment(new Date()).add(31, "days").format("YYYY-MM-DD 23:59:59");
    }
    !removeFilter ? getAllActivity() : getAllActivity(startDT, endDT);
  }, [removeFilter]);

  // useEffect( () => {
  //   getAllActivity()
  // }, [])

  useEffect(() => {
    // if (data?.length > 0) {
    //   setActivity([])
    // }
    if (searchFlag) {
      setActivity([]);
      setActivityData(data);
    }
  }, [data]);

  useEffect(() => {
    getMonthData();
  }, [count]);

  const getActivityOnScroll = () => {
    getAllActivity();
  };

  return (
    <InfiniteScroll
      dataLength={uniqueActivity()?.length}
      next={getActivityOnScroll}
      hasMore={true}
    >
      {!(checkObject === 0) ? (
        Object.entries(groupByDate)
          ?.sort()
          ?.reverse()
          ?.map((data) => {
            return (
              <>
                <div className={UpcommingClassStyle.headerContainer}>
                  <img
                    src="/Report.svg"
                    className={UpcommingClassStyle.headeImage}
                  />
                  <h3 className={UpcommingClassStyle.headerHeading}>
                    {moment(data[0]).format("D MMM, YYYY ")}
                  </h3>
                </div>
                {data?.length > 0
                  ? data[1]?.map((data, index) => {
                      return (
                        <>
                          <Box
                            sx={{
                              borderLeft: `5px solid ${color}`,
                              borderTopLeftRadius: "4px",
                              borderBottomLeftRadius: "4px",
                            }}
                          >
                            <div
                              className={`event_box ${UpcommingClassStyle.itemConteiner}`}
                            >
                              <div>
                                <h2
                                  style={{ color: color }}
                                  className={UpcommingClassStyle.cardHeading}
                                >
                                  Upcoming
                                </h2>
                                <p
                                  className={
                                    UpcommingClassStyle.cardMainHeading
                                  }
                                >
                                  {
                                    data?.[
                                      CubeDataset.Bdeactivities.activityName
                                    ]
                                  }{" "}
                                  with {data?.[CubeDataset.Bdeactivities.name]}
                                </p>
                              </div>
                              <div
                                className={`flx-Box ${UpcommingClassStyle.buttonContainer}`}
                              >
                                <Link
                                  to={{
                                    pathname: `/authorised/listing-details/${
                                      data?.[CubeDataset.Bdeactivities.leadId]
                                    }`,
                                    search: `?id=${
                                      data?.[CubeDataset.Bdeactivities.Id]
                                    }`,
                                    state: { fromDashboard: true },
                                  }}
                                  className={UpcommingClassStyle.callBtn}
                                >
                                  {data?.[CubeDataset.Bdeactivities.category]
                                    ? data?.[CubeDataset.Bdeactivities.category]
                                    : "Call"}
                                </Link>
                                <div
                                  className={UpcommingClassStyle.itemParagraph}
                                >
                                  <p>{getStarDateTime(data)}</p>
                                </div>
                              </div>
                            </div>
                          </Box>
                        </>
                      );
                    })
                  : ""}
              </>
            );
          })
      ) : (
        <div className={classes.tskPending}>"No Data Available"</div>
      )}
    </InfiniteScroll>
  );
};

const Completed = ({ color, data, removeFilter, searchFlag }) => {
  const toolRef = useRef();
  const navigate = useNavigate();
  const classes = useStyles();
  const completedClasses = useStylesCompleted();
  const [complete_activity, setActivity] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD 23:59:59")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(-31, "days").format("YYYY-MM-DD")
  );
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);
  const [activity_data, setActivityData] = useState(data ? data : []);

  const uniqueActivity = () => {
    let key = CubeDataset.Bdeactivities.Id;
    let activityData;

    activityData = [
      ...new Map(complete_activity?.map((item) => [item[key], item])).values(),
    ];

    return activityData;
  };

  const groupByDate = (
    !activity_data.length > 0 ? uniqueActivity() : activity_data
  )?.reduce((group, data) => {
    let date_value = moment(
      data?.[`${CubeDataset.Bdeactivities.startDateTime}`]
    ).format("YYYY-MM-DD 00:00");
    group[date_value] = group[date_value] ?? [];
    group[date_value].push(data);
    return group;
  }, {});

  let checkObject = Object.keys(groupByDate ? groupByDate : {}).length;

  const setTimeRange = (data) => {
    let lastRecord = data[data.length - 1];
    lastRecord = lastRecord?.[`${CubeDataset.Bdeactivities.startDateTime}`];
    setStartDate(moment(lastRecord).format("YYYY-MM-DD"));
    setEndDate(moment(lastRecord).add(-31, "days").format("YYYY-MM-DD"));
  };

  const getMonthData = (data) => {
    let startDT;
    let endDT;
    if (count == 1) {
      startDT = moment(new Date()).format("YYYY-MM-DD 23:59:59");
      endDT = moment(new Date()).add(-91, "days").format("YYYY-MM-DD");
      getAllActivity(startDT, endDT);
    }
  };

  const getAllActivity = async (startDT, endDT) => {
    let startGTRange = !endDT ? new Date(endDate) : new Date(endDT);
    let startLTRange = !startDT ? new Date(startDate) : new Date(startDT);

    let params = {
      createdByRoleName: getUserData("userData")?.crm_role,
      startDateTime: { $gt: startGTRange, $lt: startLTRange },
      status: { $in: ["Complete"] },
      limit: 100,
    };
    setLoader(true);
    try {
      let res = await getBdeActivitiesByRoleName(params);

      setLoader(false);
      if (res?.result?.length == 0 && !(count === 1)) {
        setCount(count + 1);
        getMonthData(res?.result);
      }
      if (res?.result?.length > 0) {
        setTimeRange(res?.result);
        setActivity([...complete_activity, ...res?.result]);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  useEffect(() => {
    let startDT;
    let endDT;
    if (removeFilter) {
      setActivityData([]);
      startDT = moment(new Date()).format("YYYY-MM-DD 23:59:59");
      endDT = moment(new Date()).add(-31, "days").format("YYYY-MM-DD");
    }
    !removeFilter ? getAllActivity() : getAllActivity(startDT, endDT);
  }, [removeFilter]);

  useEffect(() => {
    if (searchFlag) {
      setActivity([]);
      setActivityData(data);
    }
  }, [data]);

  useEffect(() => {
    getMonthData();
  }, [count]);

  const getActivityOnScroll = () => {
    getAllActivity();
  };

  return (
    <InfiniteScroll
      dataLength={complete_activity.length}
      next={getActivityOnScroll}
      hasMore={true}
    >
      {!(checkObject === 0) ? (
        Object.entries(groupByDate)
          ?.sort()
          ?.reverse()
          ?.map((data) => {
            return (
              <>
                <div className={completedClasses.headerContainer}>
                  <img
                    className={completedClasses.headeImage}
                    src="/Report.svg"
                  />
                  <h3 className={completedClasses.headerHeading}>
                    {moment(data[0]).format("D MMM, YYYY ")}
                  </h3>
                </div>

                <>
                  {data?.length > 0
                    ? data[1]?.map((data, index) => {
                        let checkVal =
                          data?.[CubeDataset.Bdeactivities.activityName] ===
                          "Generated a Payment Link";
                        return (
                          <>
                            <div
                              data-class="customTooltip test-tooldata"
                              data-type="info"
                              data-tip={
                                !checkVal
                                  ? `
                        <ul>
                          <h2>${
                            data?.[CubeDataset.Bdeactivities.activityName]
                          }</h2>
                          <li>${data?.[CubeDataset.Bdeactivities.name]}</li>
                          <li>Duration : ${getTimeDuration(data)}</li>
                          <li>Starts:  ${getStarDateTime(data)}</li>
                          <li>Ends:${getEndDateTime(data)}</li>
                          <li>Status: ${
                            data?.[CubeDataset.Bdeactivities.status]
                          }</li>
                          <li>
                        </ul>`
                                  : `
                        <ul>
                          <h2>${
                            data?.[CubeDataset.Bdeactivities.activityName]
                          }</h2>
                          <li>${data?.[CubeDataset.Bdeactivities.name]}</li>
                          <li>Status: ${
                            data?.[CubeDataset.Bdeactivities.status]
                          }</li>
                          <li>
                        </ul>`
                              }
                              clickable={false}
                              ref={toolRef}
                              data-for="foo"
                              data-iscapture={false}
                              data-place="top"
                              data-offset="{ 'top': '-60' ,'left' : '50'}"
                              data-multiline={true}
                              data-html={true}
                              data-effect="solid"
                            >
                              <Box
                                sx={{
                                  borderLeft: `5px solid ${color}`,
                                  borderTopLeftRadius: "4px",
                                  borderBottomLeftRadius: "4px",
                                }}
                              >
                                <div
                                  className={`event_box ${completedClasses.itemConteiner}`}
                                >
                                  <div>
                                    <h2
                                      style={{ color: color }}
                                      className={completedClasses.cardHeading}
                                    >
                                      Completed
                                    </h2>
                                    <p
                                      className={
                                        completedClasses.cardMainHeading
                                      }
                                    >
                                      {
                                        data?.[
                                          CubeDataset.Bdeactivities.activityName
                                        ]
                                      }{" "}
                                      with{" "}
                                      {data?.[CubeDataset.Bdeactivities.name]}
                                    </p>
                                  </div>
                                  <div className="">
                                    <div
                                      className={completedClasses.itemParagraph}
                                    >
                                      <p>{getStarDateTime(data)}</p>
                                    </div>
                                  </div>
                                </div>
                              </Box>
                              <ReactTooltip id="foo" />
                            </div>
                          </>
                        );
                      })
                    : ""}
                </>
              </>
            );
          })
      ) : (
        <div className={classes.tskPending}>"No Data Available"</div>
      )}
    </InfiniteScroll>
  );
};

const Missed = ({ color, data, removeFilter, searchFlag }) => {
  const classes = useStyles();
  const MissedClass = useStylesMissed();
  const [missed_activity, setActivity] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD 23:59:59")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(-31, "days").format("YYYY-MM-DD")
  );
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);
  const [missed_data, setActivityData] = useState(data ? data : []);

  const uniqueActivity = () => {
    let key = CubeDataset.Bdeactivities.Id;
    let activityData;

    activityData = [
      ...new Map(missed_activity.map((item) => [item[key], item])).values(),
    ];

    activityData = activityData?.filter(
      (obj) =>
        moment.utc(obj[CubeDataset.Bdeactivities.startDateTime]) <
        moment().utc()
    );

    return activityData;
  };

  const groupByDate = (
    !missed_data.length > 0 ? uniqueActivity() : missed_data
  )?.reduce((group, data) => {
    let date_value = moment(
      data?.[`${CubeDataset.Bdeactivities.startDateTime}`]
    ).format("YYYY-MM-DD 00:00");
    group[date_value] = group[date_value] ?? [];
    group[date_value].push(data);
    return group;
  }, {});

  let checkObject = Object.keys(groupByDate ? groupByDate : {}).length;

  const setTimeRange = (data) => {
    let lastRecord = data[data.length - 1];
    lastRecord = lastRecord?.[`${CubeDataset.Bdeactivities.startDateTime}`];
    setStartDate(moment(lastRecord).format("YYYY-MM-DD"));
    setEndDate(moment(lastRecord).add(-31, "days").format("YYYY-MM-DD"));
  };

  const getMonthData = (data) => {
    let startDT;
    let endDT;
    if (count == 1) {
      startDT = moment(new Date()).format("YYYY-MM-DD 23:59:59");
      endDT = moment(new Date()).add(-91, "days").format("YYYY-MM-DD");
      getAllActivity(startDT, endDT);
    }
  };

  const getAllActivity = async (startDT, endDT) => {
    let startGTRange = !endDT ? new Date(endDate) : new Date(endDT);
    let startLTRange = !startDT ? new Date(startDate) : new Date(startDT);

    let params = {
      createdByRoleName: getUserData("userData")?.crm_role,
      startDateTime: { $gt: startGTRange, $lt: startLTRange },
      status: { $in: ["Pending"] },
      limit: 100,
    };
    setLoader(true);
    try {
      let res = await getBdeActivitiesByRoleName(params);

      setLoader(false);
      if (res?.result?.length == 0 && !(count === 1)) {
        setCount(count + 1);
        getMonthData(res?.result);
      }
      if (res?.result?.length > 0) {
        setTimeRange(res?.result);
        setActivity([...missed_activity, ...res?.result]);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  useEffect(() => {
    let startDT;
    let endDT;
    if (removeFilter) {
      setActivityData([]);
      startDT = moment(new Date()).format("YYYY-MM-DD 23:59:59");
      endDT = moment(new Date()).add(-31, "days").format("YYYY-MM-DD");
    }
    !removeFilter ? getAllActivity() : getAllActivity(startDT, endDT);
  }, [removeFilter]);

  // useEffect( () => {
  //   getAllActivity()
  // }, [])

  useEffect(() => {
    if (searchFlag) {
      setActivity([]);
      setActivityData(data);
    }
  }, [data]);

  useEffect(() => {
    getMonthData();
  }, [count]);

  const getActivityOnScroll = () => {
    getAllActivity();
  };

  return (
    <InfiniteScroll
      dataLength={uniqueActivity()?.length}
      next={getActivityOnScroll}
      hasMore={true}
    >
      {!(checkObject === 0) ? (
        Object.entries(groupByDate)
          ?.sort()
          ?.reverse()
          ?.map((data) => {
            return (
              <>
                <div className={MissedClass.headerContainer}>
                  <img src="/Report.svg" className={MissedClass.headeImage} />
                  <h3 className={MissedClass.headerHeading}>
                    {moment(data[0]).format("D MMM, YYYY ")}
                  </h3>
                </div>
                {data?.length > 0
                  ? data[1]?.map((data, index) => {
                      return (
                        <>
                          <Box
                            sx={{
                              borderLeft: `5px solid ${color}`,
                              borderTopLeftRadius: "4px",
                              borderBottomLeftRadius: "4px",
                            }}
                          >
                            <div
                              className={`event_box ${MissedClass.itemConteiner}`}
                            >
                              <div>
                                <h2
                                  style={{ color: color }}
                                  className={MissedClass.cardHeading}
                                >
                                  Missed
                                </h2>
                                <p className={MissedClass.cardMainHeading}>
                                  {
                                    data?.[
                                      CubeDataset.Bdeactivities.activityName
                                    ]
                                  }{" "}
                                  with {data?.[CubeDataset.Bdeactivities.name]}
                                </p>
                              </div>
                              <div
                                className={`flx-Box ${MissedClass.buttonContainer}`}
                              >
                                <Link
                                  to={{
                                    pathname: `/authorised/listing-details/${
                                      data?.[CubeDataset.Bdeactivities.leadId]
                                    }`,
                                    search: `?id=${
                                      data?.[CubeDataset.Bdeactivities.Id]
                                    }`,
                                    state: { fromDashboard: true },
                                  }}
                                  className={MissedClass.callBtn}
                                >
                                  {data?.[CubeDataset.Bdeactivities.category]
                                    ? data?.[CubeDataset.Bdeactivities.category]
                                    : "Call"}
                                </Link>
                                <div className={MissedClass.itemParagraph}>
                                  <p>{getStarDateTime(data)}</p>
                                </div>
                              </div>
                            </div>
                          </Box>
                        </>
                      );
                    })
                  : ""}
              </>
            );
          })
      ) : (
        <div className={classes.tskPending}>"No Data Available"</div>
      )}
    </InfiniteScroll>
  );
};

Task.Upcoming = Upcoming;
Task.Completed = Completed;
Task.Missed = Missed;
