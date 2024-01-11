const mongoose = require('mongoose');
const { DB_MODEL_REF, BULK_UPLOAD_STATUS} = require('../constants/dbConstants');
let LeadLogs;
let leadLogSchema = new mongoose.Schema({
    // campaignId: {
    //     type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.CAMPAIGN
    // },
    campaignName: {
        type: String,
        trim: true
    },
    batch: {
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
    fileName: {
        type: String,
        trim: true
    },
    fileData: [{
        name: String,
        mobile: String,
        email: String,
        board: String,
        class: String,
        school: String,
        schoolCode: String,
        pinCode: String,
        state: String,
        city: String,
        userType: String,
        learningProfile: String,
        reference: String
    }],
    successFile: [{
        name: String,
        mobile: String,
        email: String,
        board: String,
        class: String,
        school: String,
        schoolCode: String,
        pinCode: String,
        state: String,
        city: String,
        userType: String,
        learningProfile: String,
        reference: String
    }],
    errorFile: [{
        name: String,
        mobile: String,
        email: String,
        board: String,
        class: String,
        school: String,
        schoolCode: String,
        pinCode: String,
        state: String,
        city: String,
        userType: String,
        learningProfile: String,
        reference: String ,
        errorMessage: String       
    }],
    batchStatus: { type: String, enum: [BULK_UPLOAD_STATUS.PENDING,BULK_UPLOAD_STATUS.IN_PROGRESS,BULK_UPLOAD_STATUS.UPLOADED,BULK_UPLOAD_STATUS.UPLOADED], default: BULK_UPLOAD_STATUS.PENDING },
    exception: {
        type: String,
        trim: true
    },
    createdBy: {
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
    modifiedBy: {
        type: String,
        trim: true
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = LeadLogs = mongoose.model(DB_MODEL_REF.LEAD_LOGS, leadLogSchema);