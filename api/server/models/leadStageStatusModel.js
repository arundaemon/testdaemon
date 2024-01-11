const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let LeadStageStatus;
let leadStageStatusSchema = new mongoose.Schema({
    leadId: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    journeyName: {
        type: String,
        trim: true
    },
    cycleName: {
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
    source: {
        type: String,
        trim: true
    },
    subSource: {
        type: String,
        trim: true
    },
    dnd: { 
        type: Boolean, 
        default: false 
    },
    otpVerified: { 
        type: Boolean, 
        default: false 
    },
    createdDateTime: { 
        type: Date, 
        default: null 
    },
    registrationDateTime: { 
        type: Date, 
        default: null 
    },
    appDownloadedDate: { 
        type: Date, 
        default: null 
    },
    previousStage: {
        type: String,
        trim: true
    },
    previousStatus: {
        type: String,
        trim: true
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

//leadStageStatusSchema.index({leadId:1,stageName:1,statusName:1},{unique:true,dropDups:true})
//leadStageStatusSchema.index({updatedAt:-1},{unique:false})
module.exports = LeadStageStatus = mongoose.model(DB_MODEL_REF.LEAD_STAGE_STATUS, leadStageStatusSchema);