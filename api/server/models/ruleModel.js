var mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants')
let Rule
let Schema = mongoose.Schema
var RuleSchema = new Schema({
    ruleName: {
        type: String,
        trim: true
    },
    concurrentValue: {
        type: Number
    },
    checked: {
        type: Boolean
    },
    filters: [{
        dataset: {
            dataSetName: {
                type: String,
                trim: true
            },
            displayName: {
                type: String,
                trim: true
            },
            dataSetId: {
                type: String,
                trim: true
            }
        },
        field: {
            fieldName: {
                type: String,
                trim: true
            },
            displayName: {
                type: String,
                trim: true
            },
            fieldId: {
                type: String,
                trim: true
            }
        },
        operator: { type: Object },
        filterValue: { type: Array },
        concurrent: { type: Boolean },
        consecutive: { type: Number }
    }],
    logic: {
        stringValue: {
            type: String,
            trim: true
        },
        sqlValue: {
            type: String,
            trim: true
        },
    },
    rolesLinked: [{
        role_id: {
            type: String,
            trim: true
        },
        role_code: {
            type: String,
            trim: true
        },
        role_name: {
            type: String,
            trim: true
        },

        profile_id: {
            type: String,
            trim: true
        },
        profile_code: {
            type: String,
            trim: true
        },
        profile_name: {
            type: String,
            trim: true
        },
    }],
    createdBy: {
        type: String,
        trim: true, required: true
    },
    createdBy_Uuid: {
        type: String,
        trim: true
    },
    modifiedBy: {
        type: String,
        trim: true, required: true
    },
    modifiedBy_Uuid: {
        type: String,
        trim: true
    },

    isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

//RuleSchema.index({ruleName:1,filters:1,isDeleted:1},{unique:true})
//RuleSchema.index({updatedAt:-1},{unique:false})
module.exports = Rule = mongoose.model(DB_MODEL_REF.RULE, RuleSchema);