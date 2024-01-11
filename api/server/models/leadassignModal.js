const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let LeadAssign;
let leadSchema = new mongoose.Schema({
    leadId: {
        type: String,
        trim: true,
        index:true,
        unique:true
    },
    assignedTo_userId: {
        type: String,
        trim: true
    },
    assignedTo_userName: {
        type: String,
        trim: true
    },
    assignedTo_displayName: {
        type: String,
        trim: true
    },

    assignedTo_assignedOn: { type: Date },

    assignedTo_role_id: {
        type: String,
        trim: true
    },
    assignedTo_role_code: {
        type: String,
        trim: true
    },
    assignedTo_role_name: {
        type: String,
        trim: true
    },

    assignedTo_profile_id: {
        type: String,
        trim: true
    },
    assignedTo_profile_code: {
        type: String,
        trim: true
    },
    assignedTo_profile_name: {
        type: String,
        trim: true
    },

    type: {
        type: String,
        trim: true
    }, //online, offline
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    board: {
        type: String,
        trim: true
    },
    boardId: {
        type: String,
        trim: true
    },
    class: {
        type: String,
        trim: true
    },
    classId: {
        type: String,
        trim: true
    },
    school: {
        type: String,
        trim: true
    },
    schoolCode: {
        type: String,
        trim: true
    },
    pinCode: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    stateId: {
        type: String,
        trim: true
    },
    cityId: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    sourceName: {
        type: String,
        trim: true
    },
    subSourceName: {
        type: String,
        trim: true
    },
    stageName: { type: String, trim: true },
    statusName: { type: String, trim: true },
    cycleName: { type: String, trim: true },
    journeyName: { type: String, trim: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.CAMPAIGN },
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.SOURCES },
    subSourceId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.SOURCES },
    refrenceEmpName: { type: String },
    refrenceCustName: { type: String },
    userType: {
        type: String,
        trim: true
    },
    learningProfile: {
        type: String,
        trim: true
    },
    reference: {
        type: String,
        trim: true
    },
    countryCode: {
        type: String,
        trim: true
    },
    countryName: {
        type: String,
        trim: true
    },
    countryId: {
        type: String,
        trim: true
    },

    displayName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },

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
    dndStatus: {
        type: String,
        trim: true
    },
    isRefurbished: {
        type: Boolean,
        default: false
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },

    registrationDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

//leadSchema.index({mobile:1,userType:1,leadId:1},{unique:true,dropDups:true})
//leadSchema.index({updatedAt:-1},{unique:false})

module.exports = LeadAssign = mongoose.model(DB_MODEL_REF.LEADASSIGN, leadSchema);