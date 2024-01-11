import axios from 'axios'
import { url, endPoint } from '../urls'

export function getActivityFormNumber(params) {
    //console.log("activity forn number called")
    let _url = `${url.backendHost}${endPoint.activityFormMappings.getActivityFormNumber}`
    return axios.get(_url, { params })
}

export function getFormToActivity(params) {
    let _url = `${url.backendHost}${endPoint.activityFormMappings.getFormToActivity}`
    return axios.get(_url, { params })
}

export function getActivityToActivity(params) {
    let _url = `${url.backendHost}${endPoint.activityFormMappings.getActivityToActivity}`
    return axios.get(_url, { params })
}

export function createActivityFormMapping(params) {
    let _url = url.backendHost + endPoint.activityFormMappings.createActivityFormMapping;
    return axios.post(_url, params)
}

export function createFormMappingProductArray(params) {
    let _url = url.backendHost + endPoint.activityFormMappings.createFormMappingProductArray;
    return axios.post(_url, params)
}


export function getActivityFormMappingList(params) {

    let _url = url.backendHost + endPoint.activityFormMappings.getActivityFormMappingList;

    return axios.get(_url, { params })

}

export function updateActivityFormMapping(params) {
    let _url = url.backendHost + endPoint.activityFormMappings.updateActivityFormMapping;
    return axios.put(_url, params)
}

export function deleteActivityFormMapping(params) {
    let _url = url.backendHost + endPoint.activityFormMappings.deleteActivityFormMapping;
    return axios.put(_url, params)
}

export function PrintName() {
    console.log("hellooooooooo")
}

export function getDependentFields(params) {
    let _url = url.backendHost + endPoint.activityFormMappings.getDependentFields;
    return axios.post(_url, params)

}

export function getActivityMappingDetails(params) {
    let _url = `${url.backendHost}${endPoint.activityFormMappings.getActivityMappingDetails}`
    return axios.get(_url, { params })
}

export function getDetails(params) {
    let _url = `${url.backendHost}${endPoint.activityFormMappings.getDetails}`
    return axios.post(_url, params)
}