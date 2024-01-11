import axios from "axios";
import { getUserData } from "../../../helper/randomFunction/localStorage";
import settings from '../../settings';
import { endPoint } from '../../urls';
var axiosInstance = axios.create();

export const getProductName = async (params) => {
  let { status, masterType } = params;

  let data = {
    uuid: getUserData("loginData")?.uuid,
    master_data_type: masterType,
    status: status,
  };

  let token = getUserData('loginData')?.access_token;

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      token: token
    },
  };

  let url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.packages.masterDataList}`

  var Data = await axios
    .post(url, data, config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err?.response);
    });

  return Data;
};
