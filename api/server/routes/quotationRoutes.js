const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const quotationFunctions = require('../functions/quotationFunctions');
const { updateStatusValidator } = require('../validators/quotationValidator');
const auth = require('../middlewares/auth')

router.post('/createQuotation', async (req, res) => {
  return quotationFunctions.createQuotation(req.body)
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })
})

router.post('/getQuotationList', async (req, res) => {
  let { search, pageNo, count, sortKey, sortOrder, childRoleNames } = req.body;
  return quotationFunctions.getQuotationList({ search, pageNo, count, sortKey, sortOrder, childRoleNames })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      console.log(error, '...errrr');
      return responseHandler.sendError(res, error, req)
    })
})


router.put('/deleteQuotation', [], async (req, res) => {
  return quotationFunctions.deleteQuotation(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})


router.get('/getQuotationDetails/:id', async (req, res) => {
  let { id } = req.params;
  return quotationFunctions.getQuotationDetails(id)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getProductSalePriceSum/:id', async (req, res) => {
  return quotationFunctions.getProductSalePriceSum(req.params)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getQuotationWithoutPO/:id', async (req, res) => {
  return quotationFunctions.getQuotationWithoutPO(req.params)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateQuotation', async (req, res) => {
  let data = req.body
  return quotationFunctions.updateQuotation(data)
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })

})

router.put('/updateQuotationStatus', [auth.authenticateToken, updateStatusValidator], async (req, res) => {
  return quotationFunctions.updateQuotationStatus(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateQuotationApprovalStatus', [auth.authenticateToken, updateStatusValidator], async (req, res) => {
  return quotationFunctions.updateQuotationApprovalStatus(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateIsPoGenerated', [auth.authenticateToken], async (req, res) => {
  return quotationFunctions.updateIsPoGenerated(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router;
