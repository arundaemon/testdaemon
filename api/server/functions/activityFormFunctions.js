const activityFormControllers = require('../controllers/activityFormControls');
const { createManyStageStatus } = require('../controllers/leadStageStatusControls');
const customExceptions = require('../responseModels/customExceptions');
const { getLeadJourneyDetails } = require('./leadJourneyMappingFunctions');

const createActivityForm = async (params) => {

    return activityFormControllers.createActivityForm(params)
        .then(result => {
            manageLeadStageStatus(params)
            return { message: `Activity Created successfully!`, result }
        })
        .catch(err => {
            throw err
        })
}

const logBdeActivity = async (params) => {
    return activityFormControllers.logBdeActivity(params)
        .then(result => {
            manageLeadStageStatus(params)
            return { message: `Activity Logged successfully!`, result }
        })
        .catch(err => {
            throw err
        })
}

const manageLeadStageStatus = async (params) => {
    let {list} = await getLeadJourneyDetails(params)
    if(list && list.length > 0){
        createManyStageStatus(list)
    }
}


module.exports = { createActivityForm,logBdeActivity }
