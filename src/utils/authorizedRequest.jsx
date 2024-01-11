import axios from "axios";
import toast from 'react-hot-toast';
import { TokenReset } from "../config/services/refreshToken";
import { DecryptData } from "./encryptDecrypt";

const requestInstance = axios.create();
// Configuration can be invoked here before every request we make by axios
// Add a request interceptor



requestInstance.interceptors.request.use(
  (config) => {
    const connection = navigator.onLine;
    if (connection === false) {
      toast.error("No Internet Connection");
      return false;
    }
    const token = JSON.parse(localStorage.getItem("loginData"))?.access_token;
    const authToken = DecryptData(localStorage.getItem('UserToken'))
    //console.log(authToken)
    //const refreshToken = JSON.parse(localStorage.getItem("loginData"))?.refresh_token
    config.headers = { Authorization: `Bearer ${token}`, token, "AccessToken": authToken ?? token };
    return config;
  },
  (error) => {
    toast.error(error);
    return Promise.reject(error);
  }
);
// Add a response interceptor
requestInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status == "401") {
      TokenReset();
    }
    if (error.message === "Network Error") {
      //toast.error(error.message);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default requestInstance;