const express = require('express');
const router = require('express-promise-router')();
const stageFunctions = require('../functions/stageFunctions');
const responseHandler = require('../utils/responseHandler');
const stageValidator = require('../validators/stageValidator');

router.post('/createStage', stageValidator.createStageValidator, async (req, res) => {
    let { cycleId, stageName, type, linkedStage, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return stageFunctions.createStage({ tokenPayload, cycleId, type, stageName, linkedStage, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.put('/updateStage', async (req, res) => {
    let { _id, cycleId, stageName, type, linkedStage, modifiedBy, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return stageFunctions.updateStage({ tokenPayload, _id, cycleId, stageName, type, linkedStage, modifiedBy, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.put('/mapStagesWithCycle', async (req, res) => {
    let { tokenPayload } = req;

    return stageFunctions.mapStagesWithCycle({ ...tokenPayload, ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});


router.put('/unMapAvailableStage', async (req, res) => {
    let { tokenPayload } = req;

    return stageFunctions.unMapAvailableStage({ ...tokenPayload, ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});


router.get('/getStageList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, status } = req.query
    let { tokenPayload } = req;

    return stageFunctions.getStageList({ tokenPayload, search, pageNo, count, sortKey, sortOrder, status })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getAllStages', async (req, res) => {
    let { tokenPayload } = req

    return stageFunctions.getAllStages({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/deleteStage', [], async (req, res) => {
    let { tokenPayload } = req
    return stageFunctions.deleteStage({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/stageDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;

    return stageFunctions.getStageDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/isDuplicateStage', async (req, res) => {
    let { stageName } = req.query;
    return stageFunctions.isDuplicateStage(stageName)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

});

router.put('/changeStatus', async (req, res) => {
    let { _id, status, modifiedBy } = req.body;
    return stageFunctions.changeStatus(_id, status, modifiedBy)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getStageByKey', async (req, res) => {
    return stageFunctions.getStageByKey(req.query)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req));
});

module.exports = router;
