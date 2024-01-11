import axios from 'axios';
import { url, endPoint } from '../urls';

export function leadStageStatusDetails(id) {
    let _url = `${url.backendHost}${endPoint.leadStageStatus.leadStageStatusDetails}/${id}`
    return axios.get(_url)
}
