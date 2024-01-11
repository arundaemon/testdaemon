import moment from "moment";
import _ from "lodash";
import { getLoginUserData } from "../randomFunction";
import settings from "../../config/settings";
import { isUserRegister } from "../../config/services/isUserExist";
import { getUserOnlineLead } from "../DataSetFunction";
import { updateUUID } from "../../config/services/leadassign";

export const getCreatedData = (createdOn,leadObj) => {
    let date;
    date = moment(createdOn) > moment(leadObj?.createDate) ? moment(leadObj?.createDate) : moment(createdOn)
    return date
}

export const redirectPage = (leadObj) => {
    const loginUserData = getLoginUserData()

    let encodeUrl = btoa(`${loginUserData?.userData?.employee_code}!==!${leadObj?.leadId}`);
    let url = `${settings.OMS_API_URL}/orderpunch/${encodeUrl}`;
    return { url }
}

export const isUserExist = async (leadObj) => {

    let { actualMobile, mobile, userType } = leadObj
    let isdCode = "91"
    let phone = actualMobile ? actualMobile : mobile
    const data = await isUserRegister(phone, isdCode, userType)
    return data
}

export const isUserOnlineLeads = async (leadObj) => {
    let { mobile, actualMobile, userType } = leadObj;
    mobile = mobile ? mobile?.slice(-10) : actualMobile?.slice(-10)
    let params = {
        mobile: mobile,
        userType: userType,
        name: leadObj?.name
    }
    const isUser = await getUserOnlineLead(params)
    return isUser?.loadResponses?.[0]
}

export const isUpadeUUId = async (uuid, leadObj) => {
    let { mobile, name, userType } = leadObj;
    let params = {
        "userType": leadObj?.userType,
        "mobile": leadObj?.actualMobile,
        "uuid": uuid,
        "name": leadObj?.name
    }
    var Data = await updateUUID(params).then((res) => {
        return res
    })
        .catch(err => {
            console.log(err?.response)
        })

    return Data;
}

export const mergeStepperList = (cubeStepperList, crmStepperList) => {
    let mergeStepperList = _.merge(cubeStepperList, crmStepperList)
    return mergeStepperList;
}