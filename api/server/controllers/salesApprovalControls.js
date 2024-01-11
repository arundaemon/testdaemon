const SalesApproval = require('../models/salesApprovalModel');
const ApprovalMatrix = require('../models/approvalMatrixModel');
const utils = require('../utils/utils');
const { getHierachyDetails } = require('../functions/hierachyFunctions');
const { APPROVAL_STATUS } = require('../constants/dbConstants');
const quotationFunctions = require('../functions/quotationFunctions');
const purchaseOrderFunctions = require('../functions/purchaseOrderFunctions')
const implementationFormFunctions = require("../functions/implementationFormFunctions");
const implementationSiteSurveyFunctions = require('../functions/implementationSiteSurveyFunctions');
const npsStatusUpdateFunction = require('../functions/npsStatusUpdateFunction');
const collectionFunctions = require('../functions/collectionFunctions');



const getSalesApprovalListAll = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 };
    let query = {}
    
    if (search!=='' && search) {
        query = {
            $and: [
                { referenceCode: { $regex: search, $options: 'i' } },
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
        count = 100
    } else {
        count = parseInt(count);
    }
    return SalesApproval.find(query).skip(pageNo * count).sort(sort).limit(count).lean();
}

const getSalesApprovalList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, type, groupCode, assignedToEmpId } = params
    let sort = { createdAt: -1 };
    let query = {}

    if ((search || search === '') && (type && groupCode)) {
        query = {
            $and: [
                { approvalType: { $regex: type, $options: 'i' } },
                { groupCode: { $regex: groupCode, $options: 'i' } },
                { approvalId: { $regex: search, $options: 'i' } },
                { assignedToEmpId: { $regex: assignedToEmpId, $options: 'i' } },
                { status: { $regex: 'Pending', $options: 'i' } }
            ]
        }
    }
    if (!search && (type && groupCode)) {
        query = {
            $and: [
                { approvalType: { $regex: type, $options: 'i' } },
                { groupCode: { $regex: groupCode, $options: 'i' } },
                { assignedToEmpId: { $regex: assignedToEmpId, $options: 'i' } },
                { status: { $regex: 'Pending', $options: 'i' } }
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
    const totalDocs = await SalesApproval.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / count);
    const result =await SalesApproval.find(query).skip(pageNo * count).sort(sort).limit(count).lean();
    return {
        data: result,
        totalPages:totalPages,
    }
}

const assignApprovalRequest = async ({ params, headers, tokenPayload }) => {
    let approvalType = params.approvalType
    let groupCode = params.groupCode
    let data = params?.data ?? {}
    let statusUpdate = params?.statusUpdate ?? true
    delete params.data
    let approvalMatrix = await getApprovalMatrix(approvalType, groupCode)
    let roleList = []
    let dataObj = {
        approvalId: '',
        remarks: [],
        ...params,
        ...data
    }
    try {
        let res = await getHierachyDetails({ roleName: params.createdByRoleName })
        roleList = utils.recursiveSearch(res.hierarchyInfo, 'parents')
    } catch (e) {
        return new Promise((resolve, reject) => reject('Something went wrong while fetching Role Hierarchy'))
    }
    if (roleList.length === 1 && roleList[0].length === 0) {
        return new Promise((resolve, reject) => reject('Role Hierarchy not found for this User'))
    }
    if (roleList.length > 0 && approvalMatrix) {
        let currentCount = await SalesApproval.countDocuments({})
        let reqCode = `REQ-${params.approvalType.replace(/ /g, '_')}-${currentCount + 1}`
        dataObj['approvalId'] = reqCode
        let L1Obj = approvalMatrix.approvalLevels[0]
        if (approvalMatrix.approvalRuleType === 'Percentage') {
            if (!dataObj.hasOwnProperty('discountPercent')) {
                return new Promise((resolve, reject) => reject('Please provide discount percent (discountPercent)'))
            } else {
                let discountPercent = parseInt(dataObj?.discountPercent)
                if (isNaN(discountPercent)) {
                    return new Promise((resolve, reject) => reject('Discount percent must be a valid number'))
                }
                for (let i = 0; i < approvalMatrix.approvalLevels.length; i++) {
                    let approvalLevelObj = approvalMatrix.approvalLevels[i]
                    let maxValue = parseInt(approvalLevelObj.max)
                    if ((discountPercent > maxValue) && (i === (approvalMatrix.approvalLevels.length - 1))) {
                        return new Promise((resolve, reject) => reject('Discount value exceeds the limit!!'))

                    }
                }
            }
        }
        dataObj = await getRoleObj(dataObj, approvalMatrix, roleList, L1Obj.profileName, params.createdByRoleName)
        if (!dataObj) {
            return new Promise((resolve, reject) => reject('Next Level Role Not found for Current Role'))
        }
    } else {
        if (!approvalMatrix) {
            return new Promise((resolve, reject) => reject('Approval Matrix Not found for this combination'))
        } else {
            return new Promise((resolve, reject) => reject('Role Hierarchy not found for this User'))
        }
    }
    let currentRequest = await SalesApproval.create(dataObj)
    if (statusUpdate) {
        await approvalTypeStatusUpdate({ currentRequest, approvalMatrix }, currentRequest?.createdByUuid, 'create', headers, tokenPayload)
    }
    return currentRequest
}

const acceptApprovalRequest = async ({ params, headers, tokenPayload }) => {
    if (!params?.approvalId.length > 0) {
        return new Promise((resolve, reject) => reject('Please provide ApprovalId'))
    }
    if (!params?.uuid) {
        return new Promise((resolve, reject) => reject('Please provide uuid'))
    }
    const results = [];
    const uuid = params?.uuid
    const approvalIdArray = params?.approvalId
    const updatedObjectArray = params?.updatedObjectArray ?? []
    const isAdjust = params?.adjust ? params?.adjust : false
    const remark = params?.remark ?? ''
    for (let i = 0; i < approvalIdArray.length; i++) {
        const id = approvalIdArray[i];
        const updatedObject = updatedObjectArray[i]
        try {
            const result = await acceptSingleApprovalRequest({ approvalId: id, remarks: remark, updatedObject: updatedObject, adjust: isAdjust })
            //console.log(result)
            const typeUpdateResponse = await approvalTypeStatusUpdate(result, uuid, 'approve', headers, tokenPayload)
            results.push({ message: `ApprovalId:${id} updated`, result });
        } catch (error) {
            return Promise.reject("Error : " + error);
        }
    }
    return Promise.resolve(results);
};

const rejectApprovalRequest = async ({ params, headers, tokenPayload }) => {
    if (!params?.approvalId?.length > 0) {
        return new Promise((resolve, reject) => reject('Please provide ApprovalId'))
    }
    if (!params?.uuid) {
        return new Promise((resolve, reject) => reject('Please provide uuid'))
    }
    const results = [];
    const uuid = params?.uuid
    const approvalIdArray = params?.approvalId;
    const updatedObjectArray = params?.updatedObjectArray ?? []
    const remark = params?.remark ?? ''
    for (let i = 0; i < approvalIdArray.length; i++) {
        const id = approvalIdArray[i];
        const updatedObject = updatedObjectArray[i]
        try {
            const result = await rejectSingleApprovalRequest({ approvalId: id, remarks: remark, updatedObject: updatedObject });
            const typeUpdateResponse = await approvalTypeStatusUpdate(result, uuid, 'reject', headers, tokenPayload)
            results.push({ message: `ApprovalId:${id} updated`, result });
        } catch (error) {
            return Promise.reject("Error : " + error);
        }
    }
    return Promise.resolve(results);
};

const acceptSingleApprovalRequest = async (params) => {
    if (!params.approvalId) {
        return new Promise((resolve, reject) => reject('Please provide ApprovalId'))
    }
    let approvalObj = await SalesApproval.findOne({ approvalId: params.approvalId, status: APPROVAL_STATUS.PENDING }).lean()
    if (params?.updatedObject) { //update approvalObj so further new entries will contain updated values
        Object.keys(params?.updatedObject).forEach(key => {
            if (approvalObj.hasOwnProperty(key)) {
                approvalObj[key] = params?.updatedObject[key];
            }
        });
    }

    let dataObj = {
        ...approvalObj,
        assignedToRoleName: '',
        assignedToProfileName: '',
        assignedToEmpId: '',
        assignedToName: ''
    }
    delete dataObj._id
    if (approvalObj) {
        let updateObj = {
            ...params.updatedObject,
            status: params?.adjust ? APPROVAL_STATUS.ADJUSTED : APPROVAL_STATUS.APPROVED,
            remarks: params.remarks ? params.remarks : approvalObj.remarks ? approvalObj.remarks : '',
        }
        const uniqueId = approvalObj._id
        let roleList = []
        let approvalMatrix = await getApprovalMatrix(approvalObj.approvalType, approvalObj.groupCode)
        let currentRequest
        let nextRequest
        if (approvalMatrix) {
            try {
                let res = await getHierachyDetails({ roleName: approvalObj.createdByRoleName })
                roleList = utils.recursiveSearch(res.hierarchyInfo, 'parents')
            } catch (e) {
                return new Promise((resolve, reject) => reject('Something went wrong while fetching Role Hierarchy'))
            }
            if (roleList.length > 0) {
                let currentIndex = approvalMatrix.approvalLevels.findIndex(obj => obj.profileName === approvalObj.relevantId);
                let nextLevelObj = approvalMatrix.approvalLevels[currentIndex + 1]
                //console.log(approvalMatrix,currentIndex,nextLevelObj)
                if (nextLevelObj) {
                    dataObj = await getRoleObj(dataObj, approvalMatrix, roleList, nextLevelObj.profileName, approvalObj.assignedToRoleName)
                    if (dataObj) {
                        if (dataObj.assignedToRoleName === approvalObj.assignedToRoleName) {
                            currentRequest = await SalesApproval.findOneAndUpdate({ _id: uniqueId }, updateObj, { new: true }).lean()
                            return { currentRequest, approvalMatrix }
                        } else {
                            if (approvalMatrix.approvalRuleType === 'Percentage') {
                                let discountPercent = parseInt(approvalObj.discountPercent)
                                let minValue = parseInt(nextLevelObj.min)
                                let maxValue = parseInt(nextLevelObj.max)
                                if (discountPercent <= maxValue) {
                                    currentRequest = await SalesApproval.findOneAndUpdate({ _id: uniqueId }, updateObj, { new: true }).lean()
                                    nextRequest = await SalesApproval.create(dataObj)
                                    return { currentRequest, nextRequest, approvalMatrix }
                                } else {
                                    currentRequest = await SalesApproval.findOneAndUpdate({ _id: uniqueId }, updateObj, { new: true }).lean()
                                    return { currentRequest }
                                }
                            } else {
                                currentRequest = await SalesApproval.findOneAndUpdate({ _id: uniqueId }, updateObj, { new: true }).lean();
                                nextRequest = await SalesApproval.create(dataObj)
                                return { currentRequest, nextRequest, approvalMatrix }
                            }
                        }
                    } else {
                        return new Promise((resolve, reject) => reject('Next Level Role Not found for Current Role'))
                    }
                } else {
                    currentRequest = await SalesApproval.findOneAndUpdate({ _id: uniqueId }, updateObj, { new: true }).lean()
                    return { currentRequest, approvalMatrix }
                }

            } else {
                return new Promise((resolve, reject) => reject('Role Hierarchy not found for this User'))
            }
        } else {
            return new Promise((resolve, reject) => reject('Approval Matrix Not found for this combination'))
        }
    } else {
        return new Promise((resolve, reject) => reject('Invalid Approval ID'))
    }
}

const rejectSingleApprovalRequest = async (params) => {
    if (!params.approvalId) {
        return new Promise((resolve, reject) => reject('Please provide ApprovalId'))
    }
    let approvalObj = await SalesApproval.findOne({ approvalId: params.approvalId, status: APPROVAL_STATUS.PENDING }).lean()
    if (approvalObj) {
        let updateObj = {
            ...params.updatedObject,
            status: APPROVAL_STATUS.REJECTED,
            remarks: params.remarks ? params.remarks : approvalObj.remarks ? approvalObj.remarks : '',
        }
        let currentRequest = await SalesApproval.findOneAndUpdate({ _id: approvalObj._id }, updateObj, { new: true }).lean()
        return { currentRequest }
    } else {
        return new Promise((resolve, reject) => reject('Invalid Approval ID'))
    }
}

const getApprovalMatrix = async (approvalType, groupCode) => {
    return ApprovalMatrix.findOne({ approvalType: approvalType, approvalGroupCode: groupCode, status: true }).lean()
}

const getRoleObj = async (dataObj, approvalMatrix, roleList, profileName, currentRole) => {
    dataObj['relevantId'] = profileName
    switch (approvalMatrix.approvalRuleType) {
        case 'Flat Hierarchy':
            roleObj = roleList.find(obj => obj.profileName === profileName)
            if (!roleObj) {
                let filterObj = roleList.find(obj => obj.roleName === currentRole)
                if (filterObj && filterObj.parents) {
                    roleObj = { ...filterObj.parents }
                } else if (currentRole === dataObj.createdByRoleName) {
                    roleObj = roleList[0]
                } else {
                    roleObj = null
                }
            }
            break;
        case 'Percentage':
            roleObj = roleList.find(obj => obj.profileName === profileName)
            if (!roleObj) {
                let filterObj = roleList.find(obj => obj.roleName === currentRole)
                if (filterObj && filterObj.parents) {
                    roleObj = { ...filterObj.parents }
                } else if (currentRole === dataObj.createdByRoleName) {
                    roleObj = roleList[0]
                } else {
                    roleObj = null
                }
            }
            break;
        default:
            let res = await getHierachyDetails({ roleName: profileName })
            roleList = utils.recursiveSearch(res.hierarchyInfo, 'parents')
            roleObj = roleList.find(obj => obj.roleName === profileName)
            if (!roleObj) {
                roleObj = null
            }
            break;
    }
    if (roleObj) {
        dataObj = {
            ...dataObj,
            assignedToRoleName: roleObj.roleName,
            assignedToProfileName: roleObj.profileName,
            assignedToEmpId: roleObj.userName,
            assignedToName: roleObj.displayName
        }
        return dataObj
    } else {
        return false
    }

}

const approvalTypeStatusUpdate = async (result, uuid, action, headers, tokenPayload) => {
    if (!result?.currentRequest) {
        return new Promise((resolve, reject) => reject(result))
    }
    let currentRequest = result?.currentRequest
    let nextRequest = result?.nextRequest
    let approvalMatrixType = result?.approvalMatrix?.approvalRuleType ?? "NA"
    let status
    let newRequest = false
    if (action === 'approve') {
        status = nextRequest?.status ? (`${nextRequest?.status} at ${approvalMatrixType === "Role Based" ? nextRequest?.assignedToRoleName : nextRequest?.assignedToProfileName}`) : "Approved"
    } else if (action === 'reject') {
        status = 'Rejected'
    } else if (action === 'create') {
        newRequest = true
        status = `${currentRequest?.status} at ${approvalMatrixType === "Role Based" ? currentRequest?.assignedToRoleName : currentRequest?.assignedToProfileName}`
    }
    const updateObject = {
        type: currentRequest?.approvalType,
        referenceCode: currentRequest?.referenceCode,
        status: status,
        modifiedByName: newRequest ? currentRequest?.createdByName : currentRequest?.assignedToName,
        modifiedByRoleName: newRequest ? currentRequest?.createdByRoleName : currentRequest?.assignedToRoleName,
        modifiedByProfileName: newRequest ? currentRequest?.createdByProfileName : currentRequest?.assignedToProfileName,
        modifiedByEmpCode: newRequest ? currentRequest?.createdByEmpcode : currentRequest?.assignedToEmpId,
        modifiedByUuid: uuid
    };

    if (updateObject.type === 'PO') {
        return await purchaseOrderFunctions.updatePurchaseOrderApprovalStatus(updateObject, headers, tokenPayload, currentRequest)
    } else if (updateObject.type === 'Quotation Actual' || updateObject.type === 'Quotation Demo') {
        return await quotationFunctions.updateQuotationApprovalStatus(updateObject, currentRequest)
    } else if (updateObject.type === 'Implementation') {
        return await implementationFormFunctions.updateImpApprovalStatus(updateObject, currentRequest)
    } else if (updateObject.type === 'Implementation Site Survey') {
        return await implementationSiteSurveyFunctions.updateApprovalStatus(updateObject, currentRequest)
    } else if (updateObject.type === 'Invoice & Collection Schedule (Raise NPS)') {
        return await npsStatusUpdateFunction.npsRequestStatusUpdate(headers, tokenPayload, currentRequest)
    } else if (updateObject.type === 'Generate Addendum') {
        return await collectionFunctions.addendumRequestStatusUpdate(headers, tokenPayload, currentRequest)
    } else {
        return new Promise((resolve, reject) => reject('Error in status update!'))
    }
}

module.exports = {
    getSalesApprovalList,
    assignApprovalRequest,
    acceptApprovalRequest,
    rejectApprovalRequest,
    getSalesApprovalListAll
}