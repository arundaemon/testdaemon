import axios from 'axios';
import { url,endPoint } from '../urls';

export async function getHierachyDetails(params) {
    let _url = url.backendHost + endPoint.hierachyDetails.getHierachyDetails;
    const result = await axios.get(_url, { params });
    return result;
}