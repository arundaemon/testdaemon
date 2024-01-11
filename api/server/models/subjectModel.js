const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let Subject;
let subjectSchema = new mongoose.Schema({
   
    subjectName:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }

},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
//subjectSchema.index({updatedAt:-1},{unique:false})
module.exports = Subject = mongoose.model(DB_MODEL_REF.SUBJECT, subjectSchema);