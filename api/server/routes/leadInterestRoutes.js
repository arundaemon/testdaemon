const express = require('express');
const router = require('express-promise-router')();
const leadInterestFunctions = require('../functions/leadInterestFunctions');
const auth = require('../middlewares/auth')
const responseHandler = require('../utils/responseHandler');

router.post('/createLeadInterest', async (req, res) => {
    let { tokenPayload } = req

    return leadInterestFunctions.saveLeadInterest(req.body)
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            console.log('error', error)
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/leadInterestDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;
    return leadInterestFunctions.getLeadInterestDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

})

router.get('/uniqueLeadInterest/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;
    return leadInterestFunctions.uniqueLeadInterest(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/interestTransactionalLog', async (req, res) => {
    let { tokenPayload } = req;
    let { leadId, learningProfile } = req.query;
    return leadInterestFunctions.interestTransactionalLog({...req.query})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/getOwnerInterestList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, childRoleNames, priority } = req.body
    return leadInterestFunctions.getOwnerInterestList({ search, pageNo, count, sortKey, sortOrder, childRoleNames, priority })
      .then(result => {
        return responseHandler.sendSuccess(res, result, req)
      })
      .catch(error => {
        console.log(error, '...errrr');
        return responseHandler.sendError(res, error, req)
      })
})

router.get('/getSchoolInterests', async (req, res) => {
    return leadInterestFunctions.getSchoolInterests({...req.query})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getMultipleSchoolInterests', async (req, res) => {
    return leadInterestFunctions.getMultipleSchoolInterests({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getProductList', async(req, res) => {
    return leadInterestFunctions.getProductList({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getProductWiseValue', async (req, res) => {
    return leadInterestFunctions.getProductWiseValue([...req.query])
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getUserHotsPipeline', async (req, res) => {
    return leadInterestFunctions.getUserHotsPipeline({...req.query})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/migrateProducts', async (req, res) => {
    return leadInterestFunctions.migrateProducts({...req.body})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

module.exports = router;