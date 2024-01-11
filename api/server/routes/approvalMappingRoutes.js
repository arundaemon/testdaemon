const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const approvalMappingFunctions = require('../functions/approvalMappingFunctions');
const auth = require('../middlewares/auth')

router.post('/createApprovalMapping', async (req, res) => {
    return approvalMappingFunctions.createApprovalMapping({ ...req.body })
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            //console.log(error, '...eror');
            return responseHandler.sendError(res, error, req);
        })
});

router.get('/getApprovalMappingList',[auth.authenticateToken], async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let { tokenPayload } = req;
   
    return approvalMappingFunctions.getApprovalMappingList({ search, pageNo, count, sortKey, sortOrder, tokenPayload })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getMappingInfo', async (req, res) => {
    return approvalMappingFunctions.getMappingInfo({ ...req.query })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.put('/updateApprovalMapping', async (req, res) => {
    let { tokenPayload } = req;

    return approvalMappingFunctions.updateApprovalMapping({ ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getApprovalMappingDetails/:id', async (req, res) => {
    let { id } = req.params;
    let { tokenPayload } = req;
    return approvalMappingFunctions.getApprovalMappingDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

});

module.exports = router;