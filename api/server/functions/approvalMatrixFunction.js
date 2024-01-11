const approvalMatrixControls = require('../controllers/approvalMatrixControls');
const customExceptions = require('../responseModels/customExceptions');

const createApprovalMatrix = async (params) => {
    return approvalMatrixControls.isDuplicateApprovalMatrix(params)
        .then(result => {
            if (result) {
                throw customExceptions.duplicateApprovalMatrix()
            }

            return approvalMatrixControls.createApprovalMatrix(params)
        })
        .then(result => {
            return { message: `Approval Matrix Created Successfully`, result }
        })
        .catch(error => {
            throw error
        })
}

const getApprovalMatrixList = async (params) => {
    return approvalMatrixControls.getApprovalMatrixList(params)
        .then((result) => {
            return { message: "Listing Fetched Successfully", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
}

const updateApprovalMatrix = async (params) => {
        return approvalMatrixControls.updateApprovalMatrix(params)
            .then(result => {
                return { message: `Approval Matrix Updated Successfully`, result }
            })
            .catch(error => {
                throw error
            })


}

module.exports = {
    createApprovalMatrix,
    getApprovalMatrixList,
    updateApprovalMatrix
    

}