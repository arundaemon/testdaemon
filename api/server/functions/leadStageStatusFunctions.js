const leadStageStatusControls = require('../controllers/leadStageStatusControls');

const getLeadStageStatusDetails = async (id) => {
    return leadStageStatusControls.getLeadStageStatusDetails(id)
        .then(result => {
            return { message: `Lead Stage Status details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}
const deleteLeadStageStatus = async (params) => {
    
    return leadStageStatusControls.deleteLeadStageStatus(params)
    .then(data => {
    return { message: `Record deleted successfully`, data }
     })
     .catch(error => {
     throw { errorMessage: error }
     })
    
    }

module.exports = {
    getLeadStageStatusDetails,
    deleteLeadStageStatus
}