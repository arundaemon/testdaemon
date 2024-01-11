import axios, { AxiosRequestConfig } from 'axios';
import { url, endPoint } from '../urls';
// import fs from 'fs';


export function addTarget(params) {

  let _url = url.backendHost + endPoint.target.addTarget;

  return axios.post(_url, params)

}
export function downloadSampleTarget(params) {
  return axios({
    url: url.backendHost + endPoint.target.downloadSampleTarget,
    method: 'GET',
    responseType: 'blob',
    params: params
  })
}

export function getTargetList(params) {
  let _url = url.backendHost + endPoint.target.getTargetList
  return axios.post(_url, params)
}

export async function getRoleNameProducts(params) {
  let _url = url.backendHost + endPoint.target.getRoleNameProducts;
  return await axios.get(_url, { params })
}

export function updateTargetDetails(params) {
  let _url = url.backendHost + endPoint.target.updateTargetDetails
  return axios.put(_url, params)
}

export function assignTargets(params) {
  let _url = url.backendHost + endPoint.target.assignTargets;
  return axios.post(_url, params)
}
