const express= require('express');
const router= express.Router();
const taskActivityFunctions= require('../functions/taskActivityFunctions');
const responseHandler = require('../utils/responseHandler');
const taskActivityValidator= require('../validators/taskActivityValidator');

router.post('/createTaskActivity', [], async (req, res) => {

    let { tokenPayload } = req;

    return taskActivityFunctions.createTaskActivityMapping({tokenPayload,... req.body})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req) })
})

router.get('/getTaskActivityList', [taskActivityValidator.validateGetTaskActivityMappingList], async (req, res) => {
    let { tokenPayload } = req;
    return taskActivityFunctions.getTaskActivityMappingList({tokenPayload, ...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.put('/changeStatus', async (req,res) => {

    let {_id, status}= req.body;
  
    return taskActivityFunctions.changeStatus(_id, status )
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))
  })

  module.exports= router;