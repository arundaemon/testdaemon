const customExceptions = require('../responseModels/customExceptions')
const utils = require('../utils/utils');




const updateLeadValidator= async (req,res,next)=>{

    let errors=[];
    let {leadId,assignedTo}=req.body;
    let customErrorMessage= "";
    // console.log(leadId,"leadID");
    
    if(!leadId || leadId.length===0){
        let errorMessage = customErrorMessage = "Lead Id is required";
        errors.push({errorMessage});
        // console.log(errors.length,"errors.length");

    }
    // if(Object.keys(assignedTo).length === 0 && assignedTo.constructor === Object){
    //    let errorMessage = customErrorMessage = "assignedTo field is missing or empty";
    //    errors.push({errorMessage});
    // }
    if(errors && errors.length){
        // console.log(errors,"errors");
        throw (customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))    
    } 
    next();

    } 
    



module.exports={
    updateLeadValidator
}