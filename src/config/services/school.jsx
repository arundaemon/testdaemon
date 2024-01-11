import axios from 'axios'
import { url, endPoint } from '../urls'


export function getSchoolList(params) {
  let _url = url.backendHost + endPoint.school.getSchoolList
  return axios.post(_url, params)
}

export function getAllSchoolList(params) {
  let _url = url.backendHost + endPoint.school.getAllSchoolList
  return axios.get(_url, { params })
}

export function updateSchool(params) {
  let _url = url.backendHost + endPoint.school.updateSchool
  return axios.put(_url, params)
}

// export function getProductMasterList(params) {
//   let _url = url.backendHost + endPoint.productMaster.getProductMasterList
//   return axios.get(_url, params)
// }


export function getSchoolCodeList(params) {
  let _url = url.backendHost + endPoint.school.getSchoolCodeList
  return axios.post(_url, params)
}

export function updateContactDetails(params) {
  let _url = url.backendHost + endPoint.school.updateContactDetails
  return axios.put(_url, params)
}

export function getBdeActivities(params) {
  let _url = url.backendHost + endPoint.school.getBdeActivities
  return axios.get(_url, { params })
}

export function getBdeActivity(params) {
  let _url = url.backendHost + endPoint.school.getBdeActivity
  return axios.get(_url, { params })
}

export function getEdcCount(params) {
  let _url = url.backendHost + endPoint.school.getEdcCount
  return axios.get(_url, { params })
}


export function getSchoolBySchoolCode(schoolCode) {
  let _url = `${url.backendHost + endPoint.school.getSchoolBySchoolCode}/${schoolCode}`
  return axios.get(_url)
}


export function getSchoolsByCode(params) {
  let _url = url.backendHost + endPoint.school.getSchoolsByCode
  return axios.post(_url, params)
}



