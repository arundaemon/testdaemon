import axios from 'axios';
import { url, endPoint } from '../urls';

export function createSource(params) {
    let _url = url.backendHost + endPoint.sources.createSource;
    return axios.post(_url, params)
}

export function addSubSource(params) {
    let _url = url.backendHost + endPoint.sources.addSubSource;
    return axios.put(_url, params)
}

export function removeSubSource(params) {
    let _url = url.backendHost + endPoint.sources.removeSubSource;
    return axios.put(_url, params)
}

export function updateSource(params) {
    let _url = url.backendHost + endPoint.sources.updateSource;
    return axios.put(_url, params)
}

export async function getSourceList(params) {
    let _url = url.backendHost + endPoint.sources.getSourceList;
    const result = await axios.get(_url, { params });
    return result;
}

export function deleteSource(params) {
    let _url = url.backendHost + endPoint.sources.deleteSource;
    return axios.put(_url, params)
}

export function getAllSources(params) {
    let _url = url.backendHost + endPoint.sources.getAllSources;
    return axios.get(_url, {params})
}

export function getAllSubSource(id) {
    // let _url = url.backendHost + endPoint.sources.getAllSubSource;
    let _url = `${url.backendHost}${endPoint.sources.getAllSubSource}/${id}`;
    return axios.get(_url)
}



export async function sourceDetails(sourceId, subSourceName) {
    let _url = `${url.backendHost}${endPoint.sources.sourceDetails}/${sourceId}` 
    return await axios.get(_url, { params : {subSourceName } })
}

export async function isDuplicateSource(params) {
    // console.log(params,'...params');
    let _url = url.backendHost + endPoint.sources.isDuplicateSource;
    return  axios.get(_url, { params })
}

export async function changeStatus(params) {
    let _url = url.backendHost + endPoint.sources.changeStatus;
    return axios.put(_url, params)
}

export async function changeSubSourceStatus(params) {
    let _url = url.backendHost + endPoint.sources.changeSubSourceStatus;
    return axios.put(_url, params)
}

export function allSourcesWithLeadCount(params) {

    let _url = url.backendHost + endPoint.sources.allSourcesWithLeadCount;

    return axios.get(_url, { params })

}




