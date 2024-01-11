const express = require('express');
const router = require('express-promise-router')();
const alternateContactsFunctions = require('../functions/alternateContactsFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getAlternateContactList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder,leadId } = req.query
    let { tokenPayload } = req;

    return alternateContactsFunctions.getAlternateContactList({ tokenPayload, search, pageNo, count, sortKey, sortOrder,leadId })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

module.exports = router;