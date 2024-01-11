const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createStageStatusMappingValidator = async (req, res, next) => {
    let errors = [];
    let { journeyId, selectCycle,fromStage,fromStatus,toStage,toStatus } = req.body;
    let customErrorMessage = ""

    if(!journeyId){
        let errorMessage = customErrorMessage = 'Please select a Journey';
        errors.push({ errorMessage });
    } 
    else if(!Utils.isValidMongoId(journeyId)){
        let errorMessage = customErrorMessage = 'Invalid object id';
        errors.push({ errorMessage });        
    }
    if(!selectCycle){
        let errorMessage = customErrorMessage = 'Please select a Cycle';
        errors.push({ errorMessage });
    } 
    else if(!Utils.isValidMongoId(selectCycle)){
        let errorMessage = customErrorMessage = 'Invalid object id';
        errors.push({ errorMessage });        
    }     
    if(!fromStage){
        let errorMessage = customErrorMessage = 'Please select from Stage';
        errors.push({ errorMessage });
    } 
    else if(!Utils.isValidMongoId(fromStage)){
        let errorMessage = customErrorMessage = 'Invalid object id';
        errors.push({ errorMessage });        
    } 
    if(!fromStatus){
        let errorMessage = customErrorMessage = 'Please select from Status';
        errors.push({ errorMessage });
    } 
    else if(!Utils.isValidMongoId(fromStatus)){
        let errorMessage = customErrorMessage = 'Invalid object id';
        errors.push({ errorMessage });        
    } 
    if (errors && errors.length) {
        throw (customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }
    next();
}

module.exports = {
    createStageStatusMappingValidator
}