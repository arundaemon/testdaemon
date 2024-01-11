const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let ApprovalMatrix;

let approvalMatrixSchema = new mongoose.Schema({
    approvalType:{
        type: String,
        trim: true
    },
    approvalGroupCode: { 
        type: String,
        trim:true 
    },
    approvalGroupName: { 
        type: String,
        trim:true 
    },
    approvalRuleType: { 
        type: String,
        trim:true 
    },
    
    approvalLevels: [{
        profileName: String,
        isApprove: Boolean,
        isReject: Boolean,
        isReassign: Boolean, 
        isAdjust: Boolean,
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        }
    }],

    displayFields: [{
        fieldName: String,
        isCheck: Boolean,
        url: String,
        params: String,
    }],
    
    createdBy: {
        type: String,
        trim: true
    },
    
    modifiedBy: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }   
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'} });
//approvalRequestSchema.index({updatedAt:-1},{unique:false})
module.exports = ApprovalMatrix = mongoose.model(DB_MODEL_REF.APPROVAL_MATRIX, approvalMatrixSchema);