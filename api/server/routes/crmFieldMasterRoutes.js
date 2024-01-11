const express= require('express');
const router= express.Router();
const crmFieldMasterFunctions= require('../functions/crmFieldMasterFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getAllCrmFieldMasterList',[], async(req,res) =>{

    return crmFieldMasterFunctions.getAllCrmFieldMasterList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createCrmFieldMaster', [], async(req,res) => {

    return crmFieldMasterFunctions.createCrmFieldMaster({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getCrmFieldMasterList', [], async (req, res) => {

    return crmFieldMasterFunctions.getCrmFieldMasterList({ ...req.query })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateCrmFieldMaster', [], async (req, res) => {

    return crmFieldMasterFunctions.updateCrmFieldMaster({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});


module.exports = router;