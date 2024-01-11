import axios from 'axios';
import { url,ENV, endPoint } from '../urls';

export function createActivity(params) {
    let _url = url.backendHost + endPoint.activities.createActivity;
    return axios.post(_url, params)
}

export function updateActivity(params) {
    let _url = url.backendHost + endPoint.activities.updateActivity;
    return axios.put(_url, params)
}

export async function getActivityList(params) {
    let _url = url.backendHost + endPoint.activities.getActivityList;
    return axios.get(_url, { params });
}

export function deleteActivity(params) {
    let _url = url.backendHost + endPoint.activities.deleteActivity;
    return axios.put(_url, params)
}

export function getEmployeesCount(params) {
    let _url = url.backendHost + endPoint.activities.getEmployeesCount;
    return axios.get(_url, { params });
}

export function getCustomersCount(params) {
    let _url = url.backendHost + endPoint.activities.getCustomersCount;
    return axios.get(_url, { params });
}

export function getActivity(params) {
    let _url = url.backendHost + endPoint.activities.getActivity;
    return axios.get(_url, { params });
}

export function getTrueActivity(params) {
    let _url = url.backendHost + endPoint.activities.getTrueActivity;
    return axios.get(_url, { params });
}


export function getAllActivities(params) {
    let _url = url.backendHost + endPoint.activities.getAllActivities
    return axios.get(_url, { params })
}

export function getActivityByKey(params) {
    let _url = url.backendHost + endPoint.activities.getActivityByKey
    return axios.get(_url, { params })
}

export const activityLogger = (data) => {
    let params = [{
        em_guid: data.empCode,
        uuid: data.empCode,
        landing_page: data.landing_page,
        action: data.action,
        date_time: new Date().toISOString(),
        platform: "Web",
        app_name:'CRM',
        environment: ENV.env,
        app_version: ENV.version,
        browser: navigator?.userAgent,
        os_details: navigator?.platform,
        event_type: data.event_type,
        eventStep: data.eventStep,
        click_type: data.click_type,
        value: JSON.stringify(data.eventData)
    }]
    let _url = url.logbookApi + endPoint.activities.logbookActivity;
    return axios.post(_url, params,{headers:{Authorization:'Bearer ' + btoa(`${ENV.logbookLogin}:${ENV.logbookPass}`)}})
}

export function getActivitiesDetail(params) {
    let _url = url.backendHost + endPoint.activities.getActivitiesDetail;
    return axios.post(_url, params)
}

