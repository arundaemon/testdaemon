import { toast } from "react-hot-toast";
import Env_Config from "../settings";
import md5 from "md5";
import axios from "axios"
var axiosInstance = axios.create();

export const OtpVerification = async (params) => {
    
    let {username, otpVerify, requestStamp}  = params

    let data = {
        action: "verify_otp",
        apikey: Env_Config.API_GATEWAY_API_KEY,
        username: username,
        checksum: getOtpCheckSum("verify_otp", username),
        otp_code: otpVerify,
        type: "mobile_verification",
        request_timestamp: requestStamp,
    };
  
    
    let config = {}
		let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/verifyOtp?v=2`

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


const getOtpCheckSum = (action, username) => {
    let mobile_number = "null"
    let email = "null"

    let checksum = md5(`${action}:${username}:${mobile_number}:${email}:${Env_Config.API_GATEWAY_API_KEY}:${Env_Config.API_GATEWAY_SALT_KEY}`)

    return checksum
}
