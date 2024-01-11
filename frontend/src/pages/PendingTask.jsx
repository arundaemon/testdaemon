import React, { useEffect } from "react";
import Page from "../components/Page";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Alert,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import CubeDataset from "../config/interface";
import { getActivityTime, getDays } from "../helper/randomFunction";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    boxShadow: "0px 0px 6px #00000029",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px",
    [theme.breakpoints.down("md")]: {
      marginTop: "100px",
    },
  },
  LinkDemobtn: {
    borderRadius: "4px ",
    color: "#fff ",
    padding: "5px 10px ",
    backgroundColor: "#F45E29",
    textDecoration: "none",
    width: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "600",
  },
  headerHeading: {
    fontSize: "22px",
    fontWeight: "600",
  },
  cardItem: {
    boxShadow: "0px 0px 4px #00000029",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
  },
  itemContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeading: {
    fontSize: "16px",
    fontWeight: "600",
  },
  cardPera: {
    fontSize: "14px",
    fontWeight: "normal",
  },
  time: {
    fontSize: "14px",
    fontWeight: "400",
    margin: "5px 0",
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
}));

const PendingTask = () => {
  const classes = useStyles();

  const task = useLocation();

  const navigate = useNavigate();

  const [data, setTaskData] = useState(task?.state ? task?.state?.data : []);

  const handleCall = () => {};

  useEffect(() => {
    let top_header = document.querySelector(".main-header.mobile-header");
    if (top_header && window.innerWidth <= 1024)
      top_header.style.display = "none";
  }, []);

  return (
    <>
      <div className="Create-Journey">
        <Page
          title="Extramarks | Pending Task"
          className="main-container datasets_container"
        >
          <div className={classes.cusCard}>
            <div className={classes.headerContainer}>
              <img src="/back arrow.svg" onClick={() => navigate(-1)} />
              <div className={classes.headerTitle}>Calendar</div>
            </div>
            <h3
              className={classes.headerHeading}
            >{`${task?.state?.title} Task`}</h3>
            {data?.map((data, i) => (
              <div className={classes.cardItem} key={i}>
                <div className={classes.itemContainer}>
                  <div>
                    <div>
                      <h4 className={classes.cardHeading}>
                        {data?.[CubeDataset.Bdeactivities.activityName]} with{" "}
                        {data?.[CubeDataset.Bdeactivities.name]}
                      </h4>
                    </div>
                    <div>
                      <h4 className={classes.time}>
                        Time: {getActivityTime(data)}
                      </h4>
                      <p className={classes.cardPera}>
                        {getDays(data) ? `${getDays(data)}Day ago` : ""}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Link
                      to={{
                        pathname: `/authorised/listing-details/${
                          data?.[CubeDataset.Bdeactivities.leadId]
                        }`,
                        search: `?id=${data?.[CubeDataset.Bdeactivities.Id]}`,
                        state: { fromDashboard: true },
                      }}
                      className={classes.LinkDemobtn}
                    >
                      {data?.[CubeDataset.Bdeactivities.category]
                        ? data?.[CubeDataset.Bdeactivities.category]
                        : "Call"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Page>
      </div>
    </>
  );
};

export default PendingTask;
