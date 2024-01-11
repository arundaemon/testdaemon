const ApprovalMapping = require('../models/approvalMappingModel');
const utils = require('../utils/utils');

const createApprovalMapping = async (params) => {
    const result = await ApprovalMapping.create(params);
    return result;
}

const getApprovalMappingList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 };
    let query = {};

    if(search){
        query = {
            ...query,
             $or: [{ approvalType: { $regex: search, $options: 'i' } },
            { approverProfile: { $regex: search, $options: 'i' } }]            
        }
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

    const result = await ApprovalMapping.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
}

const getApprovalMappingDetails = async (id) => {
    const result = await ApprovalMapping.findById(id);
    return result;
}

const updateApprovalMapping = async (params) => {
    let { _id, approverProfile, approvalType, isApprove, approveMetaInfo,isReject, rejectMetaInfo, isReassign, isAssignToUser, modifiedBy_Uuid, modifiedBy } = params;
    let update = {};
    let query = {_id};
    let options = { new: true };

    if(approverProfile){
        update.approverProfile = approverProfile;
    }
    if(approvalType){
        update.approvalType = approvalType;
    }
    if(approveMetaInfo){
        update.approveMetaInfo = approveMetaInfo;
    }
    if(rejectMetaInfo){
        update.rejectMetaInfo = rejectMetaInfo;
    }
    if(modifiedBy){
        update.modifiedBy = modifiedBy;
    }
    if(modifiedBy_Uuid){
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }
    if (!utils.isEmptyValue(isApprove)) {
        update.isApprove = isApprove;
    }
    if (!utils.isEmptyValue(isReject)) {
        update.isReject = isReject;
    }
    if (!utils.isEmptyValue(isReassign)) {
        update.isReassign = isReassign;
    }
    if (!utils.isEmptyValue(isAssignToUser)) {
        update.isAssignToUser = isAssignToUser;
    }
    const result = await ApprovalMapping.findOneAndUpdate(query, update, options);
    return result;    
}


const getMappingInfo = async (params) => {
    let { approvalType } = params;
    let query = {
        approvalType,
        //isDeleted: false
    };
    const result = await ApprovalMapping.findOne(query);
    return result;
}
module.exports = {
    createApprovalMapping,
    getApprovalMappingList,
    getApprovalMappingDetails,
    updateApprovalMapping,
    getMappingInfo
}