import axios from 'axios'
import { url, endPoint } from '../urls'
import settings from '../../config/settings';
import md5 from "md5";
import CryptoJS from "crypto-js";

var loginDataObj = localStorage.getItem('loginData');
var accessToken = localStorage.getItem('UserToken');
var loginData = JSON.parse(loginDataObj);
var token = loginData?.access_token


export function getSubSourceList(params) {
  const { page_offset, page_size, search_by, search_val, status } = params
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.subsourceManagment.getSubSourceList}`

  let data = {
    uuid: loginData.uuid,
    page_offset: page_offset,
    page_size: page_size,
    search_by: search_by,
    search_val: search_val,
    status: status,
    order_by: "updated_on",
    order: "DESC",
  }

  let config = {
    headers: {
      'Authorization': 'Bearer ' + loginData?.access_token,
      'token': loginData?.access_token
    }
  }

  return axios.post(_url, data, config)
}

export function addSubSource(params) {
  const { sub_source_name, sub_source_description, status, source_id, source_name } = params
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.subsourceManagment.addUpdateSubSource}`

  let data = {
    uuid: loginData.uuid,
    sub_source_name: sub_source_name,
    sub_source_description: sub_source_description,
    status: status,
    source_id: source_id,
  }

  let config = {
    headers: {
      'Authorization': 'Bearer ' + token,
      'token': token
    }
  }

  return axios.post(_url, data, config)
}

export function updateSubSource(params) {
  const { sub_source_id, status, sub_source_name, sub_source_description, source_id, source_name } = params
  let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.subsourceManagment.addUpdateSubSource}`
  let data = {
    uuid: loginData.uuid,
    sub_source_name: sub_source_name,
    sub_source_description: sub_source_description,
    source_id: source_id,
    sub_source_id: sub_source_id,
    status: status,
  }

  let config = {
    headers: {
      'Authorization': 'Bearer ' + token,
      'token': token
    }
  }


  return axios.post(_url, data, config)
}