const leadLogControls = require('../controllers/leadLogsControls');
const LeadLogs = require('../models/leadLogsModel');

const saveLogs = async (params) => {
    try{
    let { successFile , errorFile, fileData, campaignName, sourceName, subSourceName, batchStatus, fileName, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = params;
    const batchCount = await LeadLogs.find({campaignName}).count();
    const newBatchCount = batchCount + 1;
    let batch = `${campaignName}_${newBatchCount}`;

    const logsData = await leadLogControls.saveLogs({successFile, errorFile, fileData, batch, batchStatus, campaignName, sourceName, subSourceName , fileName, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid});
    return  logsData;
    }
    catch(err){
        throw { errorMessage: err }
    }
};

const getLogsList = async (params) => {
    try{
    let LogsList = leadLogControls.getLogsList(params);
    let TotalLogsCount = leadLogControls.getLogsListCount(params);
    let [result, totalCount] = await Promise.all([LogsList, TotalLogsCount])
    return { message: 'Logs List !', result, totalCount }
    }
    catch(err){
        throw { errorMessage: err}
    }
}

const updateLogs = async (params) => {
    try{
    let result = await leadLogControls.updateLogs(params);
    return result;
    }
    catch(err){
        throw { errorMessage: err }
    }
}

module.exports = {
    saveLogs,
    getLogsList,
    updateLogs
}