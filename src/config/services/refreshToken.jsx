import { toast } from "react-hot-toast"
import Env_Config from "../settings"
import md5 from "md5"
import axios from "axios"
import { getUserData, setUserData } from "../../helper/randomFunction/localStorage";
import { sendEventToAppPlatform } from "../../helper/randomFunction/activityData";
var axiosInstance = axios.create();

export const TokenReset = async () => {
 
  let action = "cognito_refresh_token"
  let username = getUserData('userData')?.username
  let refresh_token = getUserData('loginData')?.refresh_token
  let apiKey = Env_Config.API_GATEWAY_API_KEY
  let saltKey = Env_Config.API_GATEWAY_SALT_KEY

  let checkSum = getCheckSum(action,apiKey,username,saltKey)
  
  let data =  {
    "action": action,
    "apikey": apiKey,
    "checksum": checkSum,
    "refresh_token": refresh_token,
    "username": username
  }

  let config = {}
  let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/refreshToken`
  
  var Data = await axiosInstance.post(url,data,config)
    .then(res => {
        if (res?.data?.status_code === "1") {
          return resetLoginData(res?.data);
        }
      }).catch(err => {
        let message = err?.response?.data?.errors[0]?.message
        if (message === "Invalid refresh token" && err?.response?.status === 401) {
          let eventObj = {
            uuid: getUserData('userData').employee_code?? getUserData('userData').lead_id,
            role: getUserData('userData').crm_role,
            login:false
          }
          sendEventToAppPlatform('loginEvent', eventObj)
          localStorage.clear();
          window.location.pathname = "/login"
        }
        else {
          toast.error(message);
        }
    }) 
  return Data;
  
}


const resetLoginData = async (data) => {
  let access_token = data?.access_token;
  let refresh_token = data?.refresh_token
  let loginData = getUserData('loginData');

  Object?.keys(loginData)?.forEach((item, key) => {
    if (item === 'access_token') {
      loginData[item] = access_token
    }
    else if (item === 'refresh_token')
    loginData[refresh_token] = refresh_token
  })

  let params = {
    key : 'loginData',
    value: loginData
  }

  return setUserData(params)
}

const getCheckSum = (action,apikey,username,saltKey) => {
   
  let checksum = md5(`${action}:${apikey}:${username}:${saltKey}`)
 
  return checksum
}