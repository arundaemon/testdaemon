import React from 'react';
import ReactSelect from 'react-select';
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import ReactECharts from 'echarts-for-react';

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
  },
  title: {
    fontWeight: "600",
    fontSize: '18px',
    color: "#202124",

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
}));

export default function MyKra() {
  const classes = useStyles();

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  var option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.33, '#4482FF'],
              [0.66, '#FA9E2D'],
              [0.99, '#E46179'],
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
          color: '#464646',
          fontSize: 10,
          distance: -25,
          rotate: 'tangential',
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 10
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
            value: 40,
          }
        ]
      }
    ]
  };


  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>My KRA</Typography>
            <Grid className={classes.discBox}>
              <Typography className={classes.subTitle}>Loremsipum Loremsipum</Typography>
            </Grid>
          </div>
          <div className={classes.selectSection}>
            <ReactSelect
              classNamePrefix="select"
              options={options}
            />
          </div>
        </div>
      </Grid>
      <Grid sx={{ px: "16px", pt: "12px" }}>

        <div className={classes.taskCompleted}>
          <Grid className={`${classes.cusCard} ${classes.borderColorGreen}`}>
            <Typography className={`${classes.taskTitle} ${classes.bgColorGreen}`}>Call Audit</Typography>
            <div style={{ width: "100%", height: "160px" }}>
              <ReactECharts option={option} style={{
                height: '15rem',
                width: '100%',
              }} />
            </div>
          </Grid>
          <Grid className={`${classes.cusCard} ${classes.borderColorRed}`}>
            <Typography className={`${classes.taskTitle} ${classes.bgColorRed}`}>Field Shadowing</Typography>
            <div style={{ width: "100%", height: "160px" }}>
              <ReactECharts option={option} style={{
                height: '15rem',
                width: '100%',
              }} />
            </div>
          </Grid>
          <Grid className={`${classes.cusCard} ${classes.borderColorYellow}`}>
            <Typography className={`${classes.taskTitle} ${classes.bgColorYellow}`}>Order Management</Typography>
            <div style={{ width: "100%", height: "160px" }}>
              <ReactECharts option={option} style={{
                height: '15rem',
                width: '100%',
              }} />
            </div>
          </Grid>
          <Grid className={`${classes.cusCard} ${classes.borderColorYellow}`}>
            <Typography className={`${classes.taskTitle} ${classes.bgColorYellow}`}>RPP</Typography>
            <div style={{ width: "100%", height: "160px" }}>
              <ReactECharts option={option} style={{
                height: '15rem',
                width: '100%',
              }} />
            </div>
          </Grid>
        </div>
      </Grid>
    </>
  )
}
