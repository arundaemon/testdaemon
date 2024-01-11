var mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, QUOTATION_CONFIG_TYPE } = require('../constants/dbConstants')
let QuotationConfig
let Schema = mongoose.Schema

var QuotationConfigSchema = new Schema({
    productName: {
        type: String,
        trim: true
    },
    productCode: {
        type: String,
        trim: true
    },
    groupCode: {
        type: String,
        trim: true
    },
    groupName: {
        type: String,
        trim: true
    },
    quotationFor: {
        type: String,
        enum: [QUOTATION_CONFIG_TYPE.ACTUAL, QUOTATION_CONFIG_TYPE.DEMO],  //enum
        trim: true
    },
    dependentFields: [{
        type: Object
    }],
    calculatedFields: [{
        type: Object
    }],
    isHardware: {
        type: Boolean
    },
    isServices: {
        type: Boolean
    },
    isSoftware: {
        type: Boolean
    },
    isPoRequired: {
        type: Boolean
    },
    status: {
        type: Number,
        enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE],
        default: USER_STATUS.ACTIVE
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdByName: {
        type: String,
        trim: true
    },
    createdByRoleName: {
        type: String,
        trim: true
    },
    createdByProfileName: {
        type: String,
        trim: true
    },
    createdByEmpCode: {
        type: String,
        trim: true
    },
    createdByUuid: {
        type: String,
        trim: true
    },
    modifiedByName: {
        type: String,
        trim: true
    },
    modifiedByRoleName: {
        type: String,
        trim: true
    },
    modifiedByProfileName: {
        type: String,
        trim: true
    },
    modifiedByEmpCode: {
        type: String,
        trim: true
    },
    modifiedByUuid: {
        type: String,
        trim: true
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//ProjectsSchema.index({updatedAt:-1},{unique:false})
module.exports = QuotationConfig = mongoose.model(DB_MODEL_REF.QUOTATION_CONFIG, QuotationConfigSchema);