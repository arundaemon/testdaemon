const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const campaignFunctions = require('../functions/campaignFunctions');
const { authenticateToken } = require('../middlewares/auth');

router.post('/createCampaign', async (req, res) => {
    let { campaignName, campaignOwner, source, subSource, type, startDate, endDate, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return campaignFunctions.createCampaign({ tokenPayload, campaignName, campaignOwner, source, subSource, type, startDate, endDate, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/getCampaignList', [authenticateToken], async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, loggedInUser } = req.query
    let { tokenPayload } = req;
    //console.log(tokenPayload)
    return campaignFunctions.getCampaignList({ tokenPayload, search, pageNo, count, sortKey, sortOrder, loggedInUser })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            console.log(error, '...errrr');
            return responseHandler.sendError(res, error, req)
        })


})

router.put('/updateCampaign', async (req, res) => {
    let { _id, campaignName, campaignOwner, type, startDate, endDate, status, link, qrCode, modifiedBy, modifiedBy_Uuid } = req.body;
    let { tokenPayload } = req;

    return campaignFunctions.updateCampaign({ tokenPayload, _id, campaignName, status, campaignOwner, link, qrCode, type, startDate, endDate, modifiedBy, modifiedBy_Uuid })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })

})

router.get('/campaignDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;
    //console.log(id,'update id')   

    return campaignFunctions.getCampaignDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router;