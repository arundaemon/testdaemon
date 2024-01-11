
const reasonForFbRejected = require('../models/reasonforFbRejectedModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForFbRejected.findOne(query).populate(populate)
}


const createReasonForFbRejected = async(params) => {

    return reasonForFbRejected.create(params)
}

const getReasonForFbRejectedList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForFbRejected.find(query).sort(sort)


}


const getReasonForFbRejectedListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForFbRejected.countDocuments(query)
}

const updateReasonForFbRejected = async (params) => {
    let { reasonForFbRejectedId,reasonForFbRejected, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForFbRejectedId;

    if(reasonForFbRejected){
        update.reasonForFbRejected = reasonForFbRejected
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForFbRejected.findOneAndUpdate(query,update, options);
}

const deleteReasonForFbRejected = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForFbRejectedId };
    let options = { new: true }

    return reasonForFbRejected.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForFbRejected,
    getReasonForFbRejectedList,
    getReasonForFbRejectedListCount,
    updateReasonForFbRejected,
    deleteReasonForFbRejected,
    findOneByKey,
}