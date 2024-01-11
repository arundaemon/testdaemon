const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let Cycles;
let cycleSchema = new mongoose.Schema({
    journeyId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.JOURNEY },
    cycleName: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    linkedStage: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.STAGES }],
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
//cycleSchema.index({updatedAt:-1},{unique:false})
module.exports = Cycles = mongoose.model(DB_MODEL_REF.CYCLES, cycleSchema);