const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let OrderLog;
let orderLogSchema = new mongoose.Schema({    
    leadId:{
        type:String,
        trim:true
    },
    empCode:{
        type:String,
        trim:true
    },
    omsOrderNo:{
        type:String,
        trim:true
    },
    customerResponse:{
        type: String,
        trim:true
    },
    verifiedDocuments:{
        type: String,
        trim: true
    },
    errorMsg:{
        type: String,
        trim:true
    },
    status:{
        type: String,
        trim:true
    }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = OrderLog = mongoose.model(DB_MODEL_REF.ORDER_LOGS, orderLogSchema);