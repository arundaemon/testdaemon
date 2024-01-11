const express = require('express');
const router = require('express-promise-router')();
const request = require('request');
const axios = require('axios');
const md5 = require('md5')
const responseHandler = require('../utils/responseHandler');

router.post('/getProductList', async (req, res) => {
    let { board_id, subscription_type, class_syllabus_id, empcode, type } = req.body;
    const checkSum = md5(`${envConfig.API_KEY}:${envConfig.API_SALT}:${empcode}`);
    // console.log(`${requestOptions.API_KEY}:${requestOptions.SALT}:${empcode}`, '...checksum');
    // console.log(checkSum)
    try {
        //var request = require('request');
        var options = {
            'method': 'POST',
            'url': envConfig.OMS_URL + 'orderapi/orderProductServiceList/format/json',
            'headers': {
                'apikey': envConfig.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "empcode": empcode,
                "checksum": checkSum,
                "board_id": board_id,
                "subscription_type": subscription_type,
                "class_syllabus_id": class_syllabus_id,
                "type": type
            })

        };
        return request(options, async (error, response) => {
            if (error) {
                console.log(error, '..errrr');
                return responseHandler.sendError(res, error, req)
            }
            if (response.body) {
                try {
                    const result = JSON.parse(response.body.trim())
                    //console.log()
                    //return result
                    return responseHandler.sendSuccess(res, result, req)
                } catch (err) {
                    console.log(err, response);
                    return responseHandler.sendError(res, err, req)
                }
            }


        });
    }
    catch (err) {
        console.log(err, '..errr');
        throw { errorMessage: err }
    }
})


module.exports = router;