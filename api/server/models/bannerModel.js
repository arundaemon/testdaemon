const mongoose = require('mongoose');
const { DB_MODEL_REF, BANNER_STATUS } = require('../constants/dbConstants');
let Banners;
let bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        trim: true
    },
    appBanner: {
        bannerUrl: {
            type: String,
            trim: true
        },
        redirectToType: {
            type: String,
            trim: true
        },
        redirectUrl: {
            type: String,
            trim: true
        },
    },
    webBanner: {
        bannerUrl: {
            type: String,
            trim: true
        },
        redirectToType: {
            type: String,
            trim: true
        },
        redirectUrl: {
            type: String,
            trim: true
        },
    },

    priority: { type: Number },
    status: { type: Number, enum: [BANNER_STATUS.ACTIVE, BANNER_STATUS.DEACTIVE], default: BANNER_STATUS.ACTIVE },
    startDate: { type: Date },
    endDate: { type: Date },

    createdBy: {
        type: String,
        trim: true, required: true
    },
    createdBy_Uuid: {
        type: String,
        trim: true
    },

    modifiedBy: {
        type: String,
        trim: true, required: true
    },
    modifiedBy_Uuid: {
        type: String,
        trim: true
    },

    isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//bannerSchema.index({updatedAt:-1},{unique:false})
module.exports = Banners = mongoose.model(DB_MODEL_REF.BANNER, bannerSchema);