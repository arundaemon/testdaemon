// import { toast } from "react-hot-toast";
// import Env_Config from "../../settings";
// import md5 from "md5";
// import axios from "axios";
// import { getUserData } from "../../../helper/randomFunction/localStorage";
// var axiosInstance = axios.create();

// export const getMatrixList = async (params) => {
//   let { status } = params;

//   let data = {
//     uuid: getUserData("loginData")?.uuid,
//     status: status,
//   };

//   let token = getUserData('loginData')?.access_token;

//   let config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       token: token
//     },
//   };

//   let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/packages/listPricingMatrix`;
//   var Data = await axios
//     .post(url, data, config)
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       console.error(err?.response);
//     });

//   return Data;
// };
