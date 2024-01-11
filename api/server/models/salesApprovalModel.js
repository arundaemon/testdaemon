var mongoose = require("mongoose");
const { DB_MODEL_REF,APPROVAL_TYPE,APPROVAL_STATUS } = require("../constants/dbConstants");
let SalesApproval;
let Schema = mongoose.Schema;

var salesApprovalSchema = new Schema(
  {
    approvalId: {
      type: String,
      trim: true,
    },
    approvalType: {
      type: String,
      enum: Object.values(APPROVAL_TYPE),
      trim: true,
    },
    groupCode:{
      type: String,
      trim: true
    },
    groupName:{
      type: String,
      trim: true
    },
    relevantId:{
      type: String,
      trim: true
    },
    referenceCode:{
      type: String,
      trim: true
    },
    createdByRoleName:{
      type: String,
      trim:true
    },
    createdByEmpId:{
      type: String,
      trim: true
    },
    createdByProfileName:{
      type: String,
      trim: true
    },
    createdByName:{
      type: String,
      trim: true
    },
    assignedToRoleName:{
      type: String,
      trim: true
    },
    assignedToEmpId:{
      type: String,
      trim: true
    },
    assignedToProfileName:{
      type: String,
      trim: true
    },
    assignedToName:{
      type: String,
      trim: true
    },
    status:{
      type: String,
      enum: Object.values(APPROVAL_STATUS),
      default: APPROVAL_STATUS.PENDING
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    strict: false,
  }
);

module.exports = SalesApproval = mongoose.model( DB_MODEL_REF.SALES_APPROVAL, salesApprovalSchema );
