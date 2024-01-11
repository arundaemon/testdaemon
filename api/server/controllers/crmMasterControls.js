const CrmMaster = require('../models/crmMasterModel');
const utils = require('../utils/utils');

const createCrmMaster = async (params) => {
    const result = await CrmMaster.create(params);
    return result;
};

const getCrmMasterList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (search) {
        query.type = { $regex: search, $options: 'i' }
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

    const result = await CrmMaster.find(query).populate('typeId')
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
};

const getCrmMasterListCount = async (params) => {
    let query = { isDeleted: false }
    let { search } = params

    if (search) {
        query.expenseType = { $regex: search, $options: 'i' }
    }
    return CrmMaster.countDocuments(query)
};

const updateCrmMaster = async (params) => {

    let { _id, type, fieldType, typeId, value, status, modifiedBy, modifiedBy_Uuid } = params;

    let update = {};
    let options = { new: true };

    if (type) {
        update.type = type;
    }

    if (typeId) {
        update.typeId = typeId;
    }

    if (fieldType) {
        update.fieldType = fieldType;
    }

    if (value) {
        update.value = value;
    }

    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }   

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }

    const result = await CrmMaster.findOneAndUpdate({ _id }, update, options);
    return result;
};

const getCrmMasterDetails = async (id) => {
    return CrmMaster.find({ _id: id });
}

const deleteCrmMaster = async (params) => {
    let { _id } = params;
    let update = { isDeleted: true }
    let options = { new: true }

    return CrmMaster.findOneAndUpdate({ _id }, update, options)
};

const getAllCrmMaster = async (params) => {
    let query = {
        isDeleted: false,
        status: 1
    };

    const result = await CrmMaster.find(query).lean();
    return result;
};

const getAllKeyValues = async (params) => {
    const result = await CrmMaster.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
              _id: "$type",
              values: {
                $addToSet: "$value",
              },
            },
          },
          {
            $project: {
              _id: 0,
              key: "$_id",
              value: "$values",
            },
          },
    ]);
    return result;
}

const getAllProductList = async () => {
    let query = { type: 'Products' };
    const result = await CrmMaster.find(query).select('value');
    return result;
}

module.exports = {
    createCrmMaster,
    updateCrmMaster,
    deleteCrmMaster,
    getCrmMasterList,
    getCrmMasterListCount,
    getCrmMasterDetails,
    getAllCrmMaster,
    getAllKeyValues,
    getAllProductList
}