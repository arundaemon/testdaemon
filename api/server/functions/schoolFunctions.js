const schoolControls = require('../controllers/schoolControls');
const schoolLogsControls = require('../controllers/schoolLogsControls')
const schoolInterestControls = require('../controllers/leadInterestControls')
const territoryMappingControls = require('../controllers/territoryMappingControls')
const leadOwnerControls = require('../controllers/leadOwnerControls')
const leadOwnerLogsControls = require('../controllers/leadOwnerLogsControls');
const customExceptions = require('../responseModels/customExceptions');
const mongoose = require('mongoose');
const { response } = require('express');

const createSchool = async (params) => {
  let { interestShown, stateCode, city, geoTagId } = params

  if (!params.geoTagId) {
    let response = {
      statusCode: 0,
      result: {},
      message: 'Geo Tag Id not found'
    }
    return response
  }

  const isDuplicate = await duplicateSchoolFunction(params.geoTagId)

  if (isDuplicate) {
    let response = {
      statusCode: 0,
      result: {},
      message: 'Duplicate School Found'
    }
    return response
  }

  // if (!city) {
  //   let response = {
  //     statusCode: 0,
  //     result: {},
  //     message: 'City not found'
  //   }
  //   return response
  // }

  // else if (!stateCode) {
  //   let response = {
  //     statusCode: 0,
  //     result: {},
  //     message: 'State not found'
  //   }
  //   return response
  // }

  //let { territoryCode, territoryName } = await territoryMappingControls.getTerritoryDetailsByCity(city)

  let schoolData = await schoolControls.countSchoolWithStateCode(stateCode)

  let schoolCodeArray = schoolData?.map(data => data.schoolCode)

  let schoolCount = 0

  for (var i = 0; i < schoolCodeArray.length; i++) {
    var string = schoolCodeArray[i];
    var number = parseInt(string.match(/\d+/)[0]);
    if (schoolCount < number) schoolCount = number

  }

  let code = await handleStateCode(stateCode, schoolCount + 1)
  //let schoolCount = await schoolControls.countSchoolWithStateCode(stateCode)

  //let code = await handleStateCode(stateCode, schoolCount + 1)

  let schoolObj = {
    ...params,
    assignedTo_role_id: params?.role_id,
    assignedTo_role_code: params?.role_code,
    assignedTo_role_name: params?.role_name,
    assignedTo_userId: params?.userID,
    assignedTo_userName: params?.userName,
    assignedTo_displayName: params?.displayName,
    assignedTo_profile_id: params?.profile_id,
    assignedTo_profile_code: params?.profile_code,
    assignedTo_profile_name: params?.profile_name,
    assignedTo_assignedOn: new Date(),
  };

  /* if (territoryCode) {
     schoolObj.territoryCode = territoryCode
   }
   if (territoryName) {
     schoolObj.territoryName = territoryName
   }*/

  schoolObj.schoolCode = code
  let school = await schoolControls.createSchool(schoolObj);

  let leadOwners = [];
  let leadOwnerDetails = {
    leadId: school.leadId,
    leadInterestId: '',
    leadType: params?.leadType,
    ownerType: 'school',
    assignedTo_role_id: params?.role_id,
    assignedTo_role_code: params?.role_code,
    assignedTo_role_name: params?.role_name,
    assignedTo_userId: params?.userID,
    assignedTo_userName: params?.userName,
    assignedTo_displayName: params?.displayName,
    assignedTo_profile_id: params?.profile_id,
    assignedTo_profile_code: params?.profile_code,
    assignedTo_profile_name: params?.profile_name,
    assignedTo_assignedOn: new Date(),
  }
  leadOwners.push(leadOwnerDetails);

  let schoolInterestEntries = interestShown?.map((val) => {
    let interestId = mongoose.Types.ObjectId();
    let interestObj = {
      _id: interestId,
      leadId: interestId,
      schoolId: school.leadId,
      school: school.schoolName,
      schoolCode: school.schoolCode,
      learningProfile: val?.learningProfile,
      learningProfileCode: val?.learningProfileCode,
      learningProfileRefId: val?.learningProfileRefId,
      learningProfileGroupCode: val?.learningProfileGroupCode,
      learningProfileGroupName: val?.learningProfileGroupName,
      leadInterestType: params?.leadType,
      schoolCode: school.schoolCode,
      assignedTo_role_id: params?.role_id,
      assignedTo_role_code: params?.role_code,
      assignedTo_role_name: params?.role_name,
      assignedTo_userId: params?.userID,
      assignedTo_userName: params?.userName,
      assignedTo_displayName: params?.displayName,
      assignedTo_profile_id: params?.profile_id,
      assignedTo_profile_code: params?.profile_code,
      assignedTo_profile_name: params?.profile_name,
      sourceName: params?.sourceName,
      subSourceName: params?.subSourceName,
      assignedTo_assignedOn: new Date(),
    }

    let leadOwnerDetails = {
      leadId: school.leadId,
      leadInterestId: interestId,
      leadType: 'B2B',
      ownerType: 'interest',
      name: val?.learningProfile,
      assignedTo_role_id: params?.role_id,
      assignedTo_role_code: params?.role_code,
      assignedTo_role_name: params?.role_name,
      assignedTo_userId: params?.userID,
      assignedTo_userName: params?.userName,
      assignedTo_displayName: params?.displayName,
      assignedTo_profile_id: params?.profile_id,
      assignedTo_profile_code: params?.profile_code,
      assignedTo_profile_name: params?.profile_name,
      assignedTo_assignedOn: new Date()
    }
    leadOwners.push(leadOwnerDetails);

    return interestObj
  })

  let schoolInterest = await schoolInterestControls.createLeadInterest(schoolInterestEntries)

  let leadOwner = await leadOwnerControls.createManyLeadOwner(leadOwners)

  let leadOwnerLogs = leadOwnerLogsControls.createManyLeadOwnerLogs(leadOwners)

  //let schoolLogs = schoolLogsControls.createSchoolLogs(schoolObj)


  return Promise.allSettled([school, schoolInterest, leadOwner])
    .then(result => {
      let response = {
        statusCode: 1,
        result: result
      }
      return response;
    })
    .catch((error) => {
      throw { errorMessage: error }
    })
}

const duplicateSchoolFunction = async (geoTagId) => {
  const result = await schoolControls.isDuplicateSchool(geoTagId);
  if (result) {
    return true
  }
  return false
}


const handleStateCode = (state, numberOfStateEntries) => {
  numberOfStateEntries = numberOfStateEntries.toString()
  let code = numberOfStateEntries.padStart(4, '0')
  return state + code
}

const getSchoolList = async (params) => {
  return schoolControls.getSchoolList(params)
    .then(response => {
      let result = response
      return { message: 'School List', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getSchoolCodeList = async (params) => {
  return schoolControls.getSchoolCodeList(params)
    .then(response => {
      let result = response;
      if (response && response.length){
        return { message: 'School List', result }
      }
      else return { message: 'No record found', result }
      
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getSchoolDetails = async (id) => {
  let query = { leadId: id }
  return schoolControls.getSchoolDetails(query)
    .then(result => {
      return { message: `School details`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getSchoolBySchoolCode = async (id) => {
  return schoolControls.getSchoolBySchoolCode(id)
    .then(result => {
      return { message: `School details`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getAllSchoolList = async () => {
  return schoolControls.getAllSchoolList()
    .then(response => {
      let result = response
      return { message: 'All School List', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateSchool = async (params) => {
  return schoolControls.updateSchool(params)
    .then(data => {
      return { message: `School updated successfully`, data }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateContactDetails = async (params) => {
  let frontendNumber = params.contactDetails.mobileNumber
  let getSchoolContacts = await schoolControls.getSchoolByLeadId(params.leadId)
  let dbMobileNumbers = getSchoolContacts?.[0]?.contactDetails?.map(num => num.mobileNumber)
  let matchMobileNumber = dbMobileNumbers.includes(frontendNumber)


  if (matchMobileNumber) {
    let response = {
      statusCode: 0,
      result: {},
      message: frontendNumber + 'mobile Number Exist'
    }
    return response
  }

  return schoolControls.updateContactDetails(params.leadId, params.contactDetails)
    .then(data => {
      return { message: `School Contact Details updated successfully`, data }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getBdeActivities = async (params) => {
  let { leadIds } = params

  return schoolControls.getBdeActivities(leadIds)
    .then(result => {
      return { message: `All BDE activities`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getEdcCount = async (params) => {
  return schoolControls.getEdcCount(params)
    .then(result => {
      return { message: `EDC Count`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getBdeActivity = (params) => {
  let leadId = params.leadId
  return schoolControls.getBdeActivity(leadId)
    .then(result => {
      return { message: `Interest Detail`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getSchoolsByCode = async (params) => {
  return schoolControls.getSchoolsByCode(params)
  .then(result => {
    return { message: `School details by school code`, result }
  })
  .catch(error => {
    throw { errorMessage: error }
  })
}


module.exports = {
  createSchool,
  getSchoolList,
  getSchoolDetails,
  getSchoolBySchoolCode,
  getAllSchoolList,
  updateSchool,
  getSchoolCodeList,
  updateContactDetails,
  getBdeActivities,
  getEdcCount,
  getBdeActivity,
  getSchoolsByCode
}