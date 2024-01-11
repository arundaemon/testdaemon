const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

let configSchema = new mongoose.Schema({
    Authorization: {
        type: String,
        trim: true
    },
    x_api_key: {
        type: String,
        trim: true
    },
    K_Number: {
        type: Array,
        trim: true
    },
    callUrl: {
        type: String,
        trim: true
    },
    my_leads_action: {
        type: String,
        trim: true
    },
    my_leads_api_key: {
        type: String,
        trim: true
    },
    my_leads_freetrail_approval: {
        type: String,
        trim: true
    },
    orderActivity: {
        type: String,
        trim: true
    },
    paymentlinkActivity: {
        type: String,
        trim: true
    },
    trialActivity: {
        type: String,
        trim: true
    },
    appVersion:{
        type:String,
        trim:true
    },
    meetingActivity: {
        type: String,
        trim: true
    },
},
    {
        timestamps:
        {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);
//configSchema.index({updatedAt:-1},{unique:false})
module.exports = Config = mongoose.model(DB_MODEL_REF.Config, configSchema);
