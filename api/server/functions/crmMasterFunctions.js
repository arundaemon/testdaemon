const crmMasterControls = require('../controllers/crmMasterControls');
const customExceptions = require('../responseModels/customExceptions');

const createCrmMaster = async (params) => {
    return crmMasterControls.createCrmMaster(params)
        .then(result => {
            return { message: 'Crm Master created successfully', result}
        })
        .catch(error => {
            throw error
        })
};

const updateCrmMaster = async (params) => {  
    return crmMasterControls.updateCrmMaster(params)
        .then(result => {
            return { message: `Crm Master updated successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const getCrmMasterDetails = async (id) => {
    return crmMasterControls.getCrmMasterDetails(id)
        .then(result => {
            return { message: `Crm Master details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getCrmMasterList = async (params) => {
    let CrmList = crmMasterControls.getCrmMasterList(params);
    let TotalCrmCount = crmMasterControls.getCrmMasterListCount(params);
    return Promise.all([CrmList, TotalCrmCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Crm Master List', result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteCrmMaster = async (params) => {
    return crmMasterControls.deleteCrmMaster(params)
        .then(result => {
            return { message: `Crm Master deleted successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const getAllCrmMaster = async (params) => {
    return crmMasterControls.getAllCrmMaster(params)
        .then(result => {
            return { message: `All Crm Masters List `, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const getAllKeyValues = async (params) => {
    return crmMasterControls.getAllKeyValues(params)
        .then(result => {
            return { message: `All Key Values`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getAllProductList = async () => {
    return crmMasterControls.getAllProductList()
        .then(result => {
            return { message: `All Product List`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    createCrmMaster,
    updateCrmMaster,
    getCrmMasterList,
    deleteCrmMaster,
    getCrmMasterDetails,
    getAllCrmMaster,
    getAllKeyValues,
    getAllProductList
}