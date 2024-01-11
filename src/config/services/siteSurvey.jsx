import axios from "axios";
import { url, endPoint } from "../urls";

export function createSiteSurvey(formData) {
  let _url =
    url.backendHost + endPoint.implementationSiteSurvey.createSiteSurvey;
  return axios.post(_url, formData);
}

export function getSiteSurveyList(params) {
  let _url = `${url.backendHost}${endPoint.implementationSiteSurvey.getSiteSurveyList}`;
  return axios.post(_url, params);
}

export function getSiteSurveyDetails(params) {
  let _url = `${url.backendHost}${endPoint.implementationSiteSurvey.getSiteSurveyDetails}`;
  return axios.get(_url, {params});
}

export function getPrevSsrFormData(params) {
  let _url = `${url.backendHost}${endPoint.implementationSiteSurvey.getPrevSsrFormData}`;
  return axios.get(_url, { params })
}


export function updateApprovalStatus(params) {
  let _url = url.backendHost + endPoint.implementationSiteSurvey.updateApprovalStatus;
  return axios.put(_url, params)
}