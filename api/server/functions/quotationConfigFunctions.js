const quotationConfigController = require('../controllers/quotationConfigControls');
const customExceptions = require('../responseModels/customExceptions');

const createQuotationConfig = async (params) => {
    return quotationConfigController.isDuplicateConfig(params)
        .then(result => {
            if (result) {
                throw customExceptions.duplicateQuotationConfig()
            }

            return quotationConfigController.createQuotationConfig(params)
        })
        .then(result => {
            return { message: `Product Quotation Created Successfully`, result }
        })
        .catch(error => {
            throw error
        })
}

const getQuotationConfigList = async (params) => {
    return quotationConfigController.getQuotationConfigList(params)
        .then((result) => {
            return { message: "Listing Fetched Successfully", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
}

const updateQuotationConfig = async (params) => {
    return quotationConfigController.isDuplicateConfig(params)
        .then(result => {
            if (result) {
                throw customExceptions.duplicateQuotationConfig()
            }

            return quotationConfigController.updateQuotationConfig(params)
        })
        .then(result => {
            return { message: `Quotation Config Updated Successfully`, result }
        })
        .catch(error => {
            throw error
        })

}

const getQuotationConfigDetail = async (params) => {
    return quotationConfigController.getQuotationConfigDetail(params)
        .then((result) => {
            return { message: "Details Fetched Successfully", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
}

module.exports = {
    createQuotationConfig,
    getQuotationConfigList,
    updateQuotationConfig,
    getQuotationConfigDetail
}