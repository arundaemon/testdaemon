import { DecryptData } from "../../utils/encryptDecrypt";

export const getUserData = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : ""
}

export const setUserData = (params) => {
  let {key, value} = params;
  return localStorage.setItem(key, JSON.stringify(value))
}


export const getEmployeeRoles = (key) => {
  return localStorage.getItem(key)?DecryptData(localStorage.getItem(key)):[]
}

