const customExceptions = require('../responseModels/customExceptions')

const validateGetTaskList = async (req, res, next) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let errors = [];

    if (pageNo) {
        req.query.pageNo = pageNo = Number(pageNo)
    }

    if (count) {
        req.query.count = count = Number(count)
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}

const createTaskValidator= async (req,res,next)=>{
   
    let errors=[];
    let {taskName,category}=req.body;
    let customErrorMessage= "";

    if(!taskName){
        let errorMessage = customeErrorMessage = "Task name is required";
        errors.push({errorMessage});
    }
    else if(!category){
       let errorMessage = customeErrorMessage = "Please select a category";
       errors.push({errorMessage});
    }
    else if(errors && errors.length){
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
        
    }

   next();

}


module.exports = {
    validateGetTaskList,
    createTaskValidator
}