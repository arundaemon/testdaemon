const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let CustomerResponse;
let customerResponseSchema = new mongoose.Schema({   
    customerResponse:{type:String, trim:true},
    isDeleted:{type:Boolean, default:false},
    status:{type:Number,enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE  }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
//customerResponseSchema.index({updatedAt:-1},{unique:false})
module.exports = CustomerResponse = mongoose.model(DB_MODEL_REF.CUSTOMER_RESPONSE, customerResponseSchema);