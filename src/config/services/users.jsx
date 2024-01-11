import axios from 'axios'
import { url, endPoint } from '../urls'
import settings from '../../config/settings';
import md5 from "md5";
import CryptoJS from "crypto-js";

export function adminLogin(params) {
  let _url = url.backendHost + endPoint.users.adminLogin
  return axios.post(_url, params)
}

const websiteKey = 'D21B2DBA59F52167BEBFF2484DAFB'
const websiteMsaSalt = 'CoLo&Mi!2021'

const getChecksum = (str,encType) => {
  switch(encType){
    case 1:
      return CryptoJS.SHA512(str).toString()
    default:
      return CryptoJS.MD5(str).toString()
  }
}

export function userLogin(params) {
  let { username, password } = params
  let enc_type = 1
  let checksumStr = `cognito_login:${settings.WEBSITE_API_KEY}:${username}:${password}:${settings.WEBSITE_SALT_KEY}`
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth/login?v=2`
  let data = {
    action: "cognito_login",
    apikey: settings.WEBSITE_API_KEY,
    checksum: getChecksum(checksumStr,enc_type),
    enc_type,
    login_details: {
      username: username,
      password: password,
      app_name: 'CRM',
      acess_id: "",
      // access_type:"",
      app_version: "",
      gcm_key: "",
      email_address: "",
      latitude: "",
      longitude: "",
      operating_system_version: 10,
      source: "crm"
    },
    refresh_token: ""
  };

  return axios.post(_url, data)
}

export function getUserInfo(params) {
  let { username, token } = params
  let action = 'cognito_get_user_info'
  let enc_type = 2
  let str = `${action}:${settings.WEBSITE_API_KEY}:${username}:${settings.WEBSITE_SALT_KEY}`
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth/getUserInfo`
  let data = {
    action,
    apikey: settings.WEBSITE_API_KEY,
    enc_type,
    checksum: getChecksum(str,enc_type),
    username: username
  }

  let config = {
    headers: {
      'Authorization': 'Bearer ' + token,
      'token': token
    }
  }

  return axios.post(_url, data, config)
}

export function generateUserToken(params) {
  let _url = url.backendHost + endPoint.users.generateUserToken;
  return axios.post(_url, params)
}



