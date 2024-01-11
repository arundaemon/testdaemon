import axios from "axios";
import requestInstance from "../../utils/authorizedRequest";
import settings from "../settings";
import { url, endPoint } from '../urls';

export function listCollectionDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.listCollectionDetails}`
  return requestInstance.post(_url, params);
}

export function listPaymentApprovalDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.listPaymentApprovalDetails}`
  return requestInstance.post(_url, params);
}

export function getPaymentDepositCases(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.getPaymentDepositCases}`
  return requestInstance.post(_url, params);
}

export function rejectPaymentDepositCases(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.rejectPaymentDepositCases}`
  return requestInstance.post(_url, params);
}

export function listPendingCollection(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.listPendingCollection}`
  return requestInstance.post(_url, params);
}

export function pendingCollectionDetail(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.pendingCollectionDetail}`
  return requestInstance.post(_url, params);
}

export function updateAdjustmentStatus(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.updateAdjustmentStatus}`
  return requestInstance.post(_url, params);
}

export function approvePaymentFinance(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.approvePaymentFinance}`
  return requestInstance.post(_url, params);
}

export function listReceivingBank(params) {
  // let _url = `https://qa-apigateway.extramarks.com/cognito-login-service/auth/packages/listReceivingBank`
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.listReceivingBank}`
  return requestInstance.post(_url, params);
}

export function addUpdateSchoolPayment(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.addUpdateSchoolPayment}`
  return requestInstance.post(_url, params);
}

export async function uploadCollectionEvidence(params) {
  let _url = `${url.backendHost}${endPoint.paymentManagement.uploadCollectionEvidence}`
  return await axios.post(_url, params);
}

export async function uploadAddendumProof(params) {
  let _url = `${url.backendHost}${endPoint.paymentManagement.uploadAddendumProof}`
  return await axios.post(_url, params);
}

export async function listAddendumDetail(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.listAddendumDetail}`
  return await requestInstance.post(_url, params);
}

export function listRejectedPayment(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.paymentManagement.listRejectedPayment}`
  return requestInstance.post(_url, params);
}
