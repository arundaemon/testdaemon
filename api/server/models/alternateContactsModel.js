const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const alternateContactsSchema = new mongoose.Schema({
            leadId: {
                type: String,
                trim:true 
            },
            relation: {
                type: String,
                trim:true 
            },
            alternateNumber: {
                type: String,
                trim:true 
            },
            alternateName: {
                type: String,
                trim:true 
            }
        },
        {
            timestamps: { 
                createdAt: 'createdAt', 
                updatedAt: 'updatedAt' 
            }
        });
        //activityFormSchema.index({updatedAt:-1},{unique:false})
    const AlternateContact = mongoose.model(DB_MODEL_REF.ALTERNATE_CONTACT, alternateContactsSchema);
    module.exports = AlternateContact

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////