
const reasonForAckRejected = require('../models/reasonForAckRejectedModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForAckRejected.findOne(query).populate(populate)
}


const createReasonForAckRejected = async(params) => {

    return reasonForAckRejected.create(params)
}

const getReasonForAckRejectedList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForAckRejected.find(query).sort(sort)


}


const getReasonForAckRejectedListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForAckRejected.countDocuments(query)
}

const updateReasonForAckRejected = async (params) => {
    let { reasonForAckRejectedId,reasonForAckRejected, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForAckRejectedId;

    if(reasonForAckRejected){
        update.reasonForAckRejected = reasonForAckRejected
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForAckRejected.findOneAndUpdate(query,update, options);
}

const deleteReasonForAckRejected = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForAckRejectedId };
    let options = { new: true }

    return reasonForAckRejected.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForAckRejected,
    getReasonForAckRejectedList,
    getReasonForAckRejectedListCount,
    updateReasonForAckRejected,
    deleteReasonForAckRejected,
    findOneByKey,
}