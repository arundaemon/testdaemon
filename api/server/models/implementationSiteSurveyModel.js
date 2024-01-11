const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let implementationSiteSurvey;
let implementationSiteSurveySchema = new mongoose.Schema({
    siteSurveyCode: {
        type: String,
        trim: true,
        unique: true
    },
    implementationCode: {
        type: String,
        trim: true,
        unique: true
    },
    quotationCode: {
        type: String,
        trim: true
    },
    purchaseOrderCode: {
        type: String,
        trim: true
    },
    schoolId: {
        type: String,
        trim: true,
    },
    schoolCode: {
        type: String,
        trim: true,
    },
    schoolName: {
        type: String,
        trim: true,
    },
    schoolPinCode: {
        type: String,
        trim: true,
    },
    schoolAddress: {
        type: String,
        trim: true,
    },
    schoolEmailId: {
        type: String,
        trim: true,
    },
    schoolCountryCode: {
        type: String,
        trim: true,
    },
    schoolCountryName: {
        type: String,
        trim: true,
    },
    schoolType: {
        type: String,
        trim: true,
    },
    schoolStateCode: {
        type: String,
        trim: true,
    },
    schoolStateName: {
        type: String,
        trim: true,
    },
    schoolCityCode: {
        type: String,
        trim: true,
    },
    schoolCityName: {
        type: String,
        trim: true,
    },
    internetAvailability: {
        type: Boolean
    },
    downloadSpeed: {
        type: String,
        trim: true
    },
    uploadSpeed: {
        type: String,
        trim: true
    },
    networkType: {
        type: String,                             //enum? wired, wifi
        trim: true
    },
    serviceProviderDetails: {
        type: String,
        trim: true
    },
    serverConfiguration: {
        type: Object
    },
    numOfSwitchEightPort: {
        type: Number,
        trim: true
    },
    numOfSwitchSixteenPort: {
        type: Number,
        trim: true
    },
    numOfSwitchTwentyFourPort: {
        type: Number,
        trim: true
    },
    classRoomDetails: [{
        type: Object
    }],
    standaloneOnlineConfiguration: [{
        type: Object
    }],
    IFPOnlineConfiguration: [{
        type: Object
    }],
    createdByName: {
        type: String,
        trim: true,
    },
    createdByRoleName: {
        type: String,
        trim: true,
    },
    createdByProfileName: {
        type: String,
        trim: true,
    },
    createdByEmpCode: {
        type: String,
        trim: true,
    },
    createdByUuid: {
        type: String,
        trim: true,
    },
    modifiedByName: {
        type: String,
        trim: true,
    },
    modifiedByRoleName: {
        type: String,
        trim: true,
    },
    modifiedByProfileName: {
        type: String,
        trim: true,
    },
    modifiedByEmpCode: {
        type: String,
        trim: true,
    },
    modifiedByUuid: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true
    },
    approvalStatus: {
        type: String,
        trim: true,
        default: 'NEW'
    },
    consentFile: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    remarks: {
        type: String,
        trim: true
    },
    productDetails: [{
        type: Object
    }]
},
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
)

module.exports = implementationSiteSurvey = mongoose.model(
    DB_MODEL_REF.IMPLEMENTATION_SITE_SURVEY,
    implementationSiteSurveySchema
);