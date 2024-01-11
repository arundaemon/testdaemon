import { Scheduler } from "@aldabil/react-scheduler";
import { Link } from 'react-router-dom'
import { ActivityData } from "../../../helper/DataSetFunction";
import moment from "moment";
import CubeDataset from "../../../config/interface";
import { useState } from "react";
import { useEffect } from "react";

export const DayCalendar = (props) => {
  let time = "00:00:00"
  let todayDate = moment(new Date()).format('YYYY-MM-DD')
  let tomorrowDate = moment(new Date()).add(1, 'days').format('YYYY-MM-DD')

  const [start_data, setStartData] = useState(todayDate);
  const [end_date, setEndDate] = useState(tomorrowDate);

  let {data, getChangeDate} = props;
  const EVENTS = data?.map((data, index) => (
    {
      event_id: index + 1,
      title: `${data?.[CubeDataset.Bdeactivities.activityName]} with ${data?.[CubeDataset.Bdeactivities.name]}`,
      start: new Date(moment.utc(data?.[CubeDataset.Bdeactivities.startDateTime]).local().format('YYYY-MM-DD hh:mm A')),
      end: new Date(moment.utc(data?.[CubeDataset.Bdeactivities.endDateTime]).local().format('YYYY-MM-DD hh:mm A')),
      editable: false,
      deletable: false,
      url: data?.[CubeDataset.Bdeactivities.leadId],
      color: "#4482FF",
      Id: data?.[CubeDataset.Bdeactivities.Id],
      status: data?.[CubeDataset.Bdeactivities.status],
      disabled: data?.[CubeDataset.Bdeactivities.status] === "Complete" ? true : false
    }
  ))

  const DayCustomCell = {
    startHour: 0, 
    endHour: 23, 
    step: 60
  }

  useEffect(() => {
    getChangeDate(start_data, end_date)
  }, [start_data, end_date])


  const getDayViewData = (event) => {
    todayDate = `${moment(event?.start).add(1, 'days').format('YYYY-MM-DD 00:00:00')}`
    tomorrowDate = `${moment(event?.start).add(2, 'days').format('YYYY-MM-DD 00:00:00')}`
    setStartData(todayDate);
    setEndDate(tomorrowDate);
  }

  

  const getEventDetail = (event) => {


    return (
      <>
        <div className='prnt_daycell'
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
              width: "100%",
              background: !(event?.disabled) ? "#4482FF" : "darkgray",
              padding: "10px 20px",
              alignItems: 'center'
            }}
          >
            <div style={{width: '100%'}}>
              <div style={{display: "flex", justifyContent: 'space-between', width: '100%'}}>
                <div style={{textAlign: 'left', fontWeight: '600', fontSize: '12px', color: "#fff"}}>{event.title}</div>
                <div>
                {!(event?.disabled) ? <Link to={{
                  pathname:`/authorised/listing-details/${event?.url}`,
                  search:`?id=${event?.Id}`,
                  state: { fromDashboard: true }
                  }} style={{color: '#fff', fontWeight: 'bold', fontSize: '12px'}}>
                  {event?.category ? event?.category : 'Call' }
                </Link> : ''}
              </div>
              </div>
            </div>
          </div>
      </>
    )
  }
 

  return(
    <div style={{ borderTop: '1px solid #ccc', marginTop:10 }}>
      <Scheduler view="day"
        events={EVENTS}
        eventRenderer={(event) => getEventDetail(event)}
        day={DayCustomCell}
        editable={false}
        deletable={false} 
        draggable={false}
        getRemoteEvents={async (query) => {
          getDayViewData(query)
          return new Promise((res) => {
            setTimeout(() => {
              res(EVENTS);
            },  0);
          });
        }}
      /> 
    </div>
  )
}