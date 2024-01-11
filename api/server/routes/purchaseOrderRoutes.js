const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const purchaseOrderFunctions = require('../functions/purchaseOrderFunctions')
const auth = require('../middlewares/auth')
const multer = require('multer');
const { createPurchaseOrderValidator } = require('../validators/createPurchaseOrderValidator');
const { updateStatusValidator } = require('../validators/purchaseOrderValidator');


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})


router.post('/uploadPurchaseOrderToGCP', upload.single('image'), async (req, res) => {
  let { tokenPayload } = req;
  let image = req?.file

  return purchaseOrderFunctions.uploadPurchaseOrderToGCP({ ...req.body, image, tokenPayload })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});


router.post('/createPurchaseOrder', [auth.authenticateToken, createPurchaseOrderValidator], async (req, res) => {
  const reqHeaders = req.headers
  return purchaseOrderFunctions.createPurchaseOrder({ params: req.body, reqHeaders })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      console.log(error, '...eror');
      return responseHandler.sendError(res, error, req);
    })
});


router.post('/getPurchaseOrderList', [auth.authenticateToken], async (req, res) => {
  let { search, pageNo, count, sortKey, sortOrder, childRoleNames } = req.body
  let { tokenPayload } = req;
  return purchaseOrderFunctions.getPurchaseOrderList({ search, pageNo, count, sortKey, sortOrder, childRoleNames, tokenPayload })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      console.log(error, '...errrr');
      return responseHandler.sendError(res, error, req)
    })
})

router.put('/deletePurchaseOrder', [auth.authenticateToken], async (req, res) => {
  let { tokenPayload } = req
  return purchaseOrderFunctions.deletePurchaseOrder({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getPurchaseOrderDetails/:id', [auth.authenticateToken], async (req, res) => {
  let { id } = req.params;
  return purchaseOrderFunctions.getPurchaseOrderDetails(id)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getPOListBySchoolCode/:schoolCode', [auth.authenticateToken], async (req, res) => {
  let { schoolCode } = req.params;
  return purchaseOrderFunctions.getPOListBySchoolCode(schoolCode)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updatePurchaseOrderStatus', [auth.authenticateToken, updateStatusValidator], async (req, res) => {
  return purchaseOrderFunctions.updatePurchaseOrderStatus(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updatePurchaseOrderApprovalStatus', [auth.authenticateToken], async (req, res) => {
  let req_params = {
    headerValue: req.headers,
    tokenPayload: req.tokenPayload
  }

  return purchaseOrderFunctions.updatePurchaseOrderApprovalStatus(req.body, req_params)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/generatePaymentProofZip', async (req, res) => {
  return purchaseOrderFunctions.generatePaymentProofZip({...req.body})
  .then(result => {
      let fileName = 'PaymentProof.zip';
      return responseHandler.sendFileSuccess(res, fileName, req)
  })
  .catch(error => {
      console.log(error, '...errrr in generatePaymentProofZip');
      return responseHandler.sendError(res, error, req)
  })
})





module.exports = router;