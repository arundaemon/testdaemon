import { createSchool } from "./schoolRegister"
import { getUserData } from "../../helper/randomFunction/localStorage"

export const registerSchool = async (registerData) => {

  let {data, contactDetail} = registerData
  var Data
  let  {
    schoolName,
    board ,
    boardClass,
    schEmailId ,
    institueType,
    competitorName,
    totalStudent,
    totalTeacher,
    associateInstitute,
    schWebsite,
    offeredSubject,
    addMissionfee,
    tutionFee,
    internetImplement,
    country,
    state,  
    zipcode,
    address,
    interestInfo,
    stateCode,
    countryCode,
    city,
    geoTagId,
    latitude,
    longitude,
    gstNumber,
    tanNumber
  } = data


  offeredSubject = offeredSubject?.map(obj => obj?.value)

  let params = {
    "role_name": getUserData('userData')?.crm_role,
    "userName": getUserData('userData')?.username,
    "displayName": getUserData('userData')?.name,
    "profile_name": getUserData('userData')?.crm_profile,
    "schoolName": schoolName,
    "board": board?.label,
    "classes": boardClass,
    "schoolEmailId": schEmailId,
    "typeOfInstitute":institueType?.value,
    "competitorName": competitorName,
    "totalTeacher": parseInt(totalTeacher),
    "totalStudent": parseInt(totalStudent),
    "associateInstitute": associateInstitute,
    "schoolWebsite": [schWebsite],
    "subjectOffered": offeredSubject  ,
    "admissionFee": parseInt(addMissionfee),
    "tutionFee": parseInt(tutionFee),
    "internet": internetImplement,
    "country": country,
    "state": state,
    "stateCode": stateCode,
    "pinCode": zipcode,
    "city": city,
    "address": address,
    "countryCode": countryCode,
    "contactDetails": contactDetail,
    "interestShown": interestInfo, 
    "leadType": "B2B",
    "sourceName": "Reference",
    "subSourceName": "Employee_Reference",
    "geoTagId": geoTagId,
    "latitude": latitude,
    "longitude": longitude,
    "gstNumber": gstNumber,
    "tanNumber": tanNumber
  }
  
  try {
    const res = await createSchool(params)
    Data = res
  }catch(err) {
    console.log(err)
  }

  return Data;
}