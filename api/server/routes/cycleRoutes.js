const express = require('express');
const router = require('express-promise-router')();
const cycleFunctions = require('../functions/cycleFunctions');
const responseHandler = require('../utils/responseHandler');
const cycleValidator = require('../validators/cycleValidator');


router.post('/createCycle', cycleValidator.createCycleValidator, async (req, res) => {
    let { journeyId, cycleName, type, linkedCycle, status, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return cycleFunctions.createCycle({ tokenPayload, journeyId, type, cycleName, linkedCycle, status, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.put('/updateCycle', async (req, res) => {
    let { _id, journeyId, cycleName, type, linkedCycle, status, modifiedBy, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return cycleFunctions.updateCycle({ tokenPayload, _id, journeyId, type, cycleName, linkedCycle, status, modifiedBy, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});


router.put('/mapCyclesWithJourney', async (req, res) => {
    let { tokenPayload } = req;

    return cycleFunctions.mapCyclesWithJourney({ ...tokenPayload, ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.put('/unMapAvailableCycle', async (req, res) => {
    let { tokenPayload } = req;

    return cycleFunctions.unMapAvailableCycle({ ...tokenPayload, ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getCyclesList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let { tokenPayload } = req;

    return cycleFunctions.getCyclesList({ tokenPayload, search, pageNo, count, sortKey, sortOrder })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/getAllCycles', async (req, res) => {
    let { tokenPayload } = req;
    return cycleFunctions.getAllCycles({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/deleteCycle', [], async (req, res) => {
    let { tokenPayload } = req
    return cycleFunctions.deleteCycle({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/cycleDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;

    return cycleFunctions.getCycleDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/isDuplicateCycle', async (req, res) => {
    let { cycleName, id } = req.query;
    return cycleFunctions.isDuplicateCycle(cycleName, id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

})

router.put('/changeStatus', async (req, res) => {
    let { _id, status } = req.body;
    return cycleFunctions.changeStatus(_id, status)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


router.get('/getAllCycleNames', [], async (req, res) => {
    return cycleFunctions.getAllCycleNames({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, erreor, req));

});

module.exports = router;