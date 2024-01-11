import axios from 'axios';
import { url, endPoint } from '../urls';

export function createAttendanceMatrix(params) {
    let _url = url.backendHost + endPoint.attendance.createAttendanceMatrix;
    return axios.put(_url, params)
}
export function changeStatus(params) {
    let _url = url.backendHost + endPoint.attendance.changeStatus;
    return axios.put(_url, params)
}

export function getAttendanceList(params) {
    let _url = url.backendHost + endPoint.attendance.getAttendanceList;
    return axios.get(_url, {params})
}

export async function updateAttendance(params) {
    let _url = url.backendHost + endPoint.attendance.updateAttendance
    return axios.put(_url, params);  
}

export async function addActivity(params) {
    let _url = url.backendHost + endPoint.attendance.addActivity;
    return axios.put(_url,  params );
}
    
export async function attendanceDetails(matrixId) {
    let _url = `${url.backendHost}${endPoint.attendance.attendanceDetails}/${matrixId}` 
    return await axios.get(_url)
}

export async function updateActivity(params) {
    let _url = url.backendHost + endPoint.attendance.updateActivity;
    return axios.put(_url,  params );
}

export function getAttendanceData(params) {
    let _url = url.backendHost + endPoint.attendance.getMinMaxTarget;
    return axios.get(_url, {params})
}

