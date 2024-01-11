const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createStatusValidator = async (req, res, next) => {
    let errors = [];
    let { stageId, statusName, createdBy } = req.body;
    let customErrorMessage = ""

    if(!stageId){
        let errorMessage = customErrorMessage = 'Stage id is required';
        errors.push({ errorMessage });
    } 
    else if(!Utils.isValidMongoId(stageId)){
        let errorMessage = customErrorMessage = 'Invalid object id';
        errors.push({ errorMessage });        
    }    

    if(!statusName){
        let errorMessage = customErrorMessage = 'Status name is required';
        errors.push({ errorMessage });
    }

    // if(!createdBy){
    //     let errorMessage = 'Creator name is required';
    //     errors.push({ errorMessage });
    // }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createStatusValidator
}