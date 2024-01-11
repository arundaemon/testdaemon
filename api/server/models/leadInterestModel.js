const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let LeadInterest;

let leadInterestSchema = new mongoose.Schema({
    roleName: { type: String },
    leadId: {
        type: String,
        trim: true,
        index:true
    },
    schoolId: {
        type: String,
        trim: true
    },
    schoolCode: {
        type: String,
        trim: true
    },
    leadType: {
        type: String,
        trim: true, default: 'offline'
    },
    leadInterestType: {
        type: String,
        trim: true,
    },
    learningProfile: {
        type: String,
        trim: true
    },
    learningProfileCode: {
        type: String,
        trim: true
    },
    learningProfileRefId: {
        type: Number,
        trim: true
    },
    learningProfileGroupCode: {
        type: String,
        trim: true
    },
    learningProfileGroupName: {
        type: String,
        trim: true
    },
    school: {
        type: String,
        trim: true
    },
    board: {
        type: String,
        trim: true
    },
    class: {
        type: String,
        trim: true
    },
    sourceName: {
        type: String,
        trim: true
    },
    subSourceName: {
        type: String,
        trim: true
    },
    campaignName: {
        type: String,
        trim: true
    },
    campaignId: {
        type: String,
        trim: true
    },
    utmSource: {
        type: String,
        trim: true
    },
    installTime: {
        type: String,
        trim: true
    },
    advertisingId: {
        type: String,
        trim: true
    },
    utmTerm: {
        type: String,
        trim: true
    },
    utmCampaign: {
        type: String,
        trim: true
    },
    utmMedium: {
        type: String,
        trim: true
    },
    landingPage: {
        type: String,
        trim: true
    },
    adjustRefTag: {
        type: String,
        trim: true
    },
    assignedTo_userId: {
        type: String,
        trim: true
    },
    assignedTo_userName: {
        type: String,
        trim: true
    },
    assignedTo_displayName: {
        type: String,
        trim: true
    },
    assignedTo_assignedOn: { type: Date },
    assignedTo_role_id: {
        type: String,
        trim: true
    },
    assignedTo_role_code: {
        type: String,
        trim: true
    },
    assignedTo_role_name: {
        type: String,
        trim: true
    },

    assignedTo_profile_id: {
        type: String,
        trim: true
    },
    assignedTo_profile_code: {
        type: String,
        trim: true
    },
    assignedTo_profile_name: {
        type: String,
        trim: true
    },
    createdBy: {
        type: String,
        trim: true
    },
    modifiedBy: {
        type: String,
        trim: true
    },
    createdBy_Uuid: {
        type: String,
        trim: true
    },
    modifiedBy_Uuid: {
        type: String,
        trim: true
    },
    stageName: { 
        type: String, 
        trim: true 
    },
    statusName: { 
        type: String, 
        trim: true 
    },
    priority: {
        type: String,
        trim: true
    },
    edc: {
        type: Date,
        trim: true
    },
    edcCount: {
        type: Number,
        default: 0
    },
    edcUserCount: {
        type: Number
    },
    softwareContractValue: {
        type: Number
    },
    unit: {
        type: Number,
        trim: true
    },
    totalContractValue: {
        type: Number,
        trim: true
    },
    sourceType: {
        type: String,
        trim: true
    },
    app_name: {
        type: String,
        trim: true
    },
    platform: {
        type: String,
        trim: true
    },
    source_campaign: {
        type: String,
        trim: true
    },
    utm_content: {
        type: String,
        trim: true
    },
    observables: {
        type: String,
        trim: true
    },
    mx_advertising_id: {
        type: String,
        trim: true
    },
    campaign_str: {
        type: String,
        trim: true
    },
    campaign_name_flat: {
        type: String,
        trim: true
    },
    campaign_str_flat: {
        type: String,
        trim: true
    },
    adjust_device_id: {
        type: String,
        trim: true
    },
    netContractValue: {
        type: Number,
        trim: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

//leadInterestSchema.index({leadId:1,learningProfile:1},{unique:true,dropDups:true})
//leadInterestSchema.index({updatedAt:-1},{unique:false})

module.exports = LeadInterest = mongoose.model(DB_MODEL_REF.LEAD_INTEREST, leadInterestSchema);