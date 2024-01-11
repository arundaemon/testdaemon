const express = require('express')
const router = express.Router()
const userControls = require('../controllers/userControls')
const userFunctions = require('../functions/userFunctions')
const auth = require('../middlewares/auth')
const responseHandler = require('../utils/responseHandler')
const { validateGetUsersList, validateCreateUser, validateUserLogin } = require('../validators/usersValidator');


router.post('/generateUserToken', async (req, res) => {
    return userFunctions.generateUserToken({...req.body})
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.post('/createUser', [auth.authenticateToken, validateCreateUser], async (req, res) => {
    let { s_uuid, firstName, lastName, password, roleId, email, schoolCodes } = req.body
    let { tokenPayload } = req

    return userFunctions.createUser({ tokenPayload, s_uuid, firstName, lastName, password, roleId, email, schoolCodes })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.post('/userLogin', [validateUserLogin], async (req, res) => {
    let { username, password } = req.body
    
    return userFunctions.userLogin({ username, password })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/getUsersList', [auth.authenticateToken, validateGetUsersList], async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query

    return userFunctions.getUsersList({ search, pageNo, count, sortKey, sortOrder })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});


router.put('/updateUser', [auth.authenticateToken, validateCreateUser], async (req, res) => {
    let { userId, s_uuid, firstName, lastName, password, roleId, email, employeeCode, schoolCodes } = req.body

    return userFunctions.updateUser({ userId, s_uuid, firstName, lastName, password, roleId, email, employeeCode, schoolCodes })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});



router.put('/deleteUser', [auth.authenticateToken], async (req, res) => {
    let { userId } = req.body

    return userFunctions.deleteUser({ userId })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

module.exports = router
