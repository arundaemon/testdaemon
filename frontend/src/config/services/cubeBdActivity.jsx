import axios from 'axios';
import { url, endPoint } from '../urls';

export function createCubeBd(params) {
   let _url = url.backendHost + endPoint.cubeBdActivity.createCubeBdActivity;
   return axios.post(_url,  params )
}

export function getCubeBdActivity(params) {
   let _url = url.backendHost + endPoint.cubeBdActivity.getCubeBdActivity;
   return axios.get(_url,  {params} )
}



