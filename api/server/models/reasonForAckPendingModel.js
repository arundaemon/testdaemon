const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let ReasonForAckPending;
let reasonForAckPendingSchema = new mongoose.Schema({   
    reasonForAckPending:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = ReasonForAckPending = mongoose.model(DB_MODEL_REF.REASON_FOR_ACK_PENDING, reasonForAckPendingSchema);