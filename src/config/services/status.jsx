import axios from 'axios';
import { url, endPoint } from '../urls';

export function createStatus(params) {
    let _url = url.backendHost + endPoint.status.createStatus;
    return axios.post(_url, params)
}

export function updateStatus(params) {
    let _url = url.backendHost + endPoint.status.updateStatus;
    return axios.put(_url, params)
}


export function unMapAvailableStatus(params) {
    let _url = url.backendHost + endPoint.status.unMapAvailableStatus;
    return axios.put(_url, params)
}


export function mapStatusesWithStage(params) {
    let _url = url.backendHost + endPoint.status.mapStatusesWithStage;
    return axios.put(_url, params)
}

export async function getStatusList(params) {
    let _url = url.backendHost + endPoint.status.getStatusList;
    const result = await axios.get(_url, { params });
    return result;
}

export function deleteStatus(params) {
    let _url = url.backendHost + endPoint.status.deleteStatus;
    return axios.put(_url, params)
}

export function getAllStatus(params) {
    let _url = url.backendHost + endPoint.status.getAllStatus
    return axios.get(_url, {params})
}

export async function statusDetails(statusId) {
    let _url = `${url.backendHost}${endPoint.status.statusDetails}/${statusId}` 
    return await axios.get(_url)
}

export async function isDuplicateStatus(params) {
    let _url = url.backendHost + endPoint.status.isDuplicateStatus;
    return  axios.get(_url, { params })
}

export async function changeStatus(params) {
    let _url = url.backendHost + endPoint.status.changeStatus;
    return axios.put(_url, params)
}

