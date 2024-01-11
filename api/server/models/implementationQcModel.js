const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let implementationQc;
let implementationQcSchema = new mongoose.Schema({
    implementationCode: {
        type: String,
        trim: true,
    },
    hardwareId: {
        type: String,
        trim: true
    },
    qcCode: {
        type: String,
        trim: true
    },
    itemName: {
        type: String,
        trim: true,
    },
    itemVariantName: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    remarks: {
        type: String,
        trim: true
    },
    implementationDate: {
        type: Date,
        trim: true
    },
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
    }
},
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
)

module.exports = implementationQc = mongoose.model(
    DB_MODEL_REF.IMPLEMENTATION_QC,
    implementationQcSchema
);