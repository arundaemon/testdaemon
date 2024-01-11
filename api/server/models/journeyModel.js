
const mongoose = require('mongoose');
// const JOURNEY_STATUS = require('../constants/dbConstants');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants')


const journeySchema = new mongoose.Schema({
    journeyName: {
        type: String,
        trim: true, required: true
    },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },

    createdBy: {
        type: String,
        trim: true, required: true
    },
    createdBy_Uuid: {
        type: String,
        trim: true
    },

    modifiedBy: {
        type: String,
        trim: true, required: true
    },
    modifiedBy_Uuid: {
        type: String,
        trim: true
    },

    condition: [
        {
            dataset: { type: Object },
            parameter: { type: Object },
            operator: { type: Object },
            value: { type: Array, required: true }
        }
    ],

    linkedCycle: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_MODEL_REF.CYCLES }],
    filterSql: {
        type: String,
        trim: true, required: true
    },
    isDeleted: { type: Boolean, default: false }
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }

);

// var validateFilter=(filterSql)=>{

//     var regex= new RegExp(/^[a-zA-Z]*$/);

//     return regex.test(filterSql)

// }


//journeySchema.index({updatedAt:-1},{unique:false})
const Journey = mongoose.model(DB_MODEL_REF.JOURNEY, journeySchema);

module.exports = Journey;

// Journey-->
