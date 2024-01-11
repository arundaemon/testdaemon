import React from 'react';
import { Grid, Divider, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { getTargetIncentive } from '../../config/services/targetincentive';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import RevenueBgMweb from '../../assets/image/revenue-bg-mweb.svg'
import { useState } from 'react';
import { getRealisedData, getRevenueData } from '../../helper/DataSetFunction';
import CubeDataset from "../../config/interface";
import { numberIntlformate } from '../../helper/randomFunction';

const useStyles = makeStyles((theme) => ({
  cusCard: {
    boxShadow: "0px 0px 4px #00000029",
    borderRadius: "8px",
    maxWidth: "13rem",
    marginBottom: "0.4rem",
    flexGrow: "0",
    flexShrink: "0",
    marginRight: "1rem",
  },
  headerSection: {
    borderBottom: "1px solid #ffffff",
    backgroundColor: "#FA9E2D",
    color: "#ffffff",
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  title: {
    fontWeight: "600",
  },
  mainContent: {
    backgroundColor: "#FA9E2D",
    textAlign: "center",
    [theme.breakpoints.down('md')]: {
      backgroundImage: `url(${RevenueBgMweb})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right top',
      minHeight: "150px",
      padding: '10px',
      display: 'flex',
      alignItems: 'center'
    }
  },
  content: {
    display: "flex",
    justifyContent: "space-around",
    color: "#ffffff",
    [theme.breakpoints.down('md')]: {
      justifyContent: "left",
      flexWrap: 'wrap'
    }

  },
  label: {
    fontSize: "14px",
    fontWeight: "600",

    [theme.breakpoints.down('md')]: {
      padding: '0 10px',
      marginBottom: '0px'
    }
  },
  value: {
    fontSize: "16px",
    fontWeight: "600",
  },
  itemCardConaitainer: {
    [theme.breakpoints.down('md')]: {
      minWidth: "80px",
      // marginBottom: '20px'
    }
  },
  itemContainer: {
    display: 'contents',
    [theme.breakpoints.down('md')]: {
      display:'flex',
      marginBottom:'10px',
      marginTop:'10px',
    }
  },
  Divider: {
    width:"2px",
    [theme.breakpoints.down('md')]: {
      margin: '5px 0'
    }
  },
  cusBox: {
    [theme.breakpoints.down('md')]: {
      minWidth: "30%",
      margin: "10px 0"
    },
  },
  cusDivider: {
    [theme.breakpoints.down('md')]: {
      display: "none"
    },
  },
  my1rem: {
    [theme.breakpoints.down('md')]: {
      margin: '1rem 0',
    },
  }
}));

export default function BDERevenue(props) {
  const classes = useStyles();

  const [incentive, setIncentive] = useState(null);
  const [target, setTarget] = useState(null)
  const [revenue_data, setRevenueData] = useState([])

  const [relaised_data, setRelaisedData] = useState([])

  const getMyRevenue = async () => {
    try {
      let res = await getRevenueData()
      setRevenueData(res.rawData())
    }catch(err) {
      console.error(err)
    }
  }

  const getMyRelaised = async () => {
    try {
      let res = await getRealisedData()
      setRelaisedData(res.rawData())
    }catch(err) {
      console.error(err)
    }
  }


  let data = revenue_data
  
  let netInvoice = data && data.length > 0? data.reduce((total,obj)=> parseFloat(obj[CubeDataset.OMSOrders.netOfInvoice]) + total , 0):0//data?.[0]?.[CubeDataset.EmployeeLeadsOrder.netOfInvoice]
  let realised = relaised_data && relaised_data?.length > 0? relaised_data?.reduce((total,obj)=> parseFloat(obj[CubeDataset.EmployeeLeadsOrderBq.realised]) + total , 0):0 
  //console.log(realised)
  let purChased =  data && data.length > 0? data.reduce((total,obj)=> parseFloat(obj[CubeDataset.OMSOrders.punched]) + total , 0):0 //data?.[0]?.[CubeDataset.EmployeeLeadsOrder.punched]
  

  const getBoardListHandler = async () => {
    let profileName = getUserData('userData')?.crm_profile
    let roleName = getUserData('userData')?.crm_role
    let params = {profile_name: profileName , role_name:{$in: [roleName]}}

    getTargetIncentive(params)
      .then((res) => {
         if(res?.result?.[0]) {
           setTarget(res?.result?.[0]?.target)
           setIncentive(res?.result?.[0]?.incentive)
         }
      })
      .catch((err) => {
        console.log(err, "..error");
      });
  };



  useEffect(
    () => {
      getBoardListHandler();
      getMyRevenue();
      getMyRelaised();
    }, []
  )

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Typography className={classes.title}>Monthly Revenue</Typography>
      </Grid>
      <Grid sx={{ px: "16px", py: "20px" }} className={classes.mainContent}>
        <Grid className={classes.content}>
          <Grid className={classes.cusBox}>
            <Typography className={classes.label}>Target</Typography>
            <Typography className={classes.value}>{target ? numberIntlformate(target) : 0}</Typography>
          </Grid>
          <Divider color="#FFFFFF" flexItem orientation="vertical" className={classes.my1rem} md={{ borderRightWidth: 1.5 }} ></Divider>
          <Grid className={classes.cusBox}>
            <Typography className={classes.label}>Realised</Typography>
            <Typography className={classes.value}>{realised ? numberIntlformate(realised) : 0}</Typography>
          </Grid>
          <Divider color="#FFFFFF" flexItem orientation="vertical" className={classes.my1rem} md={{ borderRightWidth: 1.5 }} ></Divider>
          <Grid className={classes.cusBox}>
            <Typography className={classes.label}>Net of GST</Typography>
            <Typography className={classes.value}>{netInvoice ? numberIntlformate(netInvoice) : 0}</Typography>
          </Grid>
          <Divider color="#FFFFFF" flexItem orientation="vertical" className={classes.cusDivider} md={{ borderRightWidth: 1.5 }} ></Divider>
          <Grid className={classes.cusBox}>
            <Typography className={classes.label}>Punched</Typography>
            <Typography className={classes.value}>{purChased ? numberIntlformate(purChased) : 0}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
