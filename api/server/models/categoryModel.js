const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let Categories;
let categorySchema = new mongoose.Schema({

    categoryName: {
        type: String,
        trim: true
    },
    duration: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE }

},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });
//categorySchema.index({updatedAt:-1},{unique:false})
module.exports = Categories = mongoose.model(DB_MODEL_REF.CATEGORY, categorySchema);

   //////////////////////////// Schema for Category Modal /////////////////////////////////////