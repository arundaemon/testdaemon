
const reasonForPaPending = require('../models/reasonForPaPendingModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForPaPending.findOne(query).populate(populate)
}


const createReasonForPaPending = async(params) => {

    return reasonForPaPending.create(params)
}

const getReasonForPaPendingList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForPaPending.find(query).sort(sort)


}


const getReasonForPaPendingListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForPaPending.countDocuments(query)
}

const updateReasonForPaPending = async (params) => {
    let { reasonForPaPendingId,reasonForPaPending, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForPaPendingId;

    if(reasonForPaPending){
        update.reasonForPaPending = reasonForPaPending
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForPaPending.findOneAndUpdate(query,update, options);
}

const deleteReasonForPaPending = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForPaPendingId };
    let options = { new: true }

    return reasonForPaPending.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForPaPending,
    getReasonForPaPendingList,
    getReasonForPaPendingListCount,
    updateReasonForPaPending,
    deleteReasonForPaPending,
    findOneByKey,
}