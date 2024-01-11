import axios from 'axios'
import { url, endPoint } from '../urls'

export function getJourneyList(params) {
  let _url = url.backendHost + endPoint.journeys.getJourneyList
  return axios.get(_url, { params })
}

export function deleteJourney(params) {
  let _url = url.backendHost + endPoint.journeys.deleteJourney
  return axios.put(_url, params)
}

export function createJourney(params) {
  let _url = url.backendHost + endPoint.journeys.createJourney
  return axios.post(_url, params)
}

export function updateJourney(params) {
  let _url = url.backendHost + endPoint.journeys.updateJourney
  return axios.put(_url, params)
}


export function getJourney(params) {
  let _url = url.backendHost + endPoint.journeys.getJourney
  return axios.get(_url, { params })
}


export function getAllJourneys(params) {
  let _url = url.backendHost + endPoint.journeys.getAllJourneys

  return axios.get(_url, params)
}

export function changeStatus(params) {
  let _url = url.backendHost + endPoint.journeys.changeStatus
  return axios.put(_url, params)

}

export function getActiveJourneys(params) {
  let _url = url.backendHost + endPoint.journeys.getActiveJourneys

  return axios.get(_url, params)
}

export function getB2BDefaultStageStatus(params) {
  let _url = url.backendHost + endPoint.journeys.getB2BDefaultStageStatus

  return axios.get(_url, params)
}



