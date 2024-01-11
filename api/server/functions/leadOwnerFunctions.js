const leadOwnerControls = require('../controllers/leadOwnerControls')
const leadInterestControls = require('../controllers/leadInterestControls');
const schoolControls = require('../controllers/schoolControls');
const bdeActivitiesControls = require('../controllers/bdeActivitiesControls');
const leadOwnerLogsControls = require('../controllers/leadOwnerLogsControls');

const changeLeadOwner = async (params) => {

  let leadIdArray = params.leadId
  let updateObj = {
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

  let leadOwner = leadOwnerControls.updateLeadOwner(leadIdArray, updateObj)

  let leadInterest = leadInterestControls.updateLeadInterestOwner(leadIdArray, updateObj);

  let updateSchool = schoolControls.updateSchoolOwner(leadIdArray, updateObj);

  bdeActivitiesControls.transferActivitiesBySchool({leadIdArray, updateObj});


  return Promise.allSettled([leadOwner, leadInterest, updateSchool])
    .then(result => {
      let response = {
        statusCode: 1,
        data: result

      };

      return response;


    })
    .catch((error) => {
      throw { errorMessage: error }
    })


}

const changeLeadInterestOwner = async (params) => {

  const changeOwnerFinal = params.map(param => {
    let leadId = param.leadId
    let updateObj = {
      assignedTo_role_id: param?.role_id,
      assignedTo_role_code: param?.role_code,
      assignedTo_role_name: param?.role_name,
      assignedTo_userId: param?.userID,
      assignedTo_userName: param?.userName,
      assignedTo_displayName: param?.displayName,
      assignedTo_profile_id: param?.profile_id,
      assignedTo_profile_code: param?.profile_code,
      assignedTo_profile_name: param?.profile_name,
      assignedTo_assignedOn: new Date(),
    }

    let leadOwner = leadOwnerControls.updateLeadInterestOwner({ leadInterestId: leadId }, updateObj)

    let leadInterest = leadInterestControls.updateSingleLeadInterestOwner({ leadId: leadId }, updateObj);

    let updateActivity = bdeActivitiesControls.transferActivitiesByInterest({ leadId, updateObj });


    return Promise.allSettled([leadOwner, leadInterest])
      .then(result => {
        return result;

      })
      .catch((error) => {
        throw { errorMessage: error }
      })
  })


  return Promise.allSettled(changeOwnerFinal)
    .then(result => {

      let response = {
        statusCode: 1,
        message: 'Leads Assigned Successfully.',
        data: result

      };
      return response;
    })
    .catch((error) => {
      throw error
    })
}


module.exports = {
  changeLeadOwner,
  changeLeadInterestOwner,
}