const express = require('express')
const router = express.Router()
const ruleFunctions = require('../functions/ruleFunctions')
const auth = require('../middlewares/auth')
const responseHandler = require('../utils/responseHandler')
const ruleValidators = require('../validators/ruleValidators')

router.post('/createRule', [], async (req, res) => {
    let { tokenPayload } = req
    
    return ruleFunctions.createRule({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


router.put('/updateRule', [], async (req, res) => {
    let { tokenPayload } = req
    return ruleFunctions.updateRule({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


router.put('/deleteRule', [], async (req, res) => {
    let { tokenPayload } = req
    return ruleFunctions.deleteRule({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getRuleList', [ruleValidators.validateGetRuleList], async (req, res) => {
    let { tokenPayload } = req
    
    return ruleFunctions.getRuleList({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


router.get('/getRuleDetails', [], async (req, res) => {
    let { tokenPayload } = req
    
    return ruleFunctions.getRuleDetails({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getRulesByRole', [auth.authenticateToken], async (req, res) => {
    let { tokenPayload } = req
    
    return ruleFunctions.getRulesByRole({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router