const targetIncentiveLogControls = require('../controllers/targetIncentiveLogControls');


const saveLogs = async (params) => {
    let { successFile , errorFile, type, fileName, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = params;
    const logsData = await targetIncentiveLogControls.saveLogs({successFile, errorFile, type, fileName, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid});
    return  logsData;
};

const getLogsList = async (params) => {
    let LogsList = targetIncentiveLogControls.getLogsList(params);
    let TotalLogsCount = targetIncentiveLogControls.getLogsListCount(params);
    let [result, totalCount] = await Promise.all([LogsList, TotalLogsCount])
    return { message: 'Logs List !', result, totalCount }
}

module.exports = {
    saveLogs,
    getLogsList
}