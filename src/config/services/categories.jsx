import axios from 'axios';
import { url, endPoint } from '../urls';

export async function getCategoryList(params) {
    let _url = url.backendHost + endPoint.categories.getCategoriesList;
    return axios.get(_url, { params });  
}