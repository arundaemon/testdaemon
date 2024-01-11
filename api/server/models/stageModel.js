const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, REQUEST_STATUS } = require('../constants/dbConstants');
let Stage;
let stageSchema = new mongoose.Schema({
    cycleId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.CYCLES },
    stageName: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true,
    },
    linkedStatus: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.STATUS }],
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    requestStatus: { type: String, enum: [REQUEST_STATUS.APPROVED, REQUEST_STATUS.PENDING, REQUEST_STATUS.REJECTED], default: REQUEST_STATUS.APPROVED },
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
    isDeleted: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//stageSchema.index({updatedAt:-1},{unique:false})
module.exports = Stage = mongoose.model(DB_MODEL_REF.STAGES, stageSchema); 