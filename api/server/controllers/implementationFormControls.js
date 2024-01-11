const ImplementationConfig = require("../models/implementationConfigModel");
const Implementation = require("../models/implementationFormModel");
const utils = require("../utils/utils");

const createCompleteImplementationForm = async (params) => {
  try {
    const result = await Implementation.create(params);
    return result;
  } catch (err) {
    throw { errorMessage: err };
  }
};

const isDuplicatePo = async (impFormNumber) => {
  let query = { impFormNumber };
  let data = await Implementation.findOne(query);
  return data;
};

const getImpFormCode = async (params) => {
  try {
    let { purchaseOrderCode } = params;
    purchaseOrderCode =
      purchaseOrderCode.slice(0, 2) + purchaseOrderCode.slice(-3);
    const uniquePOCode = await Implementation.countDocuments({}).distinct(
      "impFormNumber"
    );
    let count = uniquePOCode?.length + 1;
    let totalDigits = count?.toString()?.length;
    let code;
    if (totalDigits < 2) {
      let paddedCount = `00${count}`;
      code = `IMP-${purchaseOrderCode}-${paddedCount}`;
    } else if (totalDigits < 3) {
      let paddedCount = `0${count}`;
      code = `IMP-${purchaseOrderCode}-${paddedCount}`;
    } else {
      code = `IMP-${purchaseOrderCode}-${count}`;
    }
    return code;
  } catch (error) {
    console.error(error);
  }
};

const getImplementationList = async (params) => {
  let query = { isDeleted: false };
  let {
    pageNo,
    count,
    sortKey,
    sortOrder,
    impFormNumber,
    schoolName,
    schoolCode,
    childRoleNames,
    startDate,
    endDate,
    invoices
  } = params;
  let sort = { createdAt: -1 };
  if (schoolName || schoolCode) {
    query = {
      ...query,
      $or: [
        schoolName && { schoolName: { $regex: schoolName, $options: "i" } },
        schoolCode && { schoolCode: { $regex: schoolCode, $options: "i" } },
      ].filter(Boolean),
    };
  }

  if (impFormNumber) {
    query.impFormNumber = impFormNumber;
  }

  if (startDate && endDate) {
    query = {
      ...query,
      $expr: {
        $and: [
          {
            $gte: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "+00:00",
                },
              },
              startDate,
            ],
          },
          {
            $lte: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "+00:00",
                },
              },
              endDate,
            ],
          },
        ],
      },
    };
  }

  if (childRoleNames && childRoleNames.length > 0) {
    query.createdByRoleName = { $in: childRoleNames };
  }

  // if (sortKey && sortOrder) {
  //   if (sortOrder == -1) sort = { [sortKey]: -1 };
  //   else sort = { [sortKey]: 1 };
  // }

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

  if (invoices) {
    query = { ...query, totalHardwareContractAmount: { $gt: 0 } }
  }

  const result = await Implementation.find(query)
    .skip(pageNo * count)
    .sort(sort)
    .limit(count)
    .lean();
  return result;
};

const getImplementationListByApprovalStatus = async (params) => {
  let query = { isDeleted: false };
  let {
    pageNo,
    limit,
    sortKey,
    sortOrder,
    search,
    approvalStatus,
    scheduleStatus,
  } = params;
  let sort = { createdAt: -1 };
  if (search) {
    query = {
      ...query,
      $or: [
        { schoolName: { $regex: search, $options: "i" } },
        { schoolCode: { $regex: search, $options: "i" } },
        { impFormNumber: { $regex: search, $options: "i" } },
      ],
    };
  }

  if (approvalStatus) {
    if (typeof approvalStatus === "object") {
      query["approvalStatus"] = { $in: [...approvalStatus] };
    } else {
      query["approvalStatus"] = approvalStatus;
    }
  }

  if (scheduleStatus) {
    if (typeof scheduleStatus === "object") {
      query["scheduleStatus"] = { $in: [...scheduleStatus] };
    } else {
      query["scheduleStatus"] = scheduleStatus;
    }
  }

  // if (sortKey && sortOrder) {
  //   if (sortOrder == -1) sort = { [sortKey]: -1 };
  //   else sort = { [sortKey]: 1 };
  // }

  if (utils.isEmptyValue(pageNo)) {
    pageNo = 0;
  } else {
    pageNo = parseInt(pageNo);
  }

  if (utils.isEmptyValue(limit)) {
    limit = 999;
  } else {
    limit = parseInt(limit);
  }

  const result = await Implementation.find(query)
    .skip(pageNo * limit)
    .sort(sort)
    .limit(limit)
    .lean();
  return result;
};

const getImplementationById = async (id) => {
  let query = {
    $or: [
      { purchaseOrderCode: id },
      { quotationCode: id },
      { impFormNumber: id },
    ],
  };
  return await Implementation.find(query);
};

const updateImplementationByStatus = async (params) => {
  let {
    impFormNumber,
    status,
    stage,
    modifiedByName,
    modifiedByRoleName,
    modifiedByProfileName,
    modifiedByEmpCode,
    modifiedByUuid,
  } = params;
  let update = {};
  let query = { impFormNumber };
  let options = { new: true };
  if (modifiedByName) {
    update.modifiedByName = modifiedByName;
  }
  if (modifiedByUuid) {
    update.modifiedByUuid = modifiedByUuid;
  }
  if (modifiedByRoleName) {
    update.modifiedByRoleName = modifiedByRoleName;
  }
  if (modifiedByProfileName) {
    update.modifiedByProfileName = modifiedByProfileName;
  }
  if (modifiedByEmpCode) {
    update.modifiedByEmpCode = modifiedByEmpCode;
  }
  if (stage) {
    update.stage = stage
  }
  if (!utils.isEmptyValue(status)) {
    update.status = status;
  }
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
};

const updateActivationPackage = async (params) => {
  let {
    impFormNumber,
    packageActivation,
    activationResponse,
    status,
    modifiedByName,
    modifiedByRoleName,
    modifiedByProfileName,
    modifiedByEmpCode,
    modifiedByUuid,
  } = params;
  let update = {};
  let query = { impFormNumber };
  let options = { new: true };
  if (modifiedByName) {
    update.modifiedByName = modifiedByName;
  }
  if (modifiedByUuid) {
    update.modifiedByUuid = modifiedByUuid;
  }
  if (modifiedByRoleName) {
    update.modifiedByRoleName = modifiedByRoleName;
  }
  if (modifiedByProfileName) {
    update.modifiedByProfileName = modifiedByProfileName;
  }
  if (modifiedByEmpCode) {
    update.modifiedByEmpCode = modifiedByEmpCode;
  }
  if (activationResponse) {
    update.activationResponse = activationResponse;
  }
  if (!utils.isEmptyValue(packageActivation)) {
    update.packageActivation = packageActivation;
  }
  if (!utils.isEmptyValue(status)) {
    update.status = status;
  }
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
};

const updateAssignedEngineer = async (query, update) => {
  let options = { new: true };
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
};

const updateRecord = async (query, update) => {
  let options = { new: true };
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
};

const updateImpApprovalStatus = async (params) => {
  let query = {
    isDeleted: false,
    impFormNumber: params?.referenceCode,
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
  const result = await Implementation.updateMany(query, update, options);
  return result;
};

const createProductField = async (params) => {
  try {
    const result = await ImplementationConfig.create(params);
    return result;
  } catch (err) {
    throw { errorMessage: err };
  }
};
const getProductField = async () => {
  try {
    const result = await ImplementationConfig.find({});
    return result;
  } catch (err) {
    throw { errorMessage: err };
  }
};

const getActivatedImplementationList = async (params) => {
  let query = { isDeleted: false, status: "System Activated" };
  let { search,
    pageNo,
    count,
    sortKey,
    sortOrder,
    childRoleNames,
    product,
    schoolName,
    schoolCode,
    impFormCode,
  } = params;

  let sort = { createdAt: -1 };

  if (schoolName || schoolCode || impFormCode || product) {
    query = {
      ...query, $and: [
        { schoolName: { $regex: schoolName, $options: "i" } },
        { schoolCode: { $regex: schoolCode, $options: "i" } },
        { impFormNumber: { $regex: impFormCode, $options: "i" } },
        { 'productDetails.groupCode': { $regex: product, $options: "i" } }
      ]
    }
  }

  // if (childRoleNames && childRoleNames.length > 0) {
  //   query.createdByRoleName = { $in: childRoleNames };
  // }

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

  const result = await Implementation.find(query)
    .skip(pageNo * count)
    .sort(sort)
    .limit(count)
    .lean();

  return result;
}
const updateOneByKey = async (query, update, options) => {
  return Implementation.findOneAndUpdate(query, update, options);
};

const updateStatusByPOApproval = async (params) => {
  let {
    impFormNumber,
    packageActivation,
    status,
    approvalStatus,
    modifiedByName,
    modifiedByRoleName,
    modifiedByProfileName,
    modifiedByEmpCode,
    modifiedByUuid,
  } = params;
  let update = {};
  let query = { impFormNumber };
  let options = { new: true };

  if (approvalStatus) {
    update.approvalStatus = approvalStatus;
  }
  if (modifiedByName) {
    update.modifiedByName = modifiedByName;
  }
  if (modifiedByUuid) {
    update.modifiedByUuid = modifiedByUuid;
  }
  if (modifiedByRoleName) {
    update.modifiedByRoleName = modifiedByRoleName;
  }
  if (modifiedByProfileName) {
    update.modifiedByProfileName = modifiedByProfileName;
  }
  if (modifiedByEmpCode) {
    update.modifiedByEmpCode = modifiedByEmpCode;
  }
  if (!utils.isEmptyValue(packageActivation)) {
    update.packageActivation = packageActivation;
  }
  if (!utils.isEmptyValue(status)) {
    update.status = status;
  }
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
};

const updateApprovalStatus = async (params) => {
  let query = {
    isDeleted: false,
    impFormNumber: params?.referenceCode,
  };
  let update = {
    approvalStatus: params?.approvalStatus,
    status: params?.status,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid,
  };
  let options = { new: true };
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
};

const getImplementationByCondition = async (query) => {
  return Implementation.find(query).lean();
}

const updateHardwareDetails = async (params) => {
  let query = {
    isDeleted: false,
    impFormNumber: params?.impFormNumber
  }
  let update = {
    hardwareDetails: params?.hardwareDetails,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid
  }
  let options = { new: true };
  const result = await Implementation.findOneAndUpdate(query, update, options);
  return result;
}

const updateReturnedHardwareProduct = async (params) => {
  let query = {
    isDeleted: false,
    impFormNumber: params?.impFormNumber
  }
  let impData = await getImplementationById(params?.impFormNumber)
  impData = impData[0]
  let hardware_details = impData.hardwareDetails
  let paramsHardwareDetails = params.hardware_details
  for (let i = 0; i < paramsHardwareDetails.length; i++) {
    for (let j = 0; j < hardware_details.length; j++) {
      if (paramsHardwareDetails[i].hardwareId == hardware_details[j].hardwareId) {
        hardware_details[j].implementedUnit = Number(hardware_details[j].implementedUnit) - Number(paramsHardwareDetails[i].totalReturnValue)
      }
    }
  }
  let updateHardwareUnits = {
    impFormNumber: params?.impFormNumber,
    hardwareDetails: hardware_details,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid
  }
  let result = await updateHardwareDetails(updateHardwareUnits)
  return result
}

const getImplementationListWithEr = async (params) => {
  let { pageNo, count, childRoleNames, search } = params;
  let query = { isDeleted: false };
  let sort = { createdAt: -1 };

  if (search) {
    query.status = { $regex: search, $options: 'i' };
  }

  if (childRoleNames && childRoleNames.length > 0) {
    query.createdByRoleName = { $in: childRoleNames };
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

  const result = await Implementation.aggregate([
    {
      $match: query
    },
    {
      $lookup: {
        from: "implementationassignedengineers",
        localField: "impFormNumber",
        foreignField: "implementationCode",
        as: "assigned_engineer_info",
        pipeline: [
          {
            $project: {
              _id: 0,
              assignedEngineerName: "$assignedEngineerName",
              type: "$type",
            }
          }
        ]
      }
    },
    {
      $unwind: {
        path: "$assigned_engineer_info",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$impFormNumber",
        impFormNumber: { "$first": "$impFormNumber" },
        purchaseOrderCode: { "$first": "$purchaseOrderCode" },
        quotationCode: { "$first": "$quotationCode" },
        schoolCityName: { "$first": "$schoolCityName" },
        schoolStateName: { "$first": "$schoolStateName" },
        schoolCode: { "$first": "$schoolCode" },
        schoolName: { "$first": "$schoolName" },
        productDetails: { "$first": "$productDetails" },
        status: { "$first": "$status" },
        createdAt: { "$first": "$createdAt" },
        createdByName: { "$first": "$createdByName" },
        assigned_engineer_info: { $push: "$assigned_engineer_info" }


      }
    },
    {
      $sort: sort
    },
    {
      $skip: pageNo * count
    },
    {
      $limit: count
    }
  ]);
  return result;

}

module.exports = {
  createCompleteImplementationForm,
  getImplementationList,
  getImplementationListByApprovalStatus,
  getImplementationById,
  updateImplementationByStatus,
  isDuplicatePo,
  updateImpApprovalStatus,
  getImpFormCode,
  updateAssignedEngineer,
  createProductField,
  getProductField,
  getActivatedImplementationList,
  updateOneByKey,
  updateActivationPackage,
  updateRecord,
  updateStatusByPOApproval,
  updateApprovalStatus,
  updateHardwareDetails,
  updateReturnedHardwareProduct,
  getImplementationByCondition,
  getImplementationListWithEr
};
