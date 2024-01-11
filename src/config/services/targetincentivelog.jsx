import axios from 'axios';
import { url, endPoint } from '../urls';

export function getLogsList(params) {

    let _url = url.backendHost + endPoint.targetIncentiveLog.getLogsList;

    return axios.get(_url, { params })

}