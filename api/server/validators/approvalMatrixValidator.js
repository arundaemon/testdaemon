const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createApprovalMatrixValidator = async (req, res, next) => {
    let errors = [];
    let { approvalType, approvalGroupCode, approvalRuleType } = req.body;
    let customErrorMessage = ""

    if (!approvalType) {
        let errorMessage = customErrorMessage = 'Approval Type is required';
        errors.push({ errorMessage });
    }

    if (!approvalGroupCode) {
        let errorMessage = customErrorMessage = 'Group is required';
        errors.push({ errorMessage });
    }

    if (!approvalRuleType) {
        let errorMessage = customErrorMessage = 'Rule is required';
        errors.push({ errorMessage });
    }


    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

const updateApprovalMatrixValidator = async (req, res, next) => {
   
    let errors = [];
    let { approvalType, approvalGroupCode, approvalRuleType } = req.body;
    let customErrorMessage = ""

    if (!approvalType) {
        let errorMessage = customErrorMessage = 'Approval Type is required';
        errors.push({ errorMessage });
    }

    if (!approvalGroupCode) {
        let errorMessage = customErrorMessage = 'Group is required';
        errors.push({ errorMessage });
    }

    if (!approvalRuleType) {
        let errorMessage = customErrorMessage = 'Rule is required';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createApprovalMatrixValidator,
    updateApprovalMatrixValidator

}