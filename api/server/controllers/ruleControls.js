const Rule = require('../models/ruleModel');
const utils = require('../utils/utils')

const createRule = async (params) => {
    return Rule.create(params)
}

const findOneByKey = async (query, populate) => {
    return Rule.findOne(query).populate(populate)
}

const findManyByKey = async (query, populate) => {
    return Rule.find(query).populate(populate)
}


const updateRule = async (params) => {
    let query = {}
    let update = {}
    let options = { new: true }
    query._id = params.ruleId

    if (params.ruleName)
        update.ruleName = params.ruleName

    if (params.filters)
        update.filters = params.filters

    if (params.logic)
        update.logic = params.logic

    if (params.modifiedBy)
        update.modifiedBy = params.modifiedBy

    if (params.modifiedBy_Uuid)
        update.modifiedBy_Uuid = params.modifiedBy_Uuid

    if (params.rolesLinked)
        update.rolesLinked = params.rolesLinked

    return Rule.findOneAndUpdate(query, update, options)
}


const deleteRule = async (params) => {
    let query = { _id: params.ruleId }
    let update = { isDeleted: true }
    let options = { new: true }
    return Rule.findOneAndUpdate(query, update, options)
}


const getRuleList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }

    if (search) {
        query = {
            ...query,
            $or: [
                { ruleName: { $regex: search, $options: 'i' } },
                { createdBy: { $regex: search, $options: 'i' } }
            ]
        }
    }

    if (sortKey && sortOrder)
        sort = { [sortKey]: sortOrder }

    if (utils.isEmptyValue(pageNo))
        pageNo = 0

    if (utils.isEmptyValue(count))
        count = 0

    return Rule.find(query).sort(sort).skip(pageNo * count).limit(count)
}

module.exports = {
    createRule,
    findOneByKey,
    updateRule,
    deleteRule,
    getRuleList,
    findManyByKey,
}