const mongoose = require("mongoose");
const Activities = require("../models/activityModel");
const utils = require("../utils/utils");
const RoleBasedAttendanceMatrix = require("../models/roleBasedAttendanceActivitiesModel");

const createActivity = async (params) => {
  if (params.userType === "Customer") {
    // let query={  userType: 'Customer' }
    // const count= await Activities.countDocuments(query);
    // const newCount=count+1;
    // params.ID=`ASM-C${newCount}`;
    const result = await Activities.create(params);
    return result;
  } else if (params.userType === "Employee") {
    let query = { userType: "Employee" };
    const count = await Activities.count(query);
    const newCount = count + 1;
    params.ID = `ASM-E-${mongoose.Types.ObjectId()}`;
    //console.log(params)
    const result = await Activities.create(params);
    return result;
  }
};

const findOneByKey = async (query, populate) => {
  //console.log(query)
  return Activities.findOne(query).populate(populate);
};

const updateActivity = async (params) => {
  let query = {};
  let update = {};
  let options = { new: true };

  query._id = params.activityId;

  if (params.activityName) {
    update.activityName = params.activityName;
  }

  if (params.userType) {
    update.userType = params.userType;
  }

  if (params.createdBy) {
    update.createdBy = params.createdBy;
  }

  if (params.modifiedBy) {
    update.modifiedBy = params.modifiedBy;
  }

  if (params.score) {
    update.score = params.score;
  }
  if (params.callingScore) {
    update.callingScore = params.callingScore;
  }

  if (params.maxScore) {
    update.maxScore = params.maxScore;
  }

  if (!utils.isEmptyValue(params.attendance)) {
    update.attendance = params.attendance;
  }
  if (!utils.isEmptyValue(params.task)) {
    update.task = params.task;
  }

  if (!utils.isEmptyValue(params.approval)) {
    update.approval = params.approval;
  }
  if (!utils.isEmptyValue(params.calling)) {
    update.calling = params.calling;
  }
  if (!utils.isEmptyValue(params.nonCalendar)) {
    update.nonCalendar = params.nonCalendar;
  }
  if (!utils.isEmptyValue(params.implementation)) {
    update.implementation = params.implementation;
  }
  if (!utils.isEmptyValue(params.isCollection)) {
    update.isCollection = params.isCollection;
  }
  if (params.categoryName) {
    update.categoryName = params.categoryName;
  }

  return Activities.findOneAndUpdate(query, update, options);
};

const deleteActivity = async (params) => {
  let query = { _id: params.activityId };
  let update = { isDeleted: true };
  let options = { new: true };

  const result = await Activities.findOne(query);
  //console.log(query,result, '.....query')
  let deleted = await Activities.findOneAndUpdate(query, update, options);
  let ID = result?.ID;
  let newquery = { activityId: ID };
  const newresult = await RoleBasedAttendanceMatrix.deleteMany(newquery);
  return deleted;
};

const getActivityList = async (params) => {
  let query = { isDeleted: false };
  let { pageNo, count, sortKey, sortOrder, search } = params;
  let sort = { createdAt: -1 };

  if (search) {
    query = {
      ...query,
      $or: [
        { ID: { $regex: search, $options: "i" } },
        { activityName: { $regex: search, $options: "i" } },
        { userType: { $regex: search, $options: "i" } },
        { createdBy: { $regex: search, $options: "i" } },
      ],
    };
  }

  if (sortKey && sortOrder) {
    sort = { [sortKey]: sortOrder };
  }

  if (utils.isEmptyValue(pageNo)) {
    pageNo = 0;
  }

  if (utils.isEmptyValue(count)) {
    count = 0;
  }

  return Activities.find(query)
    .sort(sort)
    .skip(pageNo * count)
    .limit(count)
    .lean();
};

const getActivity = async (params) => {
  // let query = { _id: params.journeyId }
  return Activities.findById(params.activityId);
};

const getTrueActivity = async (params) => {
  let query = { attendance: true, isDeleted: false };
  let sort = { name: 1 };
  return Activities.find(query).select(["activityName", "ID"]).sort(sort);
};

const getAllActivities = async (params) => {
  let { flag } = params;
  let query = { isDeleted: false };

  let sort = { name: 1 };
  if (flag) {
    query.userType = "Employee";
  }
  return Activities.find(query).select(["activityName", "ID"]).sort(sort);
};

const getActivitiesDetail = async (params) => {
  let query = { ID: { $in: params?.activityIdArr }, isDeleted: false };
  return Activities.find(query).lean();
};

module.exports = {
  createActivity,
  findOneByKey,
  updateActivity,
  deleteActivity,
  getActivityList,
  getActivity,
  getTrueActivity,
  getAllActivities,
  getActivitiesDetail
};
