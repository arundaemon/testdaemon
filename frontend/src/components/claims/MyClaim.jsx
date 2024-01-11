import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import Page from "../../components/Page";
import { useStyles } from "../../css/ClaimForm-css";
import { Box, Button, Grid, LinearProgress, Stack, TextField, Typography, Breadcrumbs, IconButton, TableCell, TableContainer, Table, TableRow, 
    TableBody, Paper, TableHead } from "@mui/material";
import ReactSelect from "react-select";
import moment from "moment";
import { AddExpenseForm } from "./ClaimExpense/AddExpenseForm";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getClaimMasterList } from "../../config/services/claimMaster";
import { getAllSchoolList, getSchoolCodeList, getSchoolList } from "../../config/services/school";
import { createMyClaim, getUserClaimListBySchool } from "../../config/services/userClaim";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { claimValidation } from "../../helper/AddClaim/CreateClaimValidation";
import { get } from "lodash";
import { MobileTimePicker } from "@mui/x-date-pickers";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { handleKeyTextDown, handleTextPaste } from "../../helper/randomFunction";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { getLoggedInRole } from "../../utils/utils";
import { VISITOPTIONS } from "../../constants/general";
import IconBreadcrumbArrow from './../../assets/icons/icon-breadcrumb-arrow.svg';
import ClaimMasterTable from "./ClaimMasterTable";
import useMediaQuery from '@mui/material/useMediaQuery';
import {ReactComponent as IconExpenseRemove} from './../../assets/icons/icon-expense-remove.svg';
import { ReactComponent as IconNavLeft } from "./../../assets/icons/icon-nav-left-arrow.svg";

const INRCurrencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
const MyClaim = () => {
  const classes = useStyles();

  const navigate = useNavigate()
  let { state } = useLocation();
  //console.log(state)
  const [startDate, setStartDate] = useState(null);

  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setEndTimeOut] = useState(null);
  const [isVisible, setVisibility] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [boardingData, setBoardingData] = useState(null);
  const [conveyanceData, setConveyanceData] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [giftData, setGiftData] = useState(null);
  const [stampData, setStampData] = useState(null);
  const [otherData, setOtherData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [schoolList, setSchoolList] = useState([])
  const [readInput, setReadInput] = useState(true)
  const [schoolCode, setSchoolCode] = useState('')
  const [leadId, setLeadID] = useState('')
  const [search, setSearch] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const userRole = getLoggedInRole();
  const [rolesList, setRoleslist] = useState([]);
  const [roleNameList, setRoleName] = useState([]);
  const [visitNumber, setVisitNumber] = useState(1)
  const [shw_loader, setDisplayLoader] = useState(false)
  const [visitPurpose, setVisitPurpose] = useState(null)
  const [expense, setExpense] = useState(null)
  const [allExpenseData, setAllExpenseData] = useState([]);
  const [isExpenseSubmitted, setIsExpenseSubmitted] = useState(false);
  const [meetingsList, setMeetingsList] = useState(state?.meetingList ? [...state?.meetingList] : []);
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  //const [moreExpenseComponents, setMoreExpenseComponents] = useState([]);
  const [addExpenseList, setAddExpenseList] = useState([])
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // useEffect(() => {
  //   document.body.classList.add("crm-is-inner-page");
  //   return () => document.body.classList.remove("crm-is-inner-page");
  // }, []);

  const handleMoreExpenseForm = event => {
    let expenses = addExpenseList
    expenses.push({expenseType:""})
    setAddExpenseList([...expenses])
  };

  const handleSelectedMeetings = (obj) => {    
    let selectedList = [obj]
    setSelectedMeetings(selectedList);
    //setSchoolCode(obj.schoolCode)
    getSchoolCode(obj)
    setStartDate(obj.activityDate)
    setTimeIn(obj.activityDate)
    setEndTimeOut(obj.activityDate)
    setVisitPurpose(`${obj.activityName}`)
    setAddExpenseList([{expenseType:""}])
    setVisibility(true)
    let params = {
      schoolCode: obj.schoolCode,
      roleName: getUserData('userData').crm_role,
      dateTime: state.dateTime
    }
    fetcUserClaimList(params)
  }

  const fetcUserClaimList = useCallback((params) => {
    getUserClaimListBySchool(params)
      .then(
        res => {
          setAllExpenseData(res.result)
          console.log("iii", res.result)
          setIsExpenseSubmitted(false);
        }
      )
      .catch(
        err => {
          console.log(err)
        }
      )
  })

  const fetchExpenseList = async () => {
    let params = {profile: getUserData('userData')?.crm_profile}
    try {
      let res = await getClaimMasterList(params);
      if (res?.result?.length > 0) {
        setExpenseList(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };



  const getAllSchList = async () => {
    let params = {
      childRoleNames: roleNameList,
      search,
      count: 500
    }
    try {
      let res = await getSchoolCodeList(params);
      console.log("ftyvbhm",res.result);
      if (res?.result) {
        setSchoolList(res?.result)
      }

    } catch (err) {
      console.error(err)
    }
  }


  useEffect(
    () => {
      const getData = setTimeout(() => {
        if(search){
          getAllSchList()
        }          
      },500)

      return () => clearTimeout(getData)
    }, [search]
  );


  const getUserChildRoles = async () => {
    getAllChildRoles({ role_name: userRole })
      .then((childRoles) => {
        let { all_child_roles } = childRoles?.data?.response?.data ?? {
          childs: [],
        };
        setRoleslist(all_child_roles);
        let childRoleNames = all_child_roles
          ? all_child_roles?.map((roleObj) => roleObj?.roleName)
          : [];
        childRoleNames.push(userRole);
        setRoleName(childRoleNames);
        localStorage.setItem(
          "childRoles",
          EncryptData(all_child_roles ?? [])
        );
        // getAllSchList()
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const getAllParentRoles = () => {
    if (localStorage?.getItem("childRoles")) {
      let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
      setRoleslist(childRoleNames)
      childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName)
      childRoleNames.push(userRole);
      setRoleName(childRoleNames);
      // getAllSchList()
    }
    else {
      getUserChildRoles()
    }
  };


  


  useEffect(() => {
    fetchExpenseList();
    getAllParentRoles();
    // getAllSchList();
  }, []);

  const getBoardingData = (data, formIndex) => {
    setBoardingData(data);
  };

  const getConveyanceData = (data,formIndex) => {
    setConveyanceData(data);
  };

  const getFoodData = (data,formIndex) => {
    setFoodData(data);
  };

  const getGiftData = (data,formIndex) => {
    setGiftData(data);
  };

  const getStampData = (data,formIndex) => {
    setStampData(data);
  };

  const getOtherData = (data,formIndex) => {
    setOtherData(data);
  };

  const getEventData = (data,formIndex) => {
    setEventData(data);
  };

  const getPrintData = (data,formIndex) => {
    setPrintData(data);
  };

  let randomData = [...Array(20)].map(() => Math.floor(Math.random() * 100));

  randomData = randomData?.map((obj, index) => {
    return (
      {
        label: index + 1,
        value: index + 1
      }
    )
  })

  const onSubmitData = async () => { 
    let startDateTime = moment.utc(startDate).format('hh:mm A')
    let endDateTime = moment.utc(startDate).add(30,'minutes').format('hh:mm A')
    let finalStartDate = moment.utc(startDate).format("YYYY-MM-DD")
    let finalStartDatetime  = `${finalStartDate} ${startDateTime}`
    let finalOutDatetime = `${finalStartDate} ${endDateTime}` 
    let expenseData = addExpenseList.map(obj => {
      let newObj = {
        ...obj,
        schoolCode: schoolCode,
        schoolName: schoolName,
        visitNumber: visitNumber,
        visitPurpose: visitPurpose,
        startDate: startDate,
        timeIn: moment.utc(finalStartDatetime).toISOString(),
        timeOut: moment.utc(finalOutDatetime).toISOString(),
        requestBy_roleId: getUserData('userData')?.crm_role,
        requestBy_name: getUserData('userData')?.name,
        requestBy_ProfileName: getUserData('userData')?.crm_profile,
        requestBy_empCode: getUserData('userData')?.username.toUpperCase(),
        visitDate:  startDate,
        visitTimeIn: moment.utc(finalStartDatetime).toISOString(),
        visitTimeOut: moment.utc(finalOutDatetime).toISOString(),
        leadId: leadId,
        bill:obj.billFile,
        claimRemarks: obj.claimRemarks,
      }
      return newObj
    })
    //console.log(expenseData)
    let validFlag = true
    for(let expense of expenseData){
      let isValidateForm = checkValidation(expense)
      if(!isValidateForm){
        validFlag = false
        break;
      }
    }
    if(validFlag){
      setDisplayLoader(true)
      let deleteIndexes = []
      for(let i= 0;i<expenseData.length;i++){
        let expense = expenseData[i]
        if(expense.field){
          expense.field = JSON.stringify(expense.field)
        } 
        if(expense.expenseType === 'Food'){
          delete expense.field
        }
        if(expense.billFile){
          delete expense.billFile
        }
        const formdata = new FormData();
        Object.keys(expense).map(key => {
          formdata.append(key,expense[key])
        })      
        //console.log(formdata,formdata.values())
        let data = await createClaim(formdata)
        if(data){
          deleteIndexes.push(i)
        }else if(expense.field){
          expense.field = JSON.parse(expense.field)
        }
        if(!expense.billFile){
          expense.billFile = expense.bill
        }

        //console.log(data)
      }
      //console.log(expenseData)
      expenseData = expenseData.filter(function(value, index) {
        return deleteIndexes.indexOf(index) == -1;
      })
      if(expenseData.length == 0){
        toast.success('All claims raised successfully')
      }      
      setAddExpenseList([...expenseData])
      setDisplayLoader(false)
      let params = {
        schoolCode: schoolCode,
        roleName: getUserData('userData').crm_role,
        dateTime: state.dateTime
      }
      fetcUserClaimList(params)    
    }
  }
  


  const isValidateField = () => {

    const formdata = new FormData();

    let startDateTime = moment(timeIn).format('hh:mm A')

    let endDateTime = moment(timeOut).format('hh:mm A')

    if (!(moment.utc(timeIn).local().format('X') < moment.utc(timeOut).local().format('X'))){
      toast.error("Time Out Must Be Greater")
      setEndTimeOut(null)
      return
    }

    let finalStartDate = moment(new Date(startDate)).format("YYYY-MM-DD")

    let finalStartDatetime  = `${finalStartDate} ${startDateTime}`

    let finalOutDatetime = `${finalStartDate} ${endDateTime}`

    if (expense?.value === 'Boarding and Lodging') {
      formdata.append('unit', boardingData?.unit);
      formdata.append('unitLabel', boardingData?.unitLabel);
      formdata.append('claimAmount', boardingData?.claimAmount);
      formdata.append('bill', boardingData?.billFile);
    }

    if (expense?.value === 'Conveyance') {
      formdata.append('unit', conveyanceData?.unit);
      formdata.append('unitLabel', conveyanceData?.unitLabel);
      formdata.append('claimAmount', conveyanceData?.claimAmount);
      formdata.append('field', JSON.stringify(conveyanceData?.field));
      formdata.append('bill', conveyanceData?.billFile);
    }

    if (expense?.value === 'Food') {
      formdata.append('unit', foodData?.unit);
      // formdata.append('field', JSON.stringify(foodData?.field));
      formdata.append('unitLabel', foodData?.unitLabel);
      formdata.append('claimAmount', foodData?.claimAmount);
      formdata.append('bill', foodData?.billFile);
    }

    if (expense?.value === 'Gifts') {
      formdata.append('unit', giftData?.unit);
      formdata.append('field', JSON.stringify(giftData?.field));
      formdata.append('unitLabel', giftData?.unitLabel);
      formdata.append('claimAmount', giftData?.claimAmount);
      formdata.append('bill', giftData?.billFile);
    }

    if (expense?.value === 'Stamp Paper') {
      formdata.append('unit', stampData?.unit);
      formdata.append('claimAmount', stampData?.claimAmount);
      formdata.append('bill', stampData?.billFile);
    }
    if (expense?.value === 'Others') {
      formdata.append('unit', 0);
      formdata.append('claimAmount', otherData?.claimAmount);
      formdata.append('bill', otherData?.billFile);
      formdata.append('remarks', otherData?.remark);
    }
    if (expense?.value === 'Events') {
      formdata.append('unit', eventData?.unit);
      formdata.append('field', JSON.stringify(eventData?.field));
      formdata.append('claimAmount', eventData?.claimAmount);
      formdata.append('bill', eventData?.billFile);
    }
    if (expense?.value === 'Printing') {
      formdata.append('unit', printData?.unit);
      formdata.append('field', JSON.stringify(printData?.field));
      formdata.append('unitLabel', printData?.unitLabel);
      formdata.append('claimAmount', printData?.claimAmount);
      formdata.append('bill', printData?.billFile);
    }

    formdata.append('schoolCode', schoolCode);
    formdata.append('schoolName', schoolName);
    //formdata.append('visitNumber', visitNumber?.value);
    formdata.append('expenseType', expense?.value);
    formdata.append('requestBy_roleId', getUserData('userData')?.crm_role);
    formdata.append('requestBy_name', getUserData('userData')?.name);
    formdata.append('requestBy_ProfileName', getUserData('userData')?.crm_profile);
    formdata.append('requestBy_empCode', getUserData('userData')?.employee_code);
    formdata.append('visitDate', finalStartDate);
    formdata.append('visitPurpose', visitPurpose);
    formdata.append('visitTimeIn', finalStartDatetime);
    formdata.append('visitTimeOut', finalOutDatetime);
    formdata.append('leadId', leadId);
    //console.log(formdata, 'testFormdata')

    // for (let entry of formdata.entries()) {
    //   const key = entry[0];
    //   const value = entry[1];
    
    //   console.log(`Key: ${key}, Value: ${value}`);
    // }
    return createClaim(formdata)
  }

  const createClaim = async (data) => {
    // console.log(data, '--------data')
    //return false
    try {
      let res = await createMyClaim(data)
      if (res?.result) {     
        //toast.success(res?.message)    
        return true  
      }
      else {
        toast.error(res?.message) 
        return false
      }

    } catch (err) {
      console.error(err)
    }
  }



  const checkValidation = (params) => {
    //console.log(params)
    return claimValidation({
      expenseType: params.expenseType,
      field: params,
      params: params
    })
  }


  const getExpenseType = (data) => {
    setExpense(data)
  }

  const handleTimeInChange = (value) => {
    setTimeIn(value);
    if (value && timeOut && value.isAfter(timeOut)) {
      setEndTimeOut(null);
    }
  };

  const handleTimeOutChange = (value) => {
    setEndTimeOut(value);
  };


  const disabledTime = (current, type) => {
    if (type === 'hour') {
      const timeInHour = timeIn ? timeIn.hour() : 0;
      return Array.from({ length: timeInHour }, (_, i) => i);
      // Disable hours before TimeIn hour

    } 
    if (type === 'minute') {
      if (timeIn && current.hour() === timeIn.hour()) {
        // Disable minutes before TimeIn minute if it's the same hour
        if (timeOut?.hour()) {
          if (timeIn.hour() === timeOut?.hour()) {
            const timeInMinute = timeIn.minute() + 1;
            return Array.from({ length: timeInMinute }, (_, i) => i);
          }
          else {
            return []
          }
        }
        else {
          const timeInMinute = timeIn.minute() + 1;
          return Array.from({ length: timeInMinute }, (_, i) => i);
        } 
      }
    } 
    if (type === 'second') {
      if (timeIn && current.hour() === timeIn.hour() && current.minute() === timeIn.minute()) {
        // Disable seconds before TimeIn second if it's the same hour and minute
        const timeInSecond = timeIn.second();
        return Array.from({ length: timeInSecond }, (_, i) => i);
      }
    }
    return [];
  };

  const currentTime = moment();

  function range(start, end) {
    return Array(end - start).fill().map((_, idx) => start + idx)
  }

  const getSchoolCode = (data) => {
    setSchoolCode(data?.schoolCode)
    setSchoolName(data?.schoolName)
    setLeadID(data?.schoolId)
  }

  const updateExpenseData = useCallback((newObj,index) => {
    //console.log(newObj,index)
    addExpenseList.splice(index,1,newObj)
    setAddExpenseList([...addExpenseList])
  })

  const removeExpense = useCallback((index) => {
    addExpenseList.splice(index,1)
    setAddExpenseList([...addExpenseList])
  })

  const handleDashboardRedirect = useCallback(() => {
    navigate('/authorised/school-dashboard')
  })


  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const disabledHours = () => {
    const hours = [];
    for (let i = currentHour + 1; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  
  const disabledMinutes = (hour) => {
    if (hour === currentHour) {
      const minutes = [];
      for (let i = currentMinute + 1; i < 60; i++) {
        minutes.push(i);
      }
      return minutes;
    }
    return [];
  };

 
  return (
    <>
      
      <Page title="Extramarks | Claim Master" >

        <Box className='crm-sd-claims'>
          {shw_loader ? <LinearProgress /> : ""}
          <Breadcrumbs className='crm-breadcrumbs' separator={<img src={IconBreadcrumbArrow} />} aria-label="breadcrumbs" >
              <Link underline="hover"
                key="1"
                color="inherit"
                to="/authorised/school-dashboard"
                className='crm-breadcrumbs-item breadcrumb-link' 
              >
                  Dashboard
              </Link>
              <Typography key="2" component="span"  className='crm-breadcrumbs-item breadcrumb-active'> Add Claim </Typography>
          </Breadcrumbs>

          <Box className='crm-sd-claims-container'>

            {/* <Box className="crm-page-innner-header">
              {isMobile ? (
                <Link
                  key="99"
                  color="inherit"
                  to={'..'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                  className=""
                >
                  <IconNavLeft className="crm-inner-nav-left" />{" "}
                </Link>
              ) : null}
              <Typography component="h2" className="crm-sd-log-heading">
                Back
              </Typography>
            </Box> */}

              <Box className='crm-sd-claims-list-wrapper'>
                  {/* <Box className='crm-sd-claims-list-header'>
                      <Typography component="h2" className='crm-sd-claims-title'>Raise a Claim</Typography>
                      
                  </Box> */}
                  <Box className="crm-sd-heading">
                      <Typography component="h2">Raise a Claim</Typography>
                      {/*<Typography component="p">Browse through missed meetings for the past days</Typography>*/}
                  </Box>

                  <Grid container spacing={2} className='crm-sd-claims-list-items'>
                      {
                      meetingsList?.map((item, i) => (
                          <Grid key={i} item xs={12} md={4}  >
                              {/* <Box className={`crm-sd-claims-list-item ` + (selectedMeetings.includes(item) ? `claim-selected` : `123`)}  onClick={() => handleSelectedMeetings(item)}>
                                  <Box className='crm-sd-claims-list-item-title'>{item.activityName}</Box>
                                  <Box className='crm-sd-claims-list-item-info'>{item.schoolName}, {item.schoolCity}, {item.schoolState} </Box>
                                  <Box className='crm-sd-claims-list-item-info'>{moment.utc(item.activityDate).format('DD-MM-YYYY hh:mm A')} | School Code: {item.schoolCode} </Box>
                              </Box> */}
                              <Box className={`crm-sd-claims-listitem ` + (selectedMeetings.includes(item) ? `claim-selected` : ``)} key={i} onClick={() => handleSelectedMeetings(item)}>
                                <Box className="crm-sd-claims-listitem-container">
                                  <Box className="crm-sd-claims-listitem-name">{item.activityName}</Box>
                                  <Box className="crm-sd-claims-listitem-name"><span>School Name:</span> {item?.schoolName}</Box>
                                  <Box className="crm-sd-claims-listitem-name"><span>School Code:</span> {item?.schoolCode}</Box>
                                  <Box className="crm-sd-claims-listitem-info"><span>Time:</span> {moment.utc(item?.activityDate).local().format('DD-MM-YYYY') ?? "-"}</Box>
                                </Box>
                            </Box>
                          </Grid>
                          ))
                      }
                  </Grid>
                  {
                    /* (selectedMeetings.length > 0)
                      ? <Box className='crm-sd-claims-add-expense-btn'>
                            <Button className='crm-btn crm-btn-primary crm-btn-lg' onClick={() => handleMoreExpenseForm()}>Add Expense</Button>
                        </Box>
                      : null */
                  }

                  {
                    isVisible && !isExpenseSubmitted
                      ? <>
                          {
                            addExpenseList.map((obj,expenseIndex) => (
                              <AddExpenseForm
                                key={expenseIndex}
                                list={expenseList}
                                expenseIndex={expenseIndex}
                                expenseData={obj}
                                updateExpenseData={updateExpenseData}
                                removeExpense={removeExpense}
                              />
                            ))
                          }
                          
                        </>
                      : null
                  }

                  

              </Box>

              {
                !isExpenseSubmitted && addExpenseList?.length > 0
                  ? <Box className='crm-sd-claims-actions'>
                      {
                        isVisible && !(shw_loader)
                          ? <Button className="crm-btn crm-btn-outline crm-btn-lg" onClick={handleMoreExpenseForm}>Add</Button>
                          : null
                      }
                      {
                        (isVisible && !(shw_loader) && addExpenseList.length > 0)
                          ? <Button className="crm-btn crm=btn-primary crm-btn-lg" onClick={() => onSubmitData()}>Submit</Button>
                          : null
                      }
                    </Box>
                  : null
              }

              {
                (!isExpenseSubmitted && allExpenseData?.length > 0)
                  ? <Box className="crm-sd-claims-expenses-list-wrapper">
                      <Typography component="h2" className='crm-sd-claims-expenses-list-heading'>Expenses</Typography>
                      <Box className="crm-sd-claims-expenses-list">
                      {
                        isMobile
                          ? <>
                              {
                                  //allExpenseData
                                  allExpenseData
                                  ?.map((row, i) => (
                                    <Box key={i} className="crm-sd-claims-expenses-list-item">
                                        {/* <Box className="crm-sd-claims-expenses-list-item-label">Requested by : {`${row?.requestBy_name} (${row?.requestBy_empCode})`}</Box> */}
                                        <Box className="crm-sd-claims-expenses-list-item-label">{row?.schoolName}</Box>
                                        {/* <Box className="crm-sd-claims-expenses-list-item-info">
                                          School Name: {row?.schoolName} | Type of expense: {row?.expenseType} | Units: {row?.unit} | Claim Amount: {INRCurrencyFormatter.format(row?.claimAmount)} | Status: {row?.claimStatus} | Raised date: {row?.createdAt ? moment.utc(row?.createdAt).format('DD-MM-YYYY'): 'NA'} | Approved date: {row?.approvedDate ? moment(row?.approvedDate).format('DD-MM-YYYY') : 'NA'} | Approved Amount: {row?.approvedDate ? INRCurrencyFormatter.format(row?.approvedAmount): 'NA'}
                                        </Box> */}
                                        <Box className="crm-sd-claims-expenses-list-item-info">Type of expense: <span>{row?.expenseType}</span></Box>
                                        <Box className="crm-sd-claims-expenses-list-item-info">Units: <span>{row?.unit}</span></Box>
                                        <Box className="crm-sd-claims-expenses-list-item-info">Claim Amount: <span>{INRCurrencyFormatter.format(row?.claimAmount)}</span></Box>
                                        <Box className="crm-sd-claims-expenses-list-item-info">Status: <span>{row?.claimStatus}</span></Box>
                                        <Box className="crm-sd-claims-expenses-list-item-info">Raised date: <span>{row?.visitTimeIn ? moment.utc(row?.visitTimeIn).format('DD-MM-YYYY'): 'NA'}</span></Box>
                                    </Box>
                                  ))
                              }
                              
                            </>
                          
                          : <>
                              <TableContainer component={Paper}>
                                <Table aria-label="simple table" className="custom-table datasets-table" >
                                  <TableHead>
                                    <TableRow className="cm_table_head">
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> School Name </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'>Type of expense </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Unit </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Claim Amount </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Status</div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Raised date </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Requested by </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Approved date </div></TableCell>
                                      <TableCell> <div className='crm-sd-claims-tablehead-cell'> Approved Amount </div></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {
                                      allExpenseData
                                      ?.map((row, i) => (
                                        <TableRow key={i} >
                                          <TableCell>{row?.schoolName} </TableCell>
                                          <TableCell>{row?.expenseType}</TableCell>
                                          <TableCell>{row?.unit}</TableCell>
                                          <TableCell>{INRCurrencyFormatter.format(row?.claimAmount)}</TableCell>
                                          <TableCell>{row?.claimStatus} </TableCell>
                                          <TableCell>{row?.createdAt ? moment.utc(row?.createdAt).format('DD-MM-YYYY'): 'NA'}</TableCell>
                                          <TableCell>{`${row?.requestBy_name} (${row?.requestBy_empCode})`}</TableCell>
                                          <TableCell>{row?.approvedDate ? moment.utc(row?.approvedDate).format('DD-MM-YYYY') : 'NA'}</TableCell>
                                          <TableCell>{row?.approvedDate ? INRCurrencyFormatter.format(row?.approvedAmount): 'NA'}</TableCell>
                                          
                                        </TableRow>
                                      ))
                                    }
                                  </TableBody>
                                </Table>
                              </TableContainer >
                            </>
                      }
                        
                        
                      </Box>
                    </Box>

                  : null
              }
          </Box>
          <Box className="crm-flex-end" sx={{mx: 2.5}}>
            <Button className='crm-btn crm-btn-outline crm-btn-claims-action' onClick={() => handleDashboardRedirect()}>Skip for now</Button>
            <Button sx={{mx: 2.5}} className='crm-btn crm-btn-outline crm-btn-claims-action' onClick={() => handleDashboardRedirect()}>Go to Homepage</Button>
          </Box>
          

        </Box>
      </Page>
    </>
  );
};

export default MyClaim;