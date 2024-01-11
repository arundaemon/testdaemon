import axios from 'axios';
import { url, endPoint } from '../urls';

export function createCycle(params) {
    let _url = url.backendHost + endPoint.cycles.createCycle;
    return axios.post(_url, params)
}

export function updateCycle(params) {
    let _url = url.backendHost + endPoint.cycles.updateCycle;
    return axios.put(_url, params)
}

export function mapCyclesWithJourney(params) {
    let _url = url.backendHost + endPoint.cycles.mapCyclesWithJourney;
    return axios.put(_url, params)
}

export function unMapAvailableCycle(params) {
    let _url = url.backendHost + endPoint.cycles.unMapAvailableCycle;
    return axios.put(_url, params)
}



export async function getCyclesList(params) {
    let _url = url.backendHost + endPoint.cycles.getCyclesList;
    const result = await axios.get(_url, { params });
    return result;
}

export function deleteCycle(params) {
    let _url = url.backendHost + endPoint.cycles.deleteCycle;
    return axios.put(_url, params)
}

export function getAllCycles(params) {
    let _url = url.backendHost + endPoint.cycles.getAllCycles
    return axios.get(_url, { params })
}

export async function cycleDetails(cycleId) {
    let _url = `${url.backendHost}${endPoint.cycles.cycleDetails}/${cycleId}`
    return await axios.get(_url)
}


export async function isDuplicateCycle(params) {
    let _url = url.backendHost + endPoint.cycles.isDuplicateCycle;
    return axios.get(_url, { params })
}

export async function changeStatus(params) {
    let _url = url.backendHost + endPoint.cycles.changeStatus;
    return axios.put(_url, params)
}

export async function getAllCycleNames(params) {
    let _url = url.backendHost + endPoint.cycles.getAllCycleNames;
    return axios.get(_url, { params })
}

