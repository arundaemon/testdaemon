import axios from 'axios'
import { url, endPoint } from '../urls'

export function getProjectList(params) {
  let _url = url.backendHost + endPoint.project.getProjectList
  return axios.get(_url, { params })
}

export function deleteProject(params) {
  let _url = url.backendHost + endPoint.project.deleteProject
  return axios.put(_url, params)
}

export function createProject(params) {
  let _url = url.backendHost + endPoint.project.createProject
  return axios.post(_url, params)
}

export function updateProject(params) {
  let _url = url.backendHost + endPoint.project.updateProject
  return axios.put(_url, params)
}

export function getAllProjects(params) {
  let _url = url.backendHost + endPoint.project.getAllProjects
  return axios.get(_url, params)
}