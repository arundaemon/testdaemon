const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler')
const targetIncentiveLogFunctions = require('../functions/targetIncentiveLogFunctions');

router.get('/getLogsList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let { tokenPayload } = req;

    return targetIncentiveLogFunctions.getLogsList({ search, pageNo, count, sortKey, sortOrder })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

module.exports = router;