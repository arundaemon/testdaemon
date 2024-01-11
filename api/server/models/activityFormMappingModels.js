const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const activityFormMappingSchema = new mongoose.Schema({
    mappingType: {
        type: String,
        trim: true
    },
    stageName: {
        type: String,
        trim: true
    },
    stageId: {
        type: String,
        trim: true
    },
    statusName: {
        type: String,
        trim: true
    },
    statusId: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    customerResponse: {
        type: String,
        trim: true
    },
    formId: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    reasonForDQ: {
        type: Boolean,
        default: false
    },
    subjectPreFilled: {
        type: Boolean,
        default: false
    },
    reasonForPaPending: {
        type: Boolean,
        default: false
    },
    reasonForPaRejected: {
        type: Boolean,
        default: false
    },
    reasonForObPending: {
        type: Boolean,
        default: false
    },
    reasonForObRejected: {
        type: Boolean,
        default: false
    },
    reasonForFbPending: {
        type: Boolean,
        default: false
    },
    reasonForFbRejected: {
        type: Boolean,
        default: false
    },
    reasonForAckPending: {
        type: Boolean,
        default: false
    },
    reasonForAckRejected: {
        type: Boolean,
        default: false
    },
    activityId: {
        type: String
    },
    futureActivityId: {
        type: String
    },
    activityName: {
        type: String
    },
    futureActivityName: {
        type: String
    },
    verifiedDoc: {
        type: Boolean
    },
    featureExplained: {
        type: Boolean
    },
    product: {
        type: String,
        trim: true
    },
    productCode: {
        type: String,
        trim: true
    },
    refId: {
        type: Number,
        trim: true
    },
    groupCode: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        trim: true
    },
    hardware: {
        type: String,
        trim: true
    },
    meetingStatus: {
        type: String,
        trim: true
    },
    dependentFields: [{
        type: Object
    }],
    isDeleted: {
        type: Boolean, default: false
    },
    isPriorityApplicable: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    });

//activityFormMappingSchema.index({updatedAt:-1},{unique:false})

const ActivitiesFormMapping = mongoose.model(DB_MODEL_REF.ACTIVITY_FORM_MAPPING, activityFormMappingSchema);
module.exports = ActivitiesFormMapping

//////////////////////////// Schema for Activity Modal /////////////////////////////////////