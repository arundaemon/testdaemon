const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const updateStatusValidator = async (req, res, next) => {
    let errors = [];
    let { referenceCode, status, modifiedByName, modifiedByRoleName, modifiedByProfileName, modifiedByEmpCode, modifiedByUuid } = req.body;
    let customErrorMessage = ""

    if (referenceCode && referenceCode.length <= 0) {
        let errorMessage = customErrorMessage = 'Reference code is required';
        errors.push({ errorMessage });
    }

    if (!status) {
        let errorMessage = customErrorMessage = 'Status is required';
        errors.push({ errorMessage });
    }

    if (!modifiedByName) {
        let errorMessage = customErrorMessage = 'Modified by name is required';
        errors.push({ errorMessage });
    }

    if (!modifiedByRoleName) {
        let errorMessage = customErrorMessage = 'Modified by role name is required';
        errors.push({ errorMessage });
    }

    if (!modifiedByProfileName) {
        let errorMessage = customErrorMessage = 'Modified by profile name is required';
        errors.push({ errorMessage });
    }

    if (!modifiedByEmpCode) {
        let errorMessage = customErrorMessage = 'Modified by emp code is required';
        errors.push({ errorMessage });
    }

    if (!modifiedByUuid) {
        let errorMessage = customErrorMessage = 'Modified by uuid is required';
        errors.push({ errorMessage });
    }



    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    updateStatusValidator
}