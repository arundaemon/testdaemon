import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { TokenReset } from '../config/services/refreshToken';
import { DecryptData } from './encryptDecrypt';

const InterceptReqRes = () => {
  const navigate = useNavigate()

  let authToken = DecryptData(localStorage.getItem('UserToken'))
  if (authToken) {
    //console.log('Access Token',authToken)
    axios.defaults.headers.common['AccessToken'] = authToken;
  }

   
  axios.interceptors.request.use((request) => request)

  axios.interceptors.response.use(
    (response) => {
      if (response?.data?.statusCode) {
        return response?.data?.responseData;
      }

      if (response?.data?.error?.errorCode === 17) {
        //toast('Session Expired, Login Again', { icon: '⚠️' });
        return navigate('/logout')
      }

      return response;
    },
    error => {
      //console.log('Error',error)
      if (error?.response?.status == "401") {
        //toast('Session Expired, Login Again', { icon: '⚠️' });
        return navigate('/logout')
      }
    }
  )
}

export default InterceptReqRes
