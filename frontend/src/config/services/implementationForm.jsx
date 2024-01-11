import axios from "axios";
import { url, endPoint } from "../urls";
import settings from '../settings'
import requestInstance from "../../utils/authorizedRequest";

export function implementationCompleteForm(params) {
  let _url = url.backendHost + endPoint.implementationForm.implementationCompleteForm;
  return axios.post(_url, params);
}

export function fetchImplementationList(params) {
  let _url = url.backendHost + endPoint.implementationForm.fetchImplementationList;
  return axios.post(_url, params);
}

export function fetchImplementationListByApprovalStatus(params) {
  let _url = url.backendHost + endPoint.implementationForm.fetchImplementationListByApprovalStatus;
  return axios.get(_url, { params });
}

export function getImplementationById(implementationCode) {
  let _url = `${url.backendHost + endPoint.implementationForm.fetchImplementationList}/${implementationCode}`;
  return axios.get(_url);
}

export function createProductField(params) {
  let _url = url.backendHost + endPoint.implementationForm.createProductField;
  return axios.post(_url, params);
}

export function getProductField() {
  let _url = url.backendHost + endPoint.implementationForm.getProductField;
  return axios.get(_url);
}

export function updateImplementationByStatus(params) {
  let _url = url.backendHost + endPoint.implementationForm.updateImplementationByStatus;
  return axios.put(_url, params);
}

export function updateActivationPackage(params) {
  let _url = url.backendHost + endPoint.implementationForm.updateActivationPackage;
  return axios.put(_url, params);
}

export function updateScheduleStatus(params) {
  let _url = url.backendHost + endPoint.implementationForm.updateScheduleStatus;
  return axios.put(_url, params);
}

export function listBatchDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.implementationForm.listBatchDetails}`
  // let _url = ` https://dev-apigateway.extramarks.com/cognito-login-service/auth/packages/listBatchDetails`

  return requestInstance.post(_url, params);
}

export function updateHardwareDetails(params) {
  let _url = url.backendHost + endPoint.implementationForm.updateHardwareDetails;
  return requestInstance.put(_url, params);
}

// export function packageActivation(params) {
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.implementationForm.b2bPackageActivation}`
//   return requestInstance.post(_url, params)
// }

export function getActivatedImplementationList(params) {
  let _url = url.backendHost + endPoint.implementationForm.getActivatedImplementationList;
  return axios.post(_url, params);
}

export function checkLead(params) {
  let _url = url.backendHost + endPoint.leadStageStatus.checkLead;
  return axios.post(_url, params);
}

export function getImplementationByCondition(params) {
  let _url = url.backendHost + endPoint.implementationForm.getImplementationByCondition;
  return axios.get(_url, {params});
}


export function uploadQcImageToGcp(params) {
  let _url = url.backendHost + endPoint.implementationForm.uploadQcImageToGcp;
  return axios.post(_url, params)
}


export function createQc(params) {
  let _url = url.backendHost + endPoint.implementationForm.createQc;
  return axios.post(_url, params)
}

export function getPrevQcFormData(params) {
  let _url = url.backendHost + endPoint.implementationForm.getPrevQcFormData;
  return axios.get(_url, {params})
}


export function getQcList(params) {
  let _url = url.backendHost + endPoint.implementationForm.getQcList;
  return axios.post(_url, params)
}

export function getImplementationListWithEr(params) {
  let _url = url.backendHost + endPoint.implementationForm.getImplementationListWithEr;
  return axios.post(_url, params)
}

export function getAssignedTaskList(params) {
  let _url = url.backendHost + endPoint.implementationForm.getAssignedTaskList;
  return axios.get(_url, {params})
}


export function updateActivity(params) {
  let _url = url.backendHost + endPoint.implementationForm.updateActivity;
  return requestInstance.put(_url, params);
}