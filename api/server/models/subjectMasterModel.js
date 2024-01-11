const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const subjectSchoma = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        status: { type: Number, enum: [0, 1], default: 1 }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)
//subjectSchoma.index({updatedAt:-1},{unique:false})
const subjectMaster = mongoose.model(DB_MODEL_REF.SUBJECTMASTER, subjectSchoma);
module.exports = subjectMaster