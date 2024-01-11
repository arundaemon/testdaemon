var mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants')
let Users
let Schema = mongoose.Schema
var userSchema = new Schema({
    email: {
        type: String,
        trim: true, index: true
    },
    s_uuid: {
        type: String,
        trim: true, index: true
    },
    schoolCodes: [{
        type: String,
        trim: true
    }],
    password: {
        type: String,
        trim: true, select: false
    },
    role: {
        type: String,
        trim: true
    },
    // roleId: { type: Schema.Types.ObjectId, ref: DB_MODEL_REF.ROLE },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    favouriteDashboards: [{ type: Schema.Types.ObjectId, ref: DB_MODEL_REF.DASHBOARD }],
    favouriteReports: [{ type: Schema.Types.ObjectId, ref: DB_MODEL_REF.REPORT }],
    isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//userSchema.index({updatedAt:-1},{unique:false})
module.exports = Users = mongoose.model(DB_MODEL_REF.USERS, userSchema);