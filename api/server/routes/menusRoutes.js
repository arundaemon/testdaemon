const express = require('express')
const router = express.Router()
const menusFunctions = require('../functions/menusFunctions')
const auth = require('../middlewares/auth')
const responseHandler = require('../utils/responseHandler')
const menusValidator = require('../validators/menusValidator')

router.post('/createMenu',  async (req, res) => {
    let { tokenPayload } = req
    return menusFunctions.createMenu({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateMenu',  async (req, res) => {
    let { tokenPayload } = req
    console.log(req.body,"menu body in route")
    return menusFunctions.updateMenu({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/saveRoleMenuMapping',  async (req, res) => {
    let { tokenPayload } = req
    return menusFunctions.saveRoleMenuMapping({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/deleteMenu',  async (req, res) => {
    let { tokenPayload } = req
    return menusFunctions.deleteMenu({ tokenPayload, ...req.body })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getMenusList',  async (req, res) => {
    let { tokenPayload } = req
    
    return menusFunctions.getMenusList({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllMenus', [auth.authenticateToken], async (req, res) => {
    let { tokenPayload } = req    
    return menusFunctions.getAllMenus({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllSideBarMenus', [auth.authenticateToken], async (req, res) => {
    let { tokenPayload } = req    
    return menusFunctions.getAllSideBarMenus({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllGroupedMenu', [auth.authenticateToken],async (req, res) => {
    let { tokenPayload } = req
    
    return menusFunctions.getAllGroupedMenu({ tokenPayload, ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router
