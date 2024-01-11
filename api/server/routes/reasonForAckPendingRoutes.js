const express= require('express');
const router= express.Router();
const reasonForAckPendingFunctions= require('../functions/reasonForAckPendingFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForAckPendingList',[], async(req,res) =>{

    return reasonForAckPendingFunctions.getReasonForAckPendingList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForAckPending', [], async(req,res) => {

    return reasonForAckPendingFunctions.createReasonForAckPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForAckPending', [], async(req,res) => {

    return reasonForAckPendingFunctions.updateReasonForAckPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForAckPending', [], async(req,res) => {

    return reasonForAckPendingFunctions.deleteReasonForAckPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;