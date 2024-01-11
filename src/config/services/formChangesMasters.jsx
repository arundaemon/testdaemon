import axios from 'axios';
import { url, endPoint } from '../urls';

export async function getReasonForPaPendingList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForPaPendingList;
    return axios.get(_url, { params });  
}

export async function  getReasonForPaRejectedList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForPaRejectedList;
    return axios.get(_url, { params })
}

export async function  getReasonForObPendingList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForObPendingList;
    return axios.get(_url, { params });  
}

export function getReasonForObRejectedList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForObRejectedList;
    return axios.get(_url, { params })
}

export function getReasonForFbPendingList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForFbPendingList;
    return axios.get(_url, { params })
}

export function getReasonForFbRejectedList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForFbRejectedList;
    return axios.get(_url, { params })
}

export function getReasonForAckPendingList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForAckPendingList;
    return axios.get(_url, { params })
}

export function getReasonForAckRejectedList(params) {
    let _url = url.backendHost + endPoint.formChangeMasters.getReasonForAckRejectedList;
    return axios.get(_url, { params })
}