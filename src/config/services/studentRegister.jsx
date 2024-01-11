import { toast } from "react-hot-toast"
import Env_Config from "../settings"
import md5 from "md5"
import axios from "axios"
import { USER_TYPE } from "../../constants/general";
var axiosInstance = axios.create();

export const RegisterUser = async (params) => {
  let {name,leadId,email,mobile,countryCode, city, state, username, registerType, is_sibling, referredBy,userType } = params;

  let type = USER_TYPE.find(obj => obj.label.toUpperCase() == userType.toUpperCase())
  let customerType = type?type.id:1
  leadId = leadId ? leadId?.replace(/[^a-zA-Z0-9 ]/g, '') : username;
  //customerType = customerType ? customerType : registerType;
  mobile = mobile?.slice(-10)
  name = name?.replace(/[^a-zA-Z ]/g, '')

  let action = "register_user"
  let apiKey = Env_Config.API_GATEWAY_API_KEY
  let saltKey = Env_Config.API_GATEWAY_SALT_KEY
  let checkSum = getOtpCheckSum(action, leadId, apiKey, saltKey)
  
  let data =  {

    "action" : action,
    "apikey" : apiKey,
    "checksum" : checkSum,
    
    "register_details": { 
      "name": name,
      "username": leadId,
      "mobile_no": mobile,
      "password": "",
      "city_code": "",
      "state_code": "",
      "country_code": "91",
      "city": city,
      "country": "INDIA",
      "country_id": "",
      "state": state,
      "postal_code": "",
      "location_source": "",
      "user_type": customerType,
      "is_sibling": is_sibling,
      "latitude": "",
      "longitude": "",
      "device_id": "",
      "source": "CRM",
      "operating_system_version": "",
      "app_version": "",
      "app_name": "",
      "from_page": "",
      "page_url": "",
      "app_hash" : "",
      "tnc_accepted":"0",
      "lead_source": "Reference",
      "lead_sub_source": referredBy == "employee" ? "Employee_Reference" : "Customer_Reference"
      }, 
      "referrer": { 
        "adjust_reftag": "",       
        "forwarded_params": [ 
          { 
          "adjust_device_id": "" 
          } 
        ], 
        "click_time": 0, 
        "install_time": 0, 
        "utm_source": "", 
        "utm_term": "", 
        "utm_campaign": "", 
        "utm_medium": "" 
      }, 
      "platform": 1 
  }

  let config = {}
  let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/registerUser?v=2`
  
  var Data = await axiosInstance.post(url,data,config)
    .then(res => {
        const {status, errors, message } = res?.data
        if (status == 1) {
          return res?.data
        }
        else {
          // toast.error(message)
          return res?.data
        }
      }).catch(err => {
        console.log(err?.response, "test message in without array")
        let message = err?.response?.data?.errors[0]?.message
        toast.error(message);
    }) 

  return Data;
  
}


const getOtpCheckSum = (action,user_Id,apikey, saltKey) => {
   
  let checksum = md5(`${action}:${user_Id}:${apikey}:${saltKey}`)

  return checksum
}