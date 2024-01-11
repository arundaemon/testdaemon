const Status = require('../models/statusModel');
const utils = require('../utils/utils');

const createStatus = async (params) => {
    const result = await Status.create(params);
    return result;
}

const deleteStatus = async (params) => {
    let { _id } = params;
    let update = { isDeleted: true }
    let options = { new: true }

    return Status.findOneAndUpdate({ _id }, update, options)
}

const updateStatus = async (params) => {
    let { _id, stageId, statusName, type, linkedStatus, modifiedBy, modifiedBy_Uuid } = params;
    let update = {};
    let options = { new: true };

    if (stageId) {
        update.stageId = stageId;
    }

    if (type) {
        update.type = type;
    }

    if (statusName) {
        update.statusName = statusName;
    }

    if (linkedStatus) {
        update.linkedStatus = linkedStatus;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }
    const data = Status.findOneAndUpdate({ _id }, update, options);
    return data;
}

const getStatusList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 };
    let query = { isDeleted: false }

    if (search) {
        query = {
            ...query,
            $or: [
                { statusName: { $regex: search, $options: 'i' } },
                { createdBy: { $regex: search, $options: 'i' } },
            ]
        }
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
    const data = await Status.find(query).populate('stageId', 'stageName').sort(sort).skip(pageNo * count).limit(count).lean();
    return data;
}

const getAllStatus = async (params) => {
    let query = { isDeleted: false, status: 1 }

    if (params.available) {
        query.stageId = { $eq: null }
    }

    if (params.stageId) {
        query.stageId = params.stageId
    }

    if (params?.type && params?.type !== 'user') {
        query.type = params?.type
    }

    let sort = { name: 1 }
    return Status.find(query).sort(sort)
}

const changeStatus = async (_id, status, modifiedBy) => {
    let options = { new: true };
    let update = { status: status, modifiedBy: modifiedBy };
    return Status.findOneAndUpdate({ _id }, update, options);
}

const getStatusDetails = async (id) => {
    return Status.findById(id);
}

const isDuplicateStatus = async (statusName) => {
    let query = { statusName, isDeleted: false };
    return Status.findOne(query);
}

const findOneByKey = async (query) => {
    return Status.findOne(query);
}


const updateManyByKey = async (query, update) => {
    return Status.updateMany(query, update);
}


const updateStatusByKey = async (query, update) => {
    let options = { new: true };
    return Status.findOneAndUpdate(query, update, options);
}


module.exports = {
    createStatus,
    updateStatus,
    changeStatus,
    getStatusList,
    getAllStatus,
    deleteStatus,
    getStatusDetails,
    isDuplicateStatus,
    findOneByKey,
    updateManyByKey,
    updateStatusByKey
}