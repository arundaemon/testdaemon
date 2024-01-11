import React from "react";
import { Grid, Divider, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getTargetIncentive } from "../../config/services/targetincentive";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import moment from "moment";
import RevenueBgMweb from "../../assets/image/revenue-bg-mweb.svg";
import { useState } from "react";
import { getRealisedData, getRevenueData, getTarget } from "../../helper/DataSetFunction";
import CubeDataset from "../../config/interface";
import { numberIntlformate } from "../../helper/randomFunction";
import useMediaQuery from '@mui/material/useMediaQuery';
import FormSelect from "../../theme/form/theme2/FormSelect";
import { ReactComponent as IconCalendar } from './../../assets/icons/icon-calendar-2.svg';

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
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  title: {
    fontWeight: "600",
  },
  mainContent: {
    backgroundColor: "#FA9E2D",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      // backgroundImage: `url(${RevenueBgMweb})`,
      // backgroundRepeat: "no-repeat",
      // backgroundPosition: "right top",
      minHeight: "120px",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      backgroundColor: 'transparent'
    },
  },
  content: {
    display: "flex",
    justifyContent: "space-around",
    color: "#ffffff",
    [theme.breakpoints.down("md")]: {
      justifyContent: "left",
      flexWrap: "wrap",
    },
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",

    [theme.breakpoints.down("md")]: {
      padding: "0 10px",
      marginBottom: "0px",
    },
  },
  value: {
    fontSize: "16px",
    fontWeight: "600",
  },
  itemCardConaitainer: {
    [theme.breakpoints.down("md")]: {
      minWidth: "80px",
      // marginBottom: '20px'
    },
  },
  itemContainer: {
    display: "contents",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      marginBottom: "10px",
      marginTop: "10px",
    },
  },
  Divider: {
    width: "2px",
    [theme.breakpoints.down("md")]: {
      margin: "5px 0",
    },
  },
  cusBox: {
    [theme.breakpoints.down("md")]: {
      minWidth: "30%",
      margin: "10px 0",
    },
  },
  cusDivider: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  my1rem: {
    [theme.breakpoints.down("md")]: {
      margin: "1rem 0",
    },
  },
}));

export default function SchoolRevenue({handleFilterChange}) {
  const classes = useStyles();

  const [incentive, setIncentive] = useState(null);
  const [target, setTarget] = useState(0);
  const [revenue_data, setRevenueData] = useState([]);


  const [relaised_data, setRelaisedData] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [selectValue, setSelectValue] = useState("This Year")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const options = [
    { label: 'This Financial Year', value: 'year' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Month', value: 'month' }
  ]

  const handleDropDown = (e) => {
    setSelectValue(e)
  }


  const getMyRevenue = async () => {
    try {
      let res = await getRevenueData();
      setRevenueData(res.rawData());
    } catch (err) {
      console.error(err);
    }
  };

  const getMyRelaised = async () => {
    try {
      let res = await getRealisedData();
      setRelaisedData(res.rawData());
    } catch (err) {
      console.error(err);
    }
  };

  let data = revenue_data;

  let netInvoice =
    data && data.length > 0
      ? data.reduce(
        (total, obj) =>
          parseFloat(obj[CubeDataset.OMSOrders.netOfInvoice]) + total,
        0
      )
      : 0; //data?.[0]?.[CubeDataset.EmployeeLeadsOrder.netOfInvoice]
  let realised =
    relaised_data && relaised_data?.length > 0
      ? relaised_data?.reduce(
        (total, obj) =>
          parseFloat(obj[CubeDataset.EmployeeLeadsOrderBq.realised]) + total,
        0
      )
      : 0;
  //console.log(realised)
  let purChased =
    data && data.length > 0
      ? data.reduce(
        (total, obj) =>
          parseFloat(obj[CubeDataset.OMSOrders.punched]) + total,
        0
      )
      : 0; //data?.[0]?.[CubeDataset.EmployeeLeadsOrder.punched]

  const getBoardListHandler = async () => {
    let profileName = getUserData("userData")?.crm_profile;
    let roleName = getUserData("userData")?.crm_role;
    let params = { profile_name: profileName, role_name: { $in: [roleName] } };

    getTargetIncentive(params)
      .then((res) => {
        if (res?.result?.[0]) {
          setTarget(res?.result?.[0]?.target);
          setIncentive(res?.result?.[0]?.incentive);
        }
      })
      .catch((err) => {
        console.log(err, "..error");
      });
  };

  const handleStartMonth = async (range) => {
    let startMonth;
    let targetMonthArray = []
    let currentDate = new Date()
    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear()
    let curentQuarter = Math.ceil((currentMonth + 1) / 3)

    if (range === 'This Month') {
      startMonth = moment(new Date(currentYear, currentMonth, 1)).format('YYYY-MM-DD')
      let startingDate = moment(new Date(currentYear, currentMonth, 1)).format('DD MMMM YYYY')
      let endingDate = moment(new Date(currentYear, currentMonth + 1, 0)).format('DD MMMM YYYY')
      setStartDate(startingDate)
      setEndDate(endingDate)
      targetMonthArray.push(startingDate)
      targetMonthArray.push(endingDate)

    }
    else if (range === 'This Year') {
      let financialMonth = 3
      for (let i = 0; i < 12; i++) {
        if (i == 0) {
          let startingDate = moment(new Date(currentYear, financialMonth, 1)).format('DD MMMM YYYY')
          setStartDate(startingDate)
          targetMonthArray.push(startingDate)

        }
        if (i == 11) {
          let endingDate = moment(new Date(currentYear, financialMonth + 1, 0)).format('DD MMMM YYYY')
          setEndDate(endingDate)
          targetMonthArray.push(endingDate)

        }
        financialMonth++;
        if (financialMonth === 12) {
          financialMonth = 0
          currentYear++
        }
      }
    }
    else {
      let quarterStartMonth = (curentQuarter - 1) * 3;
      for (let i = 0; i < 3; i++) {
        let date = moment(new Date(currentYear, quarterStartMonth + i, 1)).format('YYYY-MM-DD')
        if (i == 0) {
          let startingDate = moment(new Date(date)).format('DD MMMM YYYY')
          setStartDate(startingDate)
          targetMonthArray.push(startingDate)
        }
        if (i == 2) {
          let endingDate = moment(new Date(currentYear, quarterStartMonth + i + 1, 0)).format('DD MMMM YYYY')
          setEndDate(endingDate)
          targetMonthArray.push(endingDate)
        }
      }
    }
    return targetMonthArray
  }

  const fetchTargetAmount = async (dateRange) => {
    let date1 = moment(new Date(dateRange?.[0])).format('YYYY-MM-DD 00:00:00')
    let date2 = moment(new Date(dateRange?.[1])).format('YYYY-MM-DD 23:59:59')
    let roleName = getUserData("userData")?.crm_role;

    let params = { dateRange: [date1, date2], roleName: roleName }
    try {
      let data = await getTarget(params);
      let targetAmount = data?.rawData()?.[0]?.[CubeDataset.Targets.TotalTargetAmount]
      setTarget(targetAmount)
    } catch (err) {
      console.error(err, 'Error while fetching Target Amount');
    }
  };

  useEffect(() => {
    getBoardListHandler();
    getMyRevenue();
    getMyRelaised();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let dateRange = await handleStartMonth(selectValue);
      fetchTargetAmount(dateRange);
    }

    fetchData();
  }, [selectValue])
  return (
    <>
      <Box className="crm-sd-dashboard-revenue-filter">
        <Box className="crm-sd-dashboard-revenue-filter-container">
          
          <Box className="crm-sd-dashboard-revenue-filter-label">{ isMobile ? <IconCalendar className="crm-sd-revenue-filter-label-icon" /> : null } {moment(startDate).format('DD MMM')} To {moment(endDate).format('DD MMM')}</Box>
          <Box className="crm-sd-revenue-filter-options">
            <FormSelect
              isComponentReady={true}
              theme={isMobile ? `dark`: `light`}
              placeholder='This Financial Year'
              value={selectValue}
              handleSelectedValue={(e) =>
                {
                  handleFilterChange(e)
                  setSelectValue(e)
                }
              }
              optionLabels={{ label: 'label', value: 'value' }}
              options={[
                { label: 'This Financial Year', value: 'This Year' },
                { label: 'This Quarter', value: 'This Quarter' },
                { label: 'This Month', value: 'This Month' },
              ]}
            />
          </Box>
        </Box>
      </Box>

      <Box className='crm-sd-dashboard-revenue-main'>
        {
          (!isMobile)
            ? <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection + ` crm-sd-dashboard-revenue-header`}>
              <Typography className={classes.title}>Total</Typography>
            </Grid>
            : null
        }
        <Grid sx={{ px: "16px", py: "20px" }} className={classes.mainContent + ` crm-sd-dashboard-revenue-wrapper`}>

            <Grid container item xs={12} md={12} className="crm-sd-dashboard-revenue-row" >
              <Grid item xs={4} md={3} className="crm-sd-dashboard-revenue-row-item">
                <Grid className="crm-sd-dashboard-revenue">
                  <Typography component="h4" className={classes.label}>Revenue Target</Typography>
                  <Typography component="p" className={classes.value}>{`${target ? `₹ ${target}/-` : 'NA'}`}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={4} md={3}>
                <Grid className="crm-sd-dashboard-revenue">
                  <Typography component="h4" className={classes.label}>Revenue Achieved</Typography>
                  <Typography component="p" style={{fontSize:'10px'}} className={classes.value}>Coming Soon</Typography>
                </Grid>

              </Grid>
              <Grid item xs={4} md={3}>
                <Grid className="crm-sd-dashboard-revenue">
                  <Typography component="h4" className={classes.label}>Incentive Earned</Typography>
                  <Typography component="p" style={{fontSize:'10px'}} className={classes.value}>Coming Soon</Typography>
                </Grid>

              </Grid>

              {/* <Grid item xs={4}>
                <Grid className="crm-sd-dashboard-revenue no-border">
                  <Typography component="h4" className={classes.label}>Booked Revenue</Typography>
                  <Typography component="p" className={classes.value}> ₹ 1,00,000/- </Typography>
                </Grid>
              </Grid> */}

            </Grid>

            {/* <Grid container item xs={12} md={6}>
              <Grid item xs={4}>
                <Grid className="crm-sd-dashboard-revenue">
                  <Typography component="h4" className={classes.label}>Invoiced Revenue</Typography>
                  <Typography component="p" className={classes.value}>NA</Typography>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid className="crm-sd-dashboard-revenue">
                  <Typography component="h4" className={classes.label}>Collected Revenue</Typography>
                  <Typography component="p" className={classes.value}>NA</Typography>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid className="crm-sd-dashboard-revenue no-border">
                  <Typography component="h4" className={classes.label}>Carry Over Target</Typography>
                  <Typography component="p" className={classes.value}>NA</Typography>
                </Grid>
              </Grid>
            </Grid> */}

        </Grid>

      </Box>
    </>
  );
}
