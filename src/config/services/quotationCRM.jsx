import axios from "axios";
import { url, endPoint } from "../urls";

export function createQuotation(params) {
  let _url = url.backendHost + endPoint.quotation.addQuotation;
  return axios.post(_url, params);
}

export function getQuotationList(params) {
  let _url = url.backendHost + endPoint.quotation.getQuotationList;
  return axios.post(_url, params);
}

export function deleteQuotationList(params) {
  let _url = url.backendHost + endPoint.quotation.deleteQuotationList;
  return axios.put(_url, params);
}

export function getQuotationDetails(quotationId) {
  let _url = `${url.backendHost}${endPoint.quotation.getQuotationDetails}/${quotationId}`;
  return axios.get(_url);
}

export function getProductSalePriceSum(quotationId) {
  let _url = `${url.backendHost}${endPoint.quotation.getProductSalePriceSum}/${quotationId}`;
  return axios.get(_url);
}

export function getQuotationWithoutPO(schoolCode) {
  let _url = `${url.backendHost}${endPoint.quotation.getQuotationWithoutPO}/${schoolCode}`;
  return axios.get(_url);
}

export function updateQuotation(params) {
  let _url = url.backendHost + endPoint.quotation.updateQuotation;
  return axios.put(_url, params);
}

export function updateIsPoGenerated(params) {
  let _url = url.backendHost + endPoint.quotation.updateIsPoGenerated;
  return axios.put(_url, params);
}

export function updateQuotationStatus(params) {
  let _url = url.backendHost + endPoint.quotation.updateQuotationStatus;
  return axios.put(_url, params);
}