const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, CAMPAIGN_TYPE, CAMPAIGN_STATUS } = require('../constants/dbConstants');
let Campaign;
let campaignSchema = new mongoose.Schema({
    campaignName: {
        type: String,
        trim: true
    },
    campaignOwner: {
        type: String,
        trim: true
    },
    source: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.SOURCES },
    subSource: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.SOURCES },
    startDate: { type: Date },
    endDate: { type: Date },
    type: { type: String, enum: [CAMPAIGN_TYPE.SEMINAR,CAMPAIGN_TYPE.EMPTY]},
    link: {
        type: String,
        trim: true
    },
    qrCode: {
        type: String,
        trim: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    campaignStatus: { type: String, enum: [CAMPAIGN_STATUS.COMPLETED, CAMPAIGN_STATUS.IN_PROGRESS], default: CAMPAIGN_STATUS.IN_PROGRESS },
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
//campaignSchema.index({updatedAt:-1},{unique:false})
module.exports = Campaign = mongoose.model(DB_MODEL_REF.CAMPAIGN, campaignSchema);