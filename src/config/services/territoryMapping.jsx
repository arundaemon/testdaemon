import axios from 'axios';
import { url, endPoint } from '../urls';

export function createTerritory(params) {
  let _url = url.backendHost + endPoint.territory.createTerritory;
  return axios.post(_url, params)
}

export function getTerritoryList(params) {
  let _url = url.backendHost + endPoint.territory.getTerritoryList;
  return axios.get(_url, { params })
}
export function duplicateTerritoryByCity(params) {
  let _url = url.backendHost + endPoint.territory.duplicateTerritoryByCity;
  return axios.get(_url, { params })
}

export function getTerritoryCount() {
  let _url = url.backendHost + endPoint.territory.countTerritory;
  return axios.get(_url, {})
}

export async function getTerritoryDetails(territoryId) {
  let _url = `${url.backendHost}${endPoint.territory.getTerritoryDetails}/${territoryId}`
  return await axios.get(_url)
}

export function updateTerritory(params) {
  let _url = url.backendHost + endPoint.territory.updateTerritory
  return axios.put(_url, params)
}

export function getTerritory(params) {
  let _url = url.backendHost + endPoint.territory.getTerritory;
  return axios.get(_url, { params })
}

export function getTerritoryByCode(params) {
  let _url = url.backendHost + endPoint.territory.getTerritoryByCode;
  return axios.post(_url, params)
}

