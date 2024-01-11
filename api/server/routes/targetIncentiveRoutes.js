const express = require('express');
const router = require('express-promise-router')();
const multer = require('multer');
const request = require('request');
const targetIncentiveFunctions = require('../functions/targetIncentiveFunctions');
const responseHandler = require('../utils/responseHandler');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const auth = require('../middlewares/auth')
const md5 = require('md5')

router.post('/uploadTargetIncentive', upload.single("targetIncentive"), async (req, res) => {
    return targetIncentiveFunctions.uploadTargetIncentive(req)
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

router.get('/downloadSample',[auth.authenticateToken], async (req, res) => {
    let { tokenPayload } = req;
    //console.log(tokenPayload)
    const data = {
        //'apikey': envConfig.HRMS_API_KEY,
        "action": "all_child_roles",
        "role_name": tokenPayload.crm_role,
        "checksum": md5("all_child_roles:" + envConfig.HRMS_API_KEY + ":" + tokenPayload.crm_role + ":" + envConfig.HRMS_SALT_KEY)
    }
    const requestOptions = {
        url: envConfig.HRMS_URL + '/user/all-child-roles',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    //console.log(JSON.stringify(data),envConfig.HRMS_URL)    
    return request(requestOptions, async (err, response, body) => {
        if (err) {
            console.log(err)
            return responseHandler.sendError(res, err, req)
        } 
        else if (response.statusCode === 200) {
            console.log(body)          
            const data = JSON.parse(response.body.trim());
            let Savedfile = await targetIncentiveFunctions.downloadSample(data.response)
            let fileName = 'Sample_Target_Incentive.csv'
            return responseHandler.sendFileSuccess(res, fileName, req)
        }
        else {
            console.log(response.statusCode);
        }
    });

})

router.get('/getTargetIncentive', [], async (req, res) => {
    return targetIncentiveFunctions.getTargetIncentive({...req.query})
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});

module.exports = router;