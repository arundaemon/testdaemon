const { parse } = require('path');
const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createSsrValidator = async (req, res, next) => {
    let errors = [];
    let { implementationCode, quotationCode, purchaseOrderCode, schoolCode, internetAvailability, downloadSpeed, uploadSpeed, networkType, serviceProviderDetails, createdByName, createdByEmpCode, createdByRoleName, createdByProfileName, createdByUuid } = req.body;
    let customErrorMessage = ""

    if(!implementationCode){
        let errorMessage = customErrorMessage = 'Implementation code is required';
        errors.push({ errorMessage });
    }
    if(!quotationCode){
        let errorMessage = customErrorMessage = 'Quotation code is required';
        errors.push({ errorMessage });
    }
    if(!purchaseOrderCode){
        let errorMessage = customErrorMessage = 'Purchase order code is required';
        errors.push({ errorMessage });
    }
    if(!schoolCode){
        let errorMessage = customErrorMessage = 'School code is required';
        errors.push({ errorMessage }); 
    }
    if(!internetAvailability){
        let errorMessage = customErrorMessage = 'Internet availability is required';
        errors.push({ errorMessage }); 
    }
    if(!downloadSpeed){
        let errorMessage = customErrorMessage = 'Download speed is required';
        errors.push({ errorMessage }); 
    }
    if(!uploadSpeed){
        let errorMessage = customErrorMessage = 'Upload speed is required';
        errors.push({ errorMessage }); 
    }
    if(!networkType){
        let errorMessage = customErrorMessage = 'Network type is required';
        errors.push({ errorMessage }); 
    }
    if(!createdByName){
        let errorMessage = customErrorMessage = 'Created by name is required';
        errors.push({ errorMessage }); 
    }
    if(!createdByEmpCode){
        let errorMessage = customErrorMessage = 'Created by emp code is required';
        errors.push({ errorMessage }); 
    }
    if(!createdByRoleName){
        let errorMessage = customErrorMessage = 'Created by role name is required';
        errors.push({ errorMessage }); 
    }
    if(!createdByProfileName){
        let errorMessage = customErrorMessage = 'Created by profile name is required';
        errors.push({ errorMessage }); 
    }
    if(!createdByUuid){
        let errorMessage = customErrorMessage = 'Created by uuid is required';
        errors.push({ errorMessage }); 
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

const getDetailValidator = async (req, res, next) => {
    let errors = [];
    let { siteSurveyCode, implementationCode } = req.query;

    if(!siteSurveyCode && !implementationCode){
        let errorMessage = 'Site Survey code or Implementation code is required';
        errors.push({ errorMessage });
    }
    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}

const excelValidator = async (req, res, next) => {
    let errors = [];
    
    if (!req.file) {
        let errorMessage = 'File is required';
        errors.push({ errorMessage });
    }
    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}

module.exports = {
    createSsrValidator,
    getDetailValidator,
    excelValidator
}