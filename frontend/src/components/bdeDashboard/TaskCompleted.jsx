import React from 'react';
import ReactSelect from 'react-select';
import { Grid, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { makeStyles } from '@mui/styles';
import ReactECharts from 'echarts-for-react';
import { color } from 'echarts';
import { getBuAvg, getLeadCount, getNationalAvg } from '../../helper/randomFunction/getDataFunction';
import { useState } from 'react';
import { useEffect } from 'react';
import { DisplayLoader } from '../../helper/Loader';
import CubeDataset from '../../config/interface';



const useStyles = makeStyles((theme) => ({
  cusCard: {
    boxShadow: "0px 0px 4px #00000029",
    borderRadius: "8px",
    width: "13rem",
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
    padding: "1rem 14px 2rem 14px",
    textAlign: "center",
    fontWeight: "600",
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
  }
  , contentContainer: {
    marginBottom: '50px',
    [theme.breakpoints.down('md')]: {
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: '8px',
      padding: '10px',
      marginBottom: 'initial',
    }
  }
}));

export default function TaskCompleted(props) {
  const classes = useStyles();

  const options = [
    { value: 'Today', label: 'Today' },
    { value: 'This Week', label: 'This Week' },
    { value: 'This Month', label: 'This Month' }
  ]

  const [value, setValue] = useState({
    label: "Today", value: "Today"
  })


  let {data, getTaskChange} = props

  
  const getNationAvg = (buAverage, nationalAvg) => {
    let average 

    if (buAverage?.[0] > nationalAvg?.[0]) {
      return average = buAverage
    }
    else {
      return average = nationalAvg
    }
  }
  
  const getBUAvg= (buAverage, nationalAvg) => {
    let average 

    if (buAverage?.[0] > nationalAvg?.[0] ) {
      return average = nationalAvg
    }
    else {
      return average = buAverage
    }
  } 

  const getPointCount = (leadCount, buAverage, nationalAverage) => {
    
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
  
  const getFullAveraga = (buAverage,nationalAvg, leadCount) => {
    buAverage = buAverage?.[0] == '0.99'
    buAverage = nationalAvg?.[0] == '0.99'

    if( (buAverage?.[0] == '0.99' || buAverage?.[0]  > '0.99')) {
      return buAverage
    }
    
    else if( (nationalAvg?.[0] == '0.99' || nationalAvg?.[0]  > '0.99')) {
      return nationalAvg
    }
    else if (leadCount?.[0] > 1 || leadCount?.[0] == '0.99') {
      return ['0.99', '#FA9E2D']
    }
    else {
      return ['0.99', 'rgba(255, 0, 0, 0.9)']
    }
  }

  const getOptionData = (data) => {

    let leadCount = getLeadCount(data)?.length > 0 ? getLeadCount(data) : 0;
    let buAverage = getBuAvg(data)?.length > 0 ? getBuAvg(data) : 0;
    let nationalAvg = getNationalAvg(data)?.length > 0 ? getNationalAvg(data) : 0
    let fullAverage = getFullAveraga(buAverage,nationalAvg, leadCount);    

    leadCount = leadCount ? leadCount : ['0.99', 'rgba(255, 0, 0, 0.9)']
    buAverage = leadCount && buAverage && nationalAvg ? getBUAvg(buAverage, nationalAvg) : ['0.99', 'rgba(255, 0, 0, 0.9)']
    nationalAvg = buAverage && nationalAvg ? getNationAvg(buAverage, nationalAvg) : ['0.99', 'rgba(255, 0, 0, 0.9)']

    leadCount = getPointCount(leadCount, buAverage, nationalAvg)

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
            value: data?.[CubeDataset.BdeactivitiesBq.count]
          }
        ]
      }
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
    let activityCount = data?.[CubeDataset.BdeactivitiesBq.count]
    let activityAverage = data?.[CubeDataset.BdeactivitiesBq.buAverage]
    let nationalAvg = data?.[CubeDataset.BdeactivitiesBq.nationalAverage]
    let count

    if ((nationalAvg || activityAverage) && activityCount) {
      count = activityAverage > activityCount ? activityAverage - activityCount : nationalAvg - activityCount
      count = count > 0 ? count : 0
      return count
    }
    else {
      return count = 0
    }
  }

  useEffect(() => {
    getTaskChange(value)
  }, [value])

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>Task Completed</Typography>
            <Grid className={classes.discBox}>
              {/* <Typography className={classes.subTitle}>Loremsipum Loremsipum</Typography> */}
            </Grid>
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
        {(data) ? <div className={classes.taskCompleted}>
          {
            data?.length > 0 ? data?.map((data) => (
              <Grid className={`${classes.cusCard}`}>
                <Typography className={classes.taskTitle}>{data?.[CubeDataset.BdeactivitiesBq.activityName]}</Typography>
                <div style={{ width: "100%", height: "145px" }}>
                  <ReactECharts option={getOptionData(data)} style={{
                    height: '15rem',
                    width: '100%',
                  }} />
                </div>
                <Typography className={classes.taskDisc}>{getCallPoint(data)} More {data?.[CubeDataset.BdeactivitiesBq.activityName]} to  reach BU Average</Typography>
              </Grid>
            )) : <div className={classes.tskPending}>
              "No Completed tasks yet"
            </div>
          }
        </div> :
          <div className={classes.loaderVisible}>
            {DisplayLoader()}
          </div>
        }
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
