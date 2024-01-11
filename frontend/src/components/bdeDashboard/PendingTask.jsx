import React from 'react';
import { Grid, Typography, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { color } from 'echarts';
import CubeDataset from '../../config/interface';
import { getActivityTime, getDays, getStarDateTime } from '../../helper/randomFunction';

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  headerSection: {
    borderBottom: "1px solid #ccc",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      borderBottom: 'none',
      paddingLeft: '0',
      paddingRight: "0",
    }
  },
  title: {
    fontWeight: "600",
    fontSize: '18px',
    color: '#202124'
  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  subTitle: {
    fontSize: "12px",
  },
  viewAllBtn: {
    fontSize: "14px",
    color: "#4482FF",
    cursor: "pointer",
    fontWeight: '600',
    textDecoration: 'underline'
  },
  taskListSection: {
    height: "16rem",
    overflow: "auto",
    scrollbarWidth: 'thin',
  },
  MWebtaskListSection: {
    height: "auto",
    overflow: "auto",
    scrollbarWidth: 'thin',
  },
  taskList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    [theme.breakpoints.down('md')]: {
      padding: "10px 0 15px 0",
      justifyContent: "initial",
      alignItems: "initial",
      flexDirection: 'column',


    }

  },
  task: {
    fontSize: "14px",
    fontWeight: "600",
  },
  time: {
    fontSize: "14px",
    fontWeight: "400",
    margin: '5px 0'
  },
  agoTime: {
    fontSize: "12px",
    fontWeight: "400",
  },
  followUpBtn: {
    textDecoration: 'none',
    fontSize: '14px'
  },
  demoBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    color: "#ffffff !important",
  },
  btnWdth: {
    // maxWidth: "100px",
    border: "1px solid #f45e29",
    padding: '6px 12px',
    whiteSpace: 'nowrap',
    width: '40%',
    textAlign: 'center',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    borderRadius: '4px',
    color: '#f45e29',
    [theme.breakpoints.down('md')]: {
      marginTop: "10px"
    }
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
    fontStyle: "italic"
  },
  contentContainer: {
    [theme.breakpoints.down('md')]: {
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: '8px',
      padding: '10px',
      minHeight: "400px"
    }
  }
}));

export default function PendingTask(props) {
  const navigate = useNavigate();
  let { data,title, mobile_view } = props


  const handleAllActivity = (data) => {
    navigate('/authorised/pending-task', { state: { data: data, title: title } })
  }

  const classes = useStyles();

  const Data = data?.sort((a, b) => {
    let fa = a?.[CubeDataset.BdeactivitiesBq.startDateTime]
    let fb = b?.[CubeDataset.BdeactivitiesBq.startDateTime]

    if (fa > fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  

  return (
    <>
      <Grid sx={{ px: "20px", py: "12px" }} className={classes.headerSection}>
        <Typography className={classes.title}>{`${title} Task`} {data?.length > 0 ? `(${data?.length})` : ""}</Typography>
        <Grid className={classes.discBox}>
          {data?.length > 0 ? <p onClick={() => handleAllActivity(data)} className={classes.viewAllBtn}>
            View All
          </p> : ""}
        </Grid>
      </Grid>
      <Grid className={`${mobile_view ? classes.MWebtaskListSection : classes.taskListSection} ${classes.contentContainer}`}  >
        {data?.length > 0 ? (title ==="Upcoming" ? Data?.reverse() : Data)?.map((data, i) => (
          <Grid key={i} sx={{ px: "16px", py: "12px" }} className={classes.taskList}>
            <Grid>
              <Typography className={classes.task}>{data?.[CubeDataset.Bdeactivities.activityName]} with {data?.[CubeDataset.Bdeactivities.name]}</Typography>
              <Typography className={classes.time}>Time: {getActivityTime(data)}</Typography>
              <Typography className={classes.agoTime}>{getDays(data) ? `${getDays(data)}Day ago` : ''} </Typography>
            </Grid>
            <div className={classes.btnWdth}>
              <Link to={{
                pathname:`/authorised/listing-details/${data?.[CubeDataset.Bdeactivities.leadId]}`,
                search:`?id=${data?.[CubeDataset.Bdeactivities.Id]}`,
                state: { fromDashboard: true }
                }} className={classes.followUpBtn}>
                {data?.[CubeDataset.Bdeactivities.category] ? data?.[CubeDataset.Bdeactivities.category] : "Call"}
              </Link>
            </div>
          </Grid>
        )) :
          <div className={classes.tskPending}>
            No {title} tasks yet
          </div>
        }
      </Grid>
    </>
  )
}
