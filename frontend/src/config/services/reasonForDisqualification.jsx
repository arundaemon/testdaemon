import axios from 'axios';
import { url, endPoint } from '../urls';

export async function getReasonForDisqualificationList(params) {
    let _url = url.backendHost + endPoint.reasonForDisqualification.getReasonForDisqualificationList;
    return axios.get(_url, { params });  
}

export async function  createReasonForDisqualifiction(params) {
    let _url = url.backendHost + endPoint.reasonForDisqualification.createReasonForDisqualifiction;
    return axios.post(_url, params)
}

export function deleteReasonForDisqualification(params) {
    let _url = url.backendHost + endPoint.reasonForDisqualification.deleteReasonForDisqualification;
    return axios.put(_url, params)
}

export function updateReasonForDisqualification(params) {
    let _url = url.backendHost + endPoint.reasonForDisqualification.updateReasonForDisqualification;
    return axios.put(_url, params)
}