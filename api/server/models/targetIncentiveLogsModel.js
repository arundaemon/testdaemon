const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, MATRIX_TYPE } = require('../constants/dbConstants');
let TargetIncentiveLogs;
let targetIncentiveLogSchema = new mongoose.Schema({
    type: { type: String, enum: [MATRIX_TYPE.PROFILE, MATRIX_TYPE.ROLE] },
    fileName: {
        type: String,
        trim: true
    },
    successFile: [{
        userName: String,
        displayName: String,
        role_name: String,
        profile_name: String,
        incentive: Number,
        target: Number,
        empName: String,
        empCode: String
    }],
    errorFile: [{
        userName: String,
        displayName: String,
        role_name: String,
        profile_name: String,
        incentive: Number,
        target: Number,
        empName: String,
        empCode: String,
        errorMessage: String
    }],
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
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
//targetIncentiveLogSchema.index({updatedAt:-1},{unique:false})
module.exports = TargetIncentiveLogs = mongoose.model(DB_MODEL_REF.TARGET_INCENTIVE_LOGS, targetIncentiveLogSchema);