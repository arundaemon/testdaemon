import axios from 'axios'
import { url, endPoint } from '../urls'
import settings from '../../config/settings'
import requestInstance from '../../utils/authorizedRequest';

var loginDataObj = localStorage.getItem('loginData');
var loginData = JSON.parse(loginDataObj);
var token = loginData?.access_token

export function uploadPurchaseOrderFile(params) {
  let _url = url.backendHost + endPoint.purchaseOrder.uploadPurchaseOrderToGCP;
  return axios.post(_url, params)
}

export function createPurchaseOrder(params) {
  let _url = url.backendHost + endPoint.purchaseOrder.createPurchaseOrder;
  return axios.post(_url, params)
}

export function uploadTdsFile(params) {
  let _url = url.backendHost + endPoint.tds.uploadTds;
  return axios.post(_url, params);
}

export function uploadDscFile(params) {
  let _url = url.backendHost + endPoint.dsc.uploadDsc;
  return axios.post(_url, params);
}
export function getSchoolsByCode(params) {
  let _url = url.backendHost + endPoint.school.getSchoolsByCode;
  return axios.post(_url, params)
}

export function getPurchaseOrderList(params) {
  let _url = url.backendHost + endPoint.purchaseOrder.getPurchaseOrderList;
  return axios.post(_url, params)
}

export async function getPurchaseOrderDetails(params) {
  let _url = `${url.backendHost}${endPoint.purchaseOrder.getPurchaseOrderDetails}/${params}`
  return await axios.get(_url)
}

export async function getPOListBySchoolCode(params) {
  let _url = `${url.backendHost}${endPoint.purchaseOrder.getPOListBySchoolCode}/${params}`
  return await axios.get(_url)
}

export function updatePurchaseOrderStatus(params) {
  let _url = url.backendHost + endPoint.purchaseOrder.updatePurchaseOrderStatus;
  return axios.put(_url, params);
}
export function receivingBankDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listReceivingBank}`;
  return requestInstance.post(_url, params);
}

export function listIssuingBank(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listIssuingBank}`;
  return requestInstance.post(_url, params);
}

export const downloadPO = async (params) => {
  let { fileUrl, fileName } = params
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
