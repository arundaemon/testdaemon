const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const activityFormSchema = new mongoose.Schema({
        subject: { 
            type: String,
            trim:true 
        },
        conversationWith: { 
            type: String,
            trim:true 
        },
        name: { 
            type: String,
            trim:true 
        },
        appointmentStatus: { 
            type: String,
            trim:true 
        },
        disqualificationDate: { 
            type: Date,
            trim:true 
        },
        buyingDeposition: { 
            type: String,
            trim:true 
        },
        seminar: { 
            type: String,
            trim:true 
        },
        languageIssue: { 
            type: String,
            trim:true 
        },
        knownLanguage: { 
            type: String,
            trim:true 
        },
        reasonForDQ: { 
            type: String,
            trim:true 
        },
        followUpDate_Time: { 
            type: Date 
        },
        comments: { 
            type: String,
            trim:true 
        },
        class: { 
            type: String,
            trim:true 
        },
        board: { 
            type: String,
            trim:true 
        },
        school: { 
            type: String,
            trim:true 
        },
        email: { 
            type: String,
            trim:true 
        },
        },
        {
            timestamps: { 
                createdAt: 'createdAt', 
                updatedAt: 'updatedAt' 
            }
        });
        //activityFormSchema.index({updatedAt:-1},{unique:false})
    const ActivitiesForm = mongoose.model(DB_MODEL_REF.ACTIVITYFORM, activityFormSchema);
    module.exports = ActivitiesForm

   //////////////////////////// Schema for Activity Modal /////////////////////////////////////