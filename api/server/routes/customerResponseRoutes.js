const express= require('express');
const router= express.Router();
const customerResponseFunctions= require('../functions/customerResponseFunctions');
const responseHandler = require('../utils/responseHandler');
const customerResponseValidator= require('../validators/customerResponseValidator');

router.get('/getCustomerResponseList',[], async(req,res) =>{

    return customerResponseFunctions.getCustomerResponseList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createCustomerResponse', [], async(req,res) => {

    return customerResponseFunctions.createCustomerResponse({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put('/updateCustomerResponse', [], async(req,res) => {

    return customerResponseFunctions.updateCustomerResponse({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/deleteCustomerResponse', [], async(req,res) => {

    return customerResponseFunctions.deleteCustomerResponse({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.get('/getAllCustomerResponses', customerResponseValidator.validateAllCustomerResponseList, async(req,res) => {

    return customerResponseFunctions.getAllCutomerResponses({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})

})


module.exports = router