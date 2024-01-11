import { toast } from "react-hot-toast"
import Env_Config from "../settings"
import md5 from "md5"
import axios from "axios"
import { getUserData } from "../../helper/randomFunction/localStorage";
var axiosInstance = axios.create();

export const UpdateTnc = async (uuid) => {
  
  let data = {
    "action": "set_meta_data",
    "uuid":uuid,
    "entity_data": [
      {   
      "entity_key": "tnc",
      "entity_value":"0"
      }
    ],
    "refresh_token": getUserData('loginData')?.refresh_token
    }

    let token = getUserData('loginData')?.access_token;

    let config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'token': token
      }
    }
  let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/setUserMetaData`

  var Data = await axiosInstance.post(url, data, config)
    .then(res => {
      // console.log(res, "test response")
      return res?.data
    }
    ).catch(err => {
      console.error(err?.response?.data)
    })
  
  return Data;
}
