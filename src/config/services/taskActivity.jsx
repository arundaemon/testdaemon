import axios from 'axios';
import { url, endPoint } from '../urls';

export function  getTaskActivityMappingList(params) {
    let _url = url.backendHost + endPoint. taskActivityMapping.getTaskActivityMappingList;
    return axios.get(_url, {params})
}

export function changeStatus(params) {
    let _url = url.backendHost + endPoint.taskActivityMapping.changeStatus;
    return axios.put(_url, params)
}


export function  createTaskActivityMapping(params) {
    let _url = url.backendHost + endPoint.taskActivityMapping.createTaskActivityMapping;
    return axios.post(_url, params)
}
