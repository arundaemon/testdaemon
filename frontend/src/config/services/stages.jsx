import axios from 'axios';
import { url, endPoint } from '../urls';

export function createStage(params) {
    let _url = url.backendHost + endPoint.stages.createStage;
    return axios.post(_url, params)
}

export function updateStage(params) {
    let _url = url.backendHost + endPoint.stages.updateStage;
    return axios.put(_url, params)
}


export function unMapAvailableStage(params) {
    let _url = url.backendHost + endPoint.stages.unMapAvailableStage;
    return axios.put(_url, params)
}


export function mapStagesWithCycle(params) {
    let _url = url.backendHost + endPoint.stages.mapStagesWithCycle;
    return axios.put(_url, params)
}


export async function getStageList(params) {
    let _url = url.backendHost + endPoint.stages.getStageList;
    const result = await axios.get(_url, { params });
    return result;
}

export function deleteStage(params) {
    let _url = url.backendHost + endPoint.stages.deleteStage;
    return axios.put(_url, params)
}

export function getAllStages(params) {
    let _url = url.backendHost + endPoint.stages.getAllStages;
    return axios.get(_url, { params })
}

export async function stageDetails(statusId) {
    let _url = `${url.backendHost}${endPoint.stages.stageDetails}/${statusId}`
    return await axios.get(_url)
}

export async function isDuplicateStage(params) {
    let _url = url.backendHost + endPoint.stages.isDuplicateStage;
    return axios.get(_url, { params })
}

export async function changeStatus(params) {
    let _url = url.backendHost + endPoint.stages.changeStatus;
    return axios.put(_url, params)
}

export async function getStageByKey(params) {
    // console.log(params,'hhwgfdhgd')
    let _url = url.backendHost + endPoint.stages.getStageByKey;
    return axios.get(_url, { params })
}

