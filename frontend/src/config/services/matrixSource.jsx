// import axios from 'axios'
// import { url, endPoint } from '../urls'
// import settings from '../../config/settings';
// import md5 from "md5";
// import CryptoJS from "crypto-js";

// var loginDataObj = localStorage.getItem('loginData');
// var accessToken = localStorage.getItem('UserToken');
// var loginData = JSON.parse(loginDataObj);
// var token = loginData?.access_token


// export function getSourceList(params) {
//   const { page_offset, page_size, search_by, search_val, status, order_by, order } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.sourceManagment.getSourceList}`

//   let data = {
//     uuid: loginData.uuid,
//     page_offset: page_offset,
//     page_size: page_size,
//     search_by: search_by,
//     search_val: search_val,
//     status: status,
//     order_by: order_by,
//     order: order
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + loginData?.access_token,
//       'token': loginData?.access_token
//     }
//   }

//   return axios.post(_url, data, config)
// }

// export function addSource(params) {
//   const { source_name, source_description } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.sourceManagment.addUpdateSource}`

//   let data = {
//     uuid: loginData.uuid,
//     source_name: source_name,
//     source_description: source_description,
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'token': token
//     }
//   }

//   return axios.post(_url, data, config)
// }

// export function addUpdateNewSource(params) {
//   const { source_name, uuid, status, source_id } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.sourceManagment.addUpdateSource}`

//   let data = {
//     uuid: uuid,
//     source_name: source_name,
//     source_id: source_id,
//     status: status
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'token': token
//     }
//   }

//   return axios.post(_url, data, config)
// }

// export function updateSource(params) {
//   const { source_id, status, source_name, source_description } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.sourceManagment.addUpdateSource}`
//   let data = {
//     uuid: loginData.uuid,
//     source_name: source_name,
//     source_description: source_description,
//     source_id: source_id,
//     status: status
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'token': token
//     }
//   }

//   return axios.post(_url, data, config)
// }

// export function getAllSourcesList(params) {
//   const { page_offset, page_size, search_by, search_val, status, order_by, order, uuid } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.sourceManagment.getSourceList}`

//   let data = {
//     uuid: uuid,
//     page_offset: page_offset,
//     page_size: page_size,
//     search_by: search_by,
//     search_val: search_val,
//     status: status,
//     order_by: order_by,
//     order: order
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + loginData?.access_token,
//       'token': loginData?.access_token
//     }
//   }


//   return axios.post(_url, data, config)

// }



// export function getAllSubSourcesList(params) {
//   const {  search_by, search_val, order_by, order, uuid , status} = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.subsourceManagment.getSubSourceList}`

//   let data = {
//     uuid: uuid,
//     search_by: search_by,
//     search_val: search_val,
//     order_by: order_by,
//     order: order,
//     status:status
    
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + loginData?.access_token,
//       'token': loginData?.access_token
//     }
//   }

//   return axios.post(_url, data, config)

// }


// export function addUpdateNewSubSource(params) {
//   const { sub_source_name, uuid, status, sub_source_id, source_id
//   } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.subsourceManagment.addUpdateSubSource}`

  
//   let data = {
//     uuid: uuid,
//     sub_source_name: [sub_source_name],
//     sub_source_id: sub_source_id,
//     source_id:source_id,
//     status: status
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'token': token
//     }
//   }

//   return axios.post(_url, data, config)
// }

