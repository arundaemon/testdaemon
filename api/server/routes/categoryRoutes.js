const express= require('express');
const router= express.Router();
const categoryFunctions= require('../functions/categoryFunctions');
const responseHandler = require('../utils/responseHandler');
// const categoryValidator= require('../validators/activityValidator');

router.get('/getCategoryList',[], async(req,res) =>{

    return categoryFunctions.getCategoryList({...req.query})
           .then( result => { return responseHandler.sendSuccess(res, result, req)})
           .catch( error => { return responseHandler.sendError(res, error, req)})
})

router.post('/createCategory', [], async(req,res) => {

    return categoryFunctions.createCategory({...req.body})
           .then(result => { return responseHandler.sendSuccess(res, result, req) })
           .catch(error => { return responseHandler.sendError(res, error, req) })
});


module.exports = router;