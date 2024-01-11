const express= require('express');
const router= express.Router();
const subjectFunctions= require('../functions/subjectFunctions');
const responseHandler = require('../utils/responseHandler');
const subjectValidator= require('../validators/subjectValidator');

router.get('/getSubjectList',[], async(req,res) =>{

    return subjectFunctions.getSubjectList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createSubject', [], async(req,res) => {

    return subjectFunctions.createSubject({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.put ('/updateSubject', [], async(req,res) => {

    return subjectFunctions.updateSubject({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put ('/deleteSubject', [], async(req, res) => {

    return subjectFunctions.deleteSubject({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError( res, error, req) })
});

router.get ('/getAllSubjects',subjectValidator.validateAllSubjectsList, async (req, res) => {
    
    // let { search, pageNo, count, sortKey, sortOrder } = req.query

    return subjectFunctions.getAllSubjects({...req.query})
           .then(result => { return responseHandler.sendSuccess(res, result,req) })
           .catch(error => { return responseHandler.sendError( res, error,req) })
})


module.exports = router;