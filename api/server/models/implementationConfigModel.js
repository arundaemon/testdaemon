var mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants')

var ImplementationConfigSchema = new mongoose.Schema({
    productsField: [],
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
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, strict: false });

const ImplementationConfig = mongoose.model(
    DB_MODEL_REF.IMPLEMENTATION_CONFIG,
    ImplementationConfigSchema
);

module.exports = ImplementationConfig;
