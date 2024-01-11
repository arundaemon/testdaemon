import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import { useRef } from 'react';

const listArray = [
  {
    title: 'Present',
    color: '#80CC8C',
  },
  {
    title: 'Absent',
    color: '#F44040',
  },
  {
    title: 'Leave',
    color: '#FA9E2D',
  }
]

const useStyles = makeStyles((theme) => ({
  listBox : {display: 'flex', alignItems: 'center', gap:'10px', paddingRight: '30px'},

  colouredCircle : {
    fontSize:'1px', width: '10px', height: '10px', borderRadius: '50px'
  },

  listTitle : {fontSize: '14px', color: "#202124"},

  groupList: {
    display: 'flex',
    listStyle: 'none',
    padding: '10px 15px'
  },

  borderTop: {
    borderTop: "1px solid #eee",
    margin: "15px auto 0 auto",
    width: "90%"
  },

  dotStyle : {
    display: 'flex',
    justifyContent: 'center'
  }
}));

export const EventCalendar = (props)  => {

  let {getSelectedDate} = props

  const createRef = useRef(null);
  const classes = useStyles();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [leave_day, setLeaveDay] = useState([2,5,7])
  const [present_day, setPresentDay] = useState([9,10,11,12])
  const [absent_day, setAbsentDay] = useState([13,14])
  const [meeting_day, setMeetingDay] = useState([15,17])
  const today = new Date();

  const handleMonthChange = (e) => {
    let month = e.getMonth() + 1
    if (month == 11) {
      setLeaveDay([2,6,7])
    }
    else {
      setLeaveDay([1,3])
    }
  }

  const handleDateChange = (e) => {
    let date = e.getDate();
    setSelectedDate(e)
  }


  useEffect(() => {
    if (selectedDate) {
      getSelectedDate(selectedDate)
    }
  }, [selectedDate])



  function getDayElement(day, selectedDate, isInCurrentMonth, dayComponent) {
    
    //generate boolean 
    const isLeave = leave_day.includes(day.getDate()); 
    const isPresent = present_day.includes(day.getDate());
    const isabsent = absent_day.includes(day.getDate());
    const isMeeting = meeting_day.includes(day.getDate());
    const isSelected = day.getDate() === selectedDate.getDate();
    const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth();
    
    
    let dateTile
      if (isInCurrentMonth) { //conditionally return appropriate Element of date tile.
        console.log(isToday, 'getTodayDate')
        if (isToday) {
          dateTile = (
            <>
              <Paper className="sec_highlight">   
              <div className='selectedCmn_days' style={{backgroundColor: "#4482FF", color: "#fff"}}>
                {day.getDate()}
              </div>
            </Paper>
            </>
          ) 
        }
        else if (!isSelected) {
          dateTile = (
            <Paper className="sec_highlight">   
              <div className='selectedCmn_days' style={{backgroundColor: "#4482FF", color: "#fff"}}>
                {day.getDate()}
              </div>
            </Paper>
          )
        }
        else {
          dateTile = (
            <Paper className="sec_highlight">   
              <div className='selectedCmn_days'>
                {day.getDate()}
              </div>
            </Paper>
          )
        }

    } 
    else {
      dateTile = (
        <Paper className="sec_highlight">
          <div className='selectedCmn_days' style={{color: "grey"}}>
            {day.getDate()}
          </div>
        </Paper>
      )
    }
    return (
      <div className='testpicker'>
        {dateTile}
      </div>
    )
}


  return (
    <div className='cstm_eventCalendar'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <>
          <DatePicker
            ref={createRef}
            value={selectedDate}
            onChange={(event) => handleDateChange(event)}
            variant="static"
            showToolbar={true}
            leftArrowIcon={<img src="/lft_arrow.svg"/>}
            rightArrowIcon={<img src="/right_arrow.svg"/>}
            onMonthChange={(e) => handleMonthChange(e)}
            minDate={new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)}
            maxDate={new Date(new Date().getTime())}
            // using our function
            // renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => getDayElement(day, selectedDate, isInCurrentMonth, dayComponent)}
          />
        </>
      </MuiPickersUtilsProvider>
    </div>
  );
}
