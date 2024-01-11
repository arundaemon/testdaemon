const ImplementationQc = require('../models/implementationQcModel');
const utils = require("../utils/utils");

const createQc = async (params) => {
  const result = await ImplementationQc.findOneAndUpdate(
    { qcCode: params?.qcCode },
    { ...params },
    { upsert: true, new: true }
  );
  return result;
};

const getQcCode = async (params) => {
    try {
      let { implementationCode } = params;
      const uniqueQcCode = await ImplementationQc.countDocuments({}).distinct(
        "qcCode"
      );
      let count = uniqueQcCode?.length + 1;
      let totalDigits = count?.toString()?.length;
      let code;
      if (totalDigits < 2) {
        let paddedCount = `00${count}`;
        code = `QC/${implementationCode}/${paddedCount}`;
      } else if (totalDigits < 3) {
        let paddedCount = `0${count}`;
        code = `QC/${implementationCode}/${paddedCount}`;
      } else {
        code = `QC/${implementationCode}/${count}`;
      }
      return code;
    } catch (error) {
      console.error(error);
    }
};

const getQcList = async (params) => {
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames } = params;
  let sort = { createdAt: -1 };
  let query = { };

  if (sortKey && sortOrder) {
    sort = { [sortKey]: sortOrder };
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

  const result = await ImplementationQc.find(query)
    .sort(sort)
    .skip(pageNo * count)
    .limit(count)
    .lean();
  return result;
};

const getQcListCount = async (params) => {
  let { childRoleNames } = params;
  let query = { };

  if (childRoleNames && childRoleNames.length > 0) {
    query.createdByRoleName = { $in: childRoleNames };
  }
  const result = await ImplementationQc.countDocuments(query);
  return result;
};

const updateQc = async (params) => {
  let { implementationDate, qcCode, image, status, modifiedByName, modifiedByRoleName, modifiedByProfileName, modifiedByEmpCode, modifiedByUuid } = params;
  let query = { qcCode };
  let update = {};
  if (implementationDate) {
    update.implementationDate = implementationDate;
  }

  if (status) {
    update.status = status;
  }

  if (image) {
    update.image = image;
  }

  if (modifiedByName) {
    update.modifiedByName = modifiedByName;
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

  if (modifiedByUuid) {
    update.modifiedByUuid = modifiedByUuid;
  }

  return ImplementationQc.findOneAndUpdate(query, update, { new: true });
}

const getPrevQcFormData = async (params) => {
  let query = {
    implementationCode: params?.leadId,
  };
  return ImplementationQc.find(query);
};


module.exports = {
    createQc,
    getQcCode,
    updateQc,
    getPrevQcFormData,
    getQcList,
    getQcListCount
}