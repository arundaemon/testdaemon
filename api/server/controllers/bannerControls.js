const Banner = require('../models/bannerModel');
const utils = require('../utils/utils');
const { BANNER_STATUS } = require('../constants/dbConstants');

const saveBanner = async (params) => {
    return Banner.create(params);
}

const updateBanner = async (params) => {
    let query = {}
    let update = {}
    let options = { new: true }
    query._id = params.bannerId

    let { appBanner, webBanner, bannerName, priority, startDate, endDate, modifiedBy, modifiedBy_Uuid, status } = params

    if (bannerName) {
        update.bannerName = bannerName
    }

    if (startDate) {
        update.startDate = startDate
    }

    if (endDate) {
        update.endDate = endDate
    }

    if (priority) {
        update.priority = priority
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy
    }
    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid
    }

    if (appBanner) {

        if (appBanner?.redirectToType)
            update['appBanner.redirectToType'] = appBanner?.redirectToType

        if (appBanner?.redirectUrl)
            update['appBanner.redirectUrl'] = appBanner?.redirectUrl

        if (appBanner?.bannerUrl)
            update['appBanner.bannerUrl'] = appBanner?.bannerUrl
    }

    if (webBanner) {

        if (webBanner?.redirectToType)
            update['webBanner.redirectToType'] = webBanner?.redirectToType

        if (webBanner?.redirectUrl)
            update['webBanner.redirectUrl'] = webBanner?.redirectUrl

        if (webBanner?.bannerUrl)
            update['webBanner.bannerUrl'] = webBanner?.bannerUrl
    }

    if (!utils.isEmptyValue(status)) {
        update.status = status
    }

    return Banner.findOneAndUpdate(query, update, options)
}


const deleteBanner = async (params) => {
    let query = { _id: params.bannerId }
    let update = { isDeleted: true }
    let options = { new: true }

    return Banner.findOneAndUpdate(query, update, options)
}



const getBannersList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }


    if (search) {
        query = {
            ...query,
            $or: [
                { bannerName: { $regex: search, $options: 'i' } },
                { createdBy: { $regex: search, $options: 'i' } },
            ]
        }
    }

    if (sortKey && sortOrder)
        sort = { [sortKey]: sortOrder }

    if (utils.isEmptyValue(pageNo))
        pageNo = 0

    if (utils.isEmptyValue(count))
        count = 0

    return Banner.find(query).sort(sort).skip(pageNo * count).limit(count)
}

const getBannerDetails = async (params) => {
    return Banner.findById(params.bannerId);
}


const updateBannerStatus = async (params) => {
    let query = {}
    let update = {}
    let options = { new: true }
    query._id = params.bannerId

    update.status = params.bannerStatus


    return Banner.findOneAndUpdate(query, update, options)
}

const countByKey = (query) => {
    return Banner.countDocuments(query)
}

const getAllActiveBanners = async (params) => {

    let query = { status: 1, isDeleted: false };

    return Banner.find(query)

}

const getActiveBannersCountByDate = async (params) => {

    let query = {
        $or: [{
            $and: [
                { startDate: { $lte: new Date(params.startDate) } },
                { startDate: { $lte: new Date(params.endDate) } }
            ]
        },
        {
            $and: [
                {
                    $or: [
                        { endDate: { $gte: new Date(params.endDate) } },
                        { endDate: { $lte: new Date(params.endDate) } },

                    ]
                },
                { endDate: { $gte: new Date(params.startDate) } }
            ]
        }],


        status: BANNER_STATUS.ACTIVE,
        isDeleted: false
    };



    let countTotal = await Banner.countDocuments(query);
    console.log(countTotal, "count of ACTIVE BANNER IN control");
    return countTotal;
}

const checkPriorityExists = async (params) => {

    let query = {
        $or: [{
            $and: [
                { startDate: { $lte: new Date(params.startDate) } },
                { startDate: { $lte: new Date(params.endDate) } }
            ]
        },
        {
            $and: [
                {
                    $or: [
                        { endDate: { $gte: new Date(params.endDate) } },
                        { endDate: { $lte: new Date(params.endDate) } },

                    ]
                },
                { endDate: { $gte: new Date(params.startDate) } }
            ]
        }],
        priority: params.priority,
        isDeleted: false

    }

    let priorityCount = await Banner.countDocuments(query);
    console.log(priorityCount, "count of priority in control")
    return priorityCount
}

module.exports = {
    saveBanner,
    deleteBanner,
    getBannersList,
    updateBanner,
    getBannerDetails,
    updateBannerStatus,
    countByKey,
    getAllActiveBanners,
    getActiveBannersCountByDate,
    checkPriorityExists
}