const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let expenseTypeMappingSchema = new mongoose.Schema({
  expenseType: {
    type: String,
    required: true,
    trim: true
  },
  fieldName: {
    type: Array,
    trim: true
  },
  units: {
    type: Array,
  },
  level: {
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
},
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
module.exports = expenseTypeMapping = mongoose.model(DB_MODEL_REF.EXPENSE_TYPE_MAPPING, expenseTypeMappingSchema);