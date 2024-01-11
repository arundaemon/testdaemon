const Users = require('../models/userModel');
const utils = require('../utils/utils')

const addUser = async (params) => {
    return Users.create(params)
}

const findOneByKey = async (query, populate) => {
    return Users.findOne(query).populate(populate)
}


const markDashboardFavourite = async (params) => {
    let { tokenPayload, dashboardId, isFavourite } = params
    let query = {}
    let update = {}
    let options = { new: true, upsert: true }
    query['$or'] = [{ email: tokenPayload.email }, { s_uuid: tokenPayload.s_uuid }]

    if (dashboardId && isFavourite) {
        update['$pull'] = { favouriteDashboards: dashboardId }
    }
    else if (dashboardId && !isFavourite) {
        update['$addToSet'] = { favouriteDashboards: dashboardId }
    }

    update = { ...update, ...tokenPayload }
    return Users.findOneAndUpdate(query, update, options)
}


const markReportFavourite = async (params) => {
    let { tokenPayload, reportId, isFavourite } = params
    let query = {}
    let update = {}
    let options = { new: true, upsert: true }
    query['$or'] = [{ email: tokenPayload.email }, { s_uuid: tokenPayload.s_uuid }]

    if (reportId && isFavourite) {
        update['$pull'] = { favouriteReports: reportId }
    }
    else if (reportId && !isFavourite) {
        update['$addToSet'] = { favouriteReports: reportId }
    }
    update = { ...update, ...tokenPayload }
    return Users.findOneAndUpdate(query, update, options)
}


const getUsersList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 }

    if (search) {
        query.firstName = { $regex: search, $options: 'i' }
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    }

    if (utils.isEmptyValue(count)) {
        count = 999
    }

    return Users.find(query).sort(sort).skip(pageNo * count).limit(count).populate('roleId').lean()
}


const getUsersListCount = async (params) => {
    let query = { isDeleted: false }
    let { search } = params
    if (search) {
        query.firstName = { $regex: search, $options: 'i' }
    }
    return Users.countDocuments(query)
}


const updateUser = async (params) => {
    let { userId, s_uuid, firstName, lastName, password, roleId,  email ,schoolCodes } = params

    let query = {}
    let update = {}
    let options = { new: true }
    query._id = userId

    if (s_uuid) {
        update.s_uuid = s_uuid;
    }

    if (firstName) {
        update.firstName = firstName;
    }

    if (lastName) {
        update.lastName = lastName;
    }

    if (password) {
        update.password = password;
    }

    if (roleId) {
        update.roleId = roleId;
    }

    if(!utils.isNullOrUndefined(email)){
        update.email = email;
    }

    if(!utils.isNullOrUndefined(schoolCodes)){
        update.schoolCodes = schoolCodes;
    }

    return Users.findOneAndUpdate(query, update, options)
}


const deleteUser = async (params) => {
    let { userId } = params
    let query = {_id : userId}
    let update = { isDeleted: true }
    let options = { new: true }

    return Users.findOneAndUpdate(query, update, options)
}


module.exports = {
    addUser,
    findOneByKey,
    markDashboardFavourite,
    markReportFavourite,
    getUsersList,
    getUsersListCount,
    updateUser,
    deleteUser
}