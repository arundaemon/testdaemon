import { getUserData } from "../../helper/randomFunction/localStorage"
import { leadInterestCreate } from "./leadInterest"

export const createInterest = async (data) => {

  let {lead_id, board, classData, referredBy, selectedInterest} = data

  let params = {
    "leadId": lead_id,
    "leadType": "online",
    "learningProfile": selectedInterest,
    "school": "",
    "board": board,
    "class": classData,
    "sourceName":"Reference",
    "subSourceName": referredBy == "employee" ? "Employee_Reference" : "Customer_Reference",
    "campaignName": "",
    "campaignId": "",
    "createdBy_Uuid": getUserData('loginData')?.uuid,
    "roleName": getUserData('userData')?.crm_role,
    "profileName": getUserData('userData')?.crm_profile
  }

  var Data = await leadInterestCreate(params).then(res => {
     return res?.result?.status
  }).catch(err => {
     return err
  })
  return Data;
}