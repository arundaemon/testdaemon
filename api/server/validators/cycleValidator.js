const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createCycleValidator = async (req, res, next) => {
    let errors = [];
    let { cycleName } = req.body;
    let customErrorMessage = ""

    if (!cycleName) {
        let errorMessage = customErrorMessage = 'Cycle name is required';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createCycleValidator
}