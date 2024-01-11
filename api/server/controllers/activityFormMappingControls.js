const ActivityFormMapping = require("../models/activityFormMappingModels");
//const FormToActivityMapping = require("../models/formtoactivitymappingModel");
//const ActivityToActivityMapping = require("../models/activitytoactivitymappingModel");
const utils = require('../utils/utils');

const getActivityFormNumber = async (params) => {
    //console.log(params)
    params['isDeleted'] = false
    const result = await ActivityFormMapping.find(params).lean();
    return result;
}

const getFormToActivity = async (params) => {
    params['isDeleted'] = false
    const result = await ActivityFormMapping.findOne(params)
    return result;
}

const createActivityFormMapping = async (params) => {
    const result = await ActivityFormMapping.create(params);
    return result;
}

//to check duplicate entry for combination of stage, status and customer response in form mapping
const isDuplicateCombination = async (params) => {
    let { stageName, statusName, customerResponse, hardware, priority, _id, product } = params;
    let query = {
        stageName,
        statusName,
        customerResponse,
        hardware,
        product,
        isDeleted: false
    }
    if (_id) {
        query._id = { $ne: _id }
    }
    if (priority) {
        query.priority = priority;
    }
    const result = await ActivityFormMapping.findOne(query);
    return result;
}

const getActivityFormMappingList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, activityName, customerResponse, product, stageName, statusName, subject, futureActivityName } = params
    let sort = { createdAt: -1 };
    let query = { isDeleted: false }

    if (search) {
        query = {
            ...query,
            $or: [{ stageName: { $regex: search, $options: 'i' } },
            { statusName: { $regex: search, $options: 'i' } },
            { customerResponse: { $regex: search, $options: 'i' } },
            { product: { $regex: search, $options: 'i' } }
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

    if (activityName) {
        query.activityName = activityName
    }

    if (customerResponse) {
        query.customerResponse = customerResponse
    }

    if (product) {
        query.product = product
    }

    if (stageName) {
        query.stageName = stageName
    }

    if (statusName) {
        query.statusName = statusName
    }

    if (subject) {
        query.subject = subject
    }


    if (futureActivityName) {
        query.futureActivityName = futureActivityName
    }

    const result = await ActivityFormMapping.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result
}

const getDependentFields = async (params) => {
    let { customerResponse, leadStage, leadStatus, name, subject, priority, type } = params
    let query = {}

    let sort = { updatedAt: -1 };

    query.customerResponse = customerResponse
    query.stageName = leadStage
    query.statusName = leadStatus
    query.subject = subject

    if (type !== 'Implementation') {
        query.product = name,
        query.priority = priority
    }
    // if (priority) {
    //     query.priority = priority
    // }

    let result = await ActivityFormMapping.findOne(query).sort(sort)
    return result
}

const getActivityMappingDetails = async (query) => {

    let result = await ActivityFormMapping.find(query)

    let customerResponse = result?.map(data => data?.customerResponse).filter(value => value != null)?.reduce((array, currentValue) => {
        if (!array.includes(currentValue)) {
            array.push(currentValue);
        }
        return array;
    }, []);

    let subject = result?.map(data => data?.subject)?.filter(value => value != null)?.reduce((array, currentValue) => {
        if (!array.includes(currentValue)) {
            array.push(currentValue);
        }
        return array;
    }, []);


    let priority = result?.map(data => data?.priority)?.filter(value => value != null)?.reduce((array, currentValue) => {
        if (!array.includes(currentValue)) {
            array.push(currentValue);
        }
        return array;
    }, []);



    return [
        { key: "customerResponse", value: customerResponse },
        { key: "subject", value: subject },
        { key: "priority", value: priority }
    ]
}

const updateActivityFormMapping = async (params) => {
    let { _id, type, stageName, stageId, meetingStatus, product, productCode, refId, groupCode, priority, hardware, dependentFields, verifiedDoc, featureExplained, statusName, customerResponse, reasonForPaPending, reasonForPaRejected, reasonForFbPending, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForAckPending, reasonForAckRejected, activityId, activityName, futureActivityId, futureActivityName, statusId, subject, subjectPreFilled, reasonForDQ, formId, modifiedBy, modifiedBy_Uuid, isPriorityApplicable,mappingType } = params;

    let update = {};
    let options = { new: true };

    if (formId) {
        update.formId = formId;
    }

    if (type || (type === "")) {
        update.type = type
    }

    if (customerResponse) {
        update.customerResponse = customerResponse;
    }

    if (meetingStatus) {
        update.meetingStatus = meetingStatus;
    }

    if (mappingType) {
        update.mappingType = mappingType;
    }

    if (stageName) {
        update.stageName = stageName;
    }

    if (stageId) {
        update.stageId = stageId;
    }

    if (statusName) {
        update.statusName = statusName;
    }

    if (statusId) {
        update.statusId = statusId;
    }

    if (subject) {
        update.subject = subject;
    }

    if (product) {
        update.product = product;
    }

    if (productCode) {
        update.productCode = productCode;
    }

    if (refId) {
        update.refId = refId;
    }

    if (groupCode) {
        update.groupCode = groupCode;
    }


    if (priority) {
        update.priority = priority;
    }

    if (hardware) {
        update.hardware = hardware;
    }

    if (dependentFields) {
        update.dependentFields = dependentFields;
    }

    if (activityId) {
        update.activityId = activityId;
    }

    if (activityName) {
        update.activityName = activityName;
    }

    if (futureActivityId) {
        update.futureActivityId = futureActivityId;
    }

    if (futureActivityName) {
        update.futureActivityName = futureActivityName;
    }

    if (!utils.isEmptyValue(subjectPreFilled)) {
        update.subjectPreFilled = subjectPreFilled;
    }

    if (!utils.isEmptyValue(featureExplained)) {
        update.featureExplained = featureExplained;
    }

    if (!utils.isEmptyValue(verifiedDoc)) {
        update.verifiedDoc = verifiedDoc;
    }

    if (!utils.isEmptyValue(reasonForDQ)) {
        update.reasonForDQ = reasonForDQ;
    }

    if (!utils.isEmptyValue(reasonForPaPending)) {
        update.reasonForPaPending = reasonForPaPending;
    }

    if (!utils.isEmptyValue(reasonForPaRejected)) {
        update.reasonForPaRejected = reasonForPaRejected;
    }

    if (!utils.isEmptyValue(reasonForFbPending)) {
        update.reasonForFbPending = reasonForFbPending;
    }

    if (!utils.isEmptyValue(reasonForFbRejected)) {
        update.reasonForFbRejected = reasonForFbRejected;
    }

    if (!utils.isEmptyValue(reasonForObPending)) {
        update.reasonForObPending = reasonForObPending;
    }

    if (!utils.isEmptyValue(reasonForObRejected)) {
        update.reasonForObRejected = reasonForObRejected;
    }

    if (!utils.isEmptyValue(reasonForAckPending)) {
        update.reasonForAckPending = reasonForAckPending;
    }

    if (!utils.isEmptyValue(reasonForAckRejected)) {
        update.reasonForAckRejected = reasonForAckRejected;
    }

    if (!utils.isEmptyValue(isPriorityApplicable)) {
        update.isPriorityApplicable = isPriorityApplicable;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }
    return ActivityFormMapping.findOneAndUpdate({ _id }, update, options);
}

const deleteActivityFormMapping = async (params) => {
    let query = { _id: params._id }
    let update = { isDeleted: true }
    let options = { new: true }

    return ActivityFormMapping.findOneAndUpdate(query, update, options)
}

const getDetails = async (params) => {
    let { productCode, stageName, statusName, meetingStatus, type } = params;
    let query = {
        stageName, statusName, isDeleted: false
    }

    if (type !== 'Implementation') {
        query.productCode = productCode;
    }
    if (meetingStatus) {
        query.meetingStatus = meetingStatus;
    }
    const result = await ActivityFormMapping.findOne(query);
    return result;
}

const getHotsField = async (params) => {
    let query = {
        isDeleted: false,
        priority: { $in: ['HOTS', 'Pipeline'] },
        productCode: params?.productCode
    }
    const result = await ActivityFormMapping.find(query);
    return result;
}

const updateDependentFields = async (params) => {
    let { fieldCode, fieldName, fieldType } = params;

    let query = {
        isDeleted: false,
        dependentFields: { $elemMatch: { fieldCode } }
    }

    let res = await ActivityFormMapping.updateMany(query,
        {
            $set:
            {
                'dependentFields.$[elem].value': fieldName,
                'dependentFields.$[elem].label': fieldName,
                'dependentFields.$[elem].fieldType': fieldType,
                'dependentFields.$[elem].fieldName': fieldName
            }
        },
        {
            arrayFilters: [{ 'elem.fieldCode': fieldCode }]
        }
    );
    return res;

}




module.exports = {
    getActivityFormNumber,
    createActivityFormMapping,
    getActivityFormMappingList,
    updateActivityFormMapping,
    deleteActivityFormMapping,
    isDuplicateCombination,
    getDependentFields,
    getFormToActivity,
    getActivityMappingDetails,
    getDetails,
    getHotsField,
    updateDependentFields
};
