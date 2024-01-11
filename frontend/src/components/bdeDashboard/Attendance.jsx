import React, { useEffect, useState } from 'react';
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import StarIcon from "../../assets/icons/star.svg"
import { getAttendanceData } from '../../helper/DataSetFunction';
import { getCurrentStatus, getMaxAttendance, getMinAttendance, getTargetPosition } from '../../helper/randomFunction/getDataFunction';
import { color } from 'echarts';
import CubeDataset from "../../config/interface";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 4px #00000029",
    borderRadius: "8px",
    width: "13rem",
    marginBottom: "0.4rem",
    flexGrow: "0",
    flexShrink: "0",
    marginRight: "1rem",
  },
  headerSection: {
    borderBottom: "1px solid #ccc",
    [theme.breakpoints.down('md')]: {
      // display: 'none'
      borderBottom: 'none',
      paddingLeft: '0',
      paddingBottom: "0",
    }
  },
  title: {
    fontWeight: "600",
    fontSize: '18px',
    color: '#202124'
  },
  currentStatus: {
    fontSize: "14px",
  },
  currentStatusSpan: {
    borderLeft: "1px solid #ccc",
    marginLeft: "1rem",
    paddingLeft: "1rem",
    [theme.breakpoints.down('md')]: {
      display: 'block',
      borderLeft: "none",
      marginLeft: "initial",
      paddingLeft: "initial",
      marginTop: '10px'
    }
  },
  fw600: {
    fontWeight: "600",
  },
  barSection: {
    backgroundColor: "#fef7ee",
    borderRadius: "8px",
    paddingTop: "3.5rem",
    paddingBottom: "2.5rem",
  },
  linearProgressSection: {
    display: "flex",
    position: 'relative',
  },
  linearProgress: {
    height: "14px",
    width: "100%",
    borderRight: "1px solid #fff",
    borderLeft: "1px solid #fff",
    position: "relative",
  },

  linearProgresslast: {
    height: "14px",
    borderRight: "1px solid #fff",
    borderLeft: "1px solid #fff",
    position: "relative",
  },

  linearProgress: {
    height: "14px",
    width: "100%",
    borderRight: "1px solid #fff",
    borderLeft: "1px solid #fff",
    position: "relative",
  },
  linearProgressBeforeSpan: {
    position: "absolute",
    top: "-20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  linearProgressSpan: {
    position: "absolute",
    right: "-8px",
    top: "-20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  targetStarIcon: {
    width: "1rem",
    position: "absolute",
    zIndex: "1",
    top: "-38px",
  },
  starIconDiv: {
    display: "flex",
    position: "absolute",
    right: "-12px",
    top: "-38px",
  },
  starIcon: {
    width: "1rem",
  },
  starIcon1: {
    marginRight: "-2px",
  },
  CurrentStatusDiv: {
    position: "absolute",
    zIndex: "1",
    top: "20px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    left: '0px',
  },
  CurrentStatusIcon: {
    // position: "absolute",
    // top: "-8px",
    // left: "0",
    // right: "0",
    // margin: "auto",
    color: "#F45E29",
    marginTop: '-8px'
  },
  CurrentStatusSpan: {
    fontSize: "10px",
    marginTop: '-8px'
  },
  linearProgress1: {
    backgroundColor: "#F44040",
    borderRadius: "12px 0px 0px 12px",
  },
  linearProgress2: {
    backgroundColor: "#FC6060",
  },
  linearProgress3: {
    backgroundColor: "#FF7240",
  },
  linearProgress4: {
    backgroundColor: "#B1EFBA",
  },
  linearProgress5: {
    backgroundColor: "#8CDE99",
  },
  linearProgress6: {
    backgroundColor: "#8CDE99",
    borderRadius: "0px 12px 12px 0px",
  },
  ContentContainer: {
    [theme.breakpoints.down('md')]: {
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: '8px'

    }
  },
  cardSubTitle: {
    fontSize: '12px',
    [theme.breakpoints.down('md')]: {
      marginBottom: "10px"
    }
  }
}));

export default function Attendance(props) {

  let { data, getCurrentValue } = props;
  const classes = useStyles();
  const [initial_val, setData] = useState(data)
  let current = getCurrentValue ? getCurrentValue : 0;
  let max = getMaxAttendance(data?.[0]?.[CubeDataset.Attendances.maxTarget])
  let target = getMaxAttendance(data?.[0]?.[CubeDataset.Attendances.minTarget])
  let targetStarPosition = getTargetPosition(data?.[0]?.[CubeDataset.Attendances.minTarget], data?.[0]?.[CubeDataset.Attendances.maxTarget])
  let currentStatusPosition = getCurrentStatus(current, data?.[0]?.[CubeDataset.Attendances.maxTarget])
  let status = getMaxAttendance(data?.[0]?.status)

  var barSize = () => {
    
    let chunkSize = Math.ceil((max / 6)) 

    return max%chunkSize===0 ? '100' :(max%chunkSize)/chunkSize *100
  }
  
 return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Typography className={classes.title}>Attendance</Typography>
      </Grid>
      <div className={classes.ContentContainer}>
        <Typography sx={{ px: "1rem", pt: "1rem" }} className={classes.currentStatus}>
          Current Status : <span className={classes.fw600}>{(current) ? current : 0}pt / {(status && data?.[0]?.[CubeDataset.Attendances.maxTarget]) ? Math.round(data?.[0]?.[CubeDataset.Attendances.maxTarget]) : 0}pt</span>
          <span className={classes.currentStatusSpan}>Target : <span className={classes.fw600}>{(status && data?.[0]?.[CubeDataset.Attendances.minTarget]) ? Math.round(data?.[0]?.[CubeDataset.Attendances.minTarget]) : 0}pt</span></span>
        </Typography>
        <Grid sx={{ p: "1rem" }}>
          <Grid sx={{ px: "1.5rem" }} className={classes.barSection}>
            <Grid className={classes.linearProgressSection}>
              <img src={StarIcon} className={`${classes.targetStarIcon}`} style={{ left: `calc(${targetStarPosition}% - 8px)` }} alt='starIcon' />
              <div className={`${classes.CurrentStatusDiv}`} style={{ left: `calc(${currentStatusPosition}% - 10px)` }}>
                <ArrowDropUpOutlinedIcon className={classes.CurrentStatusIcon} />
                <span className={classes.CurrentStatusSpan}>{current ? current : 0}pt</span>
              </div>
              <Grid className={`${classes.linearProgress} ${classes.linearProgress1}`}>
                <span className={classes.linearProgressBeforeSpan}>0</span>
                <span className={classes.linearProgressSpan}>{Math.ceil((max / 6)) * 1}</span>
              </Grid>
              <Grid className={`${classes.linearProgress} ${classes.linearProgress2}`}>
                <span className={classes.linearProgressSpan}>{Math.ceil((max / 6)) * 2}</span>
              </Grid>
              <Grid className={`${classes.linearProgress} ${classes.linearProgress3}`}>
                <span className={classes.linearProgressSpan}>{Math.ceil((max / 6)) * 3}</span>
              </Grid>
              <Grid className={`${classes.linearProgress} ${classes.linearProgress4}`}>
                <span className={classes.linearProgressSpan}>{Math.ceil((max / 6)) * 4}</span>
              </Grid>
              <Grid className={`${classes.linearProgress} ${classes.linearProgress5}`}>
                <span className={classes.linearProgressSpan}>{Math.ceil((max / 6)) * 5}</span>
              </Grid>
              <Grid className={`${classes.linearProgresslast} ${classes.linearProgress6}`} style={{width: `${barSize()}%`}}>
                <div className={classes.starIconDiv}>
                  <img src={StarIcon} className={`${classes.starIcon} ${classes.starIcon1}`} alt='starIcon' />
                  <img src={StarIcon} className={classes.starIcon} alt='starIcon' />
                </div>
                <span className={classes.linearProgressSpan}>{max}</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
