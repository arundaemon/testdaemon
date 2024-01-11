import axios from 'axios'
import { url, endPoint } from '../urls'

export function getBannersList(params) {
  let _url = url.backendHost + endPoint.banners.getBannersList
  return axios.get(_url, { params })
}

export function deleteBanner(params) {
  let _url = url.backendHost + endPoint.banners.deleteBanner
  return axios.put(_url, params)
}

export function saveBanner(params) {
  let _url = url.backendHost + endPoint.banners.saveBanner
  return axios.post(_url, params)
}

export function updateBanner(params) {
  let _url = url.backendHost + endPoint.banners.updateBanner
  return axios.put(_url, params)
}

export function getBannerDetails(params) {
  let _url = url.backendHost + endPoint.banners.getBannerDetails
  return axios.get(_url, {params})
}

export function updateBannerStatus(params) {
  let _url = url.backendHost + endPoint.banners.updateBannerStatus
  return axios.put(_url, params)
}

export function getAllActiveBanners(params) {
  let _url = url.backendHost + endPoint.banners.getAllActiveBanners
  return axios.get(_url, { params })
}


