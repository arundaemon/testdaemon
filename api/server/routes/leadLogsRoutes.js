const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler')
const leadLogFunctions = require('../functions/leadLogFunctions');

router.get('/getLogsList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, campaignName } = req.query
    let { tokenPayload } = req;

    return leadLogFunctions.getLogsList({ search, pageNo, count, sortKey, sortOrder, campaignName })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

module.exports = router;