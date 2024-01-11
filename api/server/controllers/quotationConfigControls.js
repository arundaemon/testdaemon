const QuotationConfig = require('../models/quotationConfigModel');
const utils = require('../utils/utils');

const createQuotationConfig = async (params) => {
    const result = QuotationConfig.create(params);
    return result;
}

const getQuotationConfigList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, isActive } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (search) {
        query = {
            ...query,
            $or: [
                { productCode: { $regex: search, $options: 'i' } },
                { createdByName: { $regex: search, $options: 'i' } },
            ]
        }
    }

    if (isActive) {
        query.status = 1;
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }

    if (utils.isEmptyValue(count)) {
        count = 999
    } else {
        count = parseInt(count);
    }

    return QuotationConfig.find(query).sort(sort).skip(pageNo * count).limit(count).lean();
}

const updateQuotationConfig = async (params) => {
    let { _id, productName, productCode, groupCode, groupName, quotationFor, dependentFields, calculatedFields, isHardware, isServices, isSoftware, isPoRequired, status, modifiedByName, modifiedByRoleName, modifiedByProfileName, modifiedByEmpCode, modifiedByUuid } = params;
    let update = {};
    let options = { new: true };

    if (productName) {
        update.productName = productName;
    }
    if (productCode) {
        update.productCode = productCode;
    }

    if (groupCode) {
        update.groupCode = groupCode;
    }

    if (groupName) {
        update.groupName = groupName;
    }

    if (quotationFor) {
        update.quotationFor = quotationFor;
    }

    if (dependentFields) {
        update.dependentFields = dependentFields;
    }

    if (calculatedFields) {
        update.calculatedFields = calculatedFields;
    }

    if (!utils.isEmptyValue(isHardware)) {
        update.isHardware = isHardware;
    }

    if (!utils.isEmptyValue(isServices)) {
        update.isServices = isServices;
    }

    if (!utils.isEmptyValue(isSoftware)) {
        update.isSoftware = isSoftware;
    }

    if (!utils.isEmptyValue(isPoRequired)) {
        update.isPoRequired = isPoRequired;
    }

    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    if (modifiedByName) {
        update.modifiedByName = modifiedByName;
    }

    if (modifiedByRoleName) {
        update.modifiedByRoleName = modifiedByRoleName;
    }

    if (modifiedByProfileName) {
        update.modifiedByProfileName = modifiedByProfileName;
    }

    if (modifiedByEmpCode) {
        update.modifiedByEmpCode = modifiedByEmpCode;
    }

    if (modifiedByUuid) {
        update.modifiedByUuid = modifiedByUuid;
    }

    return QuotationConfig.findOneAndUpdate({ _id }, update, options);
}

const isDuplicateConfig = async (params) => {
    let { productCode, quotationFor, _id } = params;
    let query = { productCode, quotationFor, isDeleted: false };
    if (_id) {
        query._id = { $ne: _id };
    }

    const result = await QuotationConfig.findOne(query);
    return result;

}

const getQuotationConfigDetail = async (params) => {
    let { productCode, quotationFor } = params;
    let query = { productCode, quotationFor, isDeleted: false, status: 1 };
    return QuotationConfig.find(query);
}

module.exports = {
    createQuotationConfig,
    getQuotationConfigList,
    updateQuotationConfig,
    isDuplicateConfig,
    getQuotationConfigDetail
}