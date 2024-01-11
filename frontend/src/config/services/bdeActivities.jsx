import axios from "axios";
import { url, endPoint } from "../urls";

export async function getBdeRecentActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeDetails.getBdeRecentActivityDetails}`;
  return await axios.get(_url, { params });
}

export async function createbdeActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeDetails.createBdeActivity}`;
  return await axios.post(_url, params);
}

export async function updateBdeActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeDetails.updateCollectionTypeBdeActivity}`;
  return await axios.put(_url, params);
}

export async function logBdeActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeDetails.logBdeActivity}`;
  return await axios.post(_url, params);
}

export async function getUserActivities(params) {
  let _url = `${url.backendHost}${endPoint.bdeDetails.getUserActivities}`;
  return await axios.get(_url, { params });
}

export async function markBdeActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.logBdeActivity}`;
  return await axios.post(_url, params);
}

export async function getPendingBdeActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getPendingActivity}`;
  return await axios.post(_url, params);
}

export async function closePendingActivities(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.closePendingActivities}`;
  return await axios.post(_url, params);
}

export async function getBdeActivitiesList(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getBdeActivities}`;
  return await axios.get(_url, { params });
}

export async function getAttendancePoint(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getBdeActivityScore}`;
  return await axios.get(_url, { params });
}
export async function getBdeActivitiesByRoleName(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getBdeActivitiesByRoleName}`;
  return await axios.post(_url, params);
}

export async function getCurrentMonthActivities(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getCurrentMonthActivities}`;
  return await axios.get(_url, { params });
}

export async function checkLeadStageStatus(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.checkLeadStageStatus}`;
  return await axios.post(_url, params);
}

export async function logMeetingActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.logMeetingActivity}`;
  return await axios.post(_url, params);
}
export async function getCurrentActivities(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getCurrentActivities}`;
  return await axios.get(_url, { params });
}

export async function getBdeActivitiesByDate(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getBdeActivitiesByDate}`;
  return await axios.get(_url, { params });
}

export async function addActivity(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.addActivity}`;
  return await axios.post(_url, params);
}

export async function getActivitiesByType(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getActivitiesByType}`;
  return await axios.post(_url, params);
}

export async function getCollectionTypeActivities(params) {
  let _url = `${url.backendHost}${endPoint.bdeActivities.getCollectionTypeActivities}`;
  return await axios.post(_url, params);
}

// export async function updateBdeActivity(params) {
//   let _url = `${url.backendHost}${endPoint.bdeActivities.updateBdeActivity}`;
//   return await axios.post(_url, params);
// }
