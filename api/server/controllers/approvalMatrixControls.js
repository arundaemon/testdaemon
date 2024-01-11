const ApprovalMatrix = require('../models/approvalMatrixModel');
const utils = require('../utils/utils');

const createApprovalMatrix = async (params) => {
    const result = ApprovalMatrix.create(params);
    return result;
}

const getApprovalMatrixList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, type, groupCode } = params
    let sort = { createdAt: -1 };
    let query = {}

    if (type && groupCode) {
        query = {
            $and: [
                { approvalType: { $regex: type, $options: 'i' } },
                { approvalGroupCode: { $regex: groupCode, $options: 'i' } },
            ]
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
    return ApprovalMatrix.find(query).sort(sort).skip(pageNo * count).limit(count).lean();
    
}

const updateApprovalMatrix = async (params) => {
    let { _id} = params;
    let options = { new: true };
    return ApprovalMatrix.findOneAndUpdate({ _id }, params, options);
}

const isDuplicateApprovalMatrix = async (params) => {
    let { approvalType, approvalGroupCode } = params;
    let query = { approvalType, approvalGroupCode };
    // if (_id) {
    //     query._id = { $ne: _id };
    // }

    const result = await ApprovalMatrix.findOne(query);
    return result;

}

module.exports = {
    createApprovalMatrix,
    isDuplicateApprovalMatrix,
    getApprovalMatrixList,
    updateApprovalMatrix

}