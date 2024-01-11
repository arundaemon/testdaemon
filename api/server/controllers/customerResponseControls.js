
const CustomerResponse = require('../models/customerResponseModel');
const utils = require('../utils/utils')

const findOneByKey = async (query, populate) => {
    return CustomerResponse.findOne(query).populate(populate)
}


const createCustomerResponse = async(params) => {

    return CustomerResponse.create(params)
}

const getCustomerResponseList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return CustomerResponse.find(query).sort(sort)


}


const getCustomerResponseListCount = async (params) => {
    let query = { isDeleted: false }
    let { search} = params

    // if (search)
    //     query.categoryName = { $regex: search, $options: 'i' }

    return CustomerResponse.countDocuments(query)
}

const updateCustomerResponse = async (params) => {
    let { customerResponseId,customerResponse, status} = params;
    let update = {};
    let query = {};
    let options = { new: true}

    query._id = customerResponseId;

    if(customerResponse){
        update.customerResponse=customerResponse
    }
    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    return CustomerResponse.findOneAndUpdate(query,update, options);
}

const deleteCustomerResponse = async (params) => {

    let update = { isDeleted: true };
    let query = { _id:params.customerResponseId };
    let options = { new: true }

    return CustomerResponse.findOneAndUpdate(query, update, options);
}

const getAllCutomerResponses = async (params) => {

    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }

    if (search){

        query.customerResponse = { $regex: search, $options: 'i' }
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

    return CustomerResponse.find(query).sort(sort).skip(pageNo * count).limit(count).lean()

}

module.exports ={
    createCustomerResponse,
    getCustomerResponseList,
    getCustomerResponseListCount,
    updateCustomerResponse,
    deleteCustomerResponse,
    findOneByKey,
    getAllCutomerResponses
}