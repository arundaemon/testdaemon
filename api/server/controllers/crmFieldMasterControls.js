const CrmFieldMaster = require('../models/crmFieldMasterModel');
const utils = require('../utils/utils');

const createCrmFieldMaster = async (params) => {
    let { fieldName } = params;
    const words = fieldName.split(' ');
    const camelCasedWords = words.map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
      });
    const code = camelCasedWords.join('');
    params.fieldCode = code;
    const result = await CrmFieldMaster.create(params);
    return result;
};

const isDuplicateEntry = async (fieldName, id) => {
    let query = { fieldName, isDeleted: false };

    if(id){
        query._id = {$ne: id};
    }
    
    return CrmFieldMaster.findOne(query);
}

const getAllCrmFieldMasterList = async (params) => {
    let {listFlag } = params;
    let query = { isDeleted: false, status: 1 }
    let sort = { fieldName: 1 }

    if (listFlag){
        query.fieldType = { $in: ['Pick-list', 'Checklist']}
    }

    return CrmFieldMaster.find(query).sort(sort);
};

const getCrmFieldMasterList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (search) {
        query.fieldName = { $regex: search, $options: 'i' }
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

    const result = await CrmFieldMaster.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
};

const getCrmFieldMasterListCount = async (params) => {
    let query = { isDeleted: false }
    let { search } = params

    if (search) {
        query.fieldName = { $regex: search, $options: 'i' }
    }
    return CrmFieldMaster.countDocuments(query)
};

const updateCrmFieldMaster = async (params) => {

    let { _id, fieldType, fieldName, type, status, modifiedBy, modifiedBy_Uuid } = params;

    let update = {};
    let options = { new: true };

    if (fieldName) {
        const words = fieldName.split(' ');
        const firstWord = words[0].toLowerCase();
        const remaingString = words.slice(1).join('');
        const code = firstWord + remaingString;
        update.fieldName = fieldName;
        // update.fieldCode = code
    }

    if (fieldType) {
        update.fieldType = fieldType;
    }

    if (type) {
        update.type = type;
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

    const result = await CrmFieldMaster.findOneAndUpdate({ _id }, update, options);
    return result;
};


module.exports = {
    createCrmFieldMaster,
    getAllCrmFieldMasterList,
    isDuplicateEntry,
    getCrmFieldMasterList,
    updateCrmFieldMaster,
    getCrmFieldMasterListCount
}