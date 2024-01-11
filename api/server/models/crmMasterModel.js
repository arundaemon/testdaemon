const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, } = require('../constants/dbConstants');

const crmMasterSchema = new mongoose.Schema({
        type: { 
            type: String,
            trim:true            
        },
        typeId: {type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.CRM_FIELD_MASTER },
        fieldType: { 
            type: String,
            trim:true
        },
        value: { 
            type: String,
            trim:true 
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
            timestamps: { 
                createdAt: 'createdAt', 
                updatedAt: 'updatedAt' 
            }
        });


    const CrmMaster = mongoose.model(DB_MODEL_REF.CRM_MASTER, crmMasterSchema);
    module.exports = CrmMaster

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////