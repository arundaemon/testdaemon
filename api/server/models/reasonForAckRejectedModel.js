const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let ReasonForAckRejected;
let reasonForAckRejectedSchema = new mongoose.Schema({   
    reasonForAckRejected:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = ReasonForAckRejected = mongoose.model(DB_MODEL_REF.REASON_FOR_ACK_REJECTED, reasonForAckRejectedSchema);