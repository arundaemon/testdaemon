var mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants')
let PROJECTS
let Schema = mongoose.Schema

var ProjectsSchema = new Schema({
    projectName: {
        type: String,
        trim: true, index: true, unique: true
    },
    projectDescription: {
        type: String,
        trim: true
    },
    status: { type: String, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
//ProjectsSchema.index({updatedAt:-1},{unique:false})
module.exports = PROJECTS = mongoose.model(DB_MODEL_REF.PROJECTS, ProjectsSchema);