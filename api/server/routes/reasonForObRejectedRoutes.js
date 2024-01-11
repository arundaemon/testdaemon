const express= require('express');
const router= express.Router();
const reasonForObRejectedFunctions= require('../functions/reasonForObRejectedFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForObRejectedList',[], async(req,res) =>{

    return reasonForObRejectedFunctions.getReasonForObRejectedList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForObRejected', [], async(req,res) => {

    return reasonForObRejectedFunctions.createReasonForObRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForObRejected', [], async(req,res) => {

    return reasonForObRejectedFunctions.updateReasonForObRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForObRejected', [], async(req,res) => {

    return reasonForObRejectedFunctions.deleteReasonForObRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;