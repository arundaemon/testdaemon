const { STATUS_CODE } = require('../constants/responseConstants')
const APIResponse = require('../responseModels/APIResponse');
const customExceptions = require('../responseModels/customExceptions')
const logger = require('../logger').logger;
const path = require('path')
const fs = require('fs')


const sendSuccess = (response, result, request) => {
    var result = new APIResponse(STATUS_CODE.SUCCESS, result, request);
    let statusCode = result.statusCode || 200
    _sendResponse(response, result, statusCode);
}


const sendFileSuccess = (response, result, request) => {
    var result = new APIResponse(STATUS_CODE.SUCCESS, result, request);
    let statusCode = result.statusCode || 200
    _sendResponseFile(response, result, statusCode);
}


const _sendResponseFile = (response, result, statusCode) => {    
    result.status = statusCode
    let fileName = path.join(__dirname, '..','..', result.responseData )
    return response.download(fileName, function(err){
        if(err){
            console.log(err,'::error')
            throw next(customExceptions.completeCustomException(0, 'Download Failed', err))
        }

       result.responseData !== 'Sample_Leads.xlsx' && fs.unlink(fileName, function(){
            console.log("File was deleted") 
        });
    })
}

const _sendResponse = (response, result, statusCode) => {
    result.status = statusCode
    return response.send(result);
}

const sendError = (response, error, request) => {
    //console.log(error)
    if (!error.errorCode) {
        logger.error(error, ":::Unhandled error.");
    }
    var result = new APIResponse(STATUS_CODE.ERROR, error, request);
    let statusCode = error.statusCode || 400
    _sendResponse(response, result, statusCode);
}


function handleError(error, request, response, next) {
    // unhandled error
    sendError(response, error,request);
}

module.exports = { sendSuccess, sendError, handleError, sendFileSuccess }