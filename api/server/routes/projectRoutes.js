const express = require('express')
const router = express.Router()
const projectFunctions = require('../functions/projectFunctions')
const auth = require('../middlewares/auth')
const responseHandler = require('../utils/responseHandler')
const projectValidator = require('../validators/projectValidator')

router.post('/createProject', [], async (req, res) => {
    let { tokenPayload } = req
    
    return projectFunctions.createProject({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateProject', [], async (req, res) => {
    let { tokenPayload } = req
    return projectFunctions.updateProject({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


router.put('/deleteProject', [], async (req, res) => {
    let { tokenPayload } = req
    return projectFunctions.deleteProject({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getProjectList', [projectValidator.validateGetProjectList], async (req, res) => {
    let { tokenPayload } = req
    
    return projectFunctions.getProjectList({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllProjects', [projectValidator.validateGetProjectList], async (req, res) => {
    let { tokenPayload } = req
    
    return projectFunctions.getAllProjects({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})



module.exports = router
