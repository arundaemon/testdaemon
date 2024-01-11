const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let UserActivities;

const userActivitySchema = new mongoose.Schema(
    {
        request_json: { type: Object },
        timeseq: {
            type: String,
            trim: true
        },
        hit_from: {
            type: String,
            trim: true
        },
        activity_name: {
            type: String,
            trim: true
        },
        user_id: {
            type: String,
            trim: true
        },
        status: { type: Number },
        hit_type: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

//userActivitySchema.index({user_id:1,activity_name:1},{unique:false})
//userActivitySchema.index({updatedAt:-1},{unique:false})
module.exports = UserActivities = mongoose.model(DB_MODEL_REF.POST_ACTIVITY, userActivitySchema,DB_MODEL_REF.POST_ACTIVITY);