import { DayCalendar } from "./DaySchedule"
import { WeekCalendar } from "./WeekSchedule"
import { MonthCalendar } from "./MonthSchedule"

export const CalendarRender = ({view, data, getChangeDate}) => {
  
  const Calendar = {
    'week' : <WeekCalendar data={data} getChangeDate={getChangeDate}/>,
    'day'  : <DayCalendar data ={data} getChangeDate={getChangeDate}/>
  }  

  return (
    <>
     {Calendar[view]}
    </>
  )
} 