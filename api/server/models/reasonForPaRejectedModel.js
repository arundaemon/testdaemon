const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let ReasonForPaRejected;
let reasonForPaRejectedSchema = new mongoose.Schema({   
    reasonForPaRejected:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = ReasonForPaRejected = mongoose.model(DB_MODEL_REF.REASON_FOR_PA_REJECTED, reasonForPaRejectedSchema);