const express = require('express');
const router = require('express-promise-router')();
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const implementationSiteSurveyFunctions = require('../functions/implementationSiteSurveyFunctions');
const { createSsrValidator, getDetailValidator, excelValidator } = require('../validators/siteSurveyValidator');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post('/createSiteSurvey', upload.single("consentFile"),[auth.authenticateToken, createSsrValidator], async (req, res) => {
  let file = req?.file;
  return implementationSiteSurveyFunctions.createSiteSurvey({ ...req.body, file})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
});

router.post('/getSiteSurveyList', [auth.authenticateToken], async (req, res) => {
  return implementationSiteSurveyFunctions.getSiteSurveyList({...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getSiteSurveyDetails', [auth.authenticateToken, getDetailValidator], async (req, res) => {
  return implementationSiteSurveyFunctions.getSiteSurveyDetails({...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/getDataFromExcel', upload.single("file"), [auth.authenticateToken, excelValidator], async(req, res) => {
  return implementationSiteSurveyFunctions.getDataFromExcel(req)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
});

router.get('/downloadSample', [auth.authenticateToken], async (req, res) => {
  return implementationSiteSurveyFunctions.downloadSample({...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getPrevSsrFormData',[auth.authenticateToken], async (req, res) => {
  return implementationSiteSurveyFunctions.getPrevSsrFormData({...req.query })
  .then(result => responseHandler.sendSuccess(res, result, req))
  .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/updateSsrApprovalStatus', [auth.authenticateToken], async (req, res) => {
  return implementationSiteSurveyFunctions.updateApprovalStatus({...req.body })
  .then(result => responseHandler.sendSuccess(res, result, req))
  .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router;