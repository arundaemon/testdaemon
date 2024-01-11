const express= require('express');
const router= express.Router();
const reasonForFbPendingFunctions= require('../functions/reasonForFbPendingFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getReasonForFbPendingList',[], async(req,res) =>{

    return reasonForFbPendingFunctions.getReasonForFbPendingList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForFbPending', [], async(req,res) => {

    return reasonForFbPendingFunctions.createReasonForFbPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForFbPending', [], async(req,res) => {

    return reasonForFbPendingFunctions.updateReasonForFbPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteReasonForFbPending', [], async(req,res) => {

    return reasonForFbPendingFunctions.deleteReasonForFbPending({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})


module.exports = router;