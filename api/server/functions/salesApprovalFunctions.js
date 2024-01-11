const salesApprovalControls = require('../controllers/salesApprovalControls');


const getSalesApprovalListAll = async (params) => {
    return salesApprovalControls.getSalesApprovalListAll(params)
        .then((result) => {
            return { message: "Listing Fetched Successfully", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
}

const getSalesApprovalList = async (params) => {
    return salesApprovalControls.getSalesApprovalList(params)
        .then((result) => {
            return { message: "Listing Fetched Successfully", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
}

const assignApprovalRequest = (params) => {
    return salesApprovalControls.assignApprovalRequest(params)
    .then((result) => {
        return { message: "Approval Request assigned Successfully", result }
    })
    .catch(( error) => {
        throw { errorMessage: error}
    }) 
}

const acceptApprovalRequest = (params) => {
    return salesApprovalControls.acceptApprovalRequest(params)
    .then((result) => {
        return { message: "Status Updated Successfully", result }
    })
    .catch(( error) => {
        throw { errorMessage: error}
    }) 
}

const rejectApprovalRequest = (params) => {
    return salesApprovalControls.rejectApprovalRequest(params)
    .then((result) => {
        return { message: "Status Updated Successfully", result }
    })
    .catch(( error) => {
        throw { errorMessage: error}
    })
}


module.exports = {
    getSalesApprovalList,
    assignApprovalRequest,
    acceptApprovalRequest,
    rejectApprovalRequest,
    getSalesApprovalListAll
}