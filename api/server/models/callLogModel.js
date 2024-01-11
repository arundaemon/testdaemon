const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let CallLog;
let callSchema = new mongoose.Schema({    
    eventType:{
        type:String,
        trim:true
    },
    callId:{
        type:String,
        trim:true
    },
    msgData:{
        type:String,
        trim:true
    }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

//callSchema.index({eventType:1,callId:1,createdAt:1},{unique:true})
//callSchema.index({updatedAt:-1},{unique:false})
module.exports = CallLog = mongoose.model(DB_MODEL_REF.CALL_LOGS, callSchema);