const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const claimMasterSchema = new mongoose.Schema({
        expenseType: { 
            type: String,
            trim:true            
        },
        field: { 
            type: Object,
            trim:true
        },
        unit: { 
            type: String,
            trim:true 
        },
        unitPrice: { 
            type: String,
            trim:true 
        },
        profile: { 
            type: String,
            trim:true 
        },
        territory: {
            type: String,
            trim: true
        }, 
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


    const ClaimMaster = mongoose.model(DB_MODEL_REF.CLAIM_MASTER, claimMasterSchema);
    module.exports = ClaimMaster

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////