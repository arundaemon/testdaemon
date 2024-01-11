const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const configFunctions = require("../functions/configFunctions");

router.post('/createConfig', async (req, res) => {
    return configFunctions.createConfig(req.body)
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.get('/getConfig', async (req, res) => {
    return configFunctions.getConfig()
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.put('/updateConfig/', async(req, res) => {

    
    let { _id,authorization, xApiKey, KNumber, callUrl, myLeadsAction, myLeadsApiKey, myLeadsFreeTrailApproval,  orderActivity,  paymentlinkActivity, trialActivity, appVersion } = req.body;
    
    let { tokenPayload } = req;

    return configFunctions.updateConfig({ tokenPayload,_id, authorization, xApiKey, KNumber, callUrl, myLeadsAction, myLeadsApiKey, myLeadsFreeTrailApproval,  orderActivity,  paymentlinkActivity, trialActivity, appVersion})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })

})

router.get('/getAppVersion', (req,res) => {
    return configFunctions.getAppVersion()
        .then( result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch( error => {
            return responseHandler.sendError(res, error, req)
        })
})



module.exports = router