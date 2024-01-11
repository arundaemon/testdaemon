const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const productMasterFunctions = require('../functions/productMasterFunctions');


router.post('/createProductMaster', async (req, res) => {
  return productMasterFunctions.createProductMaster(req.body)
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
    return responseHandler.sendError(res, error, req)
    })
})

router.get('/getProductMasterList', async (req, res) => {
  return productMasterFunctions.getProductMasterList()
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      console.log(error, '...errrr');
      return responseHandler.sendError(res, error, req)
    })
})


module.exports = router;
