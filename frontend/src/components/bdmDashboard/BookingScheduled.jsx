import React, { useEffect, useState } from 'react';
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactSelect from 'react-select';
import CubeDataset from '../../config/interface';
import moment from 'moment';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
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
  viewAllBtn: {
    fontSize: "12px",
  },
  taskListSection: {
    maxHeight: "14.5rem",
    overflow: "auto",
  },
  taskList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
  },
  task: {
    fontSize: "14px",
    fontWeight: "600",
  },
  time: {
    fontSize: "14px",
    fontWeight: "400",
  },
  cusPaper: {
    boxShadow: "none",
    marginBottom: "10px",
  },
  tableHead: {
    fontWeight: "600",
    color: "#202124",
  },
  borderNone: {
    borderBottom: "none"
  },
  selectSection: {
    width: "18%",
    minWidth: "9rem",
    marginTop: '5px'
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "30vh",
    alignItems: "center",
    fontStyle: "italic"
  }
}));

function createData(name, sat, sun) {
  return { name, sat, sun };
}

export default function BookingScheduled(props) {
  const classes = useStyles();

  let {getTaskChange, data, getRoleName} = props

  const options = [
    { value: 'This Week', label: 'This Week' },
    { value: 'This Weekend', label: 'This Weekend' }
  ]

  const [change_view, setValue] = useState({
    label: "This Week", value: "This Week"
  })

  useEffect(() => {
    getTaskChange(change_view)
  }, [change_view])

  const getCount = (day, count, dayName) => {
    
    let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    if (weekDays[0] == day && weekDays[0] == dayName) {
      return count
    }

    if (weekDays[3] == day && weekDays[3] == dayName) {
      return count
    }
    if (weekDays[4] == day && weekDays[4] == dayName) {
     
      return count
    }
    if (weekDays[5] == day && weekDays[5] == dayName) {
      return count
    }

    if (weekDays[6] == day && weekDays[6] == dayName) {
      return count
    }

  }


  const groupByDate = data?.reduce((group, data) => {
    let date_value = data?.[`${CubeDataset.BdeactivitiesBq.createdByName}`]
    group[date_value] = group[date_value] ?? [];
    group[date_value].push(data);
    return group;
  }, {});

  let finalData = [];

  for (const [key, value] of Object.entries(groupByDate)) {

    let newArray = [];
    newArray.push(key);
    let dates = {};


    value.forEach((item) =>{
      let date = moment(item[CubeDataset.BdeactivitiesBq.startDateTime]).format('YYYY-MM-DD');
      let count = item[CubeDataset.BdeactivitiesBq.count]
      if(dates[date] === undefined){
        dates[date] = count
      }else{
        dates[date] = dates[date] + count
      }
    })

    for (const [key, value] of Object.entries(dates)) {
      newArray.push({[key]:value})
    }

    finalData.push(newArray);
  }

  

  const setWeekBooking = (data) => {

    const Data = new Array(3).fill(0);

    let arr = data?.slice(1);
  
    arr.forEach((a,d) =>{
      let day = moment(Object.keys(a)[0]).format('dddd');

      switch(day){

        case 'Wednesday':
            Data[0] = a;
            break;

        case 'Thursday':
            Data[1] = a;
            break;

        case 'Friday':
              Data[2] = a;
              break;
    }

    })
    
    return Data
  }


  const setWeekendBooking = (data) => {

    const Data = new Array(2).fill(0);

    let arr = data?.slice(1);
  
    arr.forEach((a,d) =>{
      let day = moment(Object.keys(a)[0]).format('dddd');
     
      switch(day){
        case 'Saturday':
          Data[0] = a;
          break;

        case 'Sunday':
          Data[1] = a;
          break;
    }

    })
    
    return Data
  }



  const renderBookingView = (data) => {
    
    var Data = data?.map((a) => {
      let date = moment(Object.keys(a)[0]).format('dddd');
      let count = Object.values(a)[0]

    
      switch(date){
        case 'Monday':
          if (getCount(date, count, 'Monday')) {
            return <TableCell className={classes.tableHead}>{getCount(date, count, 'Monday')}</TableCell>  
          }
          else {
            return <TableCell className={classes.tableHead}>{0}</TableCell>  
          }
         
        case 'Tuesday' :
          if (getCount(date, count, 'Tuesday')) {
            return <TableCell className={classes.tableHead}>{getCount(date, count, 'Tuesday')}</TableCell> 
          }
          else {
            return <TableCell className={classes.tableHead}>{0}</TableCell>
          }

        case 'Wednesday' : 
          if (getCount(date, count, 'Wednesday')) {
            return <TableCell className={classes.tableHead}>{getCount(date, count, 'Wednesday')}</TableCell> 
          }
          else {
            return <TableCell className={classes.tableHead}>{0}</TableCell>
          }

        case 'Thursday' :
      
          if (getCount(date, count, 'Thursday')) {
            return <TableCell className={classes.tableHead}>{getCount(date, count, 'Thursday')}</TableCell> 
          }
          else {
            return <TableCell className={classes.tableHead}>{0}</TableCell>
          }
          break;

        case 'Friday' :
          if (getCount(date, count, 'Friday')) {
            return <TableCell className={classes.tableHead}>{getCount(date, count, 'Friday')}</TableCell> 
          }
          else {
            return <TableCell className={classes.tableHead}>{0}</TableCell>
          }

        default: 
        return <TableCell className={classes.tableHead}>{0}</TableCell>
      }

    })

    return Data;
  }

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Grid className={classes.discBox}>
          <Typography className={classes.title}>Booking Scheduled {finalData?.length > 0 ? `(${finalData?.length})` : ""}</Typography>
          {finalData?.length > 0  ? <Link to='/authorised/all-activity' state={{ renderView: 'Booking Scheduled', getRoleName: getRoleName }} className={classes.viewAllBtn}>View All</Link> : ""}
        </Grid>
        <div className={classes.selectSection}>
          <ReactSelect
            classNamePrefix="select"
            options={options}
            value={change_view}
            onChange={(e) => setValue({
              label: e.label,
              value: e.value
            })}
            />
        </div>
      </Grid>
      <Grid className={classes.taskListSection}>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            {
              finalData?.length > 0 ? 
              <>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHead}>Name</TableCell>
                    {change_view.value === "This Week"  ? <>
                    <TableCell className={classes.tableHead}>Wednesday</TableCell>
                    <TableCell className={classes.tableHead}>Thursday</TableCell>
                    <TableCell className={classes.tableHead}>Friday</TableCell>
                    </> : <>
                      <TableCell className={classes.tableHead}>Saturday</TableCell>
                      <TableCell className={classes.tableHead} align="">Sunday</TableCell>               
                    </>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {finalData?.map((row) => {
                    
                    let bookingDates =  change_view.value === "This Week"  ? setWeekBooking(row) : setWeekendBooking(row)
          
                    return (
                      <TableRow key={row?.[0]}>
                      <TableCell className={classes.borderNone} component="th" scope="row">
                        {row?.[0]}
                      </TableCell>

                      {
                        renderBookingView(bookingDates)
                      }
                    </TableRow>
                    )
                  })}
                </TableBody>
              </> : <div className={classes.tskPending}>
                "No Booking Schedule Yet"
              </div>
            }
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
