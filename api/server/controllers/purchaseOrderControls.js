const PurchaseOrder = require("../models/purchaseOrderModel");
const quotationControls = require('../controllers/quotationControls')
const utils = require("../utils/utils");


const createPurchaseOrder = async (params) => {
  let query = { quotationCode: params.quotationCode }
  let update = { isPoGenerated: true }
  const result = await PurchaseOrder.create(params);
  quotationControls.updateIsPoGenerated(query, update)
  return result;
};

const isDuplicatePo = async (quotationCode) => {
  let query = { quotationCode }
  let data = await PurchaseOrder.findOne(query);
  return data
}


const getPurchaseOrderList = async (params) => {
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames } = params;
  let sort = { createdAt: -1 };
  let query = { isDeleted: false };

  if (search) {
    query = {
      ...query,
      $or: [
        { schoolName: { $regex: search, $options: "i" } },
        { 'product.productName': { $regex: search, $options: "i" } },
        { schoolCode: { $regex: search, $options: "i" } },
        { purchaseOrderCode: { $regex: search, $options: "i" } },
        { quotationCode: { $regex: search, $options: "i" } },
      ],
    };
  }

  if (childRoleNames && childRoleNames.length > 0) {
    query.createdByRoleName = { $in: childRoleNames };
  }

  if (sortKey && sortOrder) {
    sort = { [sortKey]: sortOrder };
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

  const result = await PurchaseOrder.find(query)
    .sort(sort)
    .skip(pageNo * count)
    .limit(count)
    .lean();
  return result;
};

const getPurchaseOrderCode = async (params) => {
  try {
    let { schoolCode } = params;
    const uniquePOCode = await PurchaseOrder.countDocuments({}).distinct(
      "purchaseOrderCode"
    );
    let count = uniquePOCode?.length + 1;
    let totalDigits = count?.toString()?.length;
    let code;
    if (totalDigits < 2) {
      let paddedCount = `00${count}`;
      code = `PO-${schoolCode}-${paddedCount}`;
    } else if (totalDigits < 3) {
      let paddedCount = `0${count}`;
      code = `PO-${schoolCode}-${paddedCount}`;
    } else {
      code = `PO-${schoolCode}-${count}`;
    }
    return code;
  } catch (error) {
    console.error(error);
  }
};

const deletePurchaseOrder = async (params) => {
  let query = { _id: params.purchaseId };
  let update = { isDeleted: true };
  let options = { new: true };
  return PurchaseOrder.findOneAndUpdate(query, update, options);
};

const getPurchaseOrderDetails = async (id) => {
  return PurchaseOrder.findOne({
    $or: [
      { purchaseOrderCode: id },
      { quotationCode: id }
    ]
  });
}

const getPOListBySchoolCode = async (schoolCode) => {
  let query = { schoolCode }
  return PurchaseOrder.find(query);
}

const updatePurchaseOrderStatus = async (params) => {
  let query = {
    purchaseOrderCode: { $in: params?.referenceCode },
    isDeleted: false
  };
  let update = {
    status: params?.status,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid
  };
  let options = { new: true };

  const result = await PurchaseOrder.updateMany(query, update, options);
  return result;
}

const updatePurchaseOrderApprovalStatus = async (params) => {
  let query = {
    purchaseOrderCode: params?.referenceCode,
    isDeleted: false
  };
  let update = {
    approvalStatus: params?.status,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid
  };
  let options = { new: true };

  const result = await PurchaseOrder.findOneAndUpdate(query, update, options);
  return result;
}



module.exports = {
  createPurchaseOrder,
  getPurchaseOrderList,
  deletePurchaseOrder,
  getPurchaseOrderCode,
  getPurchaseOrderDetails,
  updatePurchaseOrderStatus,
  getPOListBySchoolCode,
  isDuplicatePo,
  updatePurchaseOrderApprovalStatus
};
