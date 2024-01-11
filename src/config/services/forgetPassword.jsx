import { toast } from "react-hot-toast";
import Env_Config from "../settings";
import md5 from "md5";
import axios from "axios"
import { getUserData } from "../../helper/randomFunction/localStorage";
var axiosInstance = axios.create();

export const ForgetPassword = async () => {
  
	let username = getUserData('userData')?.username
	let data = {
		"action": "cognito_forgot_password",
		"apikey": Env_Config.WEBSITE_API_KEY,
		"checksum": getChecksum("cognito_forgot_password", username),
		"username": username,
		"otp_via": 'sms',
		"app_hash": "73hf874",
	};
    let config = {}
		let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/forgotPassword`

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


const getChecksum = (action, username) => {
	let checksum = md5(
		action +
		":" +
		Env_Config.WEBSITE_API_KEY +
		":" +
		username +
		":" +
		Env_Config.WEBSITE_SALT_KEY
	);
	return checksum
}