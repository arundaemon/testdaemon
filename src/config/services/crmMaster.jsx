import axios from 'axios';
import { endPoint, url } from '../urls';



export async function getCrmMasterList(params) {
    let _url = url.backendHost + endPoint.crmMaster.getCrmMasterList;
    return axios.get(_url, { params });
}

export async function createCrmMaster(params) {
    let _url = url.backendHost + endPoint.crmMaster.createCrmMaster;
    return axios.post(_url, params)
}

export function deleteCrmMaster(params) {
    let _url = url.backendHost + endPoint.crmMaster.deleteCrmMaster;
    return axios.put(_url, params)
}

export function updateCrmMaster(params) {
    let _url = url.backendHost + endPoint.crmMaster.updateCrmMaster;
    return axios.put(_url, params)
}

export function getAllKeyValues(params) {
    let _url = url.backendHost + endPoint.crmMaster.getAllKeyValues;
    return axios.get(_url, { params })
}



