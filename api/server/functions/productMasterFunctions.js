const productMasterControls = require('../controllers/productMasterControls');
const crmMasterControls = require('../controllers/crmMasterControls');

const customExceptions = require('../responseModels/customExceptions')

const createProductMaster = async (params) => {
  return productMasterControls.createProductMaster(params)
    .then(result => {
      return { message: `Product Master is created`, result }
    })
    .catch(error => {
      throw error
    })
}

const getProductMasterList = async () => {
  let crmMasterList = await crmMasterControls.getAllKeyValues()
  let productData = crmMasterList?.find(obj => obj.key === 'Products')?.value;
  // console.log(productData, 'this is data')
  return Promise.all(productData)
    .then(result => {
      return { message: 'Product Master List', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

module.exports = {
  createProductMaster,
  getProductMasterList
}