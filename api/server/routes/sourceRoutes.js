const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler')
const sourceFunctions = require('../functions/sourceFunctions');
const sourceControls = require('../controllers/sourceControls');
const sourceValidator = require('../validators/sourceValidator')

router.post('/createSource',sourceValidator.createSourceValidator, async (req, res) => {
    
    let { leadSourceName, subSource, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid } = req.body;
    return sourceFunctions.createSource({ leadSourceName, subSource, createdBy, modifiedBy, createdBy_Uuid, modifiedBy_Uuid})
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            return responseHandler.sendError(res, error, req);
        })
});

router.put('/addSubSource', async (req, res) => {
    
    let { _id, subSource, createdBy, modifiedBy } = req.body;
    return sourceFunctions.addSubSource({ _id, subSource, createdBy, modifiedBy })
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            return responseHandler.sendError(res, error, req);
        })
});

router.put('/removeSubSource', async (req, res) => {
    
    let { _id, subSource, leadSubSourceId } = req.body;
    return sourceFunctions.removeSubSource({ _id, subSource, leadSubSourceId })
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            return responseHandler.sendError(res, error, req);
        })
});




router.put('/updateSource', async (req, res) => {
    let { _id, leadSourceId, leadSourceName, subSource, modifiedBy } = req.body;
    let { tokenPayload } = req;

    return sourceFunctions.updateSource({ _id, leadSourceId, leadSourceName, subSource, modifiedBy })
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
});

router.get('/getSourceList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let { tokenPayload } = req;

    return sourceFunctions.getSourceList({ search, pageNo, count, sortKey, sortOrder })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/getAllSources', async (req, res) => {
    let { tokenPayload } = req;  
    return sourceFunctions.getAllSources({tokenPayload, ...req.query})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/deleteSource', [], async (req, res) => {
    let { tokenPayload } = req
    return sourceFunctions.deleteSource({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/changeStatus', async (req, res) => {
    let { _id, status } = req.body;
    return sourceFunctions.changeStatus( _id, status )
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/changeSubSourceStatus', async (req, res) => {
    let { _id, status, leadSubSourceId } = req.body;
    return sourceFunctions.changeSubSourceStatus( {_id, status, leadSubSourceId} )
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllSubSource/:id', async(req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;    
        
    return sourceFunctions.getAllSubSource(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

})



router.get('/sourceDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;    
    let { subSourceName } = req.query;    
        
    return sourceFunctions.getSourceDetails(id, subSourceName)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => { 
            
            responseHandler.sendError(res, error, req)
        
        })

})

router.get('/isDuplicateSource', async (req, res) => {
    let { leadSourceName, id } = req.query;
    return sourceFunctions.isDuplicateSource(leadSourceName)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))

})

router.get('/allSourcesWithLeadCount', async (req, res) => {
    // let { tokenPayload } = req;
        
    return sourceFunctions.allSourcesWithLeadCount({...req.query})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});


module.exports = router;