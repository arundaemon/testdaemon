const ProductMaster = require('../models/productMasterModel');

const createProductMaster = async (params) => {
  const result = await ProductMaster.create(params);
  return result;
}

const getProductMasterList = async () => {
  return await ProductMaster.find();

}

module.exports = {
  createProductMaster,
  getProductMasterList
}