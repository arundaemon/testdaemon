// import axios from 'axios'
// import { url, endPoint } from '../urls'
 import settings from '../../config/settings';
// import md5 from "md5";
// import CryptoJS from "crypto-js";

// var loginDataObj = localStorage.getItem('loginData');
// var accessToken = localStorage.getItem('UserToken');
// var loginData = JSON.parse(loginDataObj);
// var token = loginData?.access_token


// // export function getCampaignManagementList(params) {
// //   const { page_offset, page_size, search_by, search_val, status, order_by, order } = params
// //   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.campaignManagment.getCampaignList}`

// //   let data = {
// //     uuid: loginData.uuid,
// //     page_offset: page_offset,
// //     page_size: page_size,
// //     search_by: search_by,
// //     search_val: search_val,
// //     status: status,
// //     order_by: order_by,
// //     order: order
// //   }

// //   let config = {
// //     headers: {
// //       'Authorization': 'Bearer ' + loginData?.access_token,
// //       'token': loginData?.access_token
// //     }
// //   }

// //   return axios.post(_url, data, config)
// // }

// export function addCampaign(params) {
//   console.log(params, "parmas")
//   const { campaign_name, campaign_description, campaign_id, status } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.campaignManagment.addUpdateCampaign}`

//   let data = {
//     uuid: loginData.uuid,
//     campaign_name: campaign_name,
//     campaign_description: campaign_description,
//     campaign_id: campaign_id,
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

// export function updateCampaign(params) {
//   const { campaign_id, status, campaign_name, campaign_description } = params
//   let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.campaignManagment.addUpdateCampaign}`
//   let data = {
//     uuid: loginData.uuid,
//     campaign_id: campaign_id,
//     status: status,
//     campaign_name: campaign_name,
//     campaign_description: campaign_description,
//   }

//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + token,
//       'token': token
//     }
//   }

//   return axios.post(_url, data, config)
// }