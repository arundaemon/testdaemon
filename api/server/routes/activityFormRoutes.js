const express = require('express');
const router = express.Router();
const activityFormFunctions = require('../functions/activityFormFunctions');
const responseHandler = require('../utils/responseHandler');
const activityValidator = require('../validators/activityValidator');

router.post('/createActivityForm', [], async (req, res) => {
    let obj = req.body    
    return activityFormFunctions.createActivityForm({ ...obj })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.post('/logBdeActivity', [], async (req, res) => {
    let obj = req.body    
    return activityFormFunctions.logBdeActivity({ ...obj })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});


module.exports = router