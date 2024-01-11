
const reasonForFbPending = require('../models/reasonForFbPendingModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForFbPending.findOne(query).populate(populate)
}


const createReasonForFbPending = async(params) => {

    return reasonForFbPending.create(params)
}

const getReasonForFbPendingList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForFbPending.find(query).sort(sort)


}


const getReasonForFbPendingListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForFbPending.countDocuments(query)
}

const updateReasonForFbPending = async (params) => {
    let { reasonForFbPendingId,reasonForFbPending, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForFbPendingId;

    if(reasonForFbPending){
        update.reasonForFbPending = reasonForFbPending
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForFbPending.findOneAndUpdate(query,update, options);
}

const deleteReasonForFbPending = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForFbPendingId };
    let options = { new: true }

    return reasonForFbPending.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForFbPending,
    getReasonForFbPendingList,
    getReasonForFbPendingListCount,
    updateReasonForFbPending,
    deleteReasonForFbPending,
    findOneByKey,
}