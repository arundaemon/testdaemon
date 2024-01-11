import { toast } from "react-hot-toast";
import Env_Config from "../settings";
import md5 from "md5";
import axios from "axios";
var axiosInstance = axios.create();

export const isUserRegister = async (phone, isdCode, userType) => {
  let entity_name = "mobile";
  let userName = phone;
  let action = "cognito_is_user_register";
  let entity_value = `+${isdCode}-${userName}`;
  let data = {
    action: action,
    apikey: Env_Config.WEBSITE_API_KEY,
    entity_name: entity_name,
    entity_value: entity_value,
    //role_type: userType,
    checksum: getIsUserExist(action, entity_value),
  };
  if (userType) {
    data["role_type"] = userType;
  }
  let config = {};
  let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/isUsernameRegister`;

  var Data = await axiosInstance
    .post(url, data, config)
    .then((res) => {
      return res?.data;
    })
    .catch((err) => {
      console.log(err?.response?.data, "test user exist error");
    });

  return Data;
};

const getIsUserExist = (action, phone) => {
  let checksum = md5(
    `${action}:${Env_Config.WEBSITE_API_KEY}:${phone}:${Env_Config.WEBSITE_SALT_KEY}`
  );

  return checksum;
};
