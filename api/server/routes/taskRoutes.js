const express= require('express');
const router= express.Router();
const taskFunctions= require('../functions/taskFunctions');
const responseHandler = require('../utils/responseHandler');
const taskValidator= require('../validators/taskValidator');

router.post('/createTask',taskValidator.createTaskValidator, async(req,res) => {
    let { tokenPayload }= req;
    return taskFunctions.createTask({tokenPayload,...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getTaskList',[taskValidator.validateGetTaskList], async(req,res) =>{

    let { tokenPayload }= req;
    return taskFunctions.getTaskList({tokenPayload,...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.put('/updateTask', [], async(req,res)=>{

    let { tokenPayload  }= req;
    return taskFunctions.updateTask({tokenPayload,...req.body})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.put('/deleteTask', [], async(req, res) => {
    let { tokenPayload  }= req;

    return taskFunctions.deleteTask({tokenPayload,...req.body})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
});

router.get('/getTask', async (req, res) => {
    let { tokenPayload  }= req;

    return taskFunctions.getTask({tokenPayload, ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
  })

router.put('/changeStatus', async (req, res) => {
    let { _id, status } = req.body;
    return taskFunctions.changeStatus( _id, status )
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllTasks', async (req, res) => {

    return taskFunctions.getAllTasks({ ...req.query })
      .then(result => responseHandler.sendSuccess(res, result, req))
      .catch(error => responseHandler.sendError(res, error, req));
  
  });


module.exports= router;