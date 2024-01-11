const crmFieldMasterControls = require('../controllers/crmFieldMasterControls');
const activityFormMappingFunctions = require('../functions/activityFormMappingFunctions');
const customExceptions = require('../responseModels/customExceptions');

const createCrmFieldMaster = async (params) => {
    return crmFieldMasterControls.isDuplicateEntry(params.fieldName)
        .then(result => {
            if (result) {
                throw customExceptions.duplicateCrmFieldMaster()
            }

            return crmFieldMasterControls.createCrmFieldMaster(params)
        })
        .then(result => {
            return { message: `CRM Field Master is created`, result }
        })
        .catch(error => {
            throw error
        })
}

const getAllCrmFieldMasterList = async (params) => {
    return crmFieldMasterControls.getAllCrmFieldMasterList(params)
        .then(result => {
            return { message: 'CRM Field Master List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const updateCrmFieldMaster = async (params) => {

    return crmFieldMasterControls.isDuplicateEntry(params.fieldName, params._id)
        .then(result => {
            if (result) {
                throw customExceptions.duplicateCrmFieldMaster()
            }
            return  Promise.all([crmFieldMasterControls.updateCrmFieldMaster(params),
                activityFormMappingFunctions.updateDependentFields(params)
            ])

               
        })
        .then(result => {
            return { message: `Crm Field Master updated successfully`, result }
        })
        .catch(error => {
            throw error
        })
};

const getCrmFieldMasterList = async (params) => {
    let CrmList = crmFieldMasterControls.getCrmFieldMasterList(params);
    let TotalCrmCount = crmFieldMasterControls.getCrmFieldMasterListCount(params);
    return Promise.all([CrmList, TotalCrmCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Crm Field Master List', result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    createCrmFieldMaster,
    getAllCrmFieldMasterList,
    updateCrmFieldMaster,
    getCrmFieldMasterList
}

