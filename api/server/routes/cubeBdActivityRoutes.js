const express= require('express');
const router= express.Router();
const CubeBdFunction = require('../functions/cubeBdActivityFunction');
const responseHandler = require('../utils/responseHandler');


router.post('/createCubeBdActivity', async (req,res)=> {
  return CubeBdFunction.createCubeBdActivity({...req.body})
  .then( result => { return responseHandler.sendSuccess(res, result, req)})
  .catch( error => { return responseHandler.sendError(res, error, req)})  
})


router.get('/getCubeBdActivity', async (req,res)=> {
  return CubeBdFunction.getCubeBdActivity({...req.query})
  .then( result => { return responseHandler.sendSuccess(res, result, req)})
  .catch( error => { return responseHandler.sendError(res, error, req)})
})

module.exports = router;