import axios from 'axios';
import settings from '../settings';
import { endPoint, url } from '../urls';
import requestInstance from '../../utils/authorizedRequest';

export function listPackageBundles(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listPackageBundles}`
  return requestInstance.post(_url, params);
}

export function masterDataList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.masterDataList}`
  return requestInstance.post(_url, params);
}

export function listReasonMaster(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listReasonMaster}`
  return requestInstance.post(_url, params);
}

export function listEntityFeatures(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listEntityFeatures}`

  return requestInstance.post(_url, params);

}


export function createPackageBundle(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdatePackageBundle}`
  return requestInstance.post(_url, params);
}


export function uploadFileData(params) {
  let _url = url.backendHost + endPoint.packages.uploadFileToGcp;
  return axios.post(_url, params)
}

export function getAllProductList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.masterDataList}`
  return requestInstance.post(_url, params);
}


export function getPackageName(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listPackageBundles}`
  return requestInstance.post(_url, params);
}

export function getProductName(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.masterDataList}`
  return requestInstance.post(_url, params);
}


export function getCampaignName(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listCampaign}`;
  return requestInstance.post(_url, params);
}

export function addCampaign(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateCampaign}`;

  return requestInstance.post(_url, params);
}

export function updateCampaign(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateCampaign}`;
  return requestInstance.post(_url, params);
}

export function getAllSourcesList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listSource}`;

  return requestInstance.post(_url, params);
}


export function addUpdateNewSource(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateSource}`;

  return requestInstance.post(_url, params);
}

export function getAllSubSourcesList(params) {

  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listSubSource}`;

  return requestInstance.post(_url, params);
}

export function addUpdateNewSubSource(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateSubSource}`;

  return requestInstance.post(_url, params);
}

export function getServiceManagementList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.getServiceList}`;
  return requestInstance.post(_url, params);
}


export function addService(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateService}`;
  return requestInstance.post(_url, params);
}


export function updateService(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateService}`;
  return requestInstance.post(_url, params);
}

// export function updateService(params) {
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateService}`;
//   return requestInstance.post(_url, params);
// }

export function getMatrixList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listPricingMatrix}`;
  return requestInstance.post(_url, params);
}

export function getProductAttribute(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listMatrixAttributes}`;
  return requestInstance.post(_url, params);
}


export function addUpdateMatrix(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdatePricingMatrix}`;
  return requestInstance.post(_url, params);
}

export function listInvoiceOffice(params) {
  let _url = `${url.backendHost}${endPoint.packages.listInvoiceOffice}`;
  return requestInstance.post(_url, params);
}

export function addUpdateHardwareInvoice(params) {
  let _url = `${url.backendHost}${endPoint.packages.addUpdateHardwareInvoice}`;
  return requestInstance.post(_url, params);
}

export function listHardwareInvoice(params) {
  let _url = `${url.backendHost}${endPoint.packages.listHardwareInvoice}`;
  return requestInstance.post(_url, params);
}

export function listHwInvoicedAmountDetails(params) {
  let _url = `${url.backendHost}${endPoint.packages.listHwInvoicedAmountDetails}`;
  return requestInstance.post(_url, params);
}

export function addSchoolTdsDetail(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addSchoolTdsDetail}`;
  return requestInstance.post(_url, params);
}

export function getVoucherList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listVouchers}`;
  return requestInstance.post(_url, params);
}

export function listSchoolTdsDetail(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listSchoolTdsDetail}`;
  return requestInstance.post(_url, params);
}

export function addUpdateInvoiceDsc(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateInvoiceDsc}`;
  return requestInstance.post(_url, params);
}

export function listFormInvoices(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listFormInvoices}`;
  return requestInstance.post(_url, params);
}


export function listInvoiceDsc(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listInvoiceDsc}`;
  return requestInstance.post(_url, params);
}
export function cancelHardwareInvoice(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.cancelHardwareInvoice}`;
  return requestInstance.post(_url, params);
}


export function packageActivation(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.b2bPackageActivation}`;
  return requestInstance.post(_url, params);
}

export async function listPendingCollection(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listPendingCollection}`
  const result = await requestInstance.post(_url, params);
  return result
}

export function getPackagePrice(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.packagePriceData}`;
  return requestInstance.post(_url, params);
}


export function getPackagePriceAttribute(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.packagePriceAttributes}`;
  return requestInstance.post(_url, params);
}

export function getpendingCollectionDetail(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.pendingCollectionDetail}`;
  return requestInstance.post(_url, params);
}
export async function listInvoiceCollectionSchedule(params) {
  let _url = url.backendHost + endPoint.packages.listInvoiceCollectionSchedule
  const result = await requestInstance.post(_url, params);
  return result
}

export async function generateInvoiceFromSchedule(params) {
  let _url = url.backendHost + endPoint.packages.generateInvoiceFromSchedule
  const result = await requestInstance.post(_url, params);
  return result
}

export async function updateInvoiceDetails(params) {
  let _url = url.backendHost + endPoint.packages.updateInvoiceDetails
  const result = await requestInstance.post(_url, params);
  return result
}

export async function listGeneratedInvoice(params) {
  let _url = url.backendHost + endPoint.packages.listGeneratedInvoice
  const result = await requestInstance.post(_url, params);
  return result
}

export async function listInvoiceIRNErrors(params) {
  let _url = url.backendHost + endPoint.packages.listInvoiceIRNErrors
  const result = await requestInstance.post(_url, params);
  return result
}



export async function listInvoiceScheduleDetails(params) {
  let _url = url.backendHost + endPoint.packages.listInvoiceScheduleDetails
  const result = await requestInstance.post(_url, params);
  return result
}

export function addVoucher(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addVoucher}`;
  return requestInstance.post(_url, params);
}

export function voucherViewDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.voucherDetailsData}`;
  return requestInstance.post(_url, params);
}

export function updateVoucher(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.updateVoucherDetail}`;
  return requestInstance.post(_url, params);
}


export function voucherLogDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.voucherLogDetail}`;
  return requestInstance.post(_url, params);
}

export function cancelVoucher(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.cancelVoucher}`;
  return requestInstance.post(_url, params);
}


export async function listSchoolLedger(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listSchoolLedger}`
  const result = await requestInstance.post(_url, params);
  return result
}


export async function getschoolLedgerDetails(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.schoolLedgerDetails}`
  const result = await requestInstance.post(_url, params);
  return result
}

export function getHardwareVoucherList(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listHardwareVoucher}`;
  return requestInstance.post(_url, params);
}

export function hardwareInvoiceCreditDetail(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.hwInvoiceCreditDetail}`;
  return requestInstance.post(_url, params);
}

export function addUpdateHardwareVoucher(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateHardwareVoucher}`;
  return requestInstance.post(_url, params);
}

export async function getCreditDebitAmountLimit(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.creditDebitAmountLimit}`
  const result = await requestInstance.post(_url, params);
  return result
}

export async function addUpdateAddendum(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateAddendum}`
  const result = await requestInstance.post(_url, params);
  return result
}

export async function pendingInvoiceForRelease(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.pendingInvoiceForRelease}`
  const result = await requestInstance.post(_url, params);
  return result
}

export async function invoiceProcessAction(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.invoiceProcessAction}`
  const result = await requestInstance.post(_url, params);
  return result
}

export async function schoolLedgerVoucher(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listSchoolLedgerVoucher}`
  const result = await requestInstance.post(_url, params);
  return result
}
export async function getImplementationListWithInvoice(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listInvoicedForms}`
  const result = await requestInstance.post(_url, params);
  return result
}















