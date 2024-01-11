import axios from 'axios';
import { url, endPoint } from '../urls';

export function createManageStageStatus(params) {
    let _url = url.backendHost + endPoint.manageStageStatus.createStageStatus
    return axios.put(_url, params)
}

export function getPreviewMap(params) {
  let _url = url.backendHost + endPoint.manageStageStatus.getPreviewMap
  return axios.get(_url, {params})
}

export function getLeadStageStatus(params){
  let _url = url.backendHost + endPoint.manageStageStatus.leadStageStatus
  return axios.post(_url,params)
}