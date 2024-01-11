const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, REQUEST_STATUS  } = require('../constants/dbConstants');
let ApprovalMapping;

let approvalMappingSchema = new mongoose.Schema({
    approvalType:{
        type: String,
        trim: true
    },
    approverProfile: { 
        type: String,
        trim:true 
    },
    isApprove: {
        type: Boolean
    },
    approveMetaInfo: {
        type: Object
    },
    isReject: {
        type: Boolean
    },
    rejectMetaInfo: {
        type: Object
    },
    isReassign: {
        type: Boolean
    },
    isAssignToUser: {
        type: Boolean
    },
    createdBy: {
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
    modifiedBy: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }   
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'} });
//approvalRequestSchema.index({updatedAt:-1},{unique:false})
module.exports = ApprovalMapping = mongoose.model(DB_MODEL_REF.APPROVAL_MAPPING, approvalMappingSchema);