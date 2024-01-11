import requestInstance from "../../utils/authorizedRequest";
import settings from "../settings";
import { endPoint } from "../urls";




export function listAllPackages(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.packageMasterList}`
  return requestInstance.post(_url, params);

}

export function listHardwarePartVariants(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listHardwarePartVariants}`
 
  return requestInstance.post(_url, params);

}

export function listHardwareBundleVariants(params) {
  
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listHardwareBundleVariants}`
  return requestInstance.post(_url, params);

}

export function createHardwarePartVariant(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdatePartVariants}`
  
  return requestInstance.post(_url, params);

}

export function createHardwareBundleVariant(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateBundleVariants}`
  
  return requestInstance.post(_url, params);

}

export function listProductUom(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listUnitOfMeasurement}`

  
  return requestInstance.post(_url, params);

}

export function getRecommendHardware(params) {
  
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listHardwareRecommendation}`
  return requestInstance.post(_url, params);

}






