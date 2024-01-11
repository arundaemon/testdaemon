const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let reasonForDisqualification;
let reasonForDisqualificationSchema = new mongoose.Schema({   
    
    reasonForDisqualification:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
//reasonForDisqualificationSchema.index({updatedAt:-1},{unique:false})
module.exports = reasonForDisqualification = mongoose.model(DB_MODEL_REF.REASON_FOR_DISQUALIFICATION, reasonForDisqualificationSchema);