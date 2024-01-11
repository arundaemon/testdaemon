const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let taskActivityMapping;
let taskActivityMappingSchema = new mongoose.Schema({

    activityId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.ACTIVITIES },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.TASKS },

    callingEnabled: { type: Boolean, default: true },

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

    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    isDeleted: { type: Boolean, default: false }
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });
    //taskActivityMappingSchema.index({updatedAt:-1},{unique:false})
module.exports = taskActivityMapping = mongoose.model(DB_MODEL_REF.TASK_ACTIVITY_MAPPING, taskActivityMappingSchema);

   //////////////////////////// Schema for Task Activity Mapping Model /////////////////////////////////////