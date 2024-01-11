const { QUOTATION_CATEGORY } = require("../constants/dbConstants");
const Quotation = require("../models/quotationModel");
const utils = require("../utils/utils");

const createQuotation = async (params) => {
  try {
    const result = await Quotation.insertMany(params);
    return result;
  } catch (err) {
    throw { errorMessage: err };
  }
};

const getQuotationList = async (params) => {
  let query = { isDeleted: false };
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames } = params;
  let sort = { createdAt: -1 };
  if (search) {
    query = {
      ...query,
      $or: [
        { schoolName: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { quotationCode: { $regex: search, $options: "i" } }
      ],
    };
  }

  if (childRoleNames && childRoleNames.length > 0) {
    query.createdByRoleName = { $in: childRoleNames };
  }

  if (sortKey && sortOrder) {
    if (sortOrder == -1) sort = { [sortKey]: -1 };
    else sort = { [sortKey]: 1 };
  }

  if (utils.isEmptyValue(pageNo)) {
    pageNo = 0;
  } else {
    pageNo = parseInt(pageNo);
  }

  if (utils.isEmptyValue(count)) {
    count = 999;
  } else {
    count = parseInt(count);
  }

  const result = Quotation.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$quotationCode",
        data: { $push: "$$ROOT" },
        modifiedBy: { $first: "$modifiedBy" },
        updatedAt: { $first: "$updatedAt" },
        createdAt: { $first: "$createdAt" },
      },
    },
    { $sort: sort },
    {
      $skip: pageNo * count,
    },
    {
      $limit: count,
    },
  ]);
  return result;
};

const getQuotationListCount = async (params) => {
  try {
    const uniqueQuotationCode = await Quotation.countDocuments({}).distinct(
      "quotationCode"
    );
    let count = uniqueQuotationCode?.length + 1;
    let schoolCode = params[0]?.schoolCode;
    let totalDigits = count?.toString()?.length;
    let code;
    if (totalDigits < 2) {
      let paddedCount = `00${count}`;
      code = `QT-${schoolCode}-${paddedCount}`;
    } else if (totalDigits < 3) {
      let paddedCount = `0${count}`;
      code = `QT-${schoolCode}-${paddedCount}`;
    } else {
      code = `QT-${schoolCode}-${count}`;
    }
    return code;
  } catch (error) {
    console.error(error);
  }
};

const getProductSalePriceSum = async (params) => {
  try {
    const { id } = params;
    const quotationCodeData = await Quotation.find({ quotationCode: id });

    const result = quotationCodeData.reduce(
      (acc, item) => {
        const salePrice = parseFloat(item?.productItemSalePrice);
        const itemDuration = parseInt(item?.productItemDuration);
        const itemCategory = item?.productItemCategory;
        if (!isNaN(salePrice)) {
          acc.productItemSalePriceSum += salePrice;
          if (itemCategory) {
            if (acc[itemCategory]) {
              acc[itemCategory] += salePrice;
            } else {
              acc[itemCategory] = salePrice;
            }
          }
        }
        if (!isNaN(itemDuration) && (itemCategory == QUOTATION_CATEGORY.SOFTWARE || itemCategory == QUOTATION_CATEGORY.SERVICE)) {
          acc.maxProductItemDuration = Math.max(
            acc.maxProductItemDuration,
            itemDuration
          );
        }
        return acc;
      },
      { productItemSalePriceSum: 0, maxProductItemDuration: 1 }
    );

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getQuotationWithoutPO = async (params) => {
  const query = {
    isPoGenerated: false,
    schoolCode: params.id,
    isDeleted: false,
    approvalStatus: "Approved",
  };
  let sort = { quotationCode: 1 };
  let result = await Quotation.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$quotationCode",
      },
    },
    {
      $sort: sort,
    },
  ]);
  return result;
};

const deleteQuotation = async (params) => {
  const query = { quotationCode: { $in: params } };
  const update = { isDeleted: true };
  return Quotation.updateMany(query, update);
};

const getQuotationDetails = async (id) => {
  return Quotation.find({ quotationCode: id, isDeleted: false });
};

const updateQuotation = async (data) => {
  const results = [];
  for (const updateData of data) {
    let { id } = updateData;
    let query = { _id: id };
    let options = { new: true, upsert: true };
    delete updateData.id;
    let update = { ...updateData };
    var result = await Quotation.findOneAndUpdate(query, update, options);
    results.push(result);
  }
  return results;
};

const updateQuotationStatus = async (params) => {
  let query = {
    isDeleted: false,
    quotationCode: { $in: params?.referenceCode },
  };
  let update = {
    status: params?.status,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid,
  };
  let options = { new: true };
  const result = await Quotation.updateMany(query, update, options);
  return result;
};

const updateQuotationApprovalStatus = async (params) => {
  let query = {
    isDeleted: false,
    quotationCode: params?.referenceCode,
  };
  let update = {
    approvalStatus: params?.status,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid,
  };
  let options = { new: true };
  const result = await Quotation.updateMany(query, update, options);
  return result;
};

const updateIsPoGenerated = async (query, update) => {
  const result = await Quotation.updateMany(query, update);
  return result;
};

module.exports = {
  createQuotation,
  getQuotationList,
  deleteQuotation,
  getQuotationListCount,
  getQuotationDetails,
  updateQuotation,
  updateQuotationStatus,
  getProductSalePriceSum,
  getQuotationWithoutPO,
  updateQuotationApprovalStatus,
  updateIsPoGenerated,
};
