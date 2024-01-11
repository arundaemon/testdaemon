const express= require('express');
const router= express.Router();
const reasonForDisqualificationFunctions= require('../functions/reasonForDisqualificationFunctions');
const responseHandler = require('../utils/responseHandler');
const disqualificationValidator= require('../validators/disqualificationValidator');

router.get('/getReasonForDisqualificationList',disqualificationValidator.disqualificationValidator, async(req,res) =>{

    return reasonForDisqualificationFunctions.getReasonForDisqualificationList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createReasonForDisqualifiction', [], async(req,res) => {

    return reasonForDisqualificationFunctions.createReasonForDisqualifiction({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateReasonForDisqualification', [], async(req, res) => {

    return reasonForDisqualificationFunctions.updateReasonForDisqualification({...req.body})
          .then(result => { return responseHandler.sendSuccess(res, result, req) })
          .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/deleteReasonForDisqualification', [], async(req, res) => {

    return reasonForDisqualificationFunctions.deleteReasonForDisqualification({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})




module.exports = router;