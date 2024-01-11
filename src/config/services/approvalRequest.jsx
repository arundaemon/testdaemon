import axios from 'axios';
import { url, endPoint } from '../urls';

export function createRequest(params) {
    let _url = url.backendHost + endPoint.approvalRequest.createRequest;
    return axios.post(_url, params)
}

export async function getRequestList(params) {
    let _url = url.backendHost + endPoint.approvalRequest.getRequestList;
    const result = await axios.get(_url, { params });
    return result;
}

export async function getFinanceRequestList(params) {
    let _url = `${url.backendHost}${endPoint.userClaim.claimList}?${params}`
    return axios.get(_url)
}

export async function getRequestDetails(requestId) {
    let _url = `${url.backendHost}${endPoint.approvalRequest.getRequestDetails}/${requestId}`
    return await axios.get(_url)
}

export async function approveReject(params) {
    let _url = url.backendHost + endPoint.approvalRequest.approveReject;
    return axios.put(_url, params)
}

export function singleCouponRequest(params) {
    let _url = url.backendHost + endPoint.approvalRequest.singleCouponRequest;
    return axios.post(_url, params)
}

export async function getActualSchoolVisits(params){
    let _url = url.backendHost + endPoint.approvalRequest.getActualSchoolVisits;
    return axios.get(_url, { params });
}

export async function reassignRequest(params) {
    let _url = url.backendHost + endPoint.approvalRequest.reassignRequest;
    return axios.put(_url, params)
}

export function specialCouponRequest(params) {
    let _url = url.backendHost + endPoint.approvalRequest.specialCouponRequest;
    return axios.post(_url, params)
}

export function singleCouponApproveThruMapping(data){
    let { url, params} = data;
    return axios.post(url,params);
}

export function specialCouponApproveThruMapping(data){
    let { url, params} = data;
    return axios.post(url,params);
}

export function approveRejectThruMapping(data){
    let { url, params} = data;
    return axios.put(url, params)
}

export function approveClaimThruMapping(data){
    let {url, params} = data;
    return axios.put(url, params)
}

export async function approveClaimRequest(params) {
    let _url = url.backendHost + endPoint.approvalRequest.approveClaimRequest;
    return axios.put(_url, params)
}

export async function updateBulk(params) {
    let _url = url.backendHost + endPoint.userClaim.bulkUpdate;
    return axios.put(_url, params)
}