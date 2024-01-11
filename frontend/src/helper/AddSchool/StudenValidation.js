import { toast } from "react-hot-toast"

export const StudentValidation = (data) => {


  let isError = {}

  let Data = getDataKey(data)
  
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
    contactInfo,
    interestInfo,
    stateCode,
    countryCode,
    city,
    isValidEmail,
    isWebValidate,
    geoTagId,
    latitude,
    longitude,
    gstNumber,
    tanNumber
  } = Data


  if (schoolName.trim() == "") {
    toast.error("Please Enter School Name")
    isError.attrName = 'schoolName'
    isError.validate = false
    return isError
  }

  else if (!board?.value) {
    toast.error("Please Select Board")
    isError.attrName = 'board'
    isError.validate = false
    return isError
  }
  else if (!(boardClass?.[0]?.value)) {
    toast.error("Please Select Class")
    isError.attrName = 'boardClass'
    isError.validate = false
    return isError
  }

  else if (!isValidEmail) {
    toast.error("Please Enter Valid Email")
      isError.attrName = 'isValidEmail'
      isError.validate = false
      return isError
  }

  else if (!institueType?.value) {
    toast.error("Please Select Institute")
    isError.attrName = 'institueType'
    isError.validate = false
    return isError
  }
  
  else if (!isWebValidate) {
    toast.error("Please Add Valid Website Url")
    isError.attrName = 'isWebValidate'
    isError.validate = false
    return isError
  }

  else if (gstNumber && gstNumber?.length < 15) {
    toast.error("GSTIN Must Be 15 Digit AlphaNumeric")
    isError.attrName = 'gstNumber'
    isError.validate = false
    return isError
  }

  else if (tanNumber && tanNumber?.length < 10) {
    toast.error("TAN Must Be 10 Digit AlphaNumeric")
    isError.attrName = 'gstNumber'
    isError.validate = false
    return isError
  }
 

  else if (country?.trim() == "") {
    toast.error("Please Add Country")
    isError.attrName = 'country'
    isError.validate = false
    return isError
  }
  else if (!state) {
    toast.error("Please Add Country State")
    isError.attrName = 'state'
    isError.validate = false
    return isError
  }
  else if (!city) {
    toast.error("Please Add Country City")
    isError.attrName = 'city'
    isError.validate = false
    return isError
  }
  else if (zipcode?.trim() == "") {
    toast.error("Please Add ZipCode")
    isError.attrName = 'zipcode'
    isError.validate = false
    return isError
  }
  else if (address?.trim() == "") {
    toast.error("Please Add School Address")
    isError.attrName = 'address'
    isError.validate = false
    return isError
  }

  else {
    isError.validate = true
    isError.result = Data
    return isError
  }
}


const getDataKey = (data) => {
  let finalKey = {}

  let {
    schoolName,
    board ,
    boardClass,
    schEmailId ,
    institueType,
    competitorName,
    totalStudent,
    totalTeacher,
    associateInstitute,
    isValidEmail
  } = data?.[0]

  let {
    schWebsite,
    offeredSubject,
    isWebValidate,
    addMissionfee,
    tutionFee,
    internetImplement,
    gstNumber,
    tanNumber
  } = data?.[1]

  let {
    country,
    state,
    zipcode,
    address,
    city,
    stateCode,
    countryCode,
    geoTagId,
    latitude,
    longitude
  } = data?.[2]

  let contactInfo = data?.[3]

  let {interestInfo} = data?.[4]


  finalKey = {
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
    contactInfo,
    interestInfo,
    stateCode,
    countryCode,
    city,
    isValidEmail,
    isWebValidate,
    geoTagId,
    latitude,
    longitude,
    gstNumber,
    tanNumber
  }

   return finalKey
}