import React from 'react';
import StarIcon from "../../assets/icons/star.svg"
import ReactSelect from 'react-select';
import { Grid, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { makeStyles } from '@mui/styles';
import ReactECharts from 'echarts-for-react';
import { useState, useEffect } from 'react';
import { DisplayLoader } from '../../helper/Loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CubeDataset from '../../config/interface';



const useStyles = makeStyles((theme) => ({
  cusCard: {
    boxShadow: "0px 0px 4px #00000029",
    borderRadius: "8px",
    width: "13rem",
    marginBottom: "0.4rem",
    flexGrow: "0",
    flexShrink: "0",
    marginRight: "1rem",
    overflow: 'hidden',
  },
  headerSection: {
    borderBottom: "1px solid #ccc",
    [theme.breakpoints.down('md')]: {
      borderBottom: 'none',
      paddingLeft: '0',
      paddingRight: "0",
    }
  },
  title: {
    fontWeight: "600",
    color: '#202124',
    fontSize: '18px'
  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  subTitle: {
    fontSize: "12px",
  },
  selectSection: {
    width: "18%",
    minWidth: "9rem",
  },
  taskCompleted: {
    display: "inline-flex",
    overflow: "auto",
    padding: "4px",
    maxWidth: "100%",
  },
  taskTitle: {
    fontSize: "14px",
    backgroundColor: "#F45E29",
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    padding: "8px 4px",
  },
  taskDisc: {
    fontSize: "12px",
    padding: "1rem 14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "flex-start",
    marginTop: '30px',
  },
  starIcon: {
    width: "1.2rem",
    marginRight: "6px",
  },
  bgColorGreen: {
    backgroundColor: "#80CC8C",
  },
  bgColorRed: {
    backgroundColor: "#F44040",
  },
  bgColorYellow: {
    backgroundColor: "#F3B85C",
  },
  borderColorGreen: {
    border: "1px solid #80CC8C",
  },
  borderColorRed: {
    border: "1px solid #F44040",
  },
  borderColorYellow: {
    border: "1px solid #F3B85C",
  },
  textBox: {
    color: "#202124",
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
    display: "flex",
    justifyContent: "center",
    height: "30%",
    width: "100%",
    gap: '10px',
    alignItems: 'center'
  },
  BoxGrid: {
    width: "100%",
    height: "145px",
    textAlign: 'center',
    padding: "20px 0"
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
    fontStyle: "italic"
  },
  loaderVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    height: "50vh",
    width: "100%"
  },
  contentContainer: {
    [theme.breakpoints.down('md')]: {
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: '8px',
      padding: '10px',
    }
  }
}));

export default function MyTargets(props) {
  const classes = useStyles();

  let { data, getTargetChange, getCurrentTarget } = props

  const getBUAvg = (buAverage, nationalAvg) => {
    let average 
    
    if (buAverage > nationalAvg ) {
      return average = [nationalAvg, "#E46179"]
    }
    else {
      return average = [buAverage, "#4482FF"]
    }

  } 


  const getNationAvg = (buAverage, nationalAvg) => {
    let average 

    if (buAverage?.[0] > nationalAvg) {
      return average = [buAverage?.[0], "#4482FF"]
    }
    else {
      return average = [nationalAvg, "#E46179"]
    }
  }

  const getFullAveraga = (buAverage,nationalAvg, leadCount) => {

    buAverage = buAverage == '0.99'
    buAverage = nationalAvg == '0.99'

    if( (buAverage == '0.99' || buAverage  > '0.99')) {
      return [buAverage, "#4482FF"]
    }
    
    else if( (nationalAvg == '0.99' || nationalAvg  > '0.99')) {
      return [nationalAvg, "#E46179"]
    }
    else if (leadCount > 1 || leadCount == '0.99') {
      return ['0.99', '#FA9E2D']
    }
    else {
      return ['0.99', 'rgba(255, 0, 0, 0.9)']
    }
  }

  const getLeadCount = (leadCount, buAverage, nationalAverage) => {

    if (leadCount?.[0] > buAverage?.[0] && buAverage?.[0] > nationalAverage?.[0]) {
      return buAverage
     }
     else if (leadCount?.[0] >  nationalAverage?.[0] && nationalAverage?.[0] > buAverage?.[0]){
       return nationalAverage
     }
     else if (leadCount?.[0] >  nationalAverage?.[0] && nationalAverage?.[0] === buAverage?.[0]) {
       return buAverage
     }
     else {
       return leadCount
     }
  }

  

  const getOptionData = (data) => {
    let { activityCount, activityAverage, nationalAvg } = data


    let leadCount = activityCount > 0 ? activityCount / 100 : 0
    let buAverage = activityAverage > 0 ? activityAverage / 100 : 0
    nationalAvg = nationalAvg > 0 ? nationalAvg / 100 : 0
    let fullAverage = getFullAveraga(buAverage,nationalAvg, leadCount);  


    leadCount = leadCount ? [leadCount, "#FA9E2D"] : ['0.99', 'rgba(255, 0, 0, 0.9)']
    buAverage = leadCount && buAverage && nationalAvg ? getBUAvg(buAverage, nationalAvg) : ['0.99', 'rgba(255, 0, 0, 0.9)']
    nationalAvg = buAverage && nationalAvg ? getNationAvg(buAverage, nationalAvg) : ['0.99', 'rgba(255, 0, 0, 0.9)']
    
    leadCount = getLeadCount(leadCount, buAverage, nationalAvg )
    
    return {
      series: {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              leadCount,
              buAverage,
              nationalAvg,
              fullAverage
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '20%',
          width: 10,
          offsetCenter: [0, '-40%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 0,
        },
        splitLine: {
          length: 0,
        },
        axisLabel: {
          color: "#000",
          fontSize: 10,
          distance: -25,
          rotate: 'tangential',
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 10,
        },
        detail: {
          fontSize: 20,
          offsetCenter: [0, '-15%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value);
          },
          color: 'auto'
        },
        data: [
          {
            value: activityCount ? activityCount : 0
          }
        ]
      }
    }
  }


  const getActPoint = (activity_id) => {
    let activityPoint = {}
    let activityCount = getCurrentTarget?.filter((obj) => obj?.[CubeDataset.BdeactivitiesBq.activityId] == activity_id)?.map(obj => obj?.[CubeDataset.BdeactivitiesBq.count])?.toString();

    let activityAverage = getCurrentTarget?.filter((obj) => obj?.[CubeDataset.BdeactivitiesBq.activityId] == activity_id)?.map(obj => obj?.[CubeDataset.BdeactivitiesBq.buAverage])?.toString();

    let nationalAvg = getCurrentTarget?.filter((obj) => obj?.[CubeDataset.BdeactivitiesBq.activityId] == activity_id)?.map(obj => obj?.[CubeDataset.BdeactivitiesBq.nationalAverage])?.toString();

    activityPoint = {
      activityCount: activityCount,
      activityAverage: activityAverage,
      nationalAvg: nationalAvg
    }
    return activityPoint
  }

  const getTargetPercent = (total, count) => {
    return checkcond(total, count)
  }

  const checkcond = (total, count) => {
    let checkAvg = (count / total) * 100;

    if (checkAvg < 40) {
      return <img src="/alertred.svg" />
    }

    else if ((checkAvg == 40 || checkAvg > 40) && checkAvg < 80) {
      return <img src="/warning_alert.svg" />
    }

    else if (checkAvg == 100 || checkAvg > 100) {
      return <img src="/tickIcon.svg" />
    }
    else {
      return true
    }
  }

  const getTargetOrder = (data) => {
    let checkView = value?.label;

    if (checkView === 'This Week') {
      return data?.[CubeDataset.RolebasedattendanceactivitymodelsBq.weeklyTarget]
    }
    else if (checkView === 'This Month') {
      return data?.[CubeDataset.RolebasedattendanceactivitymodelsBq.monthlyTarget]
    }
    else {
      return data?.[CubeDataset.RolebasedattendanceactivitymodelsBq.dailyTarget]
    }
  }

  const getTargetText = () => {
    let checkView = value?.label;

    if(checkView === 'This Week') {
      return 'Weekly'
    }
    else if (checkView === 'This Month') {
      return 'Monthly'
    }
    else {
      return 'Daily'
    }
  }


  const lebelArray = [
    {
      label: 'My Points',
      color: '#FA9E2D'
    },
    {
      label: 'Business Unit Average',
      color: '#4482FF'
    },
    {
      label: 'National Average',
      color: '#E46179'
    }
  ]

  const getCallPoint = (data) => {
    let { activityCount, activityAverage, nationalAvg } = data
    let count

    activityCount = Number(activityCount)
    activityAverage = Number(activityAverage)
    nationalAvg = Number(nationalAvg)
    
    if ((nationalAvg || activityAverage) && activityCount) {
      count = activityAverage > activityCount ? activityAverage - activityCount : nationalAvg - activityCount
      count = count > 0 ? count : 0
      return count
    }
    else {
      return count = 0
    }
  }

  
  const options = [
    { value: 'Today', label: 'Today' },
    { value: 'This Week', label: 'This Week' },
    { value: 'This Month', label: 'This Month' }
  ]


  const [value, setValue] = useState({
    label: "Today", value: "Today"
  })

  useEffect(() => {
    getTargetChange(value)
  }, [value])


  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>My targets / Achievement</Typography>
          </div>
          <div className={classes.selectSection}>
            <ReactSelect
              classNamePrefix="select"
              options={options}
              value={value}
              onChange={(e) => setValue({
                label: e.label,
                value: e.value
              })}
            />
          </div>
        </div>
      </Grid>
      <Grid sx={{ px: "16px", pt: "12px" }} className={classes.contentContainer}>
        <div className={classes.taskCompleted}>
          {data?.length > 0 ? data?.map((data, index) => {
            const activityPoint = getActPoint(data?.[CubeDataset.RolebasedattendanceactivitymodelsBq.activityId])
            let { activityCount, activityAverage, nationalAvg } = activityPoint ? activityPoint : {}
            let currentTarget = getTargetOrder(data);
            return (
              <>
                <Grid className={`${classes.cusCard} ${classes.borderColorGreen}`} key={index}>
                  <Typography className={`${classes.taskTitle} ${classes.bgColorGreen}`}>{data?.[CubeDataset.Rolebasedattendanceactivitymodels.activityName]}</Typography>
                  <div className={classes.BoxGrid}>
                    <div className={classes.textBox}>
                      {getTargetPercent(currentTarget,activityCount)}
                      {`${currentTarget} ${getTargetText()} Target`}
                    </div>
                    <ReactECharts option={getOptionData(activityPoint)} style={{
                      height: '15rem',
                      width: '100%',
                    }} />
                  </div>
                  <Typography className={classes.taskDisc}>
                    <img src={StarIcon} className={classes.starIcon} alt='starIcon' />
                    <span>{getCallPoint(activityPoint)} Points more to reach BU avg.</span>
                  </Typography>
                </Grid>
              </>
            )
          }) : <div className={classes.tskPending}>
          "No Completed Target yet"
        </div>}
        </div>
          
        <FormGroup row>
          {data?.length > 0 ? lebelArray.map((data) => (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ height: 16, borderRadius: 4, width: 16, background: data?.color, marginRight: 10 }}></div>
              <span style={{ fontSize: 14, marginRight: '2rem' }}>{data?.label}</span>
            </div>
            // <FormControlLabel
            //   control={
            //     <Checkbox
            //       name="checkedA"
            //       style={{
            //         transform: "scale(0.7)",
            //         color: data?.color
            //       }}
            //     />
            //   }
            //   label={<span style={{ fontSize: '14px' }}>{data?.label}</span>}
            //   sx={{ height: "30px", mr: "2rem" }}
            // />
          )) : ""}
        </FormGroup>
      </Grid>
    </>
  )
}
