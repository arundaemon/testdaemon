const express = require('express');
const { checkLead } = require('../functions/leadFunctions');
const router = require('express-promise-router')();
const leadStageStatusFunctions = require('../functions/leadStageStatusFunctions');
const leadassignModal = require('../models/leadassignModal');
const responseHandler = require('../utils/responseHandler');
const { implementationStageStatus } = require('../functions/implementationFormFunctions');

router.get('/leadStageStatusDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;

    return leadStageStatusFunctions.getLeadStageStatusDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.delete('/deleteLeadStageStatus/:id', async (req, res) => {
    let { id } = req.params;

    return leadStageStatusFunctions.deleteLeadStageStatus(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/checkLead',(req,res) => {
    let payload = req.body;
    let data;
    if(payload.leadId){
        if(typeof payload.leadId != 'object'){
            res.send({status:0,msg:"Lead ID should be array"})
        }
        switch(payload?.leadType) {
            case 'IMPLEMENTATION':
                data = implementationStageStatus(payload.leadId, payload?.leadType);
                break;
            default:
                data = checkLead(payload.leadId);
                break;
        }
        return res.send({status:1,msg:"Success"})
    }else{
        res.send({status:0,msg:"Please provide Lead ID"})
    }
})

module.exports = router