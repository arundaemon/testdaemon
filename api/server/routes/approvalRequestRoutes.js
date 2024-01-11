const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const approvalRequestFunctions = require('../functions/approvalRequestFunctions');
const auth = require('../middlewares/auth')

router.post('/createRequest', async (req, res) => {
    return approvalRequestFunctions.createRequest({ ...req.body })
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            //console.log(error, '...eror');
            return responseHandler.sendError(res, error, req);
        })
});

router.get('/getRequestList',[auth.authenticateToken], async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, reqStatus, type,roleName, requestByEmpCode,reqDate } = req.query
    let { tokenPayload } = req;
   
    return approvalRequestFunctions.getRequestList({ search, pageNo, count, sortKey, sortOrder, reqStatus,type, tokenPayload,roleName,reqDate, requestByEmpCode })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getRequestDetails/:id', async (req, res) => {
    let { id } = req.params;
    let { tokenPayload } = req;
    return approvalRequestFunctions.getRequestDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

});

router.put('/approveReject', async (req, res) => {
    let { loggedInUser, requestStatus, remarks, _id, requestList, empCodeList,  } = req.body;
    let { tokenPayload } = req;
    return approvalRequestFunctions.approveReject({loggedInUser, requestStatus, remarks, _id, requestList, empCodeList})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => {
            //console.log(error,'::errrr');
            responseHandler.sendError(res, error, req)
        })
    
})

router.put('/reassignRequest', async (req, res) => {
    return approvalRequestFunctions.reassignRequest({...req.body})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => {
            //console.log(error,'::errrr');
            responseHandler.sendError(res, error, req)
        })
});

router.put('/approveClaimRequest', async (req, res) => {
    return approvalRequestFunctions.approveClaimRequest({...req.body})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => {
            //console.log(error,'::errrr');
            responseHandler.sendError(res, error, req)
        })
})

module.exports = router;