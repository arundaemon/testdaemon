const express = require('express');
const router = require('express-promise-router')();
const axios = require('axios');
const md5 = require('md5');
const responseHandler = require('../utils/responseHandler');
const approvalRequestControls = require('../controllers/approvalRequestControls');
const hierarchyFunctions = require('../functions/hierachyFunctions');

router.post('/singleCouponRequest', [], async (req, res) => {
    try {
        let { approver_empcode, requester_empcode, approver_role_id, remarks, metaInfo, _id } = req.body;
        const checkSumUpdated = md5(`${envConfig.API_KEY}:${envConfig.API_SALT}:${requester_empcode}`);
        var data1 = JSON.stringify({
            checksum: checkSumUpdated,
            approver_empcode: approver_empcode,
            requester_empcode: requester_empcode,
            approver_role_id: approver_role_id,
            discount_percentage: metaInfo[0].Coupan_Percentage,
            selling_price: metaInfo[0].Selling_Price,
            remarks: remarks,
            api_key: `${envConfig.API_KEY}`,
        });
        var config = {
            method: 'post',
            url: envConfig.OMS_URL + 'crmorderapi/discountCouponToSales/format/json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data1
        };
        const response = await axios(config);
        let result = response?.data;
        if (result?.mesagges === 'failed') {
            return responseHandler.sendSuccess(res, result, req)
        }
        if (result?.mesagges === 'success') {
             await approvalRequestControls.approveReject([{ _id, requestStatus: 'APPROVED', remarks }])
            return responseHandler.sendSuccess(res, result, req)
        }
    }
    catch (err) {
        console.log("err", err);
        throw { errorMessage: err }
    }
})

router.post('/specialCouponRequest', async (req, res) => {
    try {
        let { requestBy_empCode, requestBy_roleId, requestBy_ProfileName, remarks, metaInfo, _id } = req.body;
        const formattedMetaInfo = [];
        const requesterDetails = await hierarchyFunctions.getHierachyDetails({ roleName: requestBy_roleId })

        metaInfo.map(item => {
            let obj = {
                from_percentage: item.From_Percentage,
                to_percentage: item.To_Percentage,
                count: item.Quantity,
                valid_till: item.Valid_Till_Date
            };
            formattedMetaInfo.push(obj);
        })

        const checkSumUpdated = md5(`${envConfig.API_KEY}:${envConfig.API_SALT}:${requestBy_empCode}`);
        var data1 = JSON.stringify({
            checksum: checkSumUpdated,
            api_key: `${envConfig.API_KEY}`,
            empcode: requestBy_empCode,
            roleid: requesterDetails?.hierarchyInfo?.roleID,
            rolename: requestBy_roleId,          //requestBy_roleId is crm role
            profile: requestBy_ProfileName,
            coupon_list: formattedMetaInfo,

        });

        var config = {
            method: 'post',
            url: envConfig.OMS_URL + 'crmorderapi/manageCouponMaster/format/json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data1
        };
        const response = await axios(config);
        let result = response?.data;
        console.log(result,'....result of approve');
        if (result?.mesagges === 'failed') {
            return responseHandler.sendSuccess(res, result, req)
        }
        if (result?.mesagges === 'success') {
            await approvalRequestControls.approveReject([{ _id, requestStatus: 'APPROVED', remarks }])
            return responseHandler.sendSuccess(res, result, req)
        }
    }
    catch (err) {
        console.log("err", err);
        throw { errorMessage: err }
    }



})

module.exports = router;