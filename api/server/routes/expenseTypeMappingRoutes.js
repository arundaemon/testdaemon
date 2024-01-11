const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const expenseTypeMappingFunctions = require('../functions/expenseTypeMappingFunctions');
const expenseTypeMappingControl = require('../controllers/expenseTypeMappingControls')

router.post('/createExpense', async (req, res) => {
  return expenseTypeMappingFunctions.createExpense(req.body)
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })
})

router.get('/getExpenseTypeMapping', async (req, res) => {
  let { level } = req.query
  return expenseTypeMappingControl.getExpenseTypeMapping({ level })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateExpenseTypeMapping', async (req, res) => {

  return expenseTypeMappingControl.updateExpenseTypeMapping({ ...req.body })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })

})


module.exports = router;
