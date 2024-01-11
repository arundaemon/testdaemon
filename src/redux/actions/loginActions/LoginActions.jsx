import { LOGIN_SUCCESS, LOGIN_FAIL, SET_MESSAGE,SET_ROLES_LIST } from "../../constants/LoginConstants";
import { userLogin, getUserInfo } from "../../../config/services/users";


export const login = (username, password) => (dispatch) => {
    let params = { username, password }
    return userLogin(params)
        .then(
            (result) => {
                if(result?.data?.status_code==="0"){
                    throw result
                }

                return dispatch({ type: LOGIN_SUCCESS, payload: { user: result?.data } });
                // return Promise.resolve();
            },
            (error) => {
                const message = (error?.response?.data?.message) || error.message || error.toString();
                dispatch({ type: LOGIN_FAIL });
                dispatch({ type: SET_MESSAGE, payload: message });
                return Promise.reject();
            }
        );
};


export const getUserInfoAction = (username, token) => (dispatch) => {
    let params = { username, token }
    return getUserInfo(params)
        .then(
            (result) => {
                if(result && result.status == 200){
                    if(result?.data?.status_code==="0"){
                        throw result
                    }
                    return dispatch({ type: LOGIN_SUCCESS, payload: { user: result?.data } });
                }else{
                    const message = (result?.errors[0]?.message) || 'OOPS! Something went wrong';
                    dispatch({ type: LOGIN_FAIL });
                    dispatch({ type: SET_MESSAGE, payload: message });
                    return Promise.reject();
                }                
                // return Promise.resolve(); 
            },
            (error) => {
                const message = (error?.response?.data?.message) || error.message || error.toString();
                dispatch({ type: LOGIN_FAIL });
                dispatch({ type: SET_MESSAGE, payload: message });
                return Promise.reject();
            }
        ).catch(
            (error) => {
                console.log(error)
                const message = 'OOPS! Something went wrong';
                dispatch({ type: LOGIN_FAIL });
                dispatch({ type: SET_MESSAGE, payload: message });
                return Promise.reject();
            }
        )
};


