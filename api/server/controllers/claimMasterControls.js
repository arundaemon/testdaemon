const Claim = require('../models/claimMasterModel');
const utils = require('../utils/utils');

const createClaimMaster = async (params) => {
    const result = await Claim.create(params);
    return result;
};

const getClaimMasterList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, profile } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (search) {
        query.expenseType = { $regex: search, $options: 'i' }
    }
    if (profile) {
        query.profile = profile
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

    const result = await Claim.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
};

const getClaimMasterListCount = async (params) => {
    let query = { isDeleted: false }
    let { search } = params

    if (search) {
        query.expenseType = { $regex: search, $options: 'i' }
    }
    return Claim.countDocuments(query)
};

const updateClaimMaster = async (params) => {

    let { _id, expenseType, field, subField, unit, unitPrice, profile, territory, modifiedBy, modifiedBy_Uuid } = params;

    let update = {};
    let options = { new: true };

    if (expenseType) {
        update.expenseType = expenseType;
    }

    if (field) {
        update.field = field;
    }

    if (subField) {
        update.subField = subField;
    }

    if (unit) {
        update.unit = unit;
    }

    if (unitPrice) {
        update.unitPrice = unitPrice;
    }

    if (profile) {
        update.profile = profile;
    }

    if (territory) {
        update.territory = territory;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }

    const result = await Claim.findOneAndUpdate({ _id }, update, options);
    return result;
};

const getClaimMasterDetails = async (id) => {
    return Claim.find({ _id: id });
}

const deleteClaimMaster = async (params) => {
    let { _id } = params;
    let update = { isDeleted: true }
    let options = { new: true }

    return Claim.findOneAndUpdate({ _id }, update, options)
};

const isDuplicateClaimMaster = async (params) => {
    let { expenseType, field, unit, profile, _id } = params;
    let query = {
        expenseType, unit, profile, ['field.field']: field.field, ['field.subField']: field.subField, isDeleted: false

    };

    if (_id) {
        query._id = { $ne: _id };
    }

    const result = await Claim.findOne(query);
    if (result) {
        return true;
    }
    else return false;

}

module.exports = {
    createClaimMaster,
    updateClaimMaster,
    deleteClaimMaster,
    getClaimMasterList,
    getClaimMasterListCount,
    getClaimMasterDetails,
    isDuplicateClaimMaster
}