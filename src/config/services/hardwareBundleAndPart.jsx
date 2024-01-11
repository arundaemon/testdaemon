import requestInstance from '../../utils/authorizedRequest';
import settings from '../settings';
import { endPoint } from '../urls';



export function listHardwareParts(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listHardwareParts}`; 
  return requestInstance.post(_url, params);

}



export function addHardwarePart(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateHardwarePart}`;
  return requestInstance.post(_url, params);

}

export function updateHardwarePart(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateHardwarePart}`;
  return requestInstance.post(_url, params);

}

export function listHardwareBundle(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.listHardwareBundle}`;
  return requestInstance.post(_url, params);

}

export function addHardwareBundle(params) {

  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateHardwareBundle}`;
  return requestInstance.post(_url, params);

}


export function updateHardwareBundle(params) {
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.addUpdateHardwareBundle}`;
  return requestInstance.post(_url, params);

}













