const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createMappingValidator = async (req, res, next) => {
    let errors = [];
    let { stageName, statusName, subject, product } = req.body;
    let customErrorMessage = ""

    if (!stageName) {
        let errorMessage = customErrorMessage = 'Please Select Stage';
        errors.push({ errorMessage });
    }

    if (!statusName) {
        let errorMessage = customErrorMessage = 'Please Select Status';
        errors.push({ errorMessage });
    }

    if (!subject) {
        let errorMessage = customErrorMessage = 'Please Select Subject';
        errors.push({ errorMessage });
    }

    if (!product) {
        let errorMessage = customErrorMessage = 'Please Select Product';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createMappingValidator
}