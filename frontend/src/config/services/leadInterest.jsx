import axios from 'axios';
import { url, endPoint } from '../urls';


export function leadInterestCreate(params) {
  let _url = url.backendHost + endPoint.leadInterest.createLeadInterest;
  // console.log(_url, )
  return axios.post(_url, params)
}

export async function LeadDetailsInterest(leadId) {
  let _url = `${url.backendHost}${endPoint.leadInterest.leadInterestDetails}/${leadId}`
  return await axios.get(_url)
}

export async function uniqueLeadInterest(leadId) {
  let _url = `${url.backendHost}${endPoint.leadInterest.uniqueLeadInterest}/${leadId}`
  return await axios.get(_url)
}

export function interestTransactionalLog(params) {
  let _url = url.backendHost + endPoint.leadInterest.interestTransactionalLog;
  return axios.get(_url, { params })
}

export function getOwnerInterestList(params) {
  let _url = url.backendHost + endPoint.leadInterest.getOwnerInterestList;
  return axios.post(_url, params)
}

export function getSchoolInterests(params) {
  let _url = url.backendHost + endPoint.leadInterest.getSchoolInterests;
  return axios.get(_url, { params })
}

export function getMultipleSchoolInterests(params) {
  let _url = url.backendHost + endPoint.leadInterest.getMultipleSchoolInterests;
  return axios.post(_url, params)
}

export function getProductListData(params) {
  let _url = url.backendHost + endPoint.leadInterest.getProductListData;
  return axios.post(_url, params)
}

export function getUserHotsPipeline(params) {
  let _url = url.backendHost + endPoint.leadInterest.getUserHotsPipeline;
  return axios.get(_url, { params })
}

