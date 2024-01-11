import Env_Config from "../settings";
import axios from "axios";
import CryptoJS from 'crypto-js';
var axiosInstance = axios.create();

export const sendLoopMail = async (params) => {
  let {data} = params
  let action = "send_mail";
  let emSubject = "Payment Reminder";
  let emBody = `hi`;
  let recipientDetails = {
    toList: data,
    ccList: [],
  };
  let checksum = CryptoJS.SHA512(
    `${action}:${Env_Config.API_GATEWAY_KEY}:${emSubject}:${Env_Config.API_GATEWAY_SALT}`
  ).toString();

  let mailObj = {
    action,
    apikey: Env_Config.API_GATEWAY_KEY,
    checksum,
    emSubject,
    recipientDetails,
    emBody,
    type: "direct",
    directFlag: true,
  };
  let config = {};
  let _url = `${Env_Config.API_GATEWAY_URL}/communication-service/communication/sendMail`;

  var Data = await axiosInstance
  .post(_url, mailObj, config)
  .then((res) => {
    return res?.data;
  })
  .catch((err) => {
    console.error(err);
  });

return Data;
};