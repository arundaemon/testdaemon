const express = require('express');
const router = require('express-promise-router')();
const approvalMatrixFunction = require('../functions/approvalMatrixFunction');
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const { createApprovalMatrixValidator, updateApprovalMatrixValidator } = require('../validators/approvalMatrixValidator')

router.post('/createApprovalMatrix', [auth.authenticateToken, createApprovalMatrixValidator], async (req, res) => {
    return approvalMatrixFunction.createApprovalMatrix({ ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getApprovalMatrixList', async (req, res) => {
    return approvalMatrixFunction.getApprovalMatrixList({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/updateApprovalMatrix', [auth.authenticateToken, updateApprovalMatrixValidator], async (req, res) => {
    return approvalMatrixFunction.updateApprovalMatrix({ ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router;