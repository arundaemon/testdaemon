//const { leadAssignCount } = require('../../../frontend/src/helper/DataSetFunction');
const LeadAssign = require('../models/leadassignModal');
const utils = require('../utils/utils');
const moment = require('../../node_modules/moment');
const BdeActivities = require('../models/bdeActivitiesModel');
const config = require('../config')

const findOneByKey = async (query, populate) => {
    return LeadAssign.findOne(query).populate(populate)
}

const updateLeadAssign = async (params) => {
    try {
        let { leadId, name, mobile, email, board, refrenceEmpName, refrenceCustName, boardId, classId, school, schoolCode, pinCode, state,
            stateId, cityId, city, campaignId, stageName, statusName, journeyName, cycleName, sourceId, sourceName, subSourceName, subSourceId, userType, learningProfile, reference, countryCode,
            countryId, countryName, displayName, gender, phone, userPhoto, assignedTo_userId, assignedTo_userName, assignedTo_assignedOn, assignedTo_role_id,
            assignedTo_role_code, assignedTo_role_name, assignedTo_profile_id, assignedTo_profile_code, registrationDate,
            assignedTo_profile_name, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid, status, assignedTo_displayName, type } = params;

        let query = {};
        let update = {};
        let options = { new: true, upsert: true };

        query.leadId = leadId;

        if (leadId) {
            update.leadId = leadId;
        }
        if (name) {
            update.name = name
        }
        if (mobile) {
            update.mobile = mobile
        }
        if (email) {
            update.email = email
        }
        if (board) {
            update.board = board
        }
        if (boardId) {
            update.boardId = boardId
        }
        if (params.class) {
            update.class = params.class
        }
        if (classId) {
            update.classId = classId
        }
        if (school) {
            update.school = school
        }
        if (schoolCode) {
            update.schoolCode = schoolCode
        }
        if (pinCode) {
            update.pinCode = pinCode
        }
        if (state) {
            update.state = state
        }
        if (stateId) {
            update.stateId = stateId
        }
        if (cityId) {
            update.cityId = cityId
        }
        if (city) {
            update.city = city
        }
        if (campaignId) {
            update.campaignId = campaignId
        }
        if (sourceId) {
            update.sourceId = sourceId
        }
        if (subSourceId) {
            update.subSourceId = subSourceId
        }
        if (sourceName) {
            update.sourceName = sourceName
        }
        if (subSourceName) {
            update.subSourceName = subSourceName
        }
        if (stageName) {
            update.stageName = stageName;
        }
        if (statusName) {
            update.statusName = statusName;
        }
        if (cycleName) {
            update.cycleName = cycleName;
        }
        if (journeyName) {
            update.journeyName = journeyName;
        }
        if (userType) {
            update.userType = userType;
        }
        if (learningProfile) {
            update.learningProfile = learningProfile;
        }
        if (reference) {
            update.reference = reference
        }
        if (countryCode) {
            update.countryCode = countryCode
        }
        if (countryName) {
            update.countryName = countryName
        }
        if (countryId) {
            update.countryId = countryId
        }
        if (displayName) {
            update.displayName = displayName
        }
        if (gender) {
            update.gender = gender
        }
        if (phone) {
            update.gender = gender
        }
        if (userPhoto) {
            update.userPhoto = userPhoto
        }
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

        if (createdBy) {
            update.createdBy = createdBy;
        }
        if (modifiedBy) {
            update.modifiedBy = modifiedBy;
        }
        if (createdBy_Uuid) {
            update.createdByUuid = createdBy_Uuid
        }
        if (modifiedBy_Uuid) {
            update.modifiedByUuid = modifiedBy_Uuid
        }
        if (!utils.isEmptyValue(status)) {
            update.status = status;
        }
        if (type) {
            update.type = type
        }
        if (registrationDate) {
            update.registrationDate = registrationDate
        }
        if (refrenceCustName) {
            update.refrenceCustName = refrenceCustName
        }
        if (refrenceEmpName) {
            update.refrenceEmpName = refrenceEmpName
        }
        return LeadAssign.findOneAndUpdate(query, update, options);
    }
    catch (error) {
        throw error
    }
}

const updateMultipleLeads = async (params) => {
    const result = await LeadAssign.insertMany(params);
    return result;
}

const leadsTransfer = async (query, update) => {
    let bdeUpdateObj = {
        createdByRoleName: update.assignedTo_role_name,
        createdByProfileName: update.assignedTo_profile_name,
        createdByName: update.assignedTo_displayName
    }
    let leadUpdate = LeadAssign.updateMany(query, { $set: update })
    let futureActivitUpdate = BdeActivities.updateMany({ ...query, status: ['Pending', 'Init'] }, { $set: bdeUpdateObj })
    return Promise.allSettled([leadUpdate, futureActivitUpdate])
}

const updateOneByKey = async (query, update, options) => {
    return LeadAssign.findOneAndUpdate(query, update, options)
}

const updateDndStatus = async (params) => {
    try {
        //console.log('enter in controllers');
    let { mobile, dndStatus } = params;
    const mobileExist = await LeadAssign.findOne({mobile: { '$regex': mobile }});
    //console.log(mobileExist,'....mobile exist');
    if(mobileExist){
        let update = { dndStatus };
        let query = { mobile: mobileExist.mobile };
        let options = { new: true };
        const updateDnd = await LeadAssign.updateMany( query, update, options )
        return updateDnd;
    }
    }
    catch (err) {
        console.log(err, '... err inside catch control');
    }
}



const currentDndStatus = async (params) => {
    try {
        let { mobile, dndStatus } = params
        const currentDnd = await LeadAssign.findOne({ mobile: { '$regex': mobile }, dndStatus })
        if (currentDnd) {
            return currentDnd;
        }
    }
    catch (err) {
        console.log(err, '... err inside catch control');
    }

}

const getLeadAssignList = async (params) => {
    let { pageNo, itemsPerPage, sortKey, sortOrder, search, childRoleNames, campaignId, refurbishFlag } = params
    let sort = { updatedAt: -1 };
    let hint = { updatedAt: -1 }

    let query = {

    };
    if (campaignId) {
        query.campaignId = campaignId
    }

    if (refurbishFlag){
        query.isRefurbished = true
    }

    if (search) {
        query = {
            ...query,
            mobile: search.length > 9 ? [search, `91${search}`, `+91${search}`] : { $regex: search }
            /* $or: [{ name: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search } },
            { leadId: { $regex: search } }] */
        }
        //hint = {assignedTo_role_name:1,updatedAt:1}
        hint = { mobile: 1 }
    }

    if (childRoleNames && childRoleNames.length > 0) {
        hint = { assignedTo_role_name: 1, updatedAt: 1 }
        if (childRoleNames.length > 1) {
            query.assignedTo_role_name = { $in: childRoleNames }
        } else {
            query.assignedTo_role_name = childRoleNames[0]
        }
    } else {
        //query.updatedAt = { $gt: moment().utc().subtract(100, 'days') }
    }

    if (sortKey && sortOrder) {
        let key = sortKey.split('.')[1]
        sort = { updatedAt: -1, [key]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }

    if (utils.isEmptyValue(itemsPerPage)) {
        itemsPerPage = 999
    } else {
        itemsPerPage = parseInt(itemsPerPage);
    }
    //console.log(query)
    const result = await LeadAssign.find(query)
        .sort(sort).skip(pageNo * itemsPerPage).limit(itemsPerPage).hint(hint).lean()
    //.explain("executionStats")
    //console.log(result)

    result.map(item => {
        item[`${config.cfg.OFFLINE_LEADS}.name`] = item.name,
            item[`${config.cfg.OFFLINE_LEADS}.leadId`] = item.leadId,
            item[`${config.cfg.OFFLINE_LEADS}.city`] = item.city,
            item[`${config.cfg.OFFLINE_LEADS}.assignedToRoleName`] = item.assignedTo_role_name,
            item[`${config.cfg.OFFLINE_LEADS}.assignedToDisplayName`] = item.assignedTo_displayName,
            item[`${config.cfg.OFFLINE_LEADS}.createdAt`] = item.createdAt,
            item[`${config.cfg.OFFLINE_LEADS}.updatedAt`] = item.updatedAt,
            item[`${config.cfg.OFFLINE_LEADS}.Id`] = item._id,
            item[`${config.cfg.OFFLINE_LEADS}.sourceName`] = item.sourceName,
            item[`${config.cfg.OFFLINE_LEADS}.subSourceName`] = item.subSourceName
        item[`${config.cfg.OFFLINE_LEADS}.stageName`] = item.stageName
        item[`${config.cfg.OFFLINE_LEADS}.statusName`] = item.statusName
        item[`${config.cfg.OFFLINE_LEADS}.isRefurbished`] = item.isRefurbished


        return item
    })

    return result;
}

const getLeadAssignListCount = async (params) => {
    let query = {
        //updatedAt: { $gt: moment().utc().subtract(100, 'days') }
    }
    let { search, childRoleNames, campaignId } = params
    if (search) {
        query = {
            ...query,
            mobile: search.length > 9 ? search : { $regex: search }
            /* $or: [{ name: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search } },
            { leadId: { $regex: search } }] */
        }
        //hint = {assignedTo_role_name:1,updatedAt:1}
        hint = { mobile: 1 }
    }
    if (childRoleNames && childRoleNames.length > 0) {
        if (childRoleNames.length > 1) {
            query.assignedTo_role_name = { $in: childRoleNames }
            //query.updatedAt = { $gt: moment().utc().subtract(100, 'days') }
        } else {
            query.assignedTo_role_name = childRoleNames
        }
    } else {
        //query.updatedAt = { $gt: moment().utc().subtract(100, 'days') }
    }
    if (campaignId) {
        query.campaignId = campaignId
    }
    return LeadAssign.countDocuments(query)
}

const getRelatedToList = async (params) => {

    let { pageNo, itemsPerPage, sortKey, sortOrder, search, leadId, mobile } = params
    let sort = { createdAt: -1 };
    let hint = { mobile: 1 }

    let query = {
        mobile: mobile
    };

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    } else {
        sort = { updatedAt: -1 }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }

    if (utils.isEmptyValue(itemsPerPage)) {
        itemsPerPage = 999
    } else {
        itemsPerPage = parseInt(itemsPerPage);
    }

    const result = await LeadAssign.find(query).hint(hint).select('leadId name city state')
        .sort(sort).lean();


    result.map(item => {
        item[`${config.cfg.OFFLINE_LEADS}.name`] = item.name,
            item[`${config.cfg.OFFLINE_LEADS}.leadId`] = item.leadId,
            item[`${config.cfg.OFFLINE_LEADS}.city`] = item.city,
            item[`${config.cfg.OFFLINE_LEADS}.state`] = item.state
    })

    return result;
}

const getRelatedToListCount = async (params) => {
    let { mobile, leadId, sortKey, sortOrder } = params
    let query = {
        mobile: mobile
    };
    let sort = {}
    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    } else {
        sort = { updatedAt: -1 }
    }


    return LeadAssign.countDocuments(query).sort(sort)
}

const checkLeadAssign = async (params) => {
    let { mobile } = params;
    let query = { mobile };

    const result = await LeadAssign.findOne(query).lean();
    return result;
}

const checkUuid = async (leadsData) => {
    let leadId = leadsData[0].leadId;
    let query = { leadId };

    const result = await LeadAssign.findOne(query).lean();
    return result;

}

const refurbishLeads = async (params) => {
    try {
        let { leadAssignId, statusName, stageName, cycleName, journeyName } = params;
        const query = { _id: leadAssignId };
        const update = {
            stageName,
            statusName,
            cycleName,
            journeyName,
            isRefurbished: true
        }
        const result = await LeadAssign.findOneAndUpdate(query, update, {new: true});
        return result;
    }
    catch (err) {
        console.log(err, '...error inside lead assign controls');
    }
}


module.exports = {
    findOneByKey,
    updateLeadAssign,
    updateMultipleLeads,
    updateOneByKey,
    updateDndStatus,
    getLeadAssignList,
    getLeadAssignListCount,
    getRelatedToListCount,
    getRelatedToList,
    leadsTransfer,
    checkLeadAssign,
    checkUuid,
    refurbishLeads,
    currentDndStatus
}
