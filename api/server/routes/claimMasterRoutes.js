const express = require('express');
const router = express.Router();
const claimMasterFunctions = require('../functions/claimMasterFunctions');
const responseHandler = require('../utils/responseHandler');
const customerResponseValidator = require('../validators/customerResponseValidator');

router.post('/createClaimMaster', [], async (req, res) => {

    return claimMasterFunctions.createClaimMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getClaimMasterList', [], async (req, res) => {

    return claimMasterFunctions.getClaimMasterList({ ...req.query })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateClaimMaster', [], async (req, res) => {

    return claimMasterFunctions.updateClaimMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getClaimMasterDetails/:id', async (req, res) => {
    let { id } = req.params;
    return claimMasterFunctions.getClaimMasterDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/deleteClaimMaster', [], async (req, res) => {

    return claimMasterFunctions.deleteClaimMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

module.exports = router;