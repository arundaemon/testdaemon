const express= require('express');
const router= express.Router();
const reasonForPaPendingFunctions= require('../functions/reasonForPaPendingFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForPaPendingList',[], async(req,res) =>{

    return reasonForPaPendingFunctions.getReasonForPaPendingList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForPaPending', [], async(req,res) => {

    return reasonForPaPendingFunctions.createReasonForPaPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForPaPending', [], async(req,res) => {

    return reasonForPaPendingFunctions.updateReasonForPaPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForPaPending', [], async(req,res) => {

    return reasonForPaPendingFunctions.deleteReasonForPaPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;