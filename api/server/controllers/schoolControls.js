const School = require('../models/schoolModel')
const BdeActivity = require('../models/bdeActivitiesModel')
const LeadOwner = require('../models/leadOwnerModel');
const utils = require('../utils/utils');
const mongoose = require('mongoose');
const leadInterest = require('../models/leadInterestModel')
const schoolLogsControls = require('../controllers/schoolLogsControls');
const { query } = require('express');
const leadInterestModel = require('../models/leadInterestModel');


const createSchool = async (params) => {
  params.leadId = mongoose.Types.ObjectId();
  return School.create(params);
}

const isDuplicateSchool = async (geoTagCode) => {
  let query = { geoTagId: geoTagCode }
  return School.findOne(query)
}

const countSchoolWithStateCode = async (code) => {
  let data = await School.find({ stateCode: code })
  return data;
}

const getSchoolList = async (params) => {


  //let query = { ownerType: 'school' }
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames, parentRole } = params

  let sort = { updatedAt: -1 };
  let query = {}
  let searchquery = {};
  if (search) {
    searchquery = {
      ...searchquery,
      $or: [{
        ['school_info.schoolName']: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        ['school_info.schoolCode']: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        ['school_info.oldSchoolCode']: {
          $regex: search,
          $options: 'i'
        }
      },
      ]
    }
  }
  if (childRoleNames && childRoleNames.length > 0) {
    query.assignedTo_role_name = {
      $in: [...childRoleNames,parentRole]
    }
  }
  if (sortKey && sortOrder) {
    if (sortOrder == -1)
      sort = {
        [sortKey]: -1
      }
    else
      sort = {
        [sortKey]: 1
      }
  }
  if (utils.isEmptyValue(pageNo)) {
    pageNo = 0
  } else {
    pageNo = parseInt(pageNo)
  }
  if (utils.isEmptyValue(count)) {
    count = 999
  } else {
    count = parseInt(count);
  }
 
  const result = await LeadOwner.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "schools",
        localField: "leadId",
        foreignField: "leadId",
        as: "school_info",
      },
    },
    { $unwind: { path: "$school_info", preserveNullAndEmptyArrays: true } },
    { $match: searchquery },
    {
      $group: {
        _id: {
          leadId: "$leadId",
          assignedToRoleName: "$school_info.assignedTo_role_name",
        },
        school_info: { $first: "$school_info" },
        tutionFee: { $first: "$school_info.tutionFee" },
        schoolCode: { $first: "$school_info.schoolCode" },
        type: { $first: "$school_info.type" },
        createdAt: { $first: "$school_info.createdAt" },
        updatedAt: { $first: "$school_info.updatedAt" },
        oldSchoolCode: { $first: "$school_info.oldSchoolCode" },
        products: {
          $addToSet: "$name",
        },
      },
    },
    {
      $addFields: {
        isParentRole: {
          $cond: { if: { $eq: ["$_id.assignedToRoleName", parentRole] }, then: 1, else: 0 },
        },
      },
    },
    {
      $sort: {
        isParentRole: -1, // Sort by isParentRole in descending order
        updatedAt: -1,
      },
    },
    { $skip: pageNo * count },
    { $limit: count },
    {
      $project: {
        school_info: 1,
        schoolCode: 1,
        createdAt: 1,
        updatedAt: 1,
        products: 1,
      },
    },
  ]);

  return result;
};
  

const getSchoolCodeList = async (params) => {
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames, allSchool } = params
  let query = {}
  if (search) {
    query = {
      ...query,
      $or: [
        { schoolCode: { $regex: `^${search}`, $options: 'i' } },
        { oldSchoolCode: { $regex: `^${search}`, $options: 'i' } },
        { schoolName: { $regex: `^${search}`, $options: 'i' } },

      ]
    }
  }
  // if (childRoleNames && childRoleNames.length > 0 && !allSchool) {
  //   query.assignedTo_role_name = { $in: childRoleNames }
  // }

  return await School.find(query)
}


const getSchoolCodeListWithOwner = async (params) => {
  let { pageNo, count, sortKey, sortOrder, search, childRoleNames } = params

  let sort = { updatedAt: -1 };
  let input = new RegExp(search);
  let query = { ownerType: 'school' }
  let searchquery = {};
  if (search) {
    searchquery = {
      ...searchquery,
      $or: [
        { ['school_info.schoolCode']: { $regex: search, $options: 'i' } },
        { ['school_info.oldSchoolCode']: { $regex: search, $options: 'i' } },
      ]
    }
  }

  if (childRoleNames && childRoleNames.length > 0) {
    query.assignedTo_role_name = { $in: childRoleNames }
  }

  if (sortKey && sortOrder) {
    if (sortOrder == -1)
      sort = { [sortKey]: -1 }
    else
      sort = { [sortKey]: 1 }
  }

  if (utils.isEmptyValue(pageNo)) {
    pageNo = 0
  } else {
    pageNo = parseInt(pageNo)
  }

  if (utils.isEmptyValue(count)) {
    count = 999
  } else {
    count = parseInt(count);
  }

  const result = await School.aggregate([
    {
      $match: query

    },
    {
      $lookup:
      {
        from: "schools",
        localField: "leadId",
        foreignField: "leadId",
        as: "school_info"
      }
    },
    {
      $unwind: {
        path: "$school_info", preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: searchquery
    },
    {
      $project: {
        school_info: 1,
        tutionFee: `$school_info.tutionFee`,
        schoolName: `$school_info.schoolName`,
        schoolCode: `$school_info.schoolCode`,
        type: `$school_info.type`,
        createdAt: `$school_info.createdAt`,
        updatedAt: `$school_info.updatedAt`,
        oldSchoolCode: `$school_info.oldSchoolCode`,
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
  ])

  return result;

}

const getSchoolDetails = async (query) => {
  let result = [];
  let schoolInfo = await School.findOne(query);
  let interestInfo = await leadInterest.find({ schoolId: query.leadId })
  const newObj = {
    ...schoolInfo._doc,
    interest: interestInfo
  }
  result.push(newObj);
  return result
}

const updateSchoolOwner = (leadIds, params) => {
  let query = { leadId: { $in: leadIds } }
  return School.updateMany(query, params)
}

const getAllSchoolList = async () => {
  let sort = { schoolName: 1 }

  return School.find().sort(sort);
}

const updateSchool = async (params) => {
  let { leadId } = params
  return await School.findOneAndUpdate({ leadId }, params);
}

const getSchoolByLeadId = async (leadId) => {
  return await School.find({ leadId }, { contactDetails: 1 })
}

const getSchoolBySchoolCode = async (id) => {
  let query = { schoolCode: id }
  return await School.findOne(query)
}

const updateContactDetails = async (leadId, contactDetails) => {

  if (contactDetails.isPrimary == true) {
    await School.updateOne(
      { leadId },
      { $set: { "contactDetails.$[].isPrimary": false } }
    );

    const updatedSchool = await School.findOneAndUpdate(
      { leadId },
      {
        $push: {
          "contactDetails": {
            ...contactDetails,
            isPrimary: contactDetails?.isPrimary
          }
        }
      },
      { new: true }
    );

    return updatedSchool;
  }
  else {
    return await School.findOneAndUpdate({ leadId }, { $push: { "contactDetails": contactDetails } }, { new: true })
  }


}


const getBdeActivities = async (leadIds) => {
  let sort = { updatedAt: -1 };

  let result = await BdeActivity.aggregate([
    { $match: { leadId: { $in: leadIds }, status: "Complete" } },
    {
      $group: {
        _id: "$startDateTime",
        callActivity: { $push: { $ifNull: ["$callActivity", null] } },
        activityDate: { $push: { $ifNull: ["$startDateTime", null] } },
        taskActivity: { $push: { $ifNull: ["$taskActivity", null] } },
        stage: { $push: { $ifNull: ["$stage", null] } },
        attendanceActivity: { $push: { $ifNull: ["$attendanceActivity", null] } },
        paymentSchedule: { $push: { $ifNull: ["$paymentSchedule", null] } },
        netMonthlyInvoicing: { $push: { $ifNull: ["$netMonthlyInvoicing", null] } },
        netRatePerUnit: { $push: { $ifNull: ["$netRatePerUnit", null] } },
        softwareContractValue: { $push: { $ifNull: ["$softwareContractValue", null] } },
        escUnit: { $push: { $ifNull: ["$escUnit", null] } },
        productType: { $push: { $ifNull: ["$productType", null] } },
        ratePerStudent: { $push: { $ifNull: ["$ratePerStudent", null] } },
        ratePerClassroom: { $push: { $ifNull: ["$ratePerClassroom", null] } },
        approvalActivity: { $push: { $ifNull: ["$approvalActivity", null] } },
        languageIssue: { $push: { $ifNull: ["$languageIssue", null] } },
        duration: { $push: { $ifNull: ["$duration", null] } },
        status: { $push: { $ifNull: ["$status", null] } },
        isRefurbished: { $push: { $ifNull: ["$isRefurbished", null] } },
        contactDetails: { $push: { $ifNull: ["$contactDetails", null] } },
        customerResponse: { $push: { $ifNull: ["$customerResponse", null] } },
        subject: { $push: { $ifNull: ["$subject", null] } },
        priority: { $push: { $ifNull: ["$priority", null] } },
        productInterest: { $push: { $ifNull: ["$productInterest", null] } },
        meetingType: { $push: { $ifNull: ["$meetingType", null] } },
        meetingDate: { $push: { $ifNull: ["$meetingDate", null] } },
        name: { $push: { $ifNull: ["$name", null] } },
        leadId: { $push: { $ifNull: ["$leadId", null] } },
        leadStage: { $push: { $ifNull: ["$leadStage", null] } },
        leadStatus: { $push: { $ifNull: ["$leadStatus", null] } },
        edc: { $push: { $ifNull: ["$edc", null] } },
        createdBy: { $push: { $ifNull: ["$createdBy", null] } },
        grossRatePerUnit: { $push: { $ifNull: ["$grossRatePerUnit", null] } },
        meetingStatus: { $push: { $ifNull: ["$meetingStatus", null] } },
        totalContractValue: { $push: { $ifNull: ["$totalContractValue", null] } },
        createdByRoleName: { $push: { $ifNull: ["$createdByRoleName", null] } },
        createdByProfileName: { $push: { $ifNull: ["$createdByProfileName", null] } },
        createdByName: { $push: { $ifNull: ["$createdByName", null] } },
        activityId: { $push: { $ifNull: ["$activityName", null] } },
        activityName: { $push: { $ifNull: ["$activityName", null] } },
        category: { $push: { $ifNull: ["$category", null] } },
        activityScore: { $push: { $ifNull: ["$activityScore", null] } },
        activityMaxScore: { $push: { $ifNull: ["$activityMaxScore", null] } },
        createdAt: { $push: { $ifNull: ["$createdAt", null] } },
        updatedAt: { $push: { $ifNull: ["$updatedAt", null] } },
        comments: { $push: { $ifNull: ["$comments", null] } },
        grades: { $push: { $ifNull: ["$grades", null] } },
        units: { $push: { $ifNull: ["$units", null] } },
        grossContractValue: { $push: { $ifNull: ["$grossContractValue", null] } },
        grossSellingPricePerStudent: { $push: { $ifNull: ["$grossSellingPricePerStudent", null] } },
        weeklyExclusiveDoubtSession: { $push: { $ifNull: ["$weeklyExclusiveDoubtSession", null] } },
        assessmentCentrePricePerStudent: { $push: { $ifNull: ["$assessmentCentrePricePerStudent", null] } },
        testPrepPackageSellingPricePerStudent: { $push: { $ifNull: ["$testPrepPackageSellingPricePerStudent", null] } },
        numberOfStudentsPerBatch: { $push: { $ifNull: ["$numberOfStudentsPerBatch", null] } },
        numberOfBatches: { $push: { $ifNull: ["$numberOfBatches", null] } },
        numberofStudent: { $push: { $ifNull: ["$numberofStudent", null] } },
        assessmentCenter: { $push: { $ifNull: ["$assessmentCenter", null] } },
        offeringType: { $push: { $ifNull: ["$offeringType", null] } },
        lectureDeliveryType: { $push: { $ifNull: ["$lectureDeliveryType", null] } },
        studentUnit: { $push: { $ifNull: ["$studentUnit", null] } },
        minutesOfMeeting: { $push: { $ifNull: ["$minutesOfMeeting", null] } },
        hardwareContractValue: { $push: { $ifNull: ["$hardwareContractValue", null] } },
        hardwareProduct: { $push: { $ifNull: ["$hardwareProduct", null] } },
        hardware: { $push: { $ifNull: ["$hardware", null] } },
        monthlyInvoice: { $push: { $ifNull: ["$monthlyInvoice", null] } },
        contactDurationInMonths: { $push: { $ifNull: ["$contactDurationInMonths", null] } },
        visitOutcome: { $push: { $ifNull: ["$visitOutcome", null] } },
        nextMeetingDate: { $push: { $ifNull: ["$followUpDateTime", null] } },
      }
    },
    {
      $sort: sort
    }
  ]);
  return result;
}

const getBdeActivity = async (leadId) => {
  let sort = { updatedAt: -1 };

  return await BdeActivity.find({ leadId }).sort(sort)
}

const getEdcCount = async (params) => {
  let { leadIds, roleName } = params
  let resultArray = [];
  for (let i = 0; i < leadIds?.length; i++) {
    let leadId = leadIds?.[i];
    let edcShiftedCount = 0;
    let edcCount = await BdeActivity.countDocuments({ leadId, createdByRoleName: roleName, status: "Complete", edc: { $ne: null } });
    resultArray.push({ edcShiftedCount, edcCount });
  }
  return resultArray;
}

const getSchoolData = async (query) => {
  const result = School.findOne(query);
  return result;
}

const getSchoolsByCode = async (params) => {
  let { schoolCodeList } = params;
  let query = {};

  if (schoolCodeList && schoolCodeList.length > 0) {
    query.schoolCode = { $in: schoolCodeList };
  }



  return School.find(query);
}

module.exports = {
  createSchool,
  countSchoolWithStateCode,
  getSchoolList,
  getSchoolDetails,
  updateSchoolOwner,
  getAllSchoolList,
  updateSchool,
  isDuplicateSchool,
  getSchoolCodeList,
  getSchoolCodeListWithOwner,
  getSchoolByLeadId,
  getSchoolBySchoolCode,
  updateContactDetails,
  getBdeActivities,
  getEdcCount,
  getBdeActivity,
  getSchoolData,
  getSchoolsByCode
}
