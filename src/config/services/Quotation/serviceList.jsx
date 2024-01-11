// import { toast } from "react-hot-toast";
// import Env_Config from "../../settings";
// import axios from "axios";
// import { getUserData } from "../../../helper/randomFunction/localStorage";
// var axiosInstance = axios.create();

// export const getServiceList = async () => {
//   let data = {
//     uuid: getUserData("loginData")?.uuid,
//     status: [1],
//   };

//   let token = getUserData("loginData")?.access_token;

//   let config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       token: token,
//     },
//   };

//   let url = `${Env_Config.WEBSITE_URL}cognito-login-service/auth/packages/listService`;
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
