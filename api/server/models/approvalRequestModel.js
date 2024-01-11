const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, REQUEST_STATUS  } = require('../constants/dbConstants');
let ApprovalRequest;

let approvalRequestSchema = new mongoose.Schema({
    requestId:{
        type: String,
        trim: true,
        required:true
    },
    requestNumber: {
        type: String,
        trim: true,
        required:true
    },
    requestBy_roleId: { 
        type: String,
        trim:true,
    },
    requestBy_empCode: { 
        type: String,
        trim:true,
        required:true
    },
    requestBy_name: { 
        type: String,
        trim:true ,
        required:true
    },
    trialCreatorDetails:{
        type: Object
    },
    requestType: { 
        type: String,
        trim:true 
    },
    approver_roleId: { 
        type: String,
        trim:true 
    },
    approver_roleName: {
        type: String,
        trim: true,
        required:true
    },
    approver_profileName: {
        type: String,
        trim: true,
        required:true
    },
    approver_empCode: { 
        type: String,
        trim:true ,
        required:true
    },
    approver_name: { 
        type: String,
        trim:true ,
        required:true
    },
    trialData: [
        { type: Object }
    ],
    metaInfo: [{ 
        type: Object 
    }],
    remarks: { 
        type: String,
        trim:true 
    },
    requestStatus: { 
        type: String,
        trim:true 
    },
    trialType: { 
        type: String,
        trim:true 
    },
    selectedLeads: {
        type: Array
    },
    shortDescription: {
        type: Object
    },
    raisedDate: {
        type: Date
    },
    currentStatus: {
        type: String,
        trim: true
    },
    statusModifiedDate: {
        type: Date,
        trim: true
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'} });
//approvalRequestSchema.index({updatedAt:-1},{unique:false})
module.exports = ApprovalRequest = mongoose.model(DB_MODEL_REF.APPROVAL_REQUEST, approvalRequestSchema);