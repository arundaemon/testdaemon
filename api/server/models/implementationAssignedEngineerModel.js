const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let implementationAssignedEngineer;
let implementationAssignedEngineerSchema = new mongoose.Schema({
    implementationCode: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['SSR', 'QC'],
        trim: true                                    // qc, ssr
    },
    // isPrimary: {
    //     type: Boolean,
    //     trim: true,
    // },
    assignedEngineerName: {
        type: String,
        trim: true,
    },
    assignedEngineerEmpCode: {
        type: String,
        trim: true,
    },
    assignedEngineerRoleName: {
        type: String,
        trim: true,
    },
    assignedEngineerProfileName: {
        type: String,
        trim: true,
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
    isDeleted: {
        type: Boolean,
        default: false
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
    status: {
        type: String,
        trim: true
    },
},
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
)

module.exports = implementationAssignedEngineer = mongoose.model(
    DB_MODEL_REF.IMPLEMENTATION_ASSIGNED_ENGINEER,
    implementationAssignedEngineerSchema
);