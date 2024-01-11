const configModel = require("../models/configModel");

const createConfigData = async (params) => {
    const result = await configModel.create(params);
    // console.log("params",result)
    return result;
}

const getConfigData = async (params) => {
    const result = await configModel.find({});
    return result;
}

const getAppVersion = async (params) => {
    const result = await configModel.find({});
    //console.log(result)
    return result.length > 0 ? result?.[0]?.appVersion:'';
}

const updateConfig = async (params) =>{
    
    let { _id, authorization, xApiKey, KNumber, callUrl, myLeadsAction, myLeadsApiKey, myLeadsFreeTrailApproval,  orderActivity,  paymentlinkActivity, trialActivity, appVersion } = params;
    
    let update = {};
    let options = { new: true };

    if (authorization) {
        update.authorization = authorization;
    }

    if (xApiKey) {
        update.x_api_key = xApiKey;
    }

    if (KNumber) {
        update.K_Number = KNumber;
    }
    if (callUrl) {
        update.callUrl = callUrl;
    }

    if (myLeadsAction) {
        update.my_leads_action = myLeadsAction;
    }

    if (myLeadsApiKey) {
        update.my_leads_api_key = myLeadsApiKey;
    }

    if (myLeadsFreeTrailApproval) {
        update.my_leads_freetrail_approval = myLeadsFreeTrailApproval;
    }

    if (orderActivity ) {
        update.orderActivity = orderActivity ;
    }

    if (paymentlinkActivity) {
        update.paymentlinkActivity = paymentlinkActivity;
    }
    if (trialActivity) {
        update.trialActivity = trialActivity;
    }

    if (appVersion) {
        update.appVersion = appVersion;
    }

    return Config.findOneAndUpdate({ _id }, update, options);

}

module.exports = {
    getConfigData,
    createConfigData,
    updateConfig,
    getAppVersion
}