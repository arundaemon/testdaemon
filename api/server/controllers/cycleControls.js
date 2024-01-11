const Cycles = require('../models/cycleModel');
const utils = require('../utils/utils');

const createCycle = async (params) => {
    const result = await Cycles.create(params);
    return result;
}

const deleteCycle = async (params) => {
    let { _id } = params;
    let update = { isDeleted: true }
    let options = { new: true }

    return Cycles.findOneAndUpdate({ _id }, update, options)
}


const updateCycle = async (params) => {
    let { _id, journeyId, cycleName, type, linkedCycle, modifiedBy, modifiedBy_Uuid } = params;
    let update = {};
    let options = { new: true };

    if (journeyId) {
        update.journeyId = journeyId;
    }

    if (cycleName) {
        update.cycleName = cycleName;
    }

    if (cycleName) {
        update.type = type;
    }


    if (linkedCycle) {
        update.linkedCycle = linkedCycle;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }
    return Cycles.findOneAndUpdate({ _id }, update, options);
}


const getCyclesList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (search) {
        query = {
            ...query,
            $or: [
                { cycleName: { $regex: search, $options: 'i' } },
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

    return Cycles.find(query)
        .populate('journeyId', 'journeyName')
        // .populate({ path: 'journeyId', select: 'journeyName', options: { sort: [['journeyName', 'asc']] } })
        .populate('linkedCycle', 'cycleName')
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
}

const getAllCycles = async (params) => {
    let query = { isDeleted: false, status: 1 }
    let sort = { cycleName: 1 }

    if (params.availableCycles) {
        query.journeyId = { $eq: null }
    }

    return Cycles.find(query).sort(sort).populate('linkedStage')
}

const getCycleDetails = async (id) => {
    return Cycles.findById(id).populate('linkedStage')
}

const isDuplicateCycle = async (cycleName, id) => {
    let query = { cycleName, isDeleted: false };
    if (id) {
        query._id = { $ne: id };
    }
    return Cycles.findOne(query);
}


const findOneByKey = async (query) => {
    return Cycles.findOne(query);
}

const changeStatus = async (_id, status) => {
    let options = { new: true };
    let update = { status: status };
    return Cycles.findOneAndUpdate({ _id }, update, options);
}

const getAllCycleNames = async (params) => {

    var query = { isDeleted: false, status: 1 };

    if (params.journeyId) {
        query.journeyId = params.journeyId
    }
    //console.log(params)
    let sort = { cycleName: 1 };

    return Cycles.find(query).select(`cycleName`).sort(sort);
}


const updateCycleByKey = async (query, update) => {
    let options = { new: true };
    return Cycles.findOneAndUpdate(query, update, options);
}


const updateManyByKey = async (query, update) => {
    return Cycles.updateMany(query, update);
}


module.exports = {
    createCycle,
    updateCycle,
    getCyclesList,
    getAllCycles,
    deleteCycle,
    getCycleDetails,
    isDuplicateCycle,
    changeStatus,
    getAllCycleNames,
    updateCycleByKey,
    findOneByKey,
    updateManyByKey
}

