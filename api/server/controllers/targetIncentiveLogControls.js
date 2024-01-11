const TargetIncentiveLogs = require('../models/targetIncentiveLogsModel');
const utils = require('../utils/utils');

const saveLogs = async (params) => {
    return TargetIncentiveLogs.create(params)
};

const getLogsList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 };
    let query = { isDeleted: false }

    if (search) {
        query.fileName = { $regex: search, $options: 'i' }
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
   
    const data = await TargetIncentiveLogs.find(query).skip(pageNo * count).limit(count).lean();
    return data;    
}

const getLogsListCount = async (params) => {
    let query = { isDeleted: false}
    let { search } = params
    if (search) {
        query.fileName = { $regex: search, $options: 'i' }
    }
    return TargetIncentiveLogs.countDocuments(query)
}

module.exports = {
    saveLogs,
    getLogsList,
    getLogsListCount
}