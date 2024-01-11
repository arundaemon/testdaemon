const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, FIELD_MASTER_TYPE } = require('../constants/dbConstants');

let crmFieldMasterSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        trim: true
    },
    fieldCode: {
        type: String,
        trim: true
    },
    fieldType: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: [FIELD_MASTER_TYPE.DEPENDENT, FIELD_MASTER_TYPE.INDEPENDENT]
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },        
    createdBy: {
        type: String,
        trim: true
    },
    modifiedBy: {
        type: String,
        trim: true
    },
    createdBy_Uuid: {
        type: String,
        trim: true
    },
    modifiedBy_Uuid: {
        type: String,
        trim: true
    },             
    isDeleted: {
        type: Boolean, default: false
    }
},
    {
        timestamps:
        {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);
//configSchema.index({updatedAt:-1},{unique:false})
module.exports = CrmFieldMaster = mongoose.model(DB_MODEL_REF.CRM_FIELD_MASTER, crmFieldMasterSchema);
