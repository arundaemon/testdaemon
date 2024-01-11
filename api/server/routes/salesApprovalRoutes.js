const express = require('express');
const router = require('express-promise-router')();
const salesApprovalFunctions = require('../functions/salesApprovalFunctions');
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');


router.get('/getSalesApprovalListAll', async (req, res) => {
    return salesApprovalFunctions.getSalesApprovalListAll({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getSalesApprovalList', async (req, res) => {
    return salesApprovalFunctions.getSalesApprovalList({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/assignApprovalRequest',[auth.authenticateToken,auth.approvalRequest],(req,res) => {
    const headers = req.headers
    const tokenPayload = req.tokenPayload
    return salesApprovalFunctions.assignApprovalRequest({ params: req.body,  headers, tokenPayload})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/acceptApprovalRequest',[auth.authenticateToken], (req,res) => {
    const headers = req.headers
    const tokenPayload = req.tokenPayload
    return salesApprovalFunctions.acceptApprovalRequest({ params: req.body, headers, tokenPayload })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/rejectApprovalRequest',[auth.authenticateToken], (req,res) => {
    const headers = req.headers
    const tokenPayload = req.tokenPayload
    return salesApprovalFunctions.rejectApprovalRequest({ params: req.body, headers, tokenPayload })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


module.exports = router;