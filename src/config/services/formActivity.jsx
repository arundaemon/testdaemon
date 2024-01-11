import axios from 'axios';
import { url, endPoint } from '../urls';

export function submitActivityForm(params) {
    let _url = url.backendHost + endPoint.activityForm.submitActivityForm
    return axios.post(_url, params)
  }
  