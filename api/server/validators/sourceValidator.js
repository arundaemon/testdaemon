const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createSourceValidator = async (req, res, next) => {
    let errors = [];
    let { leadSourceName } = req.body;

    if(!leadSourceName){
        let errorMessage = 'Source name is required';
        errors.push({ errorMessage });
    }
    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}

module.exports = {
    createSourceValidator
}