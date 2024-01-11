const router = require('express-promise-router')();
const request = require('request');
const axios = require('axios');
const md5 = require('md5');
const auth = require('../middlewares/auth')
const hierachyFunctions = require('../functions/hierachyFunctions');
const responseHandler = require('../utils/responseHandler');

router.get('/getHierachyDetails',[auth.authenticateToken],async (req, res) =>{

    return hierachyFunctions.getHierachyDetails({...req.query})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.get('/all-child-roles',[auth.authenticateToken],async (req, res) =>{

    return hierachyFunctions.getChildRolesAPI({...req.query})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

module.exports = router