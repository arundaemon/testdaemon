const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let manageStageModel;
let manageStageModelSchema = new mongoose.Schema({
    journeyName: {
        type: String,
        trim: true
    },
    journeyId: {type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.JOURNEY},
    cycleId: {type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.CYCLES},
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
    name: {
        type: String,
        trim: true
    },
    x: { type: Number },
    y: { type: Number },
    ruleId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.RULE },
    ruleName: {
        type: String,
        trim: true
    },
    parent: {
        type: String,
        trim: true, default: ""
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

//manageStageModelSchema.index({parent:1,stageName:1,statusName:1,ruleId:1},{unique:true,dropDups:true})
//manageStageModelSchema.index({parent:1,stageName:1,statusName:1,name:1},{unique:false})
//manageStageModelSchema.index({updatedAt:-1},{unique:false})
module.exports = manageStageModel = mongoose.model(DB_MODEL_REF.MANAGE_STAGE_STATUS_MAPPING, manageStageModelSchema);

// type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.JOURNEY