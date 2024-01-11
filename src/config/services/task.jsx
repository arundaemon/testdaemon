import axios from 'axios';
import { url, endPoint } from '../urls';

export function  createTask(params) {
    let _url = url.backendHost + endPoint.task.createTask;
    return axios.post(_url, params)
}
export function changeStatus(params) {
    let _url = url.backendHost + endPoint.task.changeStatus;
    return axios.put(_url, params)
}

export function  getTaskList(params) {
    let _url = url.backendHost + endPoint.task.getTaskList;
    return axios.get(_url, {params})
}

export function  getTask(params) {
    let _url = url.backendHost + endPoint.task.getTask;
    return axios.get(_url, {params})
}

export function  updateTask(params) {
    let _url = url.backendHost + endPoint.task.updateTask;
    return axios.put(_url, params)
}

export function getAllTasks(params) {
    let _url = url.backendHost + endPoint.task.getAllTasks
  
    return axios.get(_url, params)
  }