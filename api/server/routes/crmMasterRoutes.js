const express = require('express');
const router = express.Router();
const crmMasterFunctions = require('../functions/crmMasterFunctions');
const responseHandler = require('../utils/responseHandler');

router.post('/createCrmMaster', [], async (req, res) => {
    return crmMasterFunctions.createCrmMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getCrmMasterList', [], async (req, res) => {

    return crmMasterFunctions.getCrmMasterList({ ...req.query })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateCrmMaster', [], async (req, res) => {

    return crmMasterFunctions.updateCrmMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getCrmMasterDetails/:id', async (req, res) => {
    let { id } = req.params;
    return crmMasterFunctions.getCrmMasterDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/deleteCrmMaster', [], async (req, res) => {

    return crmMasterFunctions.deleteCrmMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getAllCrmMaster', [], async (req, res) => {
    return crmMasterFunctions.getAllCrmMaster({ ...req.query })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.get('/getAllKeyValues', [], async (req, res) => {
    return crmMasterFunctions.getAllKeyValues({ ...req.query })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.get('/getAllProductList', [], async (req, res) => {
    return crmMasterFunctions.getAllProductList()
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
})

module.exports = router;