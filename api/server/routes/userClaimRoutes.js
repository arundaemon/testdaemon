const express = require('express');
const router = express.Router();
const multer = require('multer');
const myClaimFunctions = require('../functions/userClaimFunctions');
const responseHandler = require('../utils/responseHandler');
const storage = multer.memoryStorage();
const auth = require('../middlewares/auth');
const upload = multer({ storage: storage })

router.post('/createMyClaim', [auth.authenticateToken], upload.single("bill"), async (req, res) => {
    try {
        return myClaimFunctions.createMyClaim(req)
            .then(result => { return responseHandler.sendSuccess(res, result, req) })
            .catch(error => { return responseHandler.sendError(res, error, req) })
    }
    catch (err) {
        console.log(err, ':: err inside catch ');
        throw err;
    }
});

router.post('/getMyClaimList', [auth.authenticateToken], async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, status, childRoleNames } = req.body

    return myClaimFunctions.getMyClaimList({ search, pageNo, count, sortKey, sortOrder, status, childRoleNames })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getUserClaimListBySchool',[auth.authenticateToken], (req,res) => {
    let {schoolCode,roleName,dateTime} = req.query
    return myClaimFunctions.getUserClaimListBySchool({schoolCode,roleName,dateTime})
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/updateClaim', [auth.authenticateToken], async (req, res) => {

    return myClaimFunctions.updateClaim({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/getUserClaimDetails/:id', [auth.authenticateToken], async (req, res) => {
    let { id } = req.params;
    return myClaimFunctions.getUserClaimDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/bulkUpdate', [auth.authenticateToken],async (req, res) => {
    return myClaimFunctions.bulkUpdate({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
})

router.put('/bulkDelete', [auth.authenticateToken], async (req, res) => {
    return myClaimFunctions.bulkDelete({ ...req.body })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get('/claimList', [auth.authenticateToken], async (req, res) => {
    return myClaimFunctions.claimList({ ...req.query })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});



module.exports = router;