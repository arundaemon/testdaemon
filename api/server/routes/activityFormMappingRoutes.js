const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const activityFormMappingFunctions = require('../functions/activityFormMappingFunctions');
const { authenticateToken } = require('../middlewares/auth');
const { createMappingValidator } = require('../validators/activityFormMappingValidator');

router.get("/getActivityFormNumber", async (req, res) => {
    // console.log("req params inside getactivityform number",req.query)
    return activityFormMappingFunctions.getActivityFormNumber({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get("/getFormToActivity", async (req, res) => {
    // console.log("req params inside getactivityform number",req.query)
    return activityFormMappingFunctions.getFormToActivity({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get("/getActivityToActivity", async (req, res) => {
    // console.log("req params inside getactivityform number",req.query)
    return activityFormMappingFunctions.getActivityToActivity({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/createActivityFormMapping', createMappingValidator, async (req, res) => {
    let { stageName, stageId, statusName, meetingStatus, product, productCode, refId, groupCode, priority, hardware, dependentFields, verifiedDoc, featureExplained, statusId, subject, customerResponse, type, reasonForDQ, reasonForPaPending, reasonForPaRejected, reasonForFbPending, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForAckPending, reasonForAckRejected, activityId, futureActivityId, activityName, futureActivityName, subjectPreFilled, formId, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, isPriorityApplicable, mappingType } = req.body;
    let { tokenPayload } = req;

    return activityFormMappingFunctions.createActivityFormMapping({ tokenPayload, stageName, meetingStatus, product, productCode, refId, groupCode, priority, hardware, dependentFields, verifiedDoc, featureExplained, stageId, statusName, statusId, subject, customerResponse, type, reasonForDQ, reasonForPaPending, reasonForPaRejected, reasonForFbPending, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForAckPending, reasonForAckRejected, activityId, futureActivityId, activityName, futureActivityName, subjectPreFilled, formId, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, isPriorityApplicable ,mappingType})
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.post('/createFormMappingProductArray', createMappingValidator, async (req, res) => {
    let { activityId, activityName, customerResponse, dependentFields, featureExplained, formId, futureActivityId, futureActivityName, hardware, meetingStatus, priority, product, reasonForAckPending, reasonForAckRejected, reasonForDQ, reasonForFbPending, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForPaPending, isPriorityApplicable, reasonForPaRejected, stageId, stageName, statusId, statusName, subject, subjectPreFilled, type, verifiedDoc ,mappingType} = req.body
    let { tokenPayload } = req;

    return activityFormMappingFunctions.createFormMappingProductArray({ tokenPayload, activityId, activityName, customerResponse, dependentFields, featureExplained, formId, futureActivityId, futureActivityName, hardware, meetingStatus, priority, product, reasonForAckPending, reasonForAckRejected, reasonForDQ, reasonForFbPending, isPriorityApplicable, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForPaPending, reasonForPaRejected, stageId, stageName, statusId, statusName, subject, subjectPreFilled, type, verifiedDoc,mappingType })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/getActivityFormMappingList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, activityName, customerResponse, product, stageName, statusName, subject, futureActivityName } = req.query
    //let { tokenPayload } = req;
    //console.log(tokenPayload)
    return activityFormMappingFunctions.getActivityFormMappingList({ search, pageNo, count, sortKey, sortOrder, activityName, customerResponse, product, stageName, statusName, subject, futureActivityName })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            console.log(error, '...errrr');
            return responseHandler.sendError(res, error, req)
        })


})

router.post('/getDependentFields', async (req, res) => {
    return activityFormMappingFunctions.getDependentFields({ ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            console.log(error, '...errrr');
            return responseHandler.sendError(res, error, req)
        })


})

router.get('/getActivityMappingDetails', async (req, res) => {
    return activityFormMappingFunctions.getActivityMappingDetails({ ...req.query })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            console.log(error, '...errrr');
            return responseHandler.sendError(res, error, req)
        })
})

router.put('/updateActivityFormMapping', async (req, res) => {
    let { _id, type, activityId, activityName, meetingStatus, verifiedDoc, product, productCode, refId, groupCode, priority, hardware, dependentFields, featureExplained, reasonForPaPending, reasonForPaRejected, reasonForFbPending, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForAckPending, reasonForAckRejected, futureActivityId, futureActivityName, customerResponse, reasonForDQ, stageName, stageId, statusName, statusId, subject, subjectPreFilled, formId, modifiedBy, modifiedBy_Uuid, isPriorityApplicable ,mappingType} = req.body;
    let { tokenPayload } = req;

    return activityFormMappingFunctions.updateActivityFormMapping({ tokenPayload, _id, type, verifiedDoc, product, productCode, refId, groupCode, meetingStatus, priority, hardware, dependentFields, featureExplained, activityId, activityName, futureActivityId, futureActivityName, customerResponse, reasonForDQ, reasonForPaPending, reasonForPaRejected, reasonForFbPending, reasonForFbRejected, reasonForObPending, reasonForObRejected, reasonForAckPending, reasonForAckRejected, stageName, stageId, statusName, statusId, subject, subjectPreFilled, formId, modifiedBy, modifiedBy_Uuid, isPriorityApplicable,mappingType })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })

})

router.put('/deleteActivityFormMapping', [], async (req, res) => {
    let { tokenPayload } = req
    return activityFormMappingFunctions.deleteActivityFormMapping({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getDetails', async (req, res) => {
    let { tokenPayload } = req
    return activityFormMappingFunctions.getDetails({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getHotsField', async (req, res) => {
    return activityFormMappingFunctions.getHotsField({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router;