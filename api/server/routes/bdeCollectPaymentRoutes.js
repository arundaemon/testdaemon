const router = require('express-promise-router')();
const request = require('request');
const responseHandler = require('../utils/responseHandler');
const md5 = require('md5');
const bdeCollectPaymentFunctions = require("../functions//bdeCollectPaymentFunctions");


router.post('/createBdeCollectPaymentActivity', [], async (req, res) => {
    let obj = req.body;
    // console.log("routes called")
    return  bdeCollectPaymentFunctions.createBdeCollectPaymentActivity({ ...obj })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.post('/paymentCollect', async (req, res) => {
    let { empcode, onlinepayment_linktype, sf_payid,checksum,onlineprice,salesforce_orderno,contact_no,student_email,student_name,leadno,source} = req.body;
  
    try {
       
        var options = {
            'method': 'POST',
            'url': envConfig.OMS_URL+'orderapi/createLeadOnlinePayment/format/json',
            'headers': {
                'apikey': envConfig.API_KEY,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "empcode": empcode,
                "onlinepayment_linktype": onlinepayment_linktype,
                "sf_payid": sf_payid,
                "checksum": checksum,
                "onlineprice": onlineprice,
                "salesforce_orderno": salesforce_orderno,
                "contact_no": contact_no,
                "student_email": student_email,
                "student_name": student_name,
                "leadno": leadno,
                "source": source                
            })

        };
        return request(options, async (error, response) => {
            if (error) {
                return responseHandler.sendError(res, error, req)
            }
            if (response.body) {
                try{
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

router.post('/orderMark', async (req, res) => {
    let { uuid, empcode,checksum, oms_orderno} = req.body;
    return  bdeCollectPaymentFunctions.orderMark({ empcode, oms_orderno })
        .then(result => { 
            return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
    
})


module.exports = router;