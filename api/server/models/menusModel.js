var mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants')
let Menus
let Schema = mongoose.Schema

var menuSchema = new Schema({
    name: {
        type: String,
        trim: true,
        trim: true, index: true
    },
    route: {
        type: String,
        trim: true
    },
    rolesAllowed: [{
        type: String,
        trim: true
    }],
    iconUrl: {
        type: String,
        trim: true
    },
    menuOrderIndex: { type: Number },
    externalRedirection: { type: Boolean, default: false },
    isHrmMenu: { type: Boolean, default: false },
    landingPage: {
        type: String,
        trim: true
    },
    parentMenu: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.MENUS },
    projectId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.PROJECTS },
    isDeleted: { type: Boolean, default: false },
    otpVerify: { type: Boolean, default: false },

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//menuSchema.index({updatedAt:-1},{unique:false})
module.exports = Menus = mongoose.model(DB_MODEL_REF.MENUS, menuSchema);