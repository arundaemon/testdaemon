import axios from 'axios';
import { url, endPoint } from '../urls';

export function leadassign(params) {
    let _url = url.backendHost + endPoint.leadassign.updateLead;
    return axios.put(_url, params)
}

export function assignMyLeads(params) {
    let _url = url.backendHost + endPoint.leadassign.assignMyLeads;
    return axios.put(_url, params)
}

export function updateUUID(params) {
    let _url = url.backendHost + endPoint.leadassign.updateUUID;
    return axios.post(_url, params)
}

export function updateDndStatus(params) {
    let _url = url.backendHost + endPoint.leadassign.updateDndStatus;
    return axios.put(_url,  params )
}

export function getLeadAssignList(params) {
    let _url = url.backendHost + endPoint.leadassign.getLeadAssignList;
    return axios.post(_url, params)
}

export function getAlternateContacts(params){
    let _url = url.backendHost + endPoint.alternateContacts.getAlternateContacts
    return axios.get(_url, { params })
}

export function leadRelatedTo(params) {
    let _url = url.backendHost + endPoint.leadassign.getRelatedToList
    return axios.get(_url)
}

export function refurbishLeads(params) {
    let _url = url.backendHost + endPoint.leadassign.refurbishLeads
    return axios.put(_url,  params )
}
export function changeleadowner(params) {
    let _url = url.backendHost + endPoint.leadassign.changeleadowner
    return axios.put(_url,  params )
}

export function changeleadInterestowner(params) {
    let _url = url.backendHost + endPoint.leadassign.changeleadInterestowner
    return axios.put(_url, params)
  }

  export function assignedEngineer(params) {
    let _url = url.backendHost + endPoint.impForm.assignedEngineer
    return axios.put(_url, params)
  }


