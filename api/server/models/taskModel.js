const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, CATEGORY_TYPE } = require('../constants/dbConstants');
let Tasks;
let taskSchema = new mongoose.Schema({

    taskId: {
        type: String,
        trim: true, unique: true
    },
    taskName: {
        type: String,
        trim: true, required: true
    },
    category: {
        type: String,
        trim: true, enum: [CATEGORY_TYPE.HOME_DEMO, CATEGORY_TYPE.VIRTUAL_DEMO, CATEGORY_TYPE.FOLLOW_UP]
    },

    createdBy: {
        type: String,
        trim: true
    },
    createdBy_Uuid: {
        type: String,
        trim: true
    },

    modifiedBy: {
        type: String,
        trim: true
    },
    modifiedBy_Uuid: {
        type: String,
        trim: true
    },

    isDeleted: { type: Boolean, default: false },
    status: { type: Number, enums: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE }

},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });
    //taskSchema.index({updatedAt:-1},{unique:false})
module.exports = Tasks = mongoose.model(DB_MODEL_REF.TASKS, taskSchema);

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////