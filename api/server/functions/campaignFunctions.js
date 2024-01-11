const campaignControls = require('../controllers/campaignControls');
const customExceptions = require('../responseModels/customExceptions')


const createCampaign = async (params) => {
    return campaignControls.isDuplicateCampaign(params.campaignName)
        .then(result => {
            if (result) {
                throw customExceptions.campaignExists()
            }
            return campaignControls.createCampaign(params)
        })
        .then(result => {
            return { message: `Campaign is created`, result }
        })
        .catch(error => {
            throw error
        })
}

const getCampaignList = async (params) => {
    let CampaignList = campaignControls.getCampaignList(params);
    let TotalCampaignCount = campaignControls.getCampaignListCount(params);
    return Promise.all([CampaignList, TotalCampaignCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Campaign List', result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updateCampaign = async (params) => {
    return campaignControls.updateCampaign(params)
        .then(data => {
            return { message: `Campaign updated successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getCampaignDetails = async (id) => {
    return campaignControls.getCampaignDetails(id)
        .then(result => {
            return { message: `Campaign details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    createCampaign,
    getCampaignList,
    updateCampaign,
    getCampaignDetails
}