const AlternateContact = require('../models/alternateContactsModel');
const utils = require('../utils/utils');

const getAlternateContactList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, leadId } = params
    let sort = { createdAt: -1 };
    let query = { leadId }

    if (search) {
        query.alternateName = { $regex: search, $options: 'i' }
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

    return AlternateContact.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
}

const getListCount = async (params) => {
    let { search, leadId } = params
    let query = { leadId }
    
    if (search) {
        query.alternateName = { $regex: search, $options: 'i' }
    }
    return AlternateContact.countDocuments(query)
}

module.exports = {
    getAlternateContactList,
    getListCount
}
