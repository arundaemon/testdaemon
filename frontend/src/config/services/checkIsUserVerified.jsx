import { toast } from "react-hot-toast"
import Env_Config from "../settings"
import md5 from "md5"
import axios from "axios"
import { getUserData } from "../../helper/randomFunction/localStorage";
var axiosInstance = axios.create();

export const checkIsUserVerified = async (leadId) => {
 
  let action = "get_user_info_by_uuid"
  
  let checkSumParams = {
     action : "get_user_info_by_uuid",
     apiKey : Env_Config.API_GATEWAY_API_KEY,
     saltKey : Env_Config.API_GATEWAY_SALT_KEY,
     uuid : leadId
  }
  let checkSum = getOtpCheckSum(checkSumParams)
  
  let data = {
    "action": action,
    "checksum": checkSum,
    "uuid": leadId, 
    "apikey": Env_Config.API_GATEWAY_API_KEY
  }

  let token = getUserData('loginData')?.access_token;

  let config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'token': token
    }
  }
  let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/getUserInfoByUuid`
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
  let {action,uuid,apiKey,saltKey} = checkSumParams
  let checksum = md5(`${action}:${apiKey}:${uuid}:${saltKey}`)
  return checksum
}