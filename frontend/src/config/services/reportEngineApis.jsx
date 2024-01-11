import axios from 'axios'
import { url, endPoint } from '../urls'
const ROLE = 'EM_CRM'


var axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
    (response) => {
        if (response?.data?.statusCode) {
            return response?.data?.responseData;
        }
        return response;
    }
)

export function getDataSets(params) {
    let _url = url.reportEngineApiUrl + endPoint.reportEngine.getDataSets
    let role = params && params.role ? params.role : ROLE
    let uuid = params?.uuid

    return getReportEngineToken({ role, uuid })
        .then(resp => {
            if (resp?.data?.token) {
                delete axiosInstance.defaults.headers.common['AccessToken'];
                return axiosInstance.get(_url, { headers: { accessToken: resp?.data?.token } })
            }
            else
                console.error(resp)
        })
}

export function getMeasuresList(params) {
    let _url = url.reportEngineApiUrl + endPoint.reportEngine.getMeasuresList
    let uuid = params?.uuid


    return getReportEngineToken({ role: ROLE, uuid })
        .then(resp => {
            console.log(resp, 'this is resp')
            if (resp?.data?.token) {
                delete axiosInstance.defaults.headers.common['AccessToken'];
                return axiosInstance.get(_url, { params, headers: { accessToken: resp?.data?.token } })
            }
            else
                console.error(resp)
        })
}


export function getReportEngineToken(params) {
    let _url = url.reportEngineApiUrl + endPoint.reportEngine.getReportEngineToken
    return axiosInstance.get(_url, { params })
}

export function getCubeTokenCrm() {
    let params = { role: ROLE }
    let _url = url.reportEngineApiUrl + endPoint.reportEngine.getReportEngineToken
    return axiosInstance.get(_url, { params })
}