import axios from 'axios';
import { url, endPoint } from '../urls';
import { CALL_DETAILS } from '../../constants/Call';
import requestInstance from '../../utils/authorizedRequest';
import Env_Config from '../settings'

export function getLeadsList(params) {

  let _url = url.backendHost + endPoint.lead.getLeadsList;
  return axios.get(_url, { params })
}

export function uploadLead(params) {
  let _url = url.backendHost + endPoint.lead.uploadLead;
  return axios.post(_url, params)
}

export function downloadSample() {
  return axios({
    url: url.backendHost + endPoint.lead.downloadSample,
    method: 'GET',
    responseType: 'blob',
  })
}


export function startCallApi(data) {
  const { phoneNumber } = JSON.parse(localStorage.getItem('userData'));
  // console.log("userData",phoneNumber);
  let config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": data?.Authorization,
      "x-api-key": data?.['x-api-key']
    }
  }
  const body = {
    "k_number": data?.K_Number,
    "agent_number": phoneNumber,
    "customer_number": data?.customerNumber,
    "caller_id": data?.['CALLER_ID']
  }

  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  return axiosInstance.post(CALL_DETAILS.URL, body, config)
}





//
export function getBoardList(params) {

    // let _url = `https://qa-crm-api.extramarks.com/gateway/getBoardList`;

  let _url = url.backendHost + "/gateway/getBoardList";

  return requestInstance.get(_url, params)

}



export function getChildList(params) {

   // let _url = `https://qa-crm-api.extramarks.com/gateway/getChildList`;

  let _url = url.backendHost + `/gateway/getChildList`;

  return requestInstance.get(_url, params);

}

//
export function getAddUser(params) {
  let _url = Env_Config.WEBSITE_URL + `cognito-login-service/auth/registerUser?v=2`;
  return requestInstance.post(_url, params);
}

export function logout(params) {
  let _url = Env_Config.WEBSITE_URL + `cognito-login-service/auth/logout`;
  return requestInstance.post(_url, params);
}

export function getProductList(params, body) {
  let _url = url.backendHost + endPoint.product.getProductList;
  return requestInstance.post(_url, params, body)
}

export function getBatchList(params, body) {
  let _url = url.backendHost + endPoint.batch.getBatchList;
  return requestInstance.post(_url, params)
}

export function trialFormSubmit(params, body) {
  let _url = url.backendHost + endPoint.freeTrial.getFreeTrialPackageList;
  return requestInstance.post(_url, params)
}


export function multipleLeadTransfer(params) {
  let _url = url.backendHost + endPoint.lead.multipleLeadTransfer;
  return axios.post(_url, params)
}

export function getLogsList(params) {
  let _url = url.backendHost + endPoint.lead.getLogsList;
  return axios.get(_url, { params })
}



