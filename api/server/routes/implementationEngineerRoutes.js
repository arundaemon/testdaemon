const express = require('express');
const router = require('express-promise-router')();
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const implementationEngineerFunctions = require('../functions/implementationEngineerFunctions');

router.post('/assignEngineer', [auth.authenticateToken], async (req, res) => {
  return implementationEngineerFunctions.assignEngineer({ ...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
});

router.get('/getEngineerDetails', [auth.authenticateToken], async (req, res) => {
    return implementationEngineerFunctions.getEngineerDetails({ ...req.query})
      .then(result => responseHandler.sendSuccess(res, result, req))
      .catch(error => responseHandler.sendError(res, error, req));
});

router.get('/myAssignedTaskList', [auth.authenticateToken], async (req, res) => {
  return implementationEngineerFunctions.myAssignedTaskList({ ...req.query})
  .then(result => responseHandler.sendSuccess(res, result, req))
  .catch(error => responseHandler.sendError(res, error, req));
})

module.exports = router;