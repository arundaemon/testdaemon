import axios from "axios";
import { url, endPoint } from "../urls";

export function getAlertNotification(query) {
  let _url = `${
    url.backendHost + endPoint.alertNotification.getAlertNotification
  }?empCode=${query}`;
  return axios.get(_url);
}

export function addAlertNotification(params) {
  let _url =
    url.backendHost + endPoint.alertNotification.createAlertNotification;
  return axios.post(_url, params);
}

export function updateAlertNotificationStatus(params) {
  let _url =
    url.backendHost + endPoint.alertNotification.updateAlertNotificationStatus;
  return axios.get(_url, {params});
}