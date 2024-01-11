const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let ReasonForFbRejected;
let reasonForFbRejectedSchema = new mongoose.Schema({   
    reasonForFbRejected:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = ReasonForFbRejected = mongoose.model(DB_MODEL_REF.REASON_FOR_FB_REJECTED, reasonForFbRejectedSchema);