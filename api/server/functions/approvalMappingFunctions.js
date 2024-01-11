const approvalMappingControls = require('../controllers/approvalMappingControls');
const customExceptions = require('../responseModels/customExceptions')

const createApprovalMapping = async (params) => {    
    return approvalMappingControls.createApprovalMapping(params)
        .then(data => {
            return { message: `Approval Mapping Created Successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getApprovalMappingList = async (params) => {
    let RequestList = approvalMappingControls.getApprovalMappingList(params);
    let TotalRequestCount =  1000;                  //approvalMappingControls.getApprovalMappingListCount(params);
    return Promise.all([RequestList, TotalRequestCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Approval Mapping List !', result, totalCount }
        })
}

const getApprovalMappingDetails = async (id) => {
    return approvalMappingControls.getApprovalMappingDetails(id)
        .then(result => {
            return { message: `Mapping details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updateApprovalMapping = async (params) => {
    return approvalMappingControls.updateApprovalMapping(params)
        .then(result => {
            return { message: `Approval Mapping Updated Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getMappingInfo = async (params) => {
    return approvalMappingControls.getMappingInfo(params)
        .then(result => {
            return { message: `Approval Mapping Information`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    createApprovalMapping,
    getApprovalMappingList,
    getApprovalMappingDetails,
    updateApprovalMapping,
    getMappingInfo
}