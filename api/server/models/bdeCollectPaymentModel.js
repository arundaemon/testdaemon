const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let BdeCollectPayment;

const bdeCollectPaymentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        subject: {
            type: String,
            trim: true
        },
        activityName: {
            type: String,
            trim: true
        },
        activityId: {
            type: String,
            trim: true
        },
        paymentID: {
            type: String,
            trim: true
        },
        paymentUrl: {
            type: String,
            trim: true
        },
        uuid: {
            type: String,
            trim: true
        },
        activityScore: {
            type: Number
        },
        callActivity: {
            type: Boolean,
            default: false
        },
        taskActivity: {
            type: Boolean,
            default: false
        },
        attendanceActivity: {
            type: Boolean,
            default: false
        },
        approvalActivity: {
            type: Boolean,
            default: false
        },
        category: {
            type: String,
            trim: true
        },
        conversationWith: {
            type: String,
            trim: true
        },
        leadId: {
            type: String,
            trim: true
        },
        startDateTime: {
            type: Date,
            index: -1
        },
        endDateTime: {
            type: Date
        },
        followUpDateTime: {
            type: Date
        },
        class: {
            type: String,
            trim: true
        },
        board: {
            type: String,
            trim: true
        },
        school: {
            type: String,
            trim: true
        },
        comments: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        status: { type: String, enum: ['Complete', 'Pending', 'Init'], default: 'Pending' },
        leadOwner: {
            type: String,
            trim: true
        },
        createdBy: {
            type: String,
            trim: true
        },
        createdByName: {
            type: String,
            trim: true
        },
        createdByRoleName: {
            type: String,
            trim: true
        },


    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)
//bdeCollectPaymentSchema.index({updatedAt:-1},{unique:false})
module.exports = BdeCollectPayment = mongoose.model(DB_MODEL_REF.BDE_COLLECT_PAYMENT, bdeCollectPaymentSchema);