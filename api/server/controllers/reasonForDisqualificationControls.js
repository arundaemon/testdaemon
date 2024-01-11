
const ReasonForDisqualification = require('../models/reasonForDisqualificationModel');
const utils = require('../utils/utils')


const findOneByKey = async (query, populate) => {
    return ReasonForDisqualification.findOne(query).populate(populate)
}


const createReasonForDisqualifiction = async(params) => {

    return ReasonForDisqualification.create(params)
}

const getReasonForDisqualificationList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }

    if (search){

        query.reasonForDisqualification = { $regex: search, $options: 'i' }
    }
    if (sortKey && sortOrder) {

        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)){

        pageNo = 0
    }

    if (utils.isEmptyValue(count)){

        count = 0
    }

    return ReasonForDisqualification.find(query).sort(sort).skip(pageNo * count).limit(count).lean()
}


const getReasonForDisqualificationListCount = async (params) => {
    let query = { isDeleted: false }
    let { search} = params

    if (search) {
        query.reasonForDisqualification = { $regex: search, $options: 'i' }
    }

    return ReasonForDisqualification.countDocuments(query)
}

const updateReasonForDisqualification = async (params) => { 
    
    let { reasonForDisqualificationId,reasonForDisqualification, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = reasonForDisqualificationId;

    if(reasonForDisqualification){
        update.reasonForDisqualification=reasonForDisqualification
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return ReasonForDisqualification.findOneAndUpdate(query,update, options);
}

const deleteReasonForDisqualification = async (params) => {

    let query = { _id: params.reasonForDisqualificationId}
    let update = { isDeleted: true }
    let options = { new: true }
    
    return ReasonForDisqualification.findOneAndUpdate(query,update,options);

}



module.exports ={
    createReasonForDisqualifiction,
    getReasonForDisqualificationList,
    getReasonForDisqualificationListCount,
    updateReasonForDisqualification,
    deleteReasonForDisqualification,
    findOneByKey,
    
}