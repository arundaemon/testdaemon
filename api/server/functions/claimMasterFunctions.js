const claimMasterControls = require('../controllers/claimMasterControls');
const customExceptions = require('../responseModels/customExceptions');

const createClaimMaster = async (params) => {
    return claimMasterControls.isDuplicateClaimMaster(params)
        .then(res => {
            if (res) {
                throw customExceptions.duplicateClaimMaster();
            }
            return claimMasterControls.createClaimMaster(params)
        })
        .then(result => {
            return { message: 'Claim created successfully', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

};

const updateClaimMaster = async (params) => {
    return claimMasterControls.isDuplicateClaimMaster(params)
        .then(res => {
            if (res) {
                throw customExceptions.duplicateClaimMaster();
            }
            return claimMasterControls.updateClaimMaster(params)
        })
        .then(result => {
            return { message: 'Claim updated successfully', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })



    return claimMasterControls.updateClaimMaster(params)
        .then(data => {
            return { message: `Claim updated successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const getClaimMasterDetails = async (id) => {
    return claimMasterControls.getClaimMasterDetails(id)
        .then(result => {
            return { message: `Claim Master details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getClaimMasterList = async (params) => {
    let ClaimList = claimMasterControls.getClaimMasterList(params);
    let TotalClaimCount = claimMasterControls.getClaimMasterListCount(params);
    return Promise.all([ClaimList, TotalClaimCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Claim List', result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteClaimMaster = async (params) => {
    return claimMasterControls.deleteClaimMaster(params)
        .then(data => {
            return { message: `Claim deleted successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

module.exports = {
    createClaimMaster,
    updateClaimMaster,
    getClaimMasterList,
    deleteClaimMaster,
    getClaimMasterDetails
}