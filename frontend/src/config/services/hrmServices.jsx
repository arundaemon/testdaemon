import axios from 'axios'
import { url,endPoint } from '../urls'
import Env_Config from '../settings'
import md5 from "md5";


export function getRolesList(params) {
  let _url = url.hrmApiUrl + '/user/get'
  params.apikey = Env_Config.HRM_API_KEY
  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  return axiosInstance.post(_url, params);
}

export function getRolesHierarchy(params) {
  let _url = url.hrmApiUrl + '/user/rolehierarchy'

  params.action = "role_hierarchy"
  params.checksum = md5("role_hierarchy:" + Env_Config.HRM_API_KEY + ":" + params.role_name + ":" + Env_Config.HRM_API_SALT_KEY)

  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  return axiosInstance.post(_url, params);
}


export function getChildRoles(params) {
  let _url = url.hrmApiUrl + '/user/child-roles'

  params.action = "child_roles"
  params.checksum = md5("child_roles:" + Env_Config.HRM_API_KEY + ":" + params.role_name + ":" + Env_Config.HRM_API_SALT_KEY)

  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  return axiosInstance.post(_url, params);
}

// export function getAllChildRoles(params) {
//   let _url = url.hrmApiUrl + '/user/all-child-roles'
//   params.action = "all_child_roles"
//   params.checksum = md5("all_child_roles:" + Env_Config.HRM_API_KEY + ":" + params.role_name + ":" + Env_Config.HRM_API_SALT_KEY)
//   var axiosInstance = axios.create();
//   delete axiosInstance.defaults.headers.common['AccessToken'];
//   return axiosInstance.post(_url, params);
// }

export async function getAllChildRoles(params) {
  let _url = url.backendHost + endPoint.hierachyDetails.allChildRoles;
  const result = await axios.get(_url, { params });
  return result;
}

export function getAllParentRoles(params) {
  let _url = url.hrmApiUrl + '/user/rolehierarchy';
  params.action = "role_hierarchy";
  params.checksum = md5("role_hierarchy:" + Env_Config.HRM_API_KEY + ":" + params.role_name + ":" + Env_Config.HRM_API_SALT_KEY)
  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  return axiosInstance.post(_url, params);
}

export function approveSingleCoupon(data) {
  let {params, url, method} = data;
  params.checksum = md5(`${Env_Config.API_GATEWAY_API_KEY}:${Env_Config.API_GATEWAY_SALT_KEY}:${params.requester_empcode}`)
  params.api_key = `${Env_Config.API_GATEWAY_API_KEY}`;
  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  if(method === 'POST'){
    return axiosInstance.post(url, params);
  }
}

export function approveSpecialCoupon(data) {
  let {params, url, method} = data;
  params.checksum = md5(`${Env_Config.API_GATEWAY_API_KEY}:${Env_Config.API_GATEWAY_SALT_KEY}:${params.requester_empcode}`)
  params.api_key = `${Env_Config.API_GATEWAY_API_KEY}`;
  var axiosInstance = axios.create();
  delete axiosInstance.defaults.headers.common['AccessToken'];
  if(method === 'POST'){
    return axiosInstance.post(url, params);
  }
}