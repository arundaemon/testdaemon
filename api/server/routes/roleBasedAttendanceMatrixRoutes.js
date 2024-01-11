const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const roleBasedAttendanceMatrixFunctions = require('../functions/roleBasedAttendanceMatrixFunctions');

router.post('/createRoleBasedAttendanceMatrix', async (req, res) => {
    return roleBasedAttendanceMatrixFunctions.updateRoleBasedAttendanceMatrixById({...req.body})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.get('/getRoleBasedAttendanceMatrixList', async (req, res) => {
    let { ID } = req.query
    return roleBasedAttendanceMatrixFunctions.getRoleBasedAttendanceMatrixById({ID})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.put('/updateRoleBasedAttendanceMatrixList',async (req,res) =>{
        let { params } = req.body;
        return roleBasedAttendanceMatrixFunctions.updateRoleBasedAttendanceMatrixById(params)
        .then( result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch( error => {
            return responseHandler.sendError(res, error, req)
        })
})

module.exports = router;