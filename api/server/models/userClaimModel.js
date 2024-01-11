const { Double } = require('mongodb');
const mongoose = require('mongoose');
const { DB_MODEL_REF, CLAIM_STATUS } = require('../constants/dbConstants');

const userClaimSchema = new mongoose.Schema({
        claimId: {
            type: String,
            trim: true,
            required:true,
            unique: true
        },
        leadId: { 
            type: String,
            trim:true,
            required:true           
        },
        schoolCode: { 
            type: String,
            trim:true,
            required:true
        },
        schoolName: { 
            type: String,
            trim:true,
            required:true
        },
        visitNumber: { 
            type: Number,
            trim:true 
        },
        visitPurpose: { 
            type: String,
            trim:true 
        },
        visitDate: { 
            type: Date,
            trim:true ,
            required:true
        },
        visitTimeIn: {
            type: Date,
            trim: true
        },
        visitTimeOut: {
            type: Date,
            trim: true
        },
        field: {
            type: Object
        },
        fieldLabel:{
            type: String,
            trim: true
        },
        fieldValue: {
            type: String,
            trim: true
        },
        requestBy_empCode: {
            type: String,
            trim: true,
            required:true
        },
        requestBy_name: {
            type: String,
            trim: true,
            required:true
        },
        expenseType: {
            type: String,
            trim: true
        },
        unit: {
            type: Number
            
        },
        unitLabel: {
            type: String,
            trim:true
            
        },
        claimAmount: {
            type: Number
        },
        billFile: {
            type: String,
            trim: true
        },
        claimStatus: {
            type: String,
            enum: [CLAIM_STATUS.APPROVED, CLAIM_STATUS.PENDING_AT_BUH, CLAIM_STATUS.REJECTED, CLAIM_STATUS.PENDING_AT_CBO, CLAIM_STATUS.PENDING_AT_FINANCE, CLAIM_STATUS.PENDING_AT_L1]
        },
        approvedDate: {                                // for both approved and reject
            type: Date
        },
        approvedAmount: {
            type: Number
        },
        remarks: {
            type: String,
            trim: true
        },
        claimRemarks: {
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
        isDeleted: {
            type: Boolean, default: false
        },
        requestByRoleName: {
            type: String,
            trim: true
        },
        statusModifiedByEmpCode: {
            type: String,
            trim: true
        },
        statusModifiedByRoleName: {
            type: String,
            trim: true
        }
        },
        {
            timestamps: { 
                createdAt: 'createdAt', 
                updatedAt: 'updatedAt' 
            }
        });

    const UserClaim = mongoose.model(DB_MODEL_REF.USER_CLAIM, userClaimSchema);
    module.exports = UserClaim

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////