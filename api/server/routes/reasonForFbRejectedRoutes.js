const express= require('express');
const router= express.Router();
const reasonForFbRejectedFunctions= require('../functions/reasonForFbRejectedFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForFbRejectedList',[], async(req,res) =>{

    return reasonForFbRejectedFunctions.getReasonForFbRejectedList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForFbRejected', [], async(req,res) => {

    return reasonForFbRejectedFunctions.createReasonForFbRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForFbRejected', [], async(req,res) => {

    return reasonForFbRejectedFunctions.updateReasonForFbRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForFbRejected', [], async(req,res) => {

    return reasonForFbRejectedFunctions.deleteReasonForFbRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;