const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let PurchaseOrder;
let purchaseSchema = new mongoose.Schema({
    quotationCode: {
        type: String,
        trim: true,
        index: true,
        // unique: true
    },
    purchaseOrderCode: {
        type: String,
        trim: true,
        index: true,
        // unique: true
    },
    purchaseOrderFile: {
        type: String,
        trim: true,
        required: true
    },
    paymentScheduleFileURL: {
        type: String,
        trim: true,
    },
    paymentScheduleFileName: {
        type: String,
        trim: true,
    },
    quotationAmount: {
        type: Number,
        trim: true,
        required: true
    },
    poAmount: {
        type: Number,
        trim: true,
        required: true
    },
    quotationEdited:
    {
        type: Boolean,
        default: false

    },
    agreementTenure: {
        type: Number,
        trim: true,
        required: true
    },
    agreementStartDate: {
        type: Date,
        trim: true,
        required: true
    },
    agreementEndDate: {
        type: Date,
        trim: true,
        required: true
    },
    paymentTerm: {
        type: String,
        trim: true,
        required: true
    },
    agreementPayableMonth: {
        type: Number,
        trim: true,
        required: true
    },

    totalInvoicingValue: {
        type: Number,
        trim: true,
    },
    overallContractValue: {
        type: Number,
        trim: true,
        required: true
    },
    totalAdvanceAmount: {
        type: Number,
        trim: true,

    },
    totalAdvanceHardwareAmount: {
        type: Number,
        trim: true,

    },
    totalAdvanceSoftwareAmount: {
        type: Number,
        trim: true,

    },
    isAdvance: {
        type: Boolean,
        default: false
    },
    advanceDetailsMode: {
        type: Array,
    },
    adminName: {
        type: String,
        trim: true,
    },
    adminContactNumber: {
        type: String,
        trim: true
    },
    adminEmailId: {
        type: String,
        trim: true
    },
    schoolCode: {
        type: String,
        trim: true
    },
    schoolName: {
        type: String,
        trim: true
    },
    product: {
        type: Array,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdByUuid: {
        type: String,
        trim: true
    },
    createdByEmpcode: {
        type: String,
        trim: true
    },
    createdByName: {
        type: String,
        trim: true
    },
    createdByProfileName: {
        type: String,
        trim: true
    },
    createdByRoleName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    approvalStatus: {
        type: String,
        trim: true
    },
    groupCode: {
        type: String,
        trim: true
    },
    modifiedByName: {
        type: String,
        trim: true,
        required: true
    },
    modifiedByRoleName: {
        type: String,
        trim: true,
        required: true
    },
    modifiedByProfileName: {
        type: String,
        trim: true,
        required: true
    },
    modifiedByEmpCode: {
        type: String,
        trim: true,
        required: true
    },
    modifiedByUuid: {
        type: String,
        trim: true,
        required: true
    },
}, {
    timestamps:
    {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});


module.exports = PurchaseOrder = mongoose.model(DB_MODEL_REF.PURCHASE_ORDER, purchaseSchema);