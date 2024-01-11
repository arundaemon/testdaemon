import axios from 'axios';
import { url, endPoint } from '../urls';

export function getExpenseTypeMapping(params) {

  let _url = url.backendHost + endPoint.claimMaster.getExpenseTypeMapping
  return axios.get(_url, { params })

}

export function createClaimMaster(params) {
  let _url = url.backendHost + endPoint.claimMaster.createClaimMaster;
  return axios.post(_url, params)
}

export function updateClaimMaster(params) {
  let _url = url.backendHost + endPoint.claimMaster.updateClaimMaster
  return axios.put(_url, params)
}

export function deleteClaimMaster(params) {
  let _url = url.backendHost + endPoint.claimMaster.deleteClaimMaster
  return axios.put(_url, params)
}

export async function getClaimMasterDetails(claimId) {
  let _url = `${url.backendHost}${endPoint.claimMaster.getClaimMasterDetails}/${claimId}`
  return await axios.get(_url)
}
export function getClaimMasterList(params) {
  let _url = url.backendHost + endPoint.claimMaster.getClaimMasterList;
  return axios.get(_url, { params })
}


