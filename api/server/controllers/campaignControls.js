const Campaign = require('../models/campaignModel');
const utils = require('../utils/utils');

const findOneByKey = async (query) => {
    return Campaign.findOne(query)
}
const createCampaign = async (params) => {
    const result = await Campaign.create(params);
    return result;
}

const isDuplicateCampaign = async (campaignName, id) => {
    let query = { campaignName, isDeleted: false };
    if (id) {
        query._id = { $ne: id };
    }
    return Campaign.findOne(query);
}

const getCampaignList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, loggedInUser } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if(loggedInUser){
        query.createdBy_Uuid = loggedInUser
    }

    if (search) {
        query.campaignName = { $regex: search, $options: 'i' }
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

    const result = await Campaign.find(query)
        .populate('source', 'leadSourceName subSource')
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
}

const getCampaignListCount = async (params) => {
    let query = { isDeleted: false }
    let { search, loggedInUser } = params
    if(loggedInUser){
        query.createdBy_Uuid = loggedInUser
    }
    if (search) {
        query.campaignName = { $regex: search, $options: 'i' }
    }
    return Campaign.countDocuments(query)
}

const updateCampaign = async (params) => {
  
    let { _id, campaignName, campaignOwner, type, status, startDate, endDate, link, qrCode, modifiedBy, modifiedBy_Uuid } = params;
    
    let update = {};
    let options = { new: true };

    if (campaignName) {
        update.campaignName = campaignName;
    }

    if (campaignOwner) {
        update.campaignOwner = campaignOwner;
    }

    if (type) {
        update.type = type;
    }
    else{
        update.type="";
    }

    if (startDate) {
        update.startDate = startDate;
    }

    if (endDate) {
        update.endDate = endDate;
    }

    if (link) {
        update.link = link;
    }

    if (qrCode) {
        update.qrCode = qrCode;
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
    if(_id){
        return Campaign.findOneAndUpdate({ _id }, update, options);
    }else{
        throw Error('Please provide valid Campaign Id to update')
    }    
}

const getCampaignDetails = async (id) => {
    return Campaign.findById(id).populate('source', 'leadSourceName subSource');
}


module.exports = {
    createCampaign,
    getCampaignList,
    getCampaignListCount,
    updateCampaign,
    getCampaignDetails,
    findOneByKey,
    isDuplicateCampaign
}