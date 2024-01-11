import axios from 'axios';
import { url, endPoint } from '../urls';

export async function getAllCrmFieldMasterList(params) {
    let _url = url.backendHost + endPoint.crmFieldMaster.getAllCrmFieldMasterList;
    return axios.get(_url, { params });  
}

export async function  createCrmFieldMaster(params) {
    let _url = url.backendHost + endPoint.crmFieldMaster.createCrmFieldMaster;
    return axios.post(_url, params)
}

export async function getCrmFieldMasterList(params) {
    let _url = url.backendHost + endPoint.crmFieldMaster.getCrmFieldMasterList;
    return axios.get(_url, { params });  
}

export async function  updateCrmFieldMaster(params) {
    let _url = url.backendHost + endPoint.crmFieldMaster.updateCrmFieldMaster;
    return axios.put(_url, params)
}
