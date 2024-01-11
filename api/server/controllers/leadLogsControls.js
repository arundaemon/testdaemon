const LeadLogs = require('../models/leadLogsModel');
const utils = require('../utils/utils');

const saveLogs = async (params) => {
    try{
    return LeadLogs.create(params)
    }
    catch(err){
        throw { errorMessage: err }
    }
};

const updateLogs = async (params) => {
    try{
    let { batch, batchStatus, successFile, errorFile, exception } = params;
    let options = { new: true };
    let query = { batch };
    let update = { batchStatus };

    if(successFile){
        update.successFile = successFile;
    }
    if(errorFile){
        update.errorFile = errorFile;
    }
    if(exception){
        update.exception = exception;
    }

    const result = await LeadLogs.findOneAndUpdate(query, update, options);
    return result;
}
catch(err){
    throw { errorMessage: err }
}
}

const getLogsList = async (params) => {
    try{
    let { pageNo, count, sortKey, sortOrder, search, campaignName } = params
    let sort = { created: -1 };
    let query = { isDeleted: false }

    if (search) {
        query.fileName = { $regex: search, $options: 'i' }
    }

    if(campaignName){
        query.campaignName = campaignName;
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    }else{
        pageNo = parseInt(pageNo)
    }

    if (utils.isEmptyValue(count)) {
        count = 999
    }else{
        count = parseInt(count);
    }
    
    const data = await LeadLogs.find(query).sort(sort).skip(pageNo * count).limit(count).lean();
    
    return data;
}
catch(err){
    throw { errorMessage: err }
}    
}

const getLogsListCount = async (params) => {
    try{
    let query = { isDeleted: false}
    let { search, campaignName } = params
    if (search) {
        query.fileName = { $regex: search, $options: 'i' }
    }
    if(campaignName){
        query.campaignName = campaignName;
    }
    return LeadLogs.countDocuments(query)
}
catch(err){
    throw { errorMessage: err }
}
}


module.exports = {
    saveLogs,
    getLogsList,
    getLogsListCount,
    updateLogs
}
