import { toast } from "react-hot-toast";
import Env_Config from "../settings";
import md5 from "md5";
import axios from "axios"
var axiosInstance = axios.create();

export const UserOtpVerify = async (params) => {
  
  let {otpVerify, requestStamp, username} = params;
  
    let phone = !username ? phone : ""
    username = !phone ? username : "" 

    let data = {  
			"action": "verify_otp",
			"apikey": Env_Config.API_GATEWAY_API_KEY,
			"username": username,
      "email": "",
      "mobile_number": phone,
			"checksum": getVerifyOtpCheck("verify_otp", phone, username),
			"otp_code": otpVerify,
			"type": "mobile_verification",  
			"request_timestamp": requestStamp,
		};
    let config = {}
		let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/verifyOtp?v=2 `

    var Data = await axiosInstance.post(url, data, config)
    .then(res => {
      let { status, errors, message } = res?.data

      if (status == 1) {
        return res?.data
      }
      else {
         return res?.data
      }
    })
    .catch(err => {
      let message = err?.response?.data?.errors[0]?.message
      toast.error(message);
    })

  return Data;
}


const getVerifyOtpCheck = (action, phone, username) => {
  username = !phone ? username : ""
  phone = !username ? phone : ""
  let email = ""
  
  let checksum = md5(`${action}:${username}:${phone}:${email}:${Env_Config.API_GATEWAY_API_KEY}:${Env_Config.API_GATEWAY_SALT_KEY}`)
  
  return checksum
}