import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { EventCalendar } from './EvtCalendar';
import { CalendarRender } from './Schedules/Common';
import { Link, useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  flxBox: {
    width: "100%",
    display: 'flex',
    boxShadow: '0px 1px 4px #20212429',
    padding: '20px',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1000',
    background: 'white'
  },

  boxWidth: { width: '30%' },

  demoBtn: {
    borderRadius: '4px !important', color: "#fff !important", padding: '7px 15px !important', backgroundColor: "#F45E29", fontSize: '16px', textDecoration: 'none'
  },

  rightBox: {
    display: "flex",
    justifyContent: 'right',
    gap: "10px",
    marginRight: '20px',
    paddingTop: '20px',
    alignItems: 'center'
  },
  EventBox: {
    marginTop: '20px'
  }, headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginLeft: '10px'
  }
  ,
  btnContainer: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    display: 'flex',
    flex: 2,
    width: '100%'
  }, taskButton: {
    background: '#F45E29',
    flex: 1,
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    textDecoration: 'none'
  }
}));


export const MobViewCalendar = ({data, getChangeDate}) => {

  const classes = useStyles();
  const navigate = useNavigate();

  const [monthView, setMonthView] = useState({
    label: 'Month',
    value: ''
  })

  const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

  const [activity_data, setActivityData] = useState([])

  const [view, setView] = useState({
    value: 'day',
    label: 'Day'
  })

  const options = [
    { value: 'Oct', label: 'Oct' },
    { value: 'Nov', label: 'Nov' },
    { value: 'Dec', label: 'Dec' }
  ]

  const daysOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' }
  ]

  const curruntMonth = () => {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    return month[d.getMonth()];
  }


  useEffect( () => {
    setActivityData(data)
  }, [data])


  return (
    <>

      <div className={classes.flxBox} >
        <img onClick={() => navigate(-1)} src='/back arrow.svg' />
        <div className={classes.headerTitle} >
          {curruntMonth()}
        </div>
      </div>
      <div className={classes.rightBox}>
        <div>
          <Link to ="/authorised/my-calendar/events" className={classes.demoBtn}>
            All Events
          </Link>
        </div>
        <div className={classes.boxWidth}>
          <ReactSelect
            value={view}
            options={daysOptions}
            onChange={(e) => setView({
              label: e.label, value: e.value
            })}
          />
        </div>
      </div>
      <div className={classes.EventBox}>
        {/* <EventCalendar /> */}
      </div>
      <div>
        <CalendarRender view={view.value} data={data} getChangeDate={getChangeDate} />
      </div>
      <div className={classes.btnContainer}>
        <Link to="/authorised/pending_events" 
          style={{ marginRight: '2px' }} 
          className={classes.taskButton}
          state={{ data: activity_data }}
          >
          Pending Task
        </Link>
        <Link to="/authorised/event_summary" className={classes.taskButton}
          state={{ data: activity_data }}
        >
          Task Summary
        </Link>
      </div>
    </>
  )
}