const Stages = require('../models/stageModel');
const utils = require('../utils/utils');

const createStage = async (params) => {
    const result = await Stages.create(params);
    return result;
}

const deleteStage = async (params) => {
    let { _id } = params;
    let update = { isDeleted: true }
    let options = { new: true }

    return Stages.findOneAndUpdate({ _id }, update, options)
}

const updateStage = async (params) => {
    let { _id, cycleId, stageName, type, linkedStage, modifiedBy, modifiedBy_Uuid } = params;
    let update = {};
    let options = { new: true };

    if (cycleId) {
        update.cycleId = cycleId;
    }

    if (stageName) {
        update.stageName = stageName;
    }

    if (type) {
        update.type = type;
    }

    if (linkedStage) {
        update.linkedStage = linkedStage;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }
    return Stages.findOneAndUpdate({ _id }, update, options);
}

const getStageList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, status } = params
    let sort = { created: -1 };
    let query = { isDeleted: false }
    if (search) {
        query = {
            ...query,
            $or: [
                { stageName: { $regex: search, $options: 'i' } },
                { createdBy: { $regex: search, $options: 'i' } },
            ]
        }
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (status) {
        query.status = 1
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

    return Stages.find(query)
        .populate({ path: 'cycleId', select: 'cycleName', populate: { path: 'journeyId', select: 'journeyName' } })
        .sort(sort).skip(pageNo * count).limit(count).lean();
}

const getAllStages = async (params) => {
    let query = { isDeleted: false, status: 1 }

    if (params.available) {
        query.cycleId = { $eq: null }
    }

    if (params.cycleId) {
        query.cycleId = params.cycleId
    }

    if (params?.type && params?.type !== 'user') {
        query.type = params?.type
    }

    let sort = { name: 1 }
    return Stages.find(query).sort(sort).populate('linkedStatus')
}

const getStageDetails = async (id) => {
    return Stages.findById(id).populate('linkedStatus');
}

const isDuplicateStage = async (stageName) => {
    let query = { stageName, isDeleted: false };
    const result = await Stages.findOne(query);
    return result;
}

const changeStatus = async (_id, status, modifiedBy) => {
    let options = { new: true };
    let update = { status: status, modifiedBy: modifiedBy };
    const data = await Stages.findOneAndUpdate({ _id }, update, options);
    return data;
}


const findOneByKey = async (query) => { //{stageName:'Demo"}
    return Stages.findOne(query).populate({ path: 'cycleId', select: ['cycleName', 'linkedStage'], populate: { path: 'linkedStage', select: 'stageName' } });
}

const updateManyByKey = async (query, update) => {
    return Stages.updateMany(query, update);
}


const updateStageByKey = async (query, update) => {
    let options = { new: true };
    return Stages.findOneAndUpdate(query, update, options);
}

module.exports = {
    createStage,
    deleteStage,
    getAllStages,
    getStageList,
    getStageDetails,
    updateStage,
    changeStatus,
    isDuplicateStage,
    findOneByKey,
    updateManyByKey,
    updateStageByKey
}