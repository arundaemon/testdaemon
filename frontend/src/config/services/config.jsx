import axios from 'axios';
import { url, endPoint } from '../urls';

export function getConfigDetails(params) {
    let _url = url.backendHost + endPoint.config.getConfigDetails;
    return axios.get(_url, { params })
}

export function getAppVersion(params) {
    let _url = url.backendHost + endPoint.config.getAppVersion;
    return axios.get(_url, { params })
}

export function updateConfigDetails(params) {
    let _url = url.backendHost + endPoint.config.updateConfigDetails;
    return axios.put(_url, params)
}

export function makeCall(params) {
    let _url = url.backendHost + endPoint.call.startCall;
    return axios.post(_url, { params })
}

export function getServerTime(params) {
    let _url = url.backendHost + endPoint.config.getServerTime;
    return axios.get(_url, { params })
}