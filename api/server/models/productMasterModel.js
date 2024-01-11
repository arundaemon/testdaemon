const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');

const productMasterModelSchema = new mongoose.Schema({
  productCode: {
    type: String,
    trim: true,
    index: true,
    unique: true
  },
  productName: {
    type: String,
    trim: true,
    index: true,
    unique: true
  },
  status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
},

  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });

const ProductMaster = mongoose.model(DB_MODEL_REF.PRODUCT_MASTER, productMasterModelSchema);
module.exports = ProductMaster