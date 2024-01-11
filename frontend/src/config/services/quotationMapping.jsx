import axios from 'axios'
import { url, endPoint } from '../urls'


export function productsList() {
    let _url = url.backendHost + endPoint.claimMaster.getAllProductList
    return axios.get(_url)
}

export function productFields(id) {
    let _url = `${url.backendHost}${endPoint.activityFormMappings.getHotsField}?productCode=${id}`
    return axios.get(_url)
}

export function createQuotationMapper(params) {
    let _url = url.backendHost + endPoint.quotationConfig.createQuotationConfig
    return axios.post(_url, params)
}

export function fetchQuotationList() {
    let _url = url.backendHost + endPoint.quotationConfig.getQuotationConfigList
    return axios.get(_url)
}

export function updateQuotationMapper(params) {
    let _url = url.backendHost + endPoint.quotationConfig.updateQuotationConfig
    return axios.put(_url, params)
}

export function fetchSingleQuotation(searchParam) {
    let _url =`${url.backendHost + endPoint.quotationConfig.getQuotationConfigList}?search=${searchParam}`
    return axios.get(_url)
}

export function fetchQuotationDetails(quotationCode) {
    let _url = `${url.backendHost + endPoint.quotationConfig.getQuotationDetails}/${quotationCode}`
    return axios.get(_url)
}

export function fetchQuotationListDetails(params) {
    let _url = url.backendHost + endPoint.quotationConfig.getQuotationListDetail
    return axios.get(_url, { params })
}