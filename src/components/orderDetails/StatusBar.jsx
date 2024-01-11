import React from 'react';
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import rightImg from "../../assets/image/right.svg";
import wrongImg from "../../assets/image/wrong.png";

const useStyles = makeStyles((theme) => ({
  statusSection: {
    display: "flex",
    overflow: "auto",
    width: "100%",
  },
  statusBox: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    width: "7rem",
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: "0.5rem",
    position: "relative",
    '&:last-child': {
      '&::after': {
        width: "0rem !important",
      }
    },
    '&::after': {
      width: "4rem",
      height: "1px",
      backgroundColor: "rgb(218, 218, 218)",
      position: "absolute",
      top: "0.5rem",
      left: "5rem",
      content: "''",
    }
  },
  statusIcon: {
    width: "1.1rem",
  },
  statusText: {
    fontSize: "13px",
    fontWeight: "600",
    marginTop: "6px",
  },
  statusDate: {
    fontSize: "12px",
  },
  statusDays: {
    fontSize: "11px",
  },
  mainColor: {
    color: "#F45E29 !important"
  },
  disc: {
    fontSize: "10px",
    padding: "0 6px"
  }
}));

export default function StatusBar() {
  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }}>
        <Grid className={classes.statusSection}>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Submitted</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Authorized</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              false ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${false && classes.mainColor}`}>Invoiced</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Pre-closed</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              false ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${false && classes.mainColor}`}>Completed</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              false ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${false && classes.mainColor}`}>Cancellation</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
            <Typography className={classes.disc}>
              <span className='font-weight-600'>Reason: </span>Child unable to understand
            </Typography>
            <Typography className={classes.disc}>
              <span className='font-weight-600'>Raise by: </span>Shashank
            </Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Upgrade</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
            <Typography className={classes.disc}>
              <span className='font-weight-600'>Upgraded Order: ORD123</span>
            </Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Re-punch</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Refund</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Created</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
          <Grid className={classes.statusBox}>
            {
              true ?
                <img src={rightImg} alt="statusIcon" className={classes.statusIcon} />
                :
                <img src={wrongImg} alt="statusIcon" className={classes.statusIcon} />
            }
            <Typography className={`${classes.statusText} ${true && classes.mainColor}`}>Created</Typography>
            <Typography className={classes.statusDate}>21/01/2022</Typography>
            <Typography className={classes.statusDays}>(0 day)</Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
