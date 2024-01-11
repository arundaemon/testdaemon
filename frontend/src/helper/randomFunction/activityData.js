import moment from "moment";
import CubeDataset from "../../config/interface";

export const getPendingActivity = (activityData, isDay) => {
  
  let isday = isDay

  if (activityData) {
    return(
      activityData.filter( (data) => {
        let day = checkPendingDay(data);
        let hours = getHours(data, isday)
        if (day < 0 || hours ) {
          return data
        }
      })
    )
  }
}

const checkPendingDay = (data) => {
  let start_date = new Date();
  let end_date = data?.[CubeDataset.Bdeactivities.startDateTime]
  let day
  day = moment(end_date).diff(moment(start_date), 'days' )
  return day
}

const getHours = (data, isday) => {
  let current_hour = new Date().getHours();
  let event_hour = data?.[CubeDataset.Bdeactivities.startDateTime]
  let today = new Date().getDate();
  let event_date = moment(event_hour).date()
  let today_minutes = new Date().getMinutes();
  let event_minutes = moment(event_hour).minutes();

  event_hour = moment(event_hour).hours()
  if (!isday) {
    if (((event_hour < current_hour) || (event_minutes < today_minutes) ) && (today == event_date)) {
      return true
    }
  }
  else {
    if (((event_hour > current_hour)) && (today == event_date)) {
      return true
    }
  }

}

export const activityUpcomming = (data) => {
  
  if (data) {
    //console.log(data)
    return(
      data?.filter(data => data && (data?.[CubeDataset.Bdeactivities.status] == "Pending") && (moment.utc(data?.[CubeDataset.Bdeactivities.startDateTime]).format('YYYY-MM-DDTHH:mm:ssZ') >= moment().format('YYYY-MM-DDTHH:mm:ssZ')))
    )
  }
}

export const sendEventToAppPlatform = (eventType,data) => {
  //let isApp = localStorage.getItem('IS_APP')
  if (window.ReactNativeWebView){
    window.ReactNativeWebView.postMessage(  
      JSON.stringify({
        event: eventType,
        data  
      })  
    );
  }        
}

export const activityCompleted = (data) => {
  if (data) {
    return(
      data?.filter(data => (data?.[CubeDataset.Bdeactivities.status] == "Complete"))
    )
  }
}

export const activityPending = (data) => {
  if (data) {
    return(
      data?.filter(data => (data?.['Bdeactivities.status'] == "Pending" || data?.['Bdeactivities.status'] == "Complete"))
    )
  }
}

export const activityMissed = (data) => {
  if (data) {
    return(
      data?.filter(data => (data?.[CubeDataset.Bdeactivities.status] == "Pending") && (moment(data?.[CubeDataset.Bdeactivities.startDateTime]) < (moment(new Date()))))
    )
  }
}
