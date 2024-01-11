const express= require('express');
const router= express.Router();
const reasonForPaRejectedFunctions= require('../functions/reasonForPaRejectedFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForPaRejectedList',[], async(req,res) =>{

    return reasonForPaRejectedFunctions.getReasonForPaRejectedList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForPaRejected', [], async(req,res) => {

    return reasonForPaRejectedFunctions.createReasonForPaRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForPaRejected', [], async(req,res) => {

    return reasonForPaRejectedFunctions.updateReasonForPaRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForPaRejected', [], async(req,res) => {

    return reasonForPaRejectedFunctions.deleteReasonForPaRejected({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;