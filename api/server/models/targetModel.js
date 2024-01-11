const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
const targetSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    displayName: {
        type: String,
        trim: true,
        required: true
    },
    roleName: {
        type: String,
        trim: true,
        required: true
    },
    profileName: {
        type: String,
        trim: true,
        required: true
    },
    productName: {
        type: String,
        trim: true,
        required: true
    },
    targetUnit: {
        type: Number,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    targetMonth: {
        type: Date,
        required: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    createdBy: {
        type: String,
        trim: true,
        required: true

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
const target = mongoose.model(DB_MODEL_REF.TARGET, targetSchema);
module.exports = target