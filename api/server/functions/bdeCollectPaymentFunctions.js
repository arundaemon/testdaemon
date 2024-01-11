const bdeCollectPaymentControls = require("../controllers/bdeCollectPaymentControls")
const md5 = require('md5');
const request = require('request-promise');
const { logger } = require("../logger");
const orderLogModel = require("../models/orderLogModel");


const createBdeCollectPaymentActivity = async (params) => {
    // console.log("functions called")
    return bdeCollectPaymentControls.createBdeCollectPaymentActivity(params)
        .then(result => {
            return { message: `bde activity created successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const orderMark = async (params) => {
    let { uuid, empcode,customerResponse,verifiedDocuments, oms_orderno} = params;
    const checkSum = md5(`${envConfig.OMS_API_KEY}:${envConfig.OMS_API_SALT}:${empcode}`);
    try {
        let options = {
            'method': 'POST',
            'url': envConfig.OMS_URL+'orderapi/saleforcevalidateorder/format/json',
            'headers': {
                'apikey': envConfig.OMS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "empcode": empcode,
                "checksum": checkSum,
                "remark": null,
                "lead_validate": "4",
                "oms_orderno": oms_orderno          
            })
        };
        const data = await request(options)
        if(data){
            const result = JSON.parse(data);
            let logObj = {
                leadId:uuid,
                empCode:empcode,
                omsOrderNo:oms_orderno,
                customerResponse,
                verifiedDocuments,
                errorMsg:JSON.stringify(result),
                status:'Done'
            }
            orderLogModel.create(logObj)
            logger.info(`Order Marked ${empcode} => ${oms_orderno}`)
            console.log(`Order Marked ${empcode} => ${oms_orderno}`)
            return result;
        }
        else{
            let logObj = {
                leadId:uuid,
                empCode:empcode,
                omsOrderNo:oms_orderno,
                customerResponse,
                verifiedDocuments,
                errorMsg:'No response data',
                status:'Error'
            }
            orderLogModel.create(logObj)
            return {}
        }
    }
    catch (err){
        let logObj = {
            leadId:uuid,
            empCode:empcode,
            omsOrderNo:oms_orderno,
            customerResponse,
            verifiedDocuments,
            errorMsg:JSON.stringify(err),
            status:'Error'
        }
        orderLogModel.create(logObj)
        throw { errorMessage: err }
    }
}

module.exports = {
    createBdeCollectPaymentActivity,
    orderMark
}