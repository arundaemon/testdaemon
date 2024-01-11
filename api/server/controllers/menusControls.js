const Menus = require('../models/menusModel');
const utils = require('../utils/utils')

const createMenu = async (params) => {
    return Menus.create(params)
}

const findOneByKey = async (query, populate) => {
    return Menus.findOne(query).populate(populate)
}

const saveRoleMenuMapping = async (params) => {
    let { menus } = params

    let MenuUpdatePromises = menus?.map(menu => {
        let query = { _id: menu._id }
        let update = { rolesAllowed: menu?.rolesAllowed }

        let options = { new: true }
        return Menus.findOneAndUpdate(query, update, options)
    })

    return Promise.allSettled(MenuUpdatePromises)
}

const updateMenu = async (params) => {
    let query = {}
    let update = {}
    let options = { new: true }

    query._id = params.menuId

    if (params.name)
        update.name = params.name

    if (params.route)
        update.route = params.route

    if (params.rolesAllowed)
        update.rolesAllowed = params.rolesAllowed

    if (params.iconUrl)
        update.iconUrl = params.iconUrl

    if (params.parentMenu)
        update.parentMenu = params.parentMenu

    if (params.projectId)
        update.projectId = params.projectId

    if (params.menuOrderIndex) {
        update.menuOrderIndex = params.menuOrderIndex
    }

    if (!utils.isEmptyValue(params.externalRedirection))
        update.externalRedirection = params.externalRedirection


    if (!utils.isEmptyValue(params.isHrmMenu))
        update.isHrmMenu = params.isHrmMenu

    if (!utils.isEmptyValue(params.otpVerify))
        update.otpVerify = params.otpVerify

    if (params.landingPage)
        update.landingPage = params.landingPage

    return Menus.findOneAndUpdate(query, update, options)
}


const deleteMenu = async (params) => {
    let query = { _id: params.menuId }
    let update = { isDeleted: true }
    let options = { new: true }

    return Menus.findOneAndUpdate(query, update, options)
}


const getMenusList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search, rolesAllowedFilter, projectIdFilter } = params
    let sort = { createdAt: -1 }
    
    count = parseInt(count)
    pageNo=parseInt(pageNo)
    if(count == NaN){
        count = 999
    }
    if(pageNo == NaN){
        pageNo=0
    }
    if (search)
        query.name = { $regex: search, $options: 'i' }

    if (rolesAllowedFilter && rolesAllowedFilter.length) {
        query.rolesAllowed = { $in: rolesAllowedFilter }
    }
    if (projectIdFilter && projectIdFilter.length) {
        query.projectId = { $in: projectIdFilter }
    }

    if (sortKey && sortOrder)
        sort = { [sortKey]: sortOrder }

    if (utils.isEmptyValue(pageNo))
        pageNo = 0

    if (utils.isEmptyValue(count))
        count = 0


    return Menus.find(query).sort(sort).skip(pageNo * count).limit(count).populate('parentMenu projectId')
}

const getMenusListCount = async (params) => {
    let query = { isDeleted: false }
    let { search, rolesAllowedFilter } = params

    if (search)
        query.name = { $regex: search, $options: 'i' }

    if (rolesAllowedFilter && rolesAllowedFilter.length) {
        query.rolesAllowed = { $in: rolesAllowedFilter }
    }

    return Menus.count(query)
}

const getAllMenus = async (params) => {
    let query = { isDeleted: false }
    let sort = { name: 1 }

    return Menus.find(query).sort(sort).populate('parentMenu')
}

const getAllGroupedMenu = async (params) => {
    let { tokenPayload } = params
    let aggPipe = []
    let query = { isDeleted: false }

    query.rolesAllowed = { $in: [tokenPayload.crm_profile] }

    let sort = { name: 1 }
    aggPipe.push({ $match: query })
    aggPipe.push({ $sort: sort })

    let lookup = {
        from: 'menus',
        localField: 'parentMenu',
        foreignField: '_id',
        as: 'parentDetails'
    }
    aggPipe.push({ $lookup: lookup })

    let group = {
        _id: { parentId: "$parentMenu" },
        parentDetails: { $first: '$parentDetails' },
        menus: { $push: "$$ROOT" }
    }
    aggPipe.push({ $group: group })

    //aggPipe.push({ $sort: { name: 1 } })

    return Menus.aggregate(aggPipe)

}


const getAllSideBarMenus = async (params) => {
    let { tokenPayload } = params
    let query = { isDeleted: false }

    if (tokenPayload?.crm_profile) {
        query.rolesAllowed = { $in: tokenPayload.crm_profile }
    }
    let sort = { name: 1 }
    return Menus.find(query).sort(sort).populate('parentMenu')
}

module.exports = {
    createMenu,
    findOneByKey,
    updateMenu,
    deleteMenu,
    getMenusList,
    getMenusListCount,
    getAllMenus,
    saveRoleMenuMapping,
    getAllSideBarMenus,
    getAllGroupedMenu,
}