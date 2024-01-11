
const Journey = require('../models/journeyModel');
const utils = require('../utils/utils')


const findOneByKey = async (query, populate) => {
    return Journey.findOne(query).populate(populate)
}


const createJourney = async (params) => {

    return Journey.create(params)
}


const updateJourney = async (params) => {
    let { journeyId, journeyName, createdBy, modifiedBy, condition, filterSql, modifiedBy_Uuid } = params;

    let query = {}
    let update = {}
    let options = { new: true }


    query._id = journeyId;

    if (journeyName) {

        update.journeyName = journeyName;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }

    if (condition) {
        update.condition = condition;
    }
    if (filterSql) {
        update.filterSql = filterSql;
    }

    return Journey.findOneAndUpdate(query, update, options);

}

const getJourneyList = async (params) => {

    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 }

    if (search) {
        query = {
            ...query,
            $or: [
                { journeyName: { $regex: search, $options: 'i' } },
                { createdBy: { $regex: search, $options: 'i' } }
            ]
        }
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

    return Journey.find(query).sort(sort).skip(pageNo * count).limit(count).lean();
}

const deleteJourney = async (params) => {

    let query = { _id: params.journeyId }
    let update = { isDeleted: true };
    let options = { new: true };

    return Journey.findOneAndUpdate(query, update, options);

}

const getAllJourneys = async (params) => {
    let query = { isDeleted: false, status: 1 }
    let sort = { name: 1 }
    return Journey.find(query).select('journeyName').sort(sort).populate('linkedCycle')
}

const getJourney = async (params) => {
    return Journey.findById(params.journeyId).populate('linkedCycle');
}

const getLinkedJourneyList = async (params) => {
    let query = { isDeleted: false, status: 1 }
    let sort = { name: 1 }
    return Journey.find(query).sort(sort).populate({ path: 'linkedCycle', match: { isDeleted: false, status: 1 }, populate: { path: 'linkedStage', match: { isDeleted: false, status: 1 }, populate: { path: 'linkedStatus', match: { isDeleted: false, status: 1 } } } })
}

const changeStatus = async (_id, status) => {
    let options = { new: true };
    let update = { status: status };
    return Journey.findOneAndUpdate({ _id }, update, options);
}


const updateJourneyByKey = async (query, update) => {
    let options = { new: true };
    return Journey.findOneAndUpdate(query, update, options);
}

const getActiveJourneys = async (params) => {
    let query = { isDeleted: false, status: 1 }
    let sort = { name: 1 }
    return Journey.find(query).sort(sort);
}

module.exports = {
    createJourney,
    updateJourney,
    findOneByKey,
    getJourneyList,
    deleteJourney,
    getAllJourneys,
    getJourney,
    changeStatus,
    updateJourneyByKey,
    getActiveJourneys,
    getLinkedJourneyList
}