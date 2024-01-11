const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const stageStatusValidator = require('../validators/stageStatusMappingValidator');
const stageFunctions = require('../functions/manageStageStatusFunctions');

router.put('/manageStageStatus', async (req, res) => {
    let { addList,deleteList } = req.body;
    let { tokenPayload } = req;

    return stageFunctions.manageStageStatus({ tokenPayload, addList,deleteList })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getStageStatusById', async (req, res) => {
    //console.log(req.query,"queryy")
    // let {journeyId} = req.params;
    // console.log(journeyId,"journeyID to pass to route")
    
    return stageFunctions.getStageStatusById( {...req.query} )
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
})

router.get('/getPreviewMap', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder,journeyId } = req.query
    let { tokenPayload } = req;
    
    return stageFunctions.getTreeList({ tokenPayload, search, pageNo, count, sortKey, sortOrder,journeyId })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
})

module.exports = router;