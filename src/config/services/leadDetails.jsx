import axios from 'axios';
import { url, endPoint } from '../urls';


export function fetchLeadOwner(params) {
    let _url = url.backendHost + endPoint.leadDetailsById.leadDetails
    return axios.get(_url, { params })
  }