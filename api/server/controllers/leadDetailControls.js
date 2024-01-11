const mongoose = require('mongoose');
const LeadDetails = require('../models/leadassignModal');
const utils = require('../utils/utils')
const config = require('../config')

const findOneByKey = async (query) => {
    console.log(query)
    const result = await LeadDetails.findOne(query).sort({ updatedAt: -1 })
    if (result) {
        const modifiedResult = {};
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.status`] = result?.status;
        // modifiedResult["Leadassigns.isDeleted"] = result.isDeleted;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.Id`] = result?._id;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.leadId`] = result.leadId ? result.leadId : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.assignedToAssignedOn`] = result.assignedTo_assignedOn ? result.assignedTo_assignedOn : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.assignedToDisplayName`] = result.assignedTo_displayName ? result.assignedTo_displayName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.assignedToProfileName`] = result.assignedTo_profile_name ? result.assignedTo_profile_name : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.assignedToRoleName`] = result.assignedTo_role_name ? result.assignedTo_role_name : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.assignedToUserName`] = result.assignedTo_userName ? result.assignedTo_userName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.city`] = result.city ? result.city : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.createdAt`] = result.createdAt;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.mobile`] = result.mobile ? result.mobile : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.email`] = result.email ? result.email : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.name`] = result.name ? result.name : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.refrenceEmpName`] = result.refrenceEmpName ? result.refrenceEmpName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.registrationDate`] = result.registrationDate;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.sourceName`] = result.sourceName ? result.sourceName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.state`] = result.state ? result.state : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.stageName`] = result.stageName ? result.stageName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.statusName`] = result.statusName ? result.statusName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.subSourceName`] = result.subSourceName ? result.subSourceName : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.type`] = result.type ? result.type : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.updatedAt`] = result.updatedAt;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.userType`] = result.userType ? result.userType : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.dndStatus`] = result.dndStatus ? result.dndStatus : null;
        modifiedResult[`${config.cfg.OFFLINE_LEADS}.__v`] = result.__v;
        return modifiedResult;
    } else {
        return null
    }

}

module.exports = {
    findOneByKey
}