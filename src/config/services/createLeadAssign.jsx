import { getUserData } from "../../helper/randomFunction/localStorage"
import { leadassign } from "./leadassign"

export const userAddLeadAssign = async (data, user_id) => {

  let {name, city, referredBy,mobile, state, customerName, employeeCode, email} = data
  const params = {
   "leadsData" : [
     {
        "assignedToRoleName" : getUserData('userData')?.crm_role,
        "type" : "online",
        "leadId": user_id,
        "name" : name,
        "state": state,
        "city" : city,
        "mobile": mobile,
        "email": email,
        "userType": "STUDENT",
        "assignedTo_userName": getUserData('userData')?.username,
        "assignedTo_displayName": getUserData('userData')?.name,
        "assignedTo_profile_name":getUserData('userData')?.crm_profile,
        "sourceName": "Reference",
        "registrationDate": new Date(),
        "refrenceEmpName": employeeCode,
        "refrenceCustName": customerName,
        "subSourceName" :referredBy == "employee" ? "Employee_Reference" : "Customer_Reference",
     }
   ],
   "roleData" : {
      "role_name" : getUserData('userData')?.crm_role,
      "display_role_name": getUserData('userData')?.crm_role,
      "profile_name": getUserData('userData')?.crm_profile,
      "display_profile_name": getUserData('userData')?.crm_profile,
      "label" : getUserData('userData')?.crm_role,
      "value" : getUserData('userData')?.crm_role,
      "userName" : getUserData('userData')?.username
   }
  }
  var Data = await leadassign(params).then(res => {
     return res?.result?.[0]?.status
  }).catch(err => {
    return err
  }) 
  return Data;
 }