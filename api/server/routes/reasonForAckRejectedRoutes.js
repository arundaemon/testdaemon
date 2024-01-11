const express= require('express');
const router= express.Router();
const reasonForAckRejectedFunctions= require('../functions/reasonForAckRejectedFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForAckRejectedList',[], async(req,res) =>{

    return reasonForAckRejectedFunctions.getReasonForAckRejectedList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForAckRejected', [], async(req,res) => {

    return reasonForAckRejectedFunctions.createReasonForAckRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForAckRejected', [], async(req,res) => {

    return reasonForAckRejectedFunctions.updateReasonForAckRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForAckRejected', [], async(req,res) => {

    return reasonForAckRejectedFunctions.deleteReasonForAckRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;