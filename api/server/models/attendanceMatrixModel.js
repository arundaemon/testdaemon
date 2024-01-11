const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, MATRIX_TYPE } = require('../constants/dbConstants');
let Attendance;
let attendanceSchema = new mongoose.Schema({
    attendanceMatrixType: { type: String, enum: [MATRIX_TYPE.PROFILE, MATRIX_TYPE.ROLE] },
    role_id: { type: String, trim: true },
    role_code: { type: String, trim: true },
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
    maxTarget: { type: Number },
    minTarget: { type: Number },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },

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

//attendanceSchema.index({role_name:1,profile_name:1,attendanceMatrixType:1},{unique:1})
//attendanceSchema.index({updatedAt:-1},{unique:false})
module.exports = Attendance = mongoose.model(DB_MODEL_REF.ATTENDANCE, attendanceSchema);