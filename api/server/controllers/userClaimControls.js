const MyClaim = require('../models/userClaimModel');
const approvalRequestControls = require('./approvalRequestControls');
const utils = require('../utils/utils');
const hierachyFunctions = require('../functions/hierachyFunctions');
const ApprovalRequest = require('../models/approvalRequestModel');
const { CLAIM_STATUS } = require('../constants/dbConstants');

const createMyClaim = async (params) => {
    let { requestBy_roleId, claimAmount } = params;
    try {
        let update = {};
        let hierachyParams = { roleName: requestBy_roleId }
        const managerResponse = await hierachyFunctions.getHierachyDetails(hierachyParams);
        if (managerResponse?.result?.length !== 0) {
            params.approvedAmount = claimAmount;
            const result = await MyClaim.create({...params,requestByRoleName: requestBy_roleId});
            const saveRequest = await createApprovalRequest(result, params);
            if (saveRequest) {
                let profileString = saveRequest?.approver_profileName;
                if (profileString === 'BUH') {
                    update.claimStatus = `${CLAIM_STATUS.PENDING_AT_BUH}`;
                }
                else if (profileString === 'CBO') {
                    update.claimStatus = `${CLAIM_STATUS.PENDING_AT_CBO}`;
                }
                else {
                    update.claimStatus = `${CLAIM_STATUS.PENDING_AT_L1}`;
                }
            }
            const updateStatus = await MyClaim.findOneAndUpdate({ _id: result._id }, update, { new: true });
            return result;
        }

    }
    catch (err) {
        console.log(err,'.............err in create claim');
        throw err
    }
};

const createApprovalRequest = async (savedData, params) => {
    try {
        let { claimId, schoolCode, schoolName, visitNumber, billFile, visitPurpose, visitDate, requestedBy, requestBy_roleId, requestBy_name, requestBy_uuid, visitTimeIn, visitTimeOut, field, requestBy_ProfileName, requestBy_empCode, expenseType, unit, unitLabel, claimAmount, leadId, createdAt, remarks, claimRemarks } = params;

        let data = {
            requestId: claimId,
            requestType: 'Claim',
            requestStatus: 'NEW',
            requestBy_roleId: requestBy_roleId,
            requestBy_name: requestBy_name,
            requestBy_uuid: requestBy_uuid,
            requestBy_ProfileName: requestBy_ProfileName,
            requestBy_empCode: requestBy_empCode,
            raisedDate: savedData?.createdAt,
            metaInfo: {
                School_Code: schoolCode,
                School_Name: schoolName,
                Expense_type: expenseType,
                Field: field?.label,
                Sub_Field: field?.value,
                Unit: unit,
                unitLabel: unitLabel,
                Visit_Date: visitDate,
                Visit_Time_In: visitTimeIn,
                Visit_Time_Out: visitTimeOut,
                Visit_Purpose: visitPurpose,
                Visit_Number: visitNumber,
                Claim_Amount: claimAmount,
                // Raised_Date: savedData?.createdAt,
                remarks: remarks,
                billFile: billFile,
                claimRemarks: claimRemarks
            },
            shortDescription: {
                School_Code: schoolCode,
                School_Name: schoolName,
                Expense_Type: expenseType,
                Visit_Date: visitDate,
                Claim_Amount: claimAmount,
                Visit_Purpose: visitPurpose,
                Unit: unit,
                unitLabel: unitLabel,

            }
        }
        if (field) {
            //console.log(field)
            let key = field.label.replace(/ /g, '_');
            data.shortDescription[`${key}`] = field.value;
            data.metaInfo[`${key}`] = field.value;
        }
        const result = await approvalRequestControls.createRequest(data);
        return result;
    }
    catch (err) {
        console.log(err, ':: error inside create approval request');
        throw err
    }

}

const getMyClaimList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, status, childRoleNames } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }
    let smallEmp = childRoleNames?.toLowerCase();
    let capsEmp = childRoleNames?.toUpperCase();

    if (search) {
        query = {
            ...query,
            $or: [
                { expenseType: { $regex: search, $options: 'i' } },
                { requestBy_name: { $regex: search, $options: 'i' } },
                { schoolName: { $regex: search, $options: 'i' } },
            ]
        }
    }


    if (childRoleNames && childRoleNames.length > 0) {
        query.requestBy_empCode = { $in: [smallEmp, capsEmp] };
    }

    if (status) {
        query.claimStatus = { $in: status }
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

    const result = await MyClaim.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
};

const getUserClaimListBySchool = (params) => {
    let query = { isDeleted: false }
    if(params.roleName){
        query['requestByRoleName'] = params.roleName
    }

    if(params.schoolCode){
        query['schoolCode'] = params.schoolCode
    }

    if(params.dateTime){
        query = {
            ...query,
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$visitDate", timezone: "+00:00" } },
                    params.dateTime
                ]
            }
        }
    }
    //console.log(JSON.stringify(query))
    return MyClaim.find(query).sort({createdAt:-1}).lean();
}

const getMyClaimListCount = async (params) => {
    let query = { isDeleted: false }
    let { search, status, childRoleNames } = params
    let smallEmp = childRoleNames?.toLowerCase();
    let capsEmp = childRoleNames?.toUpperCase();

    if (search) {
        query.expenseType = { $regex: search, $options: 'i' }
    }

    if (childRoleNames && childRoleNames.length > 0) {
        query.requestBy_empCode = { $in: [smallEmp, capsEmp] };
    }

    if (status) {
        query.claimStatus = status
    }
    return MyClaim.countDocuments(query)
};

const updateClaim = async (params) => {

    let { _id, statusModifiedByEmpCode, statusModifiedByRoleName, claimId, claimStatus, schoolCode, schoolName, visitNumber, visitPurpose, visitDate, expenseType, unit, claimAmount, modifiedBy, approvedAmount, approvedDate, modifiedBy_Uuid, remarks } = params;

    let query = {};
    let update = {};
    let options = { new: true };

    if (_id) {
        query._id = _id;
    }

    if (claimId) {
        query.claimId = claimId;
    }

    if (claimStatus) {
        update.claimStatus = claimStatus;
    }

    if (schoolCode) {
        update.schoolCode = schoolCode;
    }

    if (schoolName) {
        update.schoolName = schoolName;
    }

    if (visitNumber) {
        update.visitNumber = visitNumber;
    }

    if (visitPurpose) {
        update.visitPurpose = visitPurpose;
    }

    if (visitDate) {
        update.visitDate = visitDate;
    }

    if (expenseType) {
        update.expenseType = expenseType;
    }

    if (unit) {
        update.unit = unit;
    }

    if (claimAmount) {
        update.claimAmount = claimAmount;
    }

    if (approvedAmount) {
        update.approvedAmount = approvedAmount;
    }

    if (approvedDate) {
        update.approvedDate = approvedDate;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }

    if (statusModifiedByEmpCode) {
        update.statusModifiedByEmpCode = statusModifiedByEmpCode;
    }

    if (statusModifiedByRoleName) {
        update.statusModifiedByRoleName = statusModifiedByRoleName;
    }

    if(remarks){
        update.remarks = remarks
    }


    const result = await MyClaim.findOneAndUpdate(query, update, options);
    return result;
}

const getUserClaimDetails = async (id) => {
    return MyClaim.find({ _id: id });
}

const bulkUpdate = async (query, update) => {    

    const result = await MyClaim.findOneAndUpdate(query, update, {new:true});
    return result;
}

const bulkDelete = async (params) => {
    let { _id, claimId } = params;
    let query = { _id };
    let update = { isDeleted: true };
    let options = { new: true };

    const result = await MyClaim.findOneAndUpdate(query, update, options);
    const reqDel = await ApprovalRequest.deleteOne({ requestId: claimId });
    return result;
}

const findClaimByEmpCode = async (params) => {
    let query = {
        requestBy_empCode: { $in: params?.empCodeList },
        claimStatus: 'PENDING AT FINANCE'
    }
    const result = await MyClaim.find(query);
    return result;
}

const claimList = async (params) => {
    let { pageNo, count, status, empCode,type='other', reqDate,sortKey, sortOrder } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }
    let smallEmp = empCode?.toLowerCase();
    let capsEmp = empCode?.toUpperCase();

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
    }

    if (empCode) {
        query.requestBy_empCode = { $in: [smallEmp, capsEmp] };
    }

    if(reqDate){
        let date = new Date(reqDate)
        query['$expr'] = {
            $and: [
              { '$eq': [{ '$month': '$createdAt' }, (date.getMonth() + 1)] },
              { '$eq': [{ '$year': '$createdAt' }, date.getFullYear() ] },
            ],
          };
    }

    if (status === 'PENDING' || status === 'NEW') {
        query.claimStatus = type === 'finance' ? 'PENDING AT FINANCE': { $nin: ['APPROVED', 'REJECTED']}
    }else if( status === 'APPROVED' || status === 'REJECTED' ) {
        query.claimStatus = status
    }

    if(status === 'ALL' && type === 'finance'){
        query.claimStatus = { $in: ['APPROVED', 'REJECTED','PENDING AT FINANCE']};
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
    const result = await MyClaim.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
}

const claimListCount = async (params) => {
    let query = { isDeleted: false }
    let {  status, empCode,type='other', reqDate } = params
    let smallEmp = empCode?.toLowerCase();
    let capsEmp = empCode?.toUpperCase();

    if (empCode) {
        query.requestBy_empCode = { $in: [smallEmp, capsEmp] };
    }

    if(reqDate){
        let date = new Date(reqDate)
        query['$expr'] = {
            $and: [
              { '$eq': [{ '$month': '$createdAt' }, (date.getMonth() + 1)] },
              { '$eq': [{ '$year': '$createdAt' }, date.getFullYear() ] },
            ],
          };
    }

    if (status === 'PENDING' || status === 'NEW') {
        query.claimStatus = type === 'finance' ? 'PENDING AT FINANCE': { $nin: ['APPROVED', 'REJECTED']}
    }else if( status === 'APPROVED' || status === 'REJECTED' ) {
        query.claimStatus = status
    }

    if(status === 'ALL' && type === 'finance'){
        query.claimStatus = { $in: ['APPROVED', 'REJECTED','PENDING AT FINANCE']};
    }

    return MyClaim.countDocuments(query)
}

module.exports = {
    createMyClaim,
    getMyClaimList,
    getMyClaimListCount,
    updateClaim,
    getUserClaimDetails,
    bulkUpdate,
    bulkDelete,
    getUserClaimListBySchool,
    findClaimByEmpCode,
    claimList,
    claimListCount
}