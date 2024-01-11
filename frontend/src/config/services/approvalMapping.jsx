import axios from 'axios';
import { url, endPoint } from '../urls';

export function createApprovalMapping(params) {
    let _url = url.backendHost + endPoint.approvalMapping.createApprovalMapping;
    return axios.post(_url, params)
}

export async function getApprovalMappingList(params) {
    let _url = url.backendHost + endPoint.approvalMapping.getApprovalMappingList;
    const result = await axios.get(_url, { params });
    return result;
}

export async function getApprovalMappingDetails(requestId) {
    let _url = `${url.backendHost}${endPoint.approvalMapping.getApprovalMappingDetails}/${requestId}`
    return await axios.get(_url)
}

export function updateApprovalMapping(params) {
    let _url = url.backendHost + endPoint.approvalMapping.updateApprovalMapping
    return axios.put(_url, params)
}

export async function getMappingInfo(params) {
    let _url = url.backendHost + endPoint.approvalMapping.getMappingInfo;
    const result = await axios.get(_url, { params });
    return result;
}