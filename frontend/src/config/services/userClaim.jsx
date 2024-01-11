import axios from 'axios';
import { url, endPoint } from '../urls';


export function getMyClaimList(params) {
  let _url = url.backendHost + endPoint.userClaim.getMyClaimList;
  return axios.post(_url, params)
}

export async function getUserClaimDetails(claimId) {
  let _url = `${url.backendHost}${endPoint.userClaim.getUserClaimDetails}/${claimId}`
  return await axios.get(_url)
}

export function updateUserClaim(params) {
  let _url = url.backendHost + endPoint.userClaim.updateUserClaim
  return axios.put(_url, params)
}

export function createMyClaim(params) {
  let _url = url.backendHost + endPoint.userClaim.createMyClaim;
  return axios.post(_url, params)
}

export function bulkDelete(params) {
  let _url = url.backendHost + endPoint.userClaim.bulkDelete;
  return axios.put(_url, params)
}


export function bulkUpdate(params) {
  let _url = url.backendHost + endPoint.userClaim.bulkUpdate
  return axios.put(_url, params)
}


export function getUserClaimListBySchool(params){
  let _url = url.backendHost + endPoint.userClaim.getUserClaimListBySchool;
  return axios.get(_url, { params })
}
