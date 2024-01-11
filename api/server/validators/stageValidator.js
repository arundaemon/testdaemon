const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createStageValidator = async (req, res, next) => {
    let errors = [];
    let { cycleId, stageName } = req.body;
    let customErrorMessage = ""

    // // if(!cycleId){
    // //     let errorMessage = customErrorMessage = 'Please select Cycle';
    // //     errors.push({ errorMessage });
    // // } 
    // else if(!Utils.isValidMongoId(cycleId)){
    //     let errorMessage = customErrorMessage = 'Invalid object id';
    //     errors.push({ errorMessage });        
    // }    

    if(!stageName){
        let errorMessage = customErrorMessage = 'Stage name is required';
        errors.push({ errorMessage });
    }
    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createStageValidator
}