import { combineReducers } from "redux";
import LoginReducers from "./LoginReducers";
import message from "./message";

export default combineReducers({ LoginReducers, message })