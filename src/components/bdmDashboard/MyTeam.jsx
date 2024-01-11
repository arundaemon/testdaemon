import React from 'react';
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import CubeDataset from '../../config/interface';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { numberIntlformate } from '../../helper/randomFunction';

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
    fontSize: "18px",
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
  nameStyle: {
    fontWeight: "600",
    margin: "2px 0px 10px 0px",
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
  },
  listBox: {
    padding: "1rem",
  },
  lineStyle: {
    fontSize: "15px",
    marginBottom: "4px",
  },
  lineValueStyle: {
    fontWeight: "600",
    marginLeft: "4px",
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
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "35vh",
    alignItems: "center",
    fontStyle: "italic"
  },
}));

export default function MyTeam(props) {
  const classes = useStyles();

  let {data, empData, target, relaisedData, bdeBooking} = props

  let userName = getUserData('userData')?.name

 
 const getPunched = (emp_id) => {
  
  let res

  res = data?.filter(obj => obj?.[CubeDataset.OMSOrders.eEmpid] === emp_id)?.[0]?.[CubeDataset.OMSOrders.punched]

  return res ? numberIntlformate(res) : 0
 } 

 const getTarget = (roleName) => {
  
  let res

  res = target?.filter(obj => obj?.role_name === roleName)?.[0]?.target  
  
  return res ? numberIntlformate(res) : 0

 }

 const getOrder = (emp_id) => {
  
  let res

  res = data?.filter(obj => obj?.[CubeDataset.OMSOrders.eEmpid] === emp_id)?.[0]?.[CubeDataset.OMSOrders.totalOrder]

  return res ? numberIntlformate(res) : 0
 } 

 const getRealised = (emp_id) => {
  
  let res

  res = relaisedData?.filter(obj => obj?.[CubeDataset.EmployeeLeadsOrder.eEmpid] === emp_id)?.[0]?.[CubeDataset.EmployeeLeadsOrder.realised]

  return res ? numberIntlformate(res) : 0
 } 

 const getBooking = (name) => {
  
  let res

  res = bdeBooking?.filter(obj => obj?.[CubeDataset.BdeactivitiesBq.createdByName
  ] === name)?.[0]?.[CubeDataset.BdeactivitiesBq.count]

  return res ? numberIntlformate(res) : 0
 } 
 

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>My Team</Typography>
          </div>
        </div>
      </Grid>
      <Grid sx={{ px: "16px", pt: "12px" }}>
        {empData?.length > 0 ? <Typography className={classes.nameStyle}>{userName}</Typography> : ''}
        {
          empData?.length > 0 ? <div className={classes.taskCompleted}> {
          empData?.map(obj => (
            <Grid className={`${classes.cusCard} ${classes.borderColorGreen}`}>
              <Typography className={`${classes.taskTitle} ${classes.bgColorGreen}`}>{obj?.displayName}</Typography>
              <div className={classes.listBox}>
                <Typography className={classes.lineStyle}>Orders:
                  <span className={classes.lineValueStyle}>{obj ? getOrder(obj?.userName) : 0}</span>
                </Typography>
                <Typography className={classes.lineStyle}>Target:
                  <span className={classes.lineValueStyle}>{obj ? getTarget(obj?.roleName) : 0}</span>
                </Typography>
                <Typography className={classes.lineStyle}>Punched:
                  <span className={classes.lineValueStyle}>{obj ? getPunched(obj?.userName) : 0 }</span>
                </Typography>
                <Typography className={classes.lineStyle}>Realised:
                  <span className={classes.lineValueStyle}>{obj ? getRealised(obj?.userName) : 0 }</span>
                </Typography>
                <Typography className={classes.lineStyle}>Booking:
                  <span className={classes.lineValueStyle}>{obj ? getBooking(obj?.displayName) : 0 }</span>
                </Typography>
              </div>
            </Grid>
          ))} </div> : <div className={classes.tskPending}>
          "No Team Activity Yet"
        </div>
        } 
      </Grid>
    </>
  )
}
