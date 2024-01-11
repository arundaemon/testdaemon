const Leads = require('../models/leadModel');
const mongoose = require('mongoose');
const LeadAssign = require('../models/leadassignModal');
const utils = require('../utils/utils');
const leadInterestFunctions = require('../functions/leadInterestFunctions');
const leadAssignControls = require('../controllers/leadAssignControl')
const { envConfig } = require('../config/env');
const leadLogFunctions = require('../functions/leadLogFunctions');
const leadJourneyMappingFunctions = require('../functions/leadJourneyMappingFunctions')
const leadAssignLogFunctions = require('../functions/leadAssignLogFunctions');

const uploadLead = async (leadsData, tokenPayload) => {
    //console.log('TOken',tokenPayload)
    try {
        //Leads.insertMany(leadsData);
        if ( leadsData && (leadsData.length !== 0)) {
            //leadInterestFunctions.saveNewLeadInterest(leadsData)
            const leadsFinal = leadsData.map(obj => {
            obj._id = mongoose.Types.ObjectId();
             let leadAssignData = {
                    'class': obj.class,
                    leadId: obj._id,
                    'type': obj.leadType,
                    name: obj.name,
                    mobile: obj.mobile,
                    email: obj.email,
                    board: obj.board,
                    countryCode: obj.countryCode,
                    countryName: obj.countryName,
                    state: obj.state,
                    city: obj.city,
                    school: obj.school,
                    learningProfile: obj.learningProfile,
                    userType: obj.userType,
                    sourceName: obj.sourceName,
                    subSourceName: obj.subSourceName,
                    campaignId: obj.campaignId,
                    modifiedBy: obj.modifiedBy,
                    modifiedBy_Uuid: obj.modifiedBy_Uuid,
                    updatedAt: obj.updatedAt,
                    assignedTo_role_name: tokenPayload.crm_role,
                    assignedTo_profile_name: tokenPayload.crm_profile,
                    assignedTo_displayName: tokenPayload.name,
                    assignedTo_userName: tokenPayload.username,
                    type: 'offline',
                    registrationDate: null
                }
                saveLeadJourney(leadAssignData);
                leadAssignLogFunctions.saveLogs(leadAssignData);
                updateLeadAssignee(leadAssignData);
                leadAssignControls.updateLeadAssign(leadAssignData);           
            })
            leadInterestFunctions.saveNewLeadInterest(leadsData)
        }
        
    } catch (err) {
        console.log(err,"::error inside lead controls upload");
        throw { errorMessage: err }
    }
}

const getLeadsList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, campaignId } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (campaignId) {
        query.campaignId = campaignId
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' }
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }

    if (utils.isEmptyValue(count)) {
        count = 999
    } else {
        count = parseInt(count);
    }

    const result = await Leads.find(query)
        .populate('sourceId')
        // .populate({ path: 'campaignName', select: 'journeyName', options: { sort: [['journeyName', 'asc']] } })
        //.populate({ path: 'campaignId', select: 'campaignName'})
        .populate('campaignId')
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
}

const getLeadListCount = async (params) => {
    let { search, campaignId } = params
    let query = { isDeleted: false }
    if (campaignId) {
        query.campaignId = campaignId;
    }
    if (search) {
        query.name = { $regex: search, $options: 'i' }
    }
    return Leads.countDocuments(query)
}

const updateLeadAssignee = async (params) => {
    try {

        let { leadId, assignedTo_userId, assignedTo_userName, sourceName, subSourceName, assignedTo_assignedOn, assignedTo_role_id, assignedTo_role_code,
            assignedTo_role_name, assignedTo_profile_id, assignedTo_profile_code, assignedTo_profile_name, assignedTo_displayName, type } = params;
        let query = {};
        let options = { new: true, upsert: true };
        let update = {};

        query._id = leadId;

        if (assignedTo_userId) {
            update.assignedTo_userId = assignedTo_userId;
        }
        if (assignedTo_userName) {
            update.assignedTo_userName = assignedTo_userName;
        }
        if (assignedTo_displayName) {
            update.assignedTo_displayName = assignedTo_displayName;
        }
        if (assignedTo_assignedOn) {
            update.assignedTo_assignedOn = assignedTo_assignedOn
        }
        if (assignedTo_role_id) {
            update.assignedTo_role_id = assignedTo_role_id
        }
        if (assignedTo_role_code) {
            update.assignedTo_role_code = assignedTo_role_code
        }
        if (assignedTo_role_name) {
            update.assignedTo_role_name = assignedTo_role_name
        }
        if (assignedTo_profile_id) {
            update.assignedTo_profile_id = assignedTo_profile_id
        }
        if (assignedTo_profile_code) {
            update.assignedTo_profile_code = assignedTo_profile_code
        }
        if (assignedTo_profile_name) {
            update.assignedTo_profile_name = assignedTo_profile_name
        }
        if (type) {
            update.type = type
        }
        if (sourceName) {
            update.sourceName = sourceName
        }
        if (subSourceName) {
            update.subSourceName = subSourceName
        }

        return Leads.findOneAndUpdate(query, update, options);
    } 
    catch (err) {
        throw { errorMessage: err }
    }

}

const getAllLeads = async (params) => {
    let query = { sourceId: params.sourceId };
    // let sort = { name: 1 }
    return Leads.countDocuments(query)
}

const checkLeadInterest = async (item, tokenPayload) => {
    try {
        let {  mobile,userType } = item;
       
        const checkLeadsTable = await LeadAssign.findOne({                          //check if lead exist in crm db 
            mobile: mobile,
            userType: userType
        });     
        
        if (checkLeadsTable && checkLeadsTable.learningProfile) {
            saveLeadJourney(checkLeadsTable)

            checkLeadsTable.leadType = 'offline'


            leadInterestFunctions.checkLeadInterestTable(checkLeadsTable, item, tokenPayload)

            return false
        }
        else {
            return true
        }
    } catch (err) {
        console.log(err, '....err inside lead controls');
        throw { errorMessage: err }

    }
}

const checkDuplicateLead = async (item) => {
    try {
        let { nameLower, mobile, userType } = item;

        const result = await LeadAssign.findOne({  
             mobile, userType
        })

        if (result) {
            return true;

        }
        else {
            return false
        }
    } catch (err) {
        console.log(err, '.....err in check duplicate lead lead controls');
        throw { errorMessage: err }

    }
}

const checkLeadExistInOnlineLeads = async (res, cubeApi, tokenPayload) => { 
    try {
        let { name, nameLower, mobile, sourceName,userType, subSourceName, modifiedBy, modifiedBy_Uuid } = res;      
        //const slicedMobile = mobile.substring(2);
        let cubeLead = {};
        const cubeResponse = await cubeApi.load({
            "measures": [],
            "order": {
                [`${envConfig.ONLINE_LEADS}.${envConfig.USER_TYPE}`]: "asc",
                [`${envConfig.ONLINE_LEADS}.mobile`]: "asc",
            },
            "dimensions": [
                `${envConfig.ONLINE_LEADS}.${envConfig.USER_TYPE}`,
                `${envConfig.ONLINE_LEADS}.mobile`,
                `${envConfig.ONLINE_LEADS}.uuid`,
            ],
            "timezone": "UTC",
            "timeDimensions": [],
            "filters": [
                {
                    "member": `${envConfig.ONLINE_LEADS}.${envConfig.USER_TYPE}`,
                    "operator": "contains",
                    "values": [`${userType}`]
                },
                {
                    "member": `${envConfig.ONLINE_LEADS}.mobile`,
                    "operator": "contains",
                    "values": [`${mobile}`]
                }
            ],
            "renewQuery": true
        })
        
        if (cubeResponse?.loadResponses[0]?.data.length !== 0) {
            cubeLead.leadId = cubeResponse?.loadResponses[0]?.data[0][`${envConfig.ONLINE_LEADS}.uuid`]
            cubeLead.leadType = 'online';
            leadInterestFunctions.checkLeadInterestTable(cubeLead, res, tokenPayload)
            return false;
        }
        return true;
    } catch (err) {
        console.log(err, '...er inside  check lead exist in online leads ..lead control');
        throw { errorMessage: err }

    }


}

const saveLeadJourney = async (leadData) => {
    try{
    let { city, name, mobile, sourceName, subSourceName, assignedTo_role_name, createdAt,updatedAt, leadId } = leadData;
    let leadJourneyData = {}
    leadJourneyData.appDownloadedData= "",
    leadJourneyData.city = city,
    leadJourneyData.createdDate = createdAt || updatedAt,
    leadJourneyData.dnd = false,
    leadJourneyData.leadId = leadId,
    leadJourneyData.leadOwner = assignedTo_role_name,
    leadJourneyData.mobile = mobile,
    leadJourneyData.name = name,
    leadJourneyData.offline = true,
    leadJourneyData.otpVerified = false,
    leadJourneyData.registrationDate = "",
    leadJourneyData.source = sourceName,
    leadJourneyData.subSource = subSourceName
   

    //leadJourneyMappingFunctions.getLeadJourneyDetails(leadJourneyData)
   
   
    }


    
    catch (err){
        console.log(err,'....inside save lead journey err');
        throw { errorMessage: err }
    }
}






const updateOneByKey = async (query, update, options) => {
    return Leads.findOneAndUpdate(query, update, options)
}


module.exports = {
    uploadLead,
    getLeadListCount,
    getLeadsList,
    updateLeadAssignee,
    getAllLeads,
    checkLeadInterest,
    checkDuplicateLead,
    checkLeadExistInOnlineLeads,
    updateOneByKey,
}
