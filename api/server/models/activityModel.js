const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let Activities;
let activitySchema = new mongoose.Schema({

    ID: { type: String, trim: true, unique: true },
    activityName: { type: String, trim: true, required: true },
    userType: { type: String, trim: true, enum: ['Customer', 'Employee'] },

    createdBy: { type: String, trim: true },
    createdBy_Uuid: { type: String, trim: true },

    modifiedBy: { type: String, trim: true },
    modifiedBy_Uuid: { type: String, trim: true },

    score: { type: Number },
    maxScore: { type: Number },
    callingScore: { type: Number },
    attendance: { type: Boolean, default: false },
    task: { type: Boolean, default: false },
    approval: { type: Boolean, default: false },
    calling: { type: Boolean, default: false },
    implementation: { type: Boolean, default: false },
    isCollection: { type: Boolean, default: false},
    nonCalendar: { type: Boolean, default: false },
    categoryName: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE }

},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });

//activitySchema.index({ID:1,activityName:1},{unique:true,dropDups:true})
//activitySchema.index({updatedAt:-1},{unique:false})
module.exports = Activities = mongoose.model(DB_MODEL_REF.ACTIVITIES, activitySchema);

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////