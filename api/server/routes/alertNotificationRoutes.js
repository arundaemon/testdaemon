const express = require('express');
const router = require('express-promise-router')();
const alertNotificationFunctions = require('../functions/alertNotificationFunctions');
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const {createAlertNotificationValidator } = require('../validators/alertNotificationValidator')

router.post('/createAlertNotification', [auth.authenticateToken, createAlertNotificationValidator], async (req, res) => {
    return alertNotificationFunctions.createAlertNotification(req.body)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/updateAlertNotificationStatus', [auth.authenticateToken], async (req, res) => {
    return alertNotificationFunctions.updateAlertNotificationStatus({ ... req.query})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAlertNotification',[auth.authenticateToken] ,async (req, res) => {
    return alertNotificationFunctions.getAlertNotification({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});


module.exports = router;
