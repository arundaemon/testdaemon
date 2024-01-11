const prod = require('../config/env/prod')
const quotationControls = require('../controllers/quotationControls')
const customExceptions = require('../responseModels/customExceptions')


const createQuotation = async (params) => {
  let quotationCode = await quotationControls.getQuotationListCount(params)
  let ProductEntries = params?.map((product, i) => {
    return {
      ...product,
      quotationCode: quotationCode,
    }
  })

  return quotationControls.createQuotation(ProductEntries)
    .then(result => {
      return { message: `Quotation is created`, result }
    })
    .catch(error => {
      throw error
    })
}

const getQuotationList = async (params) => {
  let QuotationList = quotationControls.getQuotationList(params);
  return Promise.all([QuotationList])
    .then(response => {
      let [result] = response
      return { message: 'Quotation List', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getProductSalePriceSum = async (params) => {
  return quotationControls.getProductSalePriceSum(params)
    .then(result => {
      return { message: `Quotation sum`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getQuotationWithoutPO = async (params) => {
  return quotationControls.getQuotationWithoutPO(params)
    .then(result => {
      return { message: `Quotation Code list`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}


const deleteQuotation = async (params) => {
  return quotationControls.deleteQuotation(params)
    .then(result => {
      return { message: `Quotation Deleted Successfully!`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}


const getQuotationDetails = async (id) => {
  return quotationControls.getQuotationDetails(id)
    .then(result => {
      return { message: `Quotation details`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateQuotation = async (data) => {
  return quotationControls.updateQuotation(data)
    .then(result => {
      return { message: `Quotation Updated Succesfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateQuotationStatus = async (params) => {
  return quotationControls.updateQuotationStatus(params)
    .then(result => {
      return { message: `Quotation Status Updated Succesfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateQuotationApprovalStatus = async (params) => {
  return quotationControls.updateQuotationApprovalStatus(params)
    .then(result => {
      return { message: `Quotation Approval Status Updated Succesfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateIsPoGenerated = async (params) => {
  let query = { quotationCode: params?.quotationCode };
  let update = { $set: { isPoGenerated: params?.isPoGenerated } };
  return quotationControls.updateIsPoGenerated(query, update)
    .then(result => {
      return { message: `IsPOGenerated Status Changed`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}


module.exports = {
  createQuotation,
  getQuotationList,
  deleteQuotation,
  getQuotationDetails,
  updateQuotation,
  updateQuotationStatus,
  getProductSalePriceSum,
  getQuotationWithoutPO,
  updateQuotationApprovalStatus,
  updateIsPoGenerated
}


