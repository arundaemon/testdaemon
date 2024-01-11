
const leadAssignControls = require('../controllers/leadAssignControl');
const customExceptions = require('../responseModels/customExceptions')
const leadControl = require('../controllers/leadControls');
const leadInterestFunctions = require('../functions/leadInterestFunctions');
const leadStageStatusControls = require('../controllers/leadStageStatusControls');
const bdeActivityControls = require('../controllers/bdeActivitiesControls');
const leadAssignLogFunctions = require('../functions/leadAssignLogFunctions');
const bdeActivityFunctions = require('../functions/bdeActivitiesFunctions');
const Stage = require('../models/stageModel');
const leadStageStatus = require('../models/leadStageStatusModel');

const { createCubeTokenCrm } = require('../config/cubeConnection');

const updateLeadAssign = async (params) => {
  let { tokenPayload, leadsData, roleData, fromLeadInterest } = params

  const isUuidExists = await leadAssignControls.checkUuid(leadsData);

  if (isUuidExists) {
    throw customExceptions.userExists();
  }

  const leadsAssignFinal = leadsData.map(async (item) => {

    let newLeadsObj = {
      ...item,
      assignedTo_assignedOn: new Date(),
      assignedTo_role_id: roleData.role_id,
      assignedTo_role_code: roleData.role_code,
      assignedTo_role_name: roleData.role_name,
      assignedTo_profile_id: roleData.profile_id,
      assignedTo_profile_code: roleData.profile_code,
      assignedTo_profile_name: roleData.profile_name,
    };
   
    let Lead = {}
    let offlineLeadQuery = { mobile: item.mobile, type: "offline", userType: "STUDENT" }
    let offlineLead = await leadAssignControls.findOneByKey(offlineLeadQuery);
    //console.log(offlineLead);
    if (offlineLead) {
      let offlineParams = { mobile: item.mobile, userType: item.userType, uuid: item.leadId, updatedname: item.name }
      //console.log(offlineParams);
      Lead = updateUUID(offlineParams);
    } else {
      Lead = leadAssignControls.updateLeadAssign(newLeadsObj);
    }

    let LeadAssignee = {}

    if (item?.type === 'offline') {
      LeadAssignee = leadControl.updateLeadAssignee(newLeadsObj);
    }

    leadAssignLogFunctions.saveLogs(newLeadsObj)

    return Promise.allSettled([Lead, LeadAssignee])
      .then(result => {
        let [leadResult, leadAssigneeResult] = result;

        return { leadResult, leadAssigneeResult }
      })
      .catch((error) => {
        throw { errorMessage: error }
      })
  })

  return Promise.allSettled(leadsAssignFinal)
    .then(result => {
      return { result, message: 'Leads Assigned Successfully.' }
    })
    .catch((error) => {
      throw error
    })
}

const assignMyLeads = async (params) => {
  let { tokenPayload, leadsData, roleData } = params
  let updateObj = {
    assignedTo_assignedOn: new Date(),
    assignedTo_role_id: roleData.roleID,
    assignedTo_role_name: roleData.roleName,
    assignedTo_userId: roleData.userID,
    assignedTo_userName: roleData?.userName,
    assignedTo_displayName: roleData.displayName,
    assignedTo_profile_name: roleData.profileName
  }
  let leadList = leadsData.map(obj => obj.leadId)
  leadsData.map(async (item) => {
    let newLeadsObj = {
      ...item,
      ...updateObj
    };
    leadAssignLogFunctions.saveLogs(newLeadsObj);
  })

  let query = {

  }
  if (leadList.length > 0) {
    if (leadList.length > 1) {
      query['leadId'] = { $in: leadList }
    } else {
      query['leadId'] = leadList[0]
    }
    return leadAssignControls.leadsTransfer(query, updateObj)
      .then(result => {
        return { result, message: 'Leads Assigned Successfully.' }
      })
      .catch((error) => {
        throw error
      })
  } else {
    return { result: { data: [], message: 'Select Some leads first, to change the Owner' } }
  }




}

const updateMultipleLead = async (params) => {
  let { multipleLeads, users, createdBy, modifiedBy } = params;
  const getLeads = (lead, userId) => {
    let count = 0;
    let arr = [];
    let indexArr = [];
    multipleLeads.some((item, index) => {
      if (item.sourceId === lead.sourceId) {
        count++;
        indexArr.push(index)
        arr.push({
          assignedTo: { userId },
          leadId: item.lead_id,
          createdBy,
          modifiedBy
        });
      }
      if (lead.count === count) {
        return arr;
      }

    });
    multipleLeads = multipleLeads.filter((data, index) => {
      if (!indexArr.includes(index)) {
        return data;
      }
    })
    return arr
  }
  let entries = [];
  users.map(user => {
    user.leads.map(lead => {
      let filterResponse = getLeads(lead, user.userId);
      entries.push(...filterResponse);
    });
  });
  return leadAssignControls.updateMultipleLeads(entries)
    .then(result => {
      return { message: `Lead Assign updated successfully!`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })

}

const updateUUID = async (params) => {
  let { userType, mobile, name, uuid, createdAt, registrationDate } = params
  if (!mobile || !uuid || !userType) {
    throw { errorMessage: 'userType, mobile, name, uuid Are Required' }
  }

  let leadQuery = { userType, mobile, type: "offline" }
  if (params.name) leadQuery.name = params.name;
  let leadOptions = { new: true }

  let leadAssignUpdate = {
    leadId: uuid,
    type: "online",
    registrationDate: !(registrationDate) ? new Date() : registrationDate,
    createdAt: !(createdAt) ? new Date() : createdAt
  }
  if (params.updatedname) leadAssignUpdate.name = params.updatedname

  let leadUpdate = {
    registrationDate: new Date()
  }
  const leadAssignData = await leadAssignControls.findOneByKey(leadQuery);
  const LeadAssignee = leadAssignControls.updateOneByKey(leadQuery, leadAssignUpdate, leadOptions);
  const Lead = leadControl.updateOneByKey(leadQuery, leadUpdate, {});


  return Promise.allSettled([LeadAssignee, Lead])
    .then(res => {
      let [LeadAssigneeResponse, LeadResponse] = res

      /*let LeadInterestQuery = { leadId: LeadResponse?.value?._id }*/
      let LeadInterestQuery = { leadId: leadAssignData?.leadId }
      let LeadInterestUpdate = { leadId: uuid }
      let LeadInterestOptions = { new: true }

      let leadStageStatus = leadStageStatusControls.updateManyByKey(LeadInterestQuery, LeadInterestUpdate, LeadInterestOptions)
      let leadInterest = leadInterestFunctions.updateManyByKey(LeadInterestQuery, LeadInterestUpdate, LeadInterestOptions)
      let bdeActivities = bdeActivityControls.updateManyByKey(LeadInterestQuery, LeadInterestUpdate, LeadInterestOptions)

      return Promise.allSettled([leadStageStatus, leadInterest, LeadAssigneeResponse, LeadResponse, bdeActivities])
    })
    .then(response => {
      return response
    })
}

const updateDndStatus = async (params) => {
  try {
    return leadAssignControls.currentDndStatus(params)
      .then(result => {
        if (result && result.dndStatus === 'activate') {
          throw customExceptions.dndStatusActivated()
        }
        if (result && result.dndStatus === 'de_activate') {
          throw customExceptions.dndStatusDeactivated()
        }
        return leadAssignControls.updateDndStatus(params)
      })
      .then(result => {
        if (result) {
          return { message: "Dnd Status is", result }
        }
        else {
          return { message: "Mobile Number Not Exists" }
        }
      })
      .catch(error => {
        throw error
      })

  }
  catch (err) {
    console.log(err, ":: error inside dnd status function");
  }
}
const getLeadAssignList = async (params) => {
  let LeadAssignList = leadAssignControls.getLeadAssignList(params);
  let TotalCount = 20000//leadAssignControls.getLeadAssignListCount(params);
  return Promise.all([LeadAssignList, TotalCount])
    .then(response => {
      let [result, totalCount] = response
      return { message: 'Lead Assign List', result, totalCount }
    })
}

const getRelatedToList = async (params) => {
  let RelatedToList = leadAssignControls.getRelatedToList(params);
  let TotalCount = leadAssignControls.getRelatedToListCount(params);
  return Promise.all([RelatedToList, TotalCount])
    .then(response => {
      let [result, totalCount] = response
      return { message: 'Related To List', result, totalCount }
    })
}

const updateLead = (params) => {
  //console.log('updateLead',params)
  if (params.leadId) {
    return leadAssignControls.updateOneByKey({ leadId: params.leadId }, params.update, { new: false, upsert: false })
  } else {
    return null
  }
}
const getOnlineLeadDetails = async (params) => {
  let { mobile, tokenPayload } = params;

  const cubeApi = await createCubeTokenCrm();

  const query = {
    "measures": [],
    "order": {
      [`${envConfig.ONLINE_LEADS}.mobile`]: "asc",
    },
    "dimensions": [
      `${envConfig.ONLINE_LEADS}.${envConfig.USER_TYPE}`,
      `${envConfig.ONLINE_LEADS}.mobile`,
      `${envConfig.ONLINE_LEADS}.displayName`,
      `${envConfig.ONLINE_LEADS}.city`,
      `${envConfig.ONLINE_LEADS}.stateName`,
      `${envConfig.ONLINE_LEADS}.uuid`,
    ],
    "timezone": "UTC",
    "timeDimensions": [],
    "filters": [
      {
        "member": `${envConfig.ONLINE_LEADS}.mobile`,
        "operator": "contains",
        "values": [`${mobile}`]
      }
    ],
    "renewQuery": true
  }

  const cubeResponse = await cubeApi.load(query);

  if (cubeResponse?.loadResponses[0]?.data.length !== 0) {
    let leadId = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.uuid`];
    let name = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.displayName`];
    let email = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.email`];
    let userType = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.${envConfig.USER_TYPE}`];
    let city = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.city`];
    let state = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.stateName`];
    let assignedTo_role_name = tokenPayload.crm_role;
    let assignedTo_profile_name = tokenPayload.crm_profile;
    let assignedTo_displayName = tokenPayload.name;

    const leadInLeadAssign = await leadAssignControls.checkLeadAssign({ mobile });

    if (leadInLeadAssign !== null) {
      const saveLead = await leadAssignControls.updateLeadAssign({ leadId, name, email, userType, city, state, assignedTo_role_name, assignedTo_profile_name, assignedTo_displayName })
      return { message: 'Lead saved successfully', result: saveLead }
    } else {
      return { message: 'Lead exist in CRM DB' }
    }

  } else {
    return { message: 'Lead not exists in website db' }
  }

}

//to change the stage and status of lead using refurbish option
const refurbishLeads = async (params) => {
  try{
  let {leads} = params;
  let stageName = leads[0].stageName;
  const result = await Stage.findOne({stageName}).populate({path: 'cycleId', select: 'cycleName', populate: { path: 'journeyId', select: 'journeyName' }});  
  
  
  const leadsFinal = leads.map(async (item) => {
    let leadObj = {
      leadAssignId: item?._id,
      leadId: item?.leadId,
      name: item?.name,
      mobile: item?.mobile,
      email: item?.email ?? "",
      state: item?.state ?? "",
      city: item?.city ?? "",
      journeyName: result?.cycleId?.journeyId?.journeyName ?? "",
      cycleName: result?.cycleId?.cycleName,
      stageName: item?.stageName,
      statusName: item?.statusName,
      sourceName: item?.sourceName ?? "",
      subSourceName: item?.subSourceName ?? "",
      dnd: item?.dndStatus === 'activate' ? true : false,
      registrationDateTime: item?.registrationDate ?? "",
    }

    const leadStageStatusEntry = leadStageStatus.create(leadObj);
    const leadAssignUpdate = leadAssignControls.refurbishLeads(leadObj);
    const updateActivities = bdeActivityControls.updateActivityRefurbish(leadObj);

    return Promise.allSettled([leadStageStatusEntry, leadAssignUpdate, updateActivities])
    .then(result => {
      let [leadStageStatusResult, leadAssigneeResult, bdeActivityResult] = result;

      return { leadStageStatusResult, leadAssigneeResult, bdeActivityResult }
    })
    .catch((error) => {
      throw { errorMessage: error }
    })
  })
  return Promise.allSettled(leadsFinal)
    .then(result => {
      return { result, message: 'Leads Refurbished Successfully.' }
    })
    .catch((error) => {
      throw error
    })
  }
  catch(err){
    console.log(err,'..........error inside lead assign function refurbish leads');
  }

}



module.exports = {
  updateLeadAssign,
  updateMultipleLead,
  assignMyLeads,
  updateUUID,
  updateDndStatus,
  getLeadAssignList,
  getRelatedToList,
  updateLead,
  getOnlineLeadDetails,
  refurbishLeads
}