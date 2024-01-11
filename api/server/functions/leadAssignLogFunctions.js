const leadAssignLogControls = require('../controllers/leadAssignLogControls');


const saveLogs = async (params) => {
    let { leadId, name, mobile, email, board, school, schoolCode, pinCode, state,
        city, campaignId, sourceId, sourceName, subSourceName, subSourceId, userType, learningProfile, reference, countryCode,
        displayName, gender, phone, userPhoto, assignedTo_userId, assignedTo_userName, assignedTo_assignedOn, assignedTo_role_id,
        assignedTo_role_code, assignedTo_role_name, assignedTo_profile_id, assignedTo_profile_code,
        assignedTo_profile_name, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid, status, assignedTo_displayName, type } = params;

    const logsData = await leadAssignLogControls.saveLogs({leadId, name, mobile, email, board, school, schoolCode, pinCode, state,
        city, campaignId, sourceId, sourceName, subSourceName, subSourceId, userType, learningProfile, reference, countryCode,
        displayName, gender, phone, userPhoto, assignedTo_userId, assignedTo_userName, assignedTo_assignedOn, assignedTo_role_id,
        assignedTo_role_code, assignedTo_role_name, assignedTo_profile_id, assignedTo_profile_code,
        assignedTo_profile_name, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid, status, assignedTo_displayName, type });
    return  logsData;
};

const getLeadAssignLogsList = async (params) => {
    let LogsList = leadAssignLogControls.getLeadAssignLogsList(params);
    let TotalLogsCount = leadAssignLogControls.getLogsListCount(params);
    let [result, totalCount] = await Promise.all([LogsList, TotalLogsCount])
    return { message: 'Logs List !', result, totalCount }
}

module.exports = {
    saveLogs,
    getLeadAssignLogsList
}