const express = require('express');
const router = require('express-promise-router')();
const axios = require('axios');
const md5 = require('md5')
const responseHandler = require('../utils/responseHandler');
const freeTrialValidators = require('../validators/freeTrialValidators');
const approvalRequestFunctions = require('../functions/approvalRequestFunctions');
const hierachyFunctions = require('../functions/hierachyFunctions');
const bdeActivityFunctions = require("../functions/bdeActivitiesFunctions");


router.post('/getFreeTrialPackageList',freeTrialValidators.createFreeTrialValidators, async (req, res) => {


    let { action, apikey,trial_activation_request, empcode, trialCreatorDetails,metaInfo = {},trialType} = req.body;

    const logBdeActivities = async(responseArray) =>{
            try {
                let result = {};
                for (const [index, value] of responseArray.entries()) {
                    if(value?.msg === 'Free Trial Assigned Successfully' && value?.trail_count === 0){
                            const {uuid, ...activityDetailData} = trial_activation_request[index]; 
                            let data ={
                                leadId:uuid,
                                activityType:"trial",
                                activityDetail: activityDetailData,
                                createdByRoleName: trialCreatorDetails?.requestBy_roleId,
                                createdBy: trialCreatorDetails?.requestBy_uuid,
                                createdByProfileName: trialCreatorDetails?. requestBy_ProfileName,
                                createdByName: trialCreatorDetails?.requestBy_name
                            }
                            const trialResult = await bdeActivityFunctions.logBdeActivity(data);
                            result[index] = trialResult;
                    }  
                }
                return result;
            } catch (error) {
                
            }
    }

    try {

        const checkSumUpdated = md5(`${envConfig.API_KEY}:${envConfig.API_SALT}:${empcode}`);

        var data1 = JSON.stringify({
            empcode: empcode,
            checksum: checkSumUpdated,
            action: action,
            apikey: apikey,
            trial_activation_request: trial_activation_request
        });
          
        var config = {
            method: 'post',
            url: envConfig.OMS_URL+'crmorderapi/freeTrialProductList/format/json',
            headers: {
              'Content-Type': 'application/json',
            },
            data : data1
        };

        // Before response console
        // console.log("**************trialCreatorDetails*********************");
        // console.log(trialCreatorDetails)
        // console.log("****************trial_activation_request***********");
        // console.log(trial_activation_request)
        // console.log("*************data1*********************************")
        // console.log(data1)
        // console.log("**************************config*******************")
        // console.log(config)
        
        const response = await axios(config);
        let result = response?.data;

        // After response consoles
        // console.log("************response?.data;*************");
        // console.log(response?.data)

        if(response?.data?.mesagges === 'success'){
            const responseArray = response?.data?.data_array;

            if(trialType === 'single'){
                const responseData = responseArray?.[0];

                if(responseData?.trail_count === 0){

                    if(responseData?.msg === 'Free Trial Assigned Successfully'){
                        const logResult = await logBdeActivities(responseArray);
                        result.trialLogResult = logResult;
                    }

                    return responseHandler.sendSuccess(res, result, req)
                }

                if(responseData?.trail_count > 2){
                    let newResult = { message: "There is no trial available for this user", status: "0"}
                    return responseHandler.sendError(res, newResult, req)
                }
    
                let hierachyParams = { roleName: trialCreatorDetails?.requestBy_roleId}
                const managerResponse = await hierachyFunctions.getHierachyDetails(hierachyParams);
                let approverDetails = managerResponse?.result;

                //To Approval requests to senior of current login user => start //
                let new_data =  {
                      trialCreatorDetails,
                      requestBy_empCode: empcode,
                      trialType: "single trial",
                      approver_roleId: approverDetails?.["roleID"],
                      approver_empCode: approverDetails?.["userName"],
                      approver_name: approverDetails?.["displayName"],
                      trialData: data1,
                      metaInfo,
                      remarks: "",
                      requestStatus: "NEW",
                      requestType:"Trial"
                }
    
                return approvalRequestFunctions.createRequest({ ...new_data })
                        .then((result) => {
                            return responseHandler.sendSuccess(res, result, req);
                        })
                        .catch((error) => {
                            console.log(error, '...eror');
                            return responseHandler.sendError(res, error, req);
                        })
                //To Approval requests to senior of current login user => ends //

            }else{
                // for bulk trial case
                const logResult = await logBdeActivities(responseArray);
                result.trialLogResult = logResult;
                return responseHandler.sendSuccess(res, result, req)
            }
          //To make approval request => ends//

        }else{
            responseHandler.sendError(res, result, req)
        }
    }
    catch (err){
        console.log("err",err);
        throw { errorMessage: err }
    }
})

module.exports = router;