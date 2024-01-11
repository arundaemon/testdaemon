import axios from 'axios'
import { url, endPoint } from '../urls'

export function createRoleBasedAttendanceMatrix(params) {
    let _url = url.backendHost + endPoint.roleBasedAttendaceMatrix.createRoleBasedAttendaceMatrix;
    return axios.post(_url, params)
}

export function getRoleBasedAttendanceMatrixById(params) {
    let _url = url.backendHost + endPoint.roleBasedAttendaceMatrix.getRoleBasedAttendanceMatrixList;
    return axios.get(_url, {params})
}

export function updateRoleBasedAttendanceMatrixById(params) {
    let _url = url.backendHost + endPoint.roleBasedAttendaceMatrix.updateRoleBasedAttendanceMatrixList;
    return axios.put(_url, {params})
}