
const reasonForObRejected = require('../models/reasonForObRejectedModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForObRejected.findOne(query).populate(populate)
}


const createReasonForObRejected = async(params) => {

    return reasonForObRejected.create(params)
}

const getReasonForObRejectedList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForObRejected.find(query).sort(sort)


}


const getReasonForObRejectedListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForObRejected.countDocuments(query)
}

const updateReasonForObRejected = async (params) => {
    let { reasonForObRejectedId,reasonForObRejected, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForObRejectedId;

    if(reasonForObRejected){
        update.reasonForObRejected = reasonForObRejected
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForObRejected.findOneAndUpdate(query,update, options);
}

const deleteReasonForObRejected = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForObRejectedId };
    let options = { new: true }

    return reasonForObRejected.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForObRejected,
    getReasonForObRejectedList,
    getReasonForObRejectedListCount,
    updateReasonForObRejected,
    deleteReasonForObRejected,
    findOneByKey,
}