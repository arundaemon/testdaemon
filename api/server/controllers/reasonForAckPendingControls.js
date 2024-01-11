
const reasonForAckPending = require('../models/reasonForAckPendingModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForAckPending.findOne(query).populate(populate)
}


const createReasonForAckPending = async(params) => {

    return reasonForAckPending.create(params)
}

const getReasonForAckPendingList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForAckPending.find(query).sort(sort)


}


const getReasonForAckPendingListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForAckPending.countDocuments(query)
}

const updateReasonForAckPending = async (params) => {
    let { reasonForAckPendingId,reasonForAckPending, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForAckPendingId;

    if(reasonForAckPending){
        update.reasonForAckPending = reasonForAckPending
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForAckPending.findOneAndUpdate(query,update, options);
}

const deleteReasonForAckPending = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForAckPendingId };
    let options = { new: true }

    return reasonForAckPending.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForAckPending,
    getReasonForAckPendingList,
    getReasonForAckPendingListCount,
    updateReasonForAckPending,
    deleteReasonForAckPending,
    findOneByKey,
}