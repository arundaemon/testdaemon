//import axios from 'axios';
import requestInstance from "../../utils/authorizedRequest";
import { url, endPoint } from "../urls";

export async function getMasterList(params) {
  let _url = url.backendHost + endPoint.gatewayApis.getMasterList;
  const result = await requestInstance.post(_url, params);
  return result;
}

export async function getReasonMasterList(params) {
  let _url = url.backendHost + endPoint.gatewayApis.getReasonMasterList;
  const result = await requestInstance.post(_url, params);
  return result;
}

export async function addInvoiceCollectionSchedule(params) {
  let _url =
    url.backendHost + endPoint.gatewayApis.addInvoiceCollectionSchedule;
  const result = await requestInstance.post(_url, params);
  return result;
}

export async function getScheduleList(params) {
  let _url = `${url.backendHost}${endPoint.gatewayApis.getScheduleList}`;
  const result = await requestInstance.post(_url, params);
  return result;
}

export async function uploadFileData(params) {
  let _url = url.backendHost + endPoint.gatewayApis.uploadFileToGcp;
  const result = requestInstance.post(_url, params);
  return result;
}
