const express = require('express');
const router = require('express-promise-router')();
const leadAssignFunction = require('../functions/leadAssignFunction');
const leadOwnerFunctions = require('../functions/leadOwnerFunctions')
const responseHandler = require('../utils/responseHandler');
const leadAssignValidator = require('../validators/leadAssignValidator');
const auth = require('../middlewares/auth')
const { DecryptData } = require('../utils/utils');


// leadAssignValidator.updateLeadValidator
router.put('/updateLead', [auth.authenticateToken], async (req, res) => {
  let { tokenPayload } = req
  return leadAssignFunction.updateLeadAssign({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error =>
      responseHandler.sendError(res, error, req))
});

router.put('/assignMyLeads', [auth.authenticateToken], async (req, res) => {
  let { tokenPayload } = req
  return leadAssignFunction.assignMyLeads({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/updateMultipleLead', [], async (req, res) => {
  let { tokenPayload } = req
  return leadAssignFunction.updateMultipleLead({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/updateUUID', [auth.authenticateToken], async (req, res) => {
  let { tokenPayload } = req

  return leadAssignFunction.updateUUID({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateDndStatus', async (req, res) => {
  let { tokenPayload } = req;

  return leadAssignFunction.updateDndStatus({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getLeadAssignList', async (req, res) => {
  let { search, pageNo, itemsPerPage, sortKey, sortOrder, childRoleNames, campaignId, refurbishFlag } = req.body
  //let { tokenPayload } = req

  return leadAssignFunction.getLeadAssignList({ search, pageNo, itemsPerPage, sortKey, sortOrder, childRoleNames, campaignId, refurbishFlag })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

})

router.get('/getRelatedToList', async (req, res) => {
  let leadData = DecryptData(req.query.EncryptData)

  let { search, pageNo, itemsPerPage, sortKey, sortOrder, mobile, leadId } = leadData;


  return leadAssignFunction.getRelatedToList({ search, pageNo, itemsPerPage, sortKey, sortOrder, mobile, leadId })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

})

router.get('/getOnlineLeadDetails', [auth.authenticateToken], async (req, res) => {
  let { mobile } = req.query;
  let { tokenPayload } = req;

  return leadAssignFunction.getOnlineLeadDetails({ tokenPayload, mobile })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

})

router.put('/refurbishLeads', [], async (req, res) => {
  return leadAssignFunction.refurbishLeads({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/changeleadowner', [], async (req, res) => {
  // let { tokenPayload } = req
  return leadOwnerFunctions.changeLeadOwner({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/changeleadInterestowner', [], async (req, res) => {
  // let { tokenPayload } = req
  return leadOwnerFunctions.changeLeadInterestOwner(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});


module.exports = router;