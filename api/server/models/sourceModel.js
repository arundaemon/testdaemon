const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let Sources;
let sourceSchema = new mongoose.Schema({
    leadSourceId: {
        type: String,
        trim: true
    },
    leadSourceName: {
        type: String,
        trim: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    subSource: [{
        subSourceId: mongoose.Schema.ObjectId,
        leadSubSourceId: {
            type: String,
            trim: true
        },
        leadSubSourceName: String,
        createdBy: String,
        modifiedBy: String,
        createdBy_Uuid: {
            type: String,
            trim: true
        },
        modifiedBy_Uuid: {
            type: String,
            trim: true
        },
        status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    }],
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
//sourceSchema.index({updatedAt:-1},{unique:false})
module.exports = Sources = mongoose.model(DB_MODEL_REF.SOURCES, sourceSchema);