import React, { useEffect, useState ,lazy} from "react";
import icon_calendar from "../../assets/icons/icon_calendar.png";
import { startOfDay,subDays, addDays ,format} from "date-fns";
import LeftArrowIcon from "../../assets/icons/icon-meetings-mobile-left-arrow.svg";
import RightArrowIcon from "../../assets/icons/icon-meetings-mobile-right-arrow.svg";
import { useHistory } from "react-router-dom";
import UpcomingDateWiseData from './MeetingPlannerDateWiseData';


export const allowDateFilterChangeContext = React.createContext([])

const MeetingPlannerMobile = (props) => {
  const {comingFrom=""}=props;
  const history = useHistory();
  const [scheduleDate, setscheduleDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [allowDateFilterChange , setAllowDateFilterChange] = useState(false);
  

 useEffect(()=>{
    let today=getTodayFormatedDate(); 
    let todayFormatDate = format((new Date(today?.replace(/-/g,'/'))),"dd MMM yyyy");
    let todayDate = format((new Date(today?.replace(/-/g,'/'))),"yyyy-MM-dd");
    setscheduleDate(todayFormatDate)
    setSelectedDate(todayDate)
  
 },[])

 const getTodayFormatedDate=()=> {
    let d = new Date(new Date()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
  }


  function ChangeSelectedDate(action){
    if(allowDateFilterChange){
    if(action=="prev"){
      let start = format(startOfDay(subDays(new Date(selectedDate?.replace(/-/g,'/')), 1)),"yyyy-MM-dd");
      let start_format = format(startOfDay(subDays(new Date(selectedDate?.replace(/-/g,'/')), 1)),"dd MMM, yyyy");
      setscheduleDate(start_format);
      setSelectedDate(start);
      }else{
      let start = format(startOfDay(addDays(new Date(selectedDate?.replace(/-/g,'/')), 1)),"yyyy-MM-dd");
      let start_format = format(startOfDay(addDays(new Date(selectedDate?.replace(/-/g,'/')), 1)),"dd MMM, yyyy");
      setscheduleDate(start_format);
      setSelectedDate(start);
    }
  }
  }
    return (
         <allowDateFilterChangeContext.Provider value={[allowDateFilterChange , setAllowDateFilterChange]}>
    <div className="upcoming-events-dashboard-container-mobile">
      <h4
        className="font18 font-semibold"
        style={{ marginBottom: 1, marginTop: 0 ,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' }}
      >Tasks for the Day </h4>
      <p
        className="font12 font-weight-normal"
        style={{ color: "#202124", marginBottom: 12, marginTop: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'  }}
      >Browse important upcoming tasks with a click </p>
      <div className="div-Details">
      
         {/* Ongoing Batch details */}
         <span className="span-today-date">
          <img loading="lazy" className="cal_icon" alt="calender-logo" src={icon_calendar} />
          <div className="today_date">
            <span>{scheduleDate}</span>
            <div style={{ display: 'inline-flex', alignItems: 'center' }}> 
            <span className="prev-date-select-span">
              <img src={LeftArrowIcon} alt="" style={{cursor:'pointer'}} onClick={()=>ChangeSelectedDate("prev")}/> 
            </span>
            <span className="next-date-select-span">
              <img src={RightArrowIcon} alt="" style={{cursor:'pointer'}} onClick={()=>ChangeSelectedDate("next")}/>
              </span>
              </div>
            
            </div>
        </span>

        <div className="div_days_container">
            <UpcomingDateWiseData  selectedDate={selectedDate} comingFrom={comingFrom} />

            
        </div>

        <div className="div_view_all" onClick={''}>View All </div>
        
        </div>
    </div>
    </allowDateFilterChangeContext.Provider>
  );
};

export default React.memo(MeetingPlannerMobile);
