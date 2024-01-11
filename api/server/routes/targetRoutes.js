

const express = require('express');
const router = require('express-promise-router')();
const multer = require('multer');
const request = require('request');
const targetFunctions = require('../functions/targetFunctions');
const responseHandler = require('../utils/responseHandler');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const auth = require('../middlewares/auth')
const md5 = require('md5')

router.post('/addTarget', [auth.authenticateToken], upload.single("target"), async (req, res) => {
    return targetFunctions.addTarget(req)
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});


router.get('/downloadSampleTarget', [auth.authenticateToken], async (req, res) => {
    // console.log(req, 'testRequestComes')
    let { tokenPayload } = req;
    let { roleName } = req.query;
    // console.log(tokenPayload,req.query,'.........................payload')
    const data = {
        //'apikey': envConfig.HRMS_API_KEY,
        "action": "all_child_roles",
        "role_name": roleName,
        "checksum": md5("all_child_roles:" + envConfig.HRMS_API_KEY + ":" + roleName + ":" + envConfig.HRMS_SALT_KEY)
    }
    const requestOptions = {
        url: envConfig.HRMS_URL + '/user/all-child-roles',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    return request(requestOptions, async (err, response, body) => {
        if (err) {
            console.log(err)
            return responseHandler.sendError(res, err, req)
        }
        else if (response.statusCode === 200) {
            // console.log(body)
            const data = JSON.parse(response.body.trim());
            let Savedfile = await targetFunctions.downloadSampleTarget(data.response)
            let fileName = 'Sample_Target_Incentive.csv'
            return responseHandler.sendFileSuccess(res, fileName, req)
        }
        else {
            console.log(response.statusCode);
        }
    });

})

router.post('/getTargetList', [auth.authenticateToken], async (req, res) => {
    let { childList, range } = req.body
    return targetFunctions.getTargetList({ childList, range })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.put('/updateTargetDetails', [auth.authenticateToken], async (req, res) => {
    return targetFunctions.updateTargetDetails({ ...req.body })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/getRoleNameProducts', [auth.authenticateToken], async (req, res) => {
    return targetFunctions.getRoleNameProducts({ ...req.query })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/assignTargets', [auth.authenticateToken], async (req, res) => {
    let { data, range } = req.body
    return targetFunctions.assignTargets({ data, range })
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

module.exports = router;