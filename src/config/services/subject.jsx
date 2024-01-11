import axios from 'axios';
import { url, endPoint } from '../urls';

export async function getSubjectList(params) {
    let _url = url.backendHost + endPoint.subject.getSubjectList;
    return axios.get(_url, { params });  
}

export async function  createSubject(params) {
    let _url = url.backendHost + endPoint.subject.createSubject;
    return axios.post(_url, params)
}

export async function  getAllSubjects(params) {
    let _url = url.backendHost + endPoint.subject.getAllSubjects;
    return axios.get(_url, { params });  
}

export function deleteSubject(params) {
    let _url = url.backendHost + endPoint.subject.deleteSubject;
    return axios.put(_url, params)
}

export function updateSubject(params) {
    let _url = url.backendHost + endPoint.subject.updateSubject;
    return axios.put(_url, params)
}