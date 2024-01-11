const ApprovalRequest = require('../models/approvalRequestModel');
const utils = require('../utils/utils');
const hierachyFunctions = require('../functions/hierachyFunctions');
const approvalMappingFunctions = require('../functions/approvalMappingFunctions');
const { DB_MODEL_REF, CLAIM_STATUS } = require('../constants/dbConstants');


const createRequest = async (params) => {
    try {
        let { requestType, requestBy_roleId } = params;
        const mappingData = await approvalMappingFunctions.getMappingInfo({ approvalType: requestType });
        const count = await ApprovalRequest.countDocuments();
        const newCount = count + 1;
        const approverProfile = mappingData?.result?.approverProfile;

        let hierachyParams = { roleName: requestBy_roleId }
        const managerResponse = await hierachyFunctions.getHierachyDetails(hierachyParams);
        const hierarchyResult = managerResponse?.result;
        const approverDetails = getApproverDetails(hierarchyResult, approverProfile);
        if (approverDetails.message === "No profile found") {
            params.approver_roleId = hierarchyResult?.["roleID"]
            params.approver_empCode = hierarchyResult?.["userName"]
            params.approver_name = hierarchyResult?.["displayName"]
            params.approver_roleName = hierarchyResult?.["roleName"]
            params.approver_profileName = hierarchyResult?.["profileName"]
            params.currentStatus = `${CLAIM_STATUS.PENDING_AT_L1}`
            if (hierarchyResult?.["roleName"] === 'CBO') {
                params.currentStatus = `${CLAIM_STATUS.PENDING_AT_CBO}`
            }
        }

        let data = {
            ...params,
            ...approverDetails,
            requestNumber: `REQ-${newCount}`,
        }
        const result = await ApprovalRequest.create(data);
        return result;
    }
    catch (err) {
        console.log(err, ':: error inside catch create request');
        throw err;
    }



}

const getApproverDetails = (hierarchyResult, approverProfile) => {
    try {
        let approverProfileLength = approverProfile?.length;
        //let profileString = hierarchyResult?.roleName.substring(0, approverProfileLength);
        let profileString = hierarchyResult?.profileName;
        if (approverProfile === profileString) {
            result = {
                approver_roleId: hierarchyResult?.["roleID"],
                approver_empCode: hierarchyResult?.["userName"],
                approver_name: hierarchyResult?.["displayName"],
                approver_roleName: hierarchyResult?.["roleName"],
                approver_profileName: hierarchyResult?.["profileName"],
                currentStatus: `PENDING AT ${approverProfile}`
            }
            return result;
        }
        else if (hierarchyResult?.parents) {
            let hierarchyData = hierarchyResult?.parents
            return getApproverDetails(hierarchyData, approverProfile)
        }
        else {
            console.log({ message: "No profile found" });
            return { message: "No profile found" };
        }
    }
    catch (err) {
        throw err
    }
}

const getRequestList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, reqStatus, type, tokenPayload, roleName,reqDate, requestByEmpCode } = params;
    let sort = { createdAt: -1 };

    let query = {}

    if (requestByEmpCode) {
        query.requestBy_empCode = requestByEmpCode;
    }

    if (reqStatus && reqStatus === 'NEW') {
        query.currentStatus = { $nin: ['APPROVED', 'REJECTED']};
    }else if (reqStatus && reqStatus !== 'NEW') {
        query.currentStatus = reqStatus;
    }


    if (type === 'requester') {
        query.requestBy_empCode = tokenPayload?.employee_code;
    }
    
    if(roleName){
        query.approver_roleName = roleName;
    }

    if(reqDate){
        let date = new Date(reqDate)
        query['$expr'] = { "$eq": [{ "$month": "$raisedDate" }, (date.getMonth() + 1)] }
    }

    if (search) {
        query = {
            ...query,
            $or: [
                { requestNumber: { $regex: search, $options: 'i' } },
                { requestId: { $regex: search, $options: 'i' } }
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

    const result = await ApprovalRequest.find(query).sort(sort).collation( { locale: "en_US", numericOrdering: true })
        .skip(pageNo * count).limit(count).lean();
   
    return result;
}

const getRequestListCount = async (params) => {
    // let query = { isDeleted: false }
    let { search, loggedInId, reqStatus, type, tokenPayload, roleName, requestByEmpCode, reqDate } = params

    let query = {}

    if (reqStatus && reqStatus === 'NEW') {
        query.currentStatus = { $nin: ['APPROVED', 'REJECTED']};
    }else if (reqStatus && reqStatus !== 'NEW') {
        query.currentStatus = reqStatus;
    }

    if (requestByEmpCode) {
        query.requestBy_empCode = requestByEmpCode;
    }

    if (type === 'requester') {
        query.requestBy_empCode = tokenPayload?.employee_code;
    }
    else {
        //query.approver_empCode = tokenPayload?.employee_code;
        query.approver_roleName = roleName;
    }
    if(roleName){
        query.approver_roleName = roleName;
    }

    if(reqDate){
        let date = new Date(reqDate)
        query['$expr'] = { "$eq": [{ "$month": "$raisedDate" }, (date.getMonth() + 1)] }
    }

    if (search) {
        query = {
            ...query,
            $or: [
                { requestNumber: { $regex: search, $options: 'i' } },
                { requestId: { $regex: search, $options: 'i' } }
            ]
        }
    }

    return ApprovalRequest.countDocuments(query)
}



const getRequestDetails = async (id) => {
    return ApprovalRequest.findById(id);
}

const approveReject = async (params) => {
    let { _id, requestStatus, remarks } = params;
    let update = { requestStatus, remarks, statusModifiedDate: new Date() };
    let options = { new: true };
    const result = await ApprovalRequest.findOneAndUpdate({ _id }, update, options);
    return result;
}

const reassignRequest = async (params) => {
    let { _id, approver_empCode, approver_name, approver_roleId, approver_roleName, approver_profileName } = params;
    let query = { _id };
    let update = {
        approver_empCode, approver_name, approver_roleId, approver_roleName, approver_profileName
    }
    let options = { new: true };

    const result = await ApprovalRequest.findOneAndUpdate(query, update, options);
    return result;
}

const isDuplicateRequest = async (params) => {
    let { requestId } = params;
    const result = await ApprovalRequest.findOne({ requestId });
    return result;
}

const createNewRequest = async (params) => {
    return ApprovalRequest.create(params);
}

const getRequestByEmpCode = async (params) => {
    let query = {
        requestBy_empCode: { $in: params?.empCodeList },
        requestStatus: 'NEW',
        approver_roleName: params?.loggedInUser
    }
    const result = await ApprovalRequest.find(query);
    return result;
}

const updateCurrentStatus = async (params) => {
    let { requestId, currentStatus } = params;
    let query = {
        requestId
    };
    let update = { currentStatus };
    let options = { new: true };

    const result = await ApprovalRequest.updateMany(query, update, options);
    return result
}

module.exports = {
    createRequest,
    getRequestList,
    getRequestListCount,
    getRequestDetails,
    approveReject,
    reassignRequest,
    isDuplicateRequest,
    createNewRequest,
    getRequestByEmpCode,
    updateCurrentStatus
}