import axios from 'axios'
import { url, endPoint } from '../urls'


export function getRuleList(params) {
  let _url = url.backendHost + endPoint.rule.getRuleList
  return axios.get(_url, { params })
}

export function deleteRule(params) {
  let _url = url.backendHost + endPoint.rule.deleteRule
  return axios.put(_url, params)
}

export function createRule(params) {
  let _url = url.backendHost + endPoint.rule.createRule
  return axios.post(_url, params)
}

export function updateRule(params) {
  let _url = url.backendHost + endPoint.rule.updateRule
  return axios.put(_url, params)
}

export function getRuleDetails(params) {
  let _url = url.backendHost + endPoint.rule.getRuleDetails
  return axios.get(_url, { params })
}

export function getRulesByRole(params) {
  let _url = url.backendHost + endPoint.rule.getRulesByRole
  return axios.get(_url, { params })
}