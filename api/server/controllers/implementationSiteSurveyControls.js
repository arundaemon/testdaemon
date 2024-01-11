const SiteSurvey = require("../models/implementationSiteSurveyModel");
const utils = require("../utils/utils");

const createSiteSurvey = async (params) => {
  const result = await SiteSurvey.findOneAndUpdate(
    { siteSurveyCode: params?.siteSurveyCode },
    { ...params, isDeleted: false },
    { upsert: true, new: true }
  );
  return result;
};

const getSiteSurveyCode = async (params) => {
  try {
    let { schoolCode } = params;
    const uniqueSsrCode = await SiteSurvey.countDocuments({}).distinct(
      "siteSurveyCode"
    );
    let count = uniqueSsrCode?.length + 1;
    let totalDigits = count?.toString()?.length;
    let code;
    if (totalDigits < 2) {
      let paddedCount = `00${count}`;
      code = `SSR-${schoolCode}-${paddedCount}`;
    } else if (totalDigits < 3) {
      let paddedCount = `0${count}`;
      code = `SSR-${schoolCode}-${paddedCount}`;
    } else {
      code = `SSR-${schoolCode}-${count}`;
    }
    return code;
  } catch (error) {
    console.error(error);
  }
};

const getSiteSurveyList = async (params) => {
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames } = params;
  let sort = { createdAt: -1 };
  let query = { isDeleted: false };

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

  const result = await SiteSurvey.find(query)
    .sort(sort)
    .skip(pageNo * count)
    .limit(count)
    .lean();
  return result;
};

const getSiteSurveyListCount = async (params) => {
  let { childRoleNames } = params;
  let query = { isDeleted: false };

  if (childRoleNames && childRoleNames.length > 0) {
    query.createdByRoleName = { $in: childRoleNames };
  }
  const result = await SiteSurvey.countDocuments(query);
  return result;
};

const getSiteSurveyDetails = async (params) => {
  let query = {
    isDeleted: false,
  };


  if (params?.siteSurveyCode) {
    query.siteSurveyCode = params?.siteSurveyCode;
  }

  if (params?.implementationCode) {
    query.implementationCode = params?.implementationCode;
  }

  return SiteSurvey.findOne(query);
};

const getPrevSsrFormData = async (params) => {
  let query = {
    implementationCode: params?.leadId,
    isDeleted: false,
  };
  return SiteSurvey.findOne(query);
};

const updateApprovalStatus = async (params) => {
  let query = { implementationCode: params?.referenceCode, isDeleted: false };
  let options = { new: true };
  let update = {
    approvalStatus: params?.status,
    modifiedByName: params?.modifiedByName,
    modifiedByRoleName: params?.modifiedByRoleName,
    modifiedByProfileName: params?.modifiedByProfileName,
    modifiedByEmpCode: params?.modifiedByEmpCode,
    modifiedByUuid: params?.modifiedByUuid,
  };
  return SiteSurvey.findOneAndUpdate(query, update, options);
};


module.exports = {
  createSiteSurvey,
  getSiteSurveyList,
  getSiteSurveyListCount,
  getSiteSurveyCode,
  getSiteSurveyDetails,
  getPrevSsrFormData,
  updateApprovalStatus,
};
