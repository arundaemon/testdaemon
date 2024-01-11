const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler')
const statusFunctions = require('../functions/statusFunctions');
const statusControls = require('../controllers/statusControls');
const statusValidator = require('../validators/statusValidator')

router.post('/createStatus', statusValidator.createStatusValidator, async (req, res) => {
    let { stageId, statusName, createdBy, type, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = req.body;

    return statusFunctions.createStatus({ stageId, statusName, type, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid })
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            return responseHandler.sendError(res, error, req);
        })
});

router.put('/updateStatus', async (req, res) => {
    let { _id, stageId, statusName, linkedStatus, status, type, requestStatus, modifiedBy } = req.body;
    let { tokenPayload } = req;

    return statusFunctions.updateStatus({ _id, stageId, statusName, type, linkedStatus, status, requestStatus, modifiedBy })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.put('/mapStatusesWithStage', async (req, res) => {
    let { stageId, linkedStatus, modifiedBy, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return statusFunctions.mapStatusesWithStage({ ...tokenPayload, stageId, linkedStatus, modifiedBy, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});


router.put('/unMapAvailableStatus', async (req, res) => {
    let { tokenPayload } = req;

    return statusFunctions.unMapAvailableStatus({ ...tokenPayload, ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getStatusList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let { tokenPayload } = req;

    return statusFunctions.getStatusList({ search, pageNo, count, sortKey, sortOrder })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getAllStatus', async (req, res) => {
    let { tokenPayload } = req;

    return statusFunctions.getAllStatus({ ...tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/deleteStatus', [], async (req, res) => {
    let { tokenPayload } = req
    return statusFunctions.deleteStatus({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/changeStatus', async (req, res) => {
    let { _id, status, modifiedBy } = req.body;
    return statusFunctions.changeStatus(_id, status, modifiedBy)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/statusDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;

    return statusFunctions.getStatusDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/isDuplicateStatus', async (req, res) => {
    let { statusName, id } = req.query;
    return statusFunctions.isDuplicateStatus(statusName)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

})

module.exports = router;