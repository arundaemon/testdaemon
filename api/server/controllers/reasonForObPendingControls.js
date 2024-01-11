
const reasonForObPending = require('../models/reasonForObPendingModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForObPending.findOne(query).populate(populate)
}


const createReasonForObPending = async(params) => {

    return reasonForObPending.create(params)
}

const getReasonForObPendingList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForObPending.find(query).sort(sort)


}


const getReasonForObPendingListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForObPending.countDocuments(query)
}

const updateReasonForObPending = async (params) => {
    let { reasonForObPendingId,reasonForObPending, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForObPendingId;

    if(reasonForObPending){
        update.reasonForObPending = reasonForObPending
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForObPending.findOneAndUpdate(query,update, options);
}

const deleteReasonForObPending = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForObPendingId };
    let options = { new: true }

    return reasonForObPending.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForObPending,
    getReasonForObPendingList,
    getReasonForObPendingListCount,
    updateReasonForObPending,
    deleteReasonForObPending,
    findOneByKey,
}