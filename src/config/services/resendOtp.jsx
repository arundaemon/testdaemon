import Env_Config from "../settings"
import md5 from "md5"
import axios from "axios"
import { getUserData } from "../../helper/randomFunction/localStorage";
var axiosInstance = axios.create();

export const ResendOtpVerify = async (params) => {
  let {username, mobile_number} = params
  mobile_number = mobile_number?.slice(-10)
  let action = "resend_otp"
  
  let checkSumParams = {
     action : "resend_otp",
     apiKey : Env_Config.WEBSITE_API_KEY,
     saltKey : Env_Config.WEBSITE_SALT_KEY,
     username : username
  }
  let checkSum = getOtpCheckSum(checkSumParams)
  
  let data = {
    "action": action,
    "checksum": checkSum,
    "username": username, 
    "mobile_number": mobile_number,
    "apikey": Env_Config.WEBSITE_API_KEY,
    "country_code": 91,
    "country_id" : 99,
    "source" : "CRM",
    "platform": 1,
    "type": "mobile_verification"
  }

  let config = {}
  let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/resendOtp`
  var Data = await axiosInstance.post(url, data, config)
    .then(res => {
      return res?.data;
    }
    )
    .catch(err => {
      console.error(err?.response);
    })
  
  return Data;
}


const getOtpCheckSum = (checkSumParams) => {
  let {action,username,apiKey,saltKey} = checkSumParams
  let checksum = md5(`${action}:${username}:${apiKey}:${saltKey}`)
  return checksum
}