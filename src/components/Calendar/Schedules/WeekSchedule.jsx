import { Scheduler } from "@aldabil/react-scheduler";
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import CubeDataset from "../../../config/interface";
import { useState } from "react";
import { useEffect } from "react";

const weekCustomCell = { 
  weekDays: [0, 1, 2, 3, 4, 5,6], 
  weekStartOn: 0, 
  startHour: 0, 
  endHour: 23,
  step: 60,
}

const useStyles = makeStyles((theme) => ({
  cstmweekView : {
    background: "#fff",
    height: "100%"
  },

  gridBox : {
    display: 'flex', gap: '10px', paddingLeft: '10px', paddingBottom: '5px'
  },

  colourLabel : {
    fontSize:'1px', width: '10px', height: '10px', borderRadius: '50px', marginTop: '3px'
  },
  largeWidth: { width: "100%"},
  
  smallWidth : {width: '10%'},

  titleContent : {color: "#000", fontSize: '12px', textAlign: 'start'},

  linkStyle : {textAlign: 'start', paddingLeft: '35px'}


}));



export const WeekCalendar = (props) => {
  let {data, getChangeDate} = props;
  const classes = useStyles();

  

  let todayDate = moment(new Date()).format('YYYY-MM-DD')
  let tomorrowDate = moment(new Date()).add(1, 'days').format('YYYY-MM-DD')

  const [start_data, setStartData] = useState(todayDate);
  const [end_date, setEndDate] = useState(tomorrowDate);

  const EVENTS = data?.map((data, index) => (
    {
      event_id: index + 1,
      title: `${data?.[CubeDataset.Bdeactivities.activityName]} with ${data?.[CubeDataset.Bdeactivities.name]}`,
      start: new Date(moment.utc(data?.[CubeDataset.Bdeactivities.startDateTime]).local().format('YYYY-MM-DD hh:mm A')),
      end: new Date(moment.utc(data?.[CubeDataset.Bdeactivities.endDateTime]).local().format('YYYY-MM-DD hh:mm A')),
      editable: false,
      deletable: false,
      url: data?.[CubeDataset.Bdeactivities.leadId],
      color: data?.[CubeDataset.Bdeactivities.status] === "Complete" ? "darkgray" : "#4482FF",
      Id: data?.[CubeDataset.Bdeactivities.Id],
      status: data?.[CubeDataset.Bdeactivities.status],
      disabled: data?.[CubeDataset.Bdeactivities.status] === "Complete" ? true : false
    }
  ))


  useEffect(() => {
    getChangeDate(start_data, end_date)
  }, [start_data, end_date])


 const getWeekViewData = (event) => {
  todayDate = `${moment(event?.start).format('YYYY-MM-DD 00:00:00')}`
  tomorrowDate = `${moment(event?.end).format('YYYY-MM-DD 00:00:00')}`

  setStartData(todayDate);
  setEndDate(tomorrowDate);
 }

 

  const getWeekView = (event, classes) => {
   

    return(
      <>
        <div className={classes.cstmweekView}>
          <div className={classes.gridBox}>
            <div className={classes.smallWidth} >
              <div className={classes.colourLabel} style={{backgroundColor: event.color, color: event.color}}/>
            </div>
            <div className={classes.largeWidth}>
              <p className={classes.titleContent}>{event.title}</p>
            </div>
          </div>
          <div className={classes.linkStyle}>
            {!(event?.disabled) ? <Link to={{
              pathname:`/authorised/listing-details/${event?.url}`,
              search:`?id=${event?.Id}`,
              state: { fromDashboard: true }
              }} style={{color: event.color, fontSize: '12px'}}>
              {event?.category ? event?.category : 'Call' }
            </Link> : ''}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Scheduler view="week" events={EVENTS}  eventRenderer={(event) => getWeekView(event, classes)} week={weekCustomCell}
      editable={false}
      deletable={false} 
      draggable={false} 
      day={null}
      getRemoteEvents={async (query) => {
          getWeekViewData(query)
          return new Promise((res) => {
            setTimeout(() => {
              res(EVENTS);
            }, 0);
          });
        }}
      /> 
    </>
  )
}