const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let ReasonForObPending;
let reasonForObPendingSchema = new mongoose.Schema({   
    reasonForObPending:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = ReasonForObPending = mongoose.model(DB_MODEL_REF.REASON_FOR_OB_PENDING, reasonForObPendingSchema);