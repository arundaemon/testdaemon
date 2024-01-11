const expenseTypeMappingControls = require('../controllers/expenseTypeMappingControls');
const customExceptions = require('../responseModels/customExceptions')

const createExpense = async (params) => {
  return expenseTypeMappingControls.createExpense(params)
    .then(result => {
      return { message: `ExpenseType Mapping is created`, result }
    })
    .catch(error => {
      throw error
    })
}

module.exports = {
  createExpense
}