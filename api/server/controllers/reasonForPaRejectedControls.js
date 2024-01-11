
const reasonForPaRejected = require('../models/reasonForPaRejectedModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return reasonForPaRejected.findOne(query).populate(populate)
}


const createReasonForPaRejected = async(params) => {

    return reasonForPaRejected.create(params)
}

const getReasonForPaRejectedList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return reasonForPaRejected.find(query).sort(sort)


}


const getReasonForPaRejectedListCount = async (params) => {
    let query = { isDeleted: false }

    return reasonForPaRejected.countDocuments(query)
}

const updateReasonForPaRejected = async (params) => {
    let { reasonForPaRejectedId,reasonForPaRejected, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForPaRejectedId;

    if(reasonForPaRejected){
        update.reasonForPaRejected = reasonForPaRejected
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return reasonForPaRejected.findOneAndUpdate(query,update, options);
}

const deleteReasonForPaRejected = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.reasonForPaRejectedId };
    let options = { new: true }

    return reasonForPaRejected.findOneAndUpdate(query, update, options);
}


module.exports ={
    createReasonForPaRejected,
    getReasonForPaRejectedList,
    getReasonForPaRejectedListCount,
    updateReasonForPaRejected,
    deleteReasonForPaRejected,
    findOneByKey,
}