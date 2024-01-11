import React, { useEffect, useState } from 'react';
import Page from "../../components/Page";
import { Grid, Paper, styled } from "@mui/material";
import { makeStyles } from '@mui/styles';
import Slider from "../../components/MyLeads/Slider";
import MyKra from "../../components/bdmDashboard/MyKra";
import MyTeam from "../../components/bdmDashboard/MyTeam";
import LeadAssigned from "../../components/bdmDashboard/LeadAssigned";
import TodayBooking from "../../components/bdmDashboard/TodayBooking";
import BookingScheduled from "../../components/bdmDashboard/BookingScheduled";
import MissedEvent from "../../components/bdmDashboard/MissedEvent";
import { getEmployeeRoles, getUserData } from '../../helper/randomFunction/localStorage';
import { getBDMEmpID, getBDMEmpRoleName, getLoginUserData } from '../../helper/randomFunction';
import { getAllBDEBooking, getBookingData, getBookingSchedule, getPendingBooking, getRealisedData, getRevenueData, getTeamActivity } from '../../helper/DataSetFunction';
import { activityLogger } from '../../config/services/activities';
import moment from 'moment';
import { getTargetIncentive } from '../../config/services/targetincentive';
import Revenue from '../MyLeads/Revenue';



const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const useStyles = makeStyles((theme) => ({
  prevPointer: {
    fontSize: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  activePointer: {
    fontSize: "14px",
    fontWeight: "600"
  },
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  subTitle: {
    fontSize: "14px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  selectSection: {
    borderRadius: "0",
    paddingBottom: "0",
    paddingTop: "1px"
  },
  borderRight: {
    borderRight: "1px solid #DEDEDE",
  }
}));
export const BDMDashboard = () => {
  const classes = useStyles();
  const loginUserData = getLoginUserData()
  let roleList = getEmployeeRoles('childRoles');

  let {getRoleName, empData} = getBDMEmpRoleName(roleList)

  roleList = getBDMEmpID(roleList)

  const [today_order, setTodayOrder] = useState([]);

  const [bde_order, setBDEOrder] = useState([]);

  const [view_task, setTaskView] = useState(null)

  const [booking_date, setBookingDate] = useState([])

  const [pending_booking, setPendingBooking] = useState([])

  const [bde_booking , setBDEBooking] = useState([])

  const [team_activity , setTeamActivity] = useState([])

  const [target, setTarget] = useState([])

  const [relaised_data, setRelaisedData] = useState([])

  
  const getTodayBooking = async () => {
    
    let bookView = 'Today'

    try {
      const res = await getBookingData(getRoleName, bookView);
      setTodayOrder(res?.loadResponses?.[0]?.data);
    }catch(err) {
      console.error(err)
    }
  }


  const getMonthlyBooking = async () => {
    
    let bookView = 'This Month'

    try {
      const res = await getBookingData(getRoleName, bookView);
      setBDEOrder(res?.loadResponses?.[0]?.data);
    }catch(err) {
      console.error(err)
    }
  }
  
  const getScheduleBooking = async () => {

    try {
      const res = await getBookingSchedule(getRoleName, view_task);
      setBookingDate(res?.loadResponses?.[0]?.data)
    }catch(err) {
      console.error(err)
    }
  }

  const getMissedBooking = async () => {

    try {
      const res = await getPendingBooking(getRoleName);
      setPendingBooking(res?.loadResponses?.[0]?.data)
    }catch(err) {
      console.error(err)
    }
  }

  const getBDEBooking = async () => {

    try {
      const res = await getAllBDEBooking(getRoleName);
      let data = res.rawData()
      setBDEBooking(data)
    }catch(err) {
      console.error(err)
    }
  } 


  const getMYEmpActivity = async () => {

    try {
      const res = await getTeamActivity(getRoleName, roleList);
      setTeamActivity(res?.loadResponses?.[0]?.data)
    }catch(err) {
      console.error(err)
    }
  }

  const getBDETarget = async () => {
    let profileName = getUserData('userData')?.crm_profile

    let roleName = empData?.map(obj => obj?.roleName)
    
    let params = {profile_name: profileName, 
      role_name: {$in : roleName}
    }

    getTargetIncentive(params)
      .then((res) => {
         if(res?.result) {
           setTarget(res?.result)
         }
      })
      .catch((err) => {
        console.log(err, "..error");
      });
  };


  const getMyRelaised = async () => {
    try {
      let res = await getRealisedData()
      setRelaisedData(res?.loadResponses?.[0]?.data)
    }catch(err) {
      console.error(err)
    }
  }

  const getTaskChange = (task) => {
    setTaskView(task)
  }

  useEffect( () => {
    getTodayBooking();
    getMissedBooking();
    getBDEBooking();
    getMYEmpActivity();
    getBDETarget();
    getMyRelaised();
    getMonthlyBooking();
    let data = loginUserData.userData
    let activityData = {
      empCode:data.employee_code,
      landing_page:'BDM Dashboard Page',
      action:'BDM Dashboard',
      event_type: 'View BDM Dashboard',
      eventStep: 'View BDM Dashboard',
      click_type: 'View BDM Dashboard',
      eventData: data
    }
    activityLogger(activityData)
  }, [])

  useEffect( () => {
    if (view_task) {
      getScheduleBooking();
    }
  }, [view_task])

  
  return (
    <>
      <div className='BdmDashboardPage'>
        <Page title="Dashboard">
          <Grid sx={{ px: "16px", py: "12px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                  <Revenue />
                </Grid>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                  <Slider />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: "0px" }}>
              <Grid item xs={12} lg={8}>
                {/* <Grid className={classes.cusCard}>
                  <MyKra />
                </Grid> */}
                <Grid className={classes.cusCard}>
                  <MyTeam data={team_activity ? team_activity : []} empData={empData ? empData : []} target={target ? target : []} relaisedData={relaised_data ?? []} bdeBooking = {bde_order ?? []}/>
                </Grid>
                <Grid className={classes.cusCard} sx={{ mt: "16px" }}>
                  <LeadAssigned data ={bde_booking ? bde_booking : []}/>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Grid className={classes.cusCard}>
                  <TodayBooking data = {today_order ? today_order : []} getRoleName={getRoleName}/>
                </Grid>
                <Grid className={classes.cusCard} sx={{ mt: "16px" }}>
                  <BookingScheduled getTaskChange={getTaskChange} data={booking_date ? booking_date : []} getRoleName={getRoleName}/>
                </Grid>
                <Grid className={classes.cusCard} sx={{ mt: "16px" }}>
                  <MissedEvent data ={pending_booking ? pending_booking : []} getRoleName={getRoleName}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Page>
      </div>
    </>
  )


}