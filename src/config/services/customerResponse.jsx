import axios from 'axios';
import { url, endPoint } from '../urls';

export async function getCustomerResponseList(params) {
    let _url = url.backendHost + endPoint.customerResponse.getCustomerResponseList;
    return axios.get(_url, { params });  
}

export async function getAllCustomerResponses(params) {
    let _url = url.backendHost + endPoint.customerResponse.getAllCustomerResponses;
    return axios.get(_url, { params });  
}

export async function  createCustomerResponse(params) {
    let _url = url.backendHost + endPoint.customerResponse.createCustomerResponse;
    return axios.post(_url, params)
}

export function deleteCustomerResponse(params) {
    let _url = url.backendHost + endPoint.customerResponse.deleteCustomerResponse;
    return axios.put(_url, params)
}

export function updateCustomerResponse(params) {
    let _url = url.backendHost + endPoint.customerResponse.updateCustomerResponse;
    return axios.put(_url, params)
}