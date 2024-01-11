const ExpenseTypeMapping = require('../models/expenseTypeMappingModel');

const createExpense = async (params) => {
  try {
    const result = await ExpenseTypeMapping.create(params);
    return result;
  }
  catch (err) {
    throw { errorMessage: err }
  }
}

const getExpenseTypeMapping = async (params) => {
  let query = {}
  query = params
  return ExpenseTypeMapping.find(query);
}

const updateExpenseTypeMapping = async (params) => {
  let { _id, fieldName, units, expenseType, level, createdBy, modifiedBy } = params;

  let update = {};
  let options = { new: true };

  if (fieldName) {
    update.fieldName = fieldName;
  }

  if (units) {
    update.units = units;
  }

  if (expenseType) {
    update.expenseType = expenseType;
  }

  if (level) {
    update.level = level;
  }

  if (createdBy) {
    update.createdBy = createdBy;
  }

  if (modifiedBy) {
    update.modifiedBy = modifiedBy;
  }

  const result = await ExpenseTypeMapping.findOneAndUpdate({ _id }, update, options);
  return result;
}


module.exports = {
  createExpense,
  getExpenseTypeMapping,
  updateExpenseTypeMapping
}