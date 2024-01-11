import axios from 'axios'
import { url, endPoint } from '../urls'

export function getMenusList(params) {
  let _url = url.backendHost + endPoint.menus.getMenusList
  return axios.get(_url, { params })
}

export function deleteMenu(params) {
  let _url = url.backendHost + endPoint.menus.deleteMenu
  return axios.put(_url, params)
}

export function createMenu(params) {
  let _url = url.backendHost + endPoint.menus.createMenu
  return axios.post(_url, params)
}

export function updateMenu(params) {
  let _url = url.backendHost + endPoint.menus.updateMenu
  return axios.put(_url, params)
}

export function getAllMenus(params) {
  let _url = url.backendHost + endPoint.menus.getAllMenus
  return axios.get(_url, params)
}

export function getAllSideBarMenus(params) {
  let _url = url.backendHost + endPoint.menus.getAllSideBarMenus
  return axios.get(_url, params)
}

export function getAllGroupedMenu(params) {
  let _url = url.backendHost + endPoint.menus.getAllGroupedMenu
  return axios.get(_url, params)
}

export function saveRoleMenuMapping(params) {
  let _url = url.backendHost + endPoint.menus.saveRoleMenuMapping
  return axios.put(_url, params)
}