const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createQuotationConfigValidator = async (req, res, next) => {
    let errors = [];
    let { productName, productCode, quotationFor } = req.body;
    let customErrorMessage = ""

    if (!productName) {
        let errorMessage = customErrorMessage = 'Product name is required';
        errors.push({ errorMessage });
    }

    if (!productCode) {
        let errorMessage = customErrorMessage = 'Product code is required';
        errors.push({ errorMessage });
    }

    if (!quotationFor) {
        let errorMessage = customErrorMessage = 'Quotation for is required';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

const updateQuotationConfigValidator = async (req, res, next) => {
    let errors = [];
    let {  productCode, quotationFor } = req.body;
    let customErrorMessage = ""

    if (!productCode) {
        let errorMessage = customErrorMessage = 'Product code is required';
        errors.push({ errorMessage });
    }

    if (!quotationFor) {
        let errorMessage = customErrorMessage = 'Quotation for is required';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createQuotationConfigValidator,
    updateQuotationConfigValidator
}