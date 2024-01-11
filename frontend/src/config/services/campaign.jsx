import axios from 'axios';
import { url, endPoint } from '../urls';

export function createCampaign(params) {
    let _url = url.backendHost + endPoint.campaign.createCampaign;
    return axios.post(_url, params)
}

export function getCampaignList(params) {

    let _url = url.backendHost + endPoint.campaign.getCampaignList;

    return axios.get(_url,  {params} )

}

export async function getCampaignDetails(campaignId) {
    let _url = `${url.backendHost}${endPoint.campaign.getCampaignDetails}/${campaignId}` 
    return await axios.get(_url)
}


export function updateCampaign(params) {
    let _url = url.backendHost + endPoint.campaign.updateCampaign
    return axios.put(_url, params)
  }