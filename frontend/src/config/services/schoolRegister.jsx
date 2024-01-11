import axios from 'axios';
import { url, endPoint } from '../urls';



export function createSchool(params) {
  let _url = url.backendHost + endPoint.school.createSchool;
  return axios.post(_url,  params )
}

export function getSchoolDetail({school_id}) {
  let _url = `${url.backendHost}${endPoint.school.getSchoolDetail}/${school_id}`
  return axios.get(_url)
}

export function getSchoolsByCode(params) {
  let _url = url.backendHost + endPoint.school.getSchoolsByCode;
  return axios.post(_url,  params )
}