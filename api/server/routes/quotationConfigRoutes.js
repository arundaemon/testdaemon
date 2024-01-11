const express = require('express');
const router = require('express-promise-router')();
const quotationConfigFunctions = require('../functions/quotationConfigFunctions');
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const { createQuotationConfigValidator, updateQuotationConfigValidator } = require('../validators/quotationConfigValidator');

router.post('/createQuotationConfig', [auth.authenticateToken, createQuotationConfigValidator], async (req, res) => {
    return quotationConfigFunctions.createQuotationConfig({ ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getQuotationConfigList', async (req, res) => {
    return quotationConfigFunctions.getQuotationConfigList({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/updateQuotationConfig', [auth.authenticateToken, updateQuotationConfigValidator], async (req, res) => {
    return quotationConfigFunctions.updateQuotationConfig({ ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getQuotationConfigDetail', [auth.authenticateToken], async (req, res) => {
    return quotationConfigFunctions.getQuotationConfigDetail({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
} )

module.exports = router;