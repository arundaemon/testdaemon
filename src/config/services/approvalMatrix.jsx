import axios from 'axios'
import { url, endPoint } from '../urls'



export function createApprovalMatrix(params) {
    let _url = url.backendHost + endPoint.approvalMatrix.createApprovalMatrix
    return axios.post(_url, params)
}

export function getApprovalMatrixList() {
    let _url = url.backendHost + endPoint.approvalMatrix.getApprovalMatrixList
    return axios.get(_url)
}

export function updateApprovalMatrix(params) {
    let _url = url.backendHost + endPoint.approvalMatrix.updateApprovalMatrix
    return axios.put(_url, params)
}

export function getSingleApprovalMatrix(query) {
    let _url = `${url.backendHost}${endPoint.approvalMatrix.getApprovalMatrixList}?${query?.value}`
    return axios.get(_url)
}


export function getApprovalMatrix(params) {
    let _url = url.backendHost + endPoint.approvalMatrix.getApprovalMatrixList
    return axios.get(_url, {params})
}