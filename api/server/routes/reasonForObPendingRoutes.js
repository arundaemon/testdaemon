const express= require('express');
const router= express.Router();
const reasonForObPendingFunctions= require('../functions/reasonForObPendingFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForObPendingList',[], async(req,res) =>{

    return reasonForObPendingFunctions.getReasonForObPendingList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForObPending', [], async(req,res) => {

    return reasonForObPendingFunctions.createReasonForObPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForObPending', [], async(req,res) => {

    return reasonForObPendingFunctions.updateReasonForObPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForObPending', [], async(req,res) => {

    return reasonForObPendingFunctions.deleteReasonForObPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;