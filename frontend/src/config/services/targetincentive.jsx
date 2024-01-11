import axios, { AxiosRequestConfig } from 'axios';
import { url, endPoint } from '../urls';
// import fs from 'fs';


export function uploadTargetIncentive(params) {
  console.log(params, 'this is params123')

  let _url = url.backendHost + endPoint.targetIncentive.uploadTargetIncentive;

  return axios.post(_url, params)

}
export function downloadSample() {
  return axios({
    url: url.backendHost + endPoint.targetIncentive.downloadSample,
    method: 'GET',
    responseType: 'blob',
  })
}

export function getTargetIncentive(params) {
  let _url = url.backendHost + endPoint.targetIncentive.getTargetIncentive;
  return axios.get(_url, { params })
}
