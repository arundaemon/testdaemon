const taskActivityMapping = require('../models/taskActivityModel');
const utils = require('../utils/utils');

const createTaskActivityMapping = async (params) => {

    return taskActivityMapping.create(params)
}

const getTaskActivityMappingListCount = async (params) => {

    let query = { isDeleted: false }
    let { search } = params
    if (search) {
        query.createdBy = { $regex: search, $options: 'i' }
        
    }
    return taskActivityMapping.countDocuments(query)
}

const getTaskActivityMappingList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 }

    if (search) {
        query.createdBy = { $regex: search, $options: 'i' }
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    }

    if (utils.isEmptyValue(count)) {
        count = 0
    }

    return taskActivityMapping.find(query)
    .populate('activityId', 'activityName')
    .populate('taskId', 'taskName')
    .sort(sort)
    .skip(pageNo * count).limit(count).lean();
}

const changeStatus = async ( _id, status ) => {
    let options = { new: true };
    let update = { status: status };
    return  taskActivityMapping.findOneAndUpdate({ _id }, update , options);
}

module.exports ={
    createTaskActivityMapping,
    getTaskActivityMappingList,
    getTaskActivityMappingListCount,
    changeStatus
}