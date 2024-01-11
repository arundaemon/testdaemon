const express = require('express');
const router = require('express-promise-router')();
const request = require('request');
const axios = require('axios');
const md5 = require('md5')
const responseHandler = require('../utils/responseHandler');

router.post('/getBatchList', async (req, res) => {
    let { empcode, board_id, syllabus_id, product_id, checksum } = req.body;
    const checkSum = md5(`${envConfig.API_KEY}:${envConfig.API_SALT}:${empcode}`);
    try {
        //var request = require('request');
        var options = {
            'method': 'POST',
            'url': envConfig.OMS_URL+'crmorderapi/getBatchClassMapping/format/json',
            'headers': {
                'apikey': envConfig.API_KEY,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "empcode": empcode,
                "checksum": checkSum,
                "board_id": board_id,
                "syllabus_id": syllabus_id,
                "product_id": product_id
            })

        };
        return request(options, async (error, response) => {
            if (error) {
                return responseHandler.sendError(res, error, req)
            }
            if (response.body) {
                try{
                //console.log(response.body,'..body batch');
                const result = JSON.parse(response.body.trim());
                return responseHandler.sendSuccess(res, result, req)
                }catch(err){
                    console.log(err);
                    return responseHandler.sendError(res, err, req)
                }
                
            }


        });
    }
    catch (err){
        throw { errorMessage: err }
    }
})
module.exports = router;