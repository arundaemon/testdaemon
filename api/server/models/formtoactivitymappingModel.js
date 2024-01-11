const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const formToActivityMappingSchema = new mongoose.Schema({
    subject: {
        type: String,
        trim: true
    },
    buyingDesposition: {
        type: String,
        trim: true
    },
    formId: {
        type: String,
        trim: true
    },
    appointmentStatus: {
        type: String,
        trim: true
    },
    activityId: {
        type: String,
        trim: true
    },
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)
//formToActivityMappingSchema.index({updatedAt:-1},{unique:false})
const FormToActivityMapping = mongoose.model(DB_MODEL_REF.FORM_TO_ACTIVITY_MAPPING, formToActivityMappingSchema);
module.exports = FormToActivityMapping