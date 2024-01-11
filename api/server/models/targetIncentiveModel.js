const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let TargetIncentive;
let targetIncentiveSchema = new mongoose.Schema({
    roleId: {
        type: String,
        trim: true
    },
    profileId: {
        type: String,
        trim: true
    },

    userName: {
        type: String,
        trim: true
    },
    displayName: {
        type: String,
        trim: true
    },

    role_name: {
        type: String,
        trim: true
    },
    profile_name: {
        type: String,
        trim: true
    },

    incentive: { type: Number },
    target: { type: Number },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
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
    isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//targetIncentiveSchema.index({updatedAt:-1},{unique:false})
module.exports = TargetIncentive = mongoose.model(DB_MODEL_REF.TARGET_INCENTIVE, targetIncentiveSchema);