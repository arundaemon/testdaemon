const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let RoleBasedAttendanceActivityModel;
let roleBasedAttendanceActivitySchema = new mongoose.Schema({
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
    activityId: {
        type: String,
        trim: true
    },
    ID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: DB_MODEL_REF.ACTIVITIES 
    },
    activityName: {
        type: String,
        trim: true
    },
    dailyTarget: { 
        type: Number 
    },
    weeklyTarget: { 
        type: Number 
    },
    monthlyTarget: { 
        type: Number 
    },
    id: {
        type: String,
        trim: true
    },
    status: {
        type: Number
    },
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });

//roleBasedAttendanceActivitySchema.index({role_name:1, profile_name:1, activityName:1,activityId:1},{unique:true,dropDups:true})
//roleBasedAttendanceActivitySchema.index({updatedAt:-1},{unique:false})
module.exports = RoleBasedAttendanceActivityModel = mongoose.model(DB_MODEL_REF.ROLE_BASED_ATTENDANCE_ACTIVITY_MODEL, roleBasedAttendanceActivitySchema);

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////