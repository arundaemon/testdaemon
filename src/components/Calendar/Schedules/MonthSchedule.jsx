import { Scheduler } from "@aldabil/react-scheduler";
import { Link } from "react-router-dom";

export const MonthCalendar = () => {
  
  const WeekEvent = [
    {
      event_id: 1,
      title: "Follow Up Call With Himanshu",
      start: new Date(new Date(new Date().setHours(10)).setMinutes(30)),
      end: new Date(new Date(new Date().setHours(11)).setMinutes(30)),
      editable: false,
      deletable: false,
      draggable: false,
      color: "#4482FF",
      url: '/'
    },
    {
      event_id: 2,
      title: "Home Demo with Himanshu",
      start: new Date("2022/11/15 03:00"),
      end: new Date("2022/11/15 04:00"),
      color: "#4482FF",
      editable: false,
      deletable: false,
      draggable: false,
      url: '/'
    },
    {
      event_id: 3,
      title: "Event 4",
      start: new Date("2022/11/14 10:00"),
      end: new Date("2022/11/14 11:00"),
      color: "#4482FF",
      editable: false,
      deletable: false,
      draggable: false,
      url: '/'
    },
  ];

  const DayCustomCell = {
    startHour: 1, 
    endHour: 24, 
    step: 60
  }

  const getWeekView = (event) => {
    return(
      <>
        <div style={{backgroundColor: ""}} className="cstmweekView">
            <div style={{display: 'flex', gap: '10px', paddingLeft: '10px', paddingBottom: '5px'}}>
              <div style={{width: '10%'}}>
                <p style={{backgroundColor: event.color, color: event.color, fontSize:'1px', width: '10px', height: '10px', borderRadius: '50px', marginTop: '3px'}}>0</p>
              </div>
              <div style={{width: '100%'}}>
                <p style={{color: "#000", fontSize: '12px', textAlign: 'start'}}>{event.title}</p>
              </div>
            </div>
            <div style={{textAlign: 'start', paddingLeft: '35px'}}>
                <Link to="/" style={{color: event.color, fontSize: '12px'}}>
                   Join Link
                </Link>
              </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Scheduler view="month" events={WeekEvent} eventRenderer={(event) => getWeekView(event)}  day={DayCustomCell}  />  
    </>
  )
}