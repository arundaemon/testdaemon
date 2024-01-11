const target = require('../models/targetModel');
const leadInterest = require('../models/leadInterestModel');
const utils = require('../utils/utils');
const { response } = require('express');
const { updateLeadAssign } = require('./leadAssignControl');

const addTarget = async (data, targetMonth, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid) => {
  let promises = []
  for (let dataObj of data) {
    let query = {}
    let update = {}

    query.roleName = dataObj?.['Role Name']
    query.targetMonth = targetMonth
    query.productName = dataObj?.['Product']

    update.profileName = dataObj?.['Profile Name']
    update.productName = dataObj?.['Product']
    update.displayName = dataObj?.['Employee Name']
    update.userName = dataObj?.['Employee Code']
    update.targetUnit = dataObj?.['Monthly Units']
    update.targetAmount = dataObj?.['Monthly Target Value']
    update.roleName = dataObj?.['Role Name']
    update.targetMonth = targetMonth
    update.createdBy = createdBy
    update.modifiedBy = modifiedBy
    update.createdBy_Uuid = createdBy_Uuid
    update.modifiedBy_Uuid = modifiedBy_Uuid

    let options = { new: true, upsert: true }
    let response = target.findOneAndUpdate(query, update, options);
    promises.push(response)
  }
  return Promise.allSettled(promises)
}

const finalTargetList = (result, mappedData) => {
  const combinedData = [];

  for (let i = 0; i < result.length; i++) {
    const id = result[i]._id;
    let obj2 = mappedData.find(obj => obj._id === id) || {};

    if (!obj2.hotsValue) {
      obj2.hotsValue = 0;
    }
    if (!obj2.pipelineValue) {
      obj2.pipelineValue = 0;
    }
    const mergedObj = { ...result[i], ...obj2 };
    combinedData.push(mergedObj);
  }

  // console.log(combinedData,'.............................combined data');
  return combinedData;
}



const getTargetList = async (params) => {
  let { childList, startDate, endDate } = params
  let query = {}
  let childRolesNames = childList?.map((roleObj) => roleObj?.roleName)
  query.roleName = { $in: childRolesNames }

  if (startDate && endDate) {
    query.targetMonth = { $gte: new Date(startDate), $lte: new Date(endDate) }
  }

  let result = await target.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$roleName",
        firstRecord: { $first: "$$ROOT" },
        targetAmount: { $sum: "$targetAmount" },
      }
    },
  ]);

  for (let i = 0; i < childList?.length; i++) {
    let roleName = childList[i]?.roleName;
    let found = result?.some(item => item?._id == roleName);
    if (!found) {
      const newObj = {
        _id: roleName,
        firstRecord: {
          ...childList?.[i],
          targetAmount: "NA"
        },
        targetAmount: "NA"
      };
      result.push(newObj);
    }
  }

  result?.forEach((item) => {
    if (typeof item?.targetAmount === "number") {
      item.targetAmount = roundToTwoDecimalPlaces(item?.targetAmount);
    }
  });

  return result;
}

const updateTargetDetails = async (params) => {
  let { productName, roleName, targetAmount, startDate, endDate, modifiedBy, modifiedBy_Uuid } = params
  let updateQuery = {
    $and: [
      { targetMonth: { $gte: startDate } },
      { targetMonth: { $lte: endDate } },
      { productName },
      { roleName },
      { modifiedBy },
      { modifiedBy_Uuid }

    ]
  };
  let updateOperation = {
    $set: {
      targetAmount,
    }
  }

  let result = await target.updateMany(updateQuery, updateOperation)
  return result
}

const getRoleNameProducts = async (params) => {
  let { roleName, startDate, endDate } = params;
  let query = { roleName };
  if (startDate && endDate) {
    query.targetMonth = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  let result = await target.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$productName",
        firstRecord: { $first: "$$ROOT" },
        targetAmount: { $sum: "$targetAmount" },
      },
    },
  ]);

  result?.forEach((item) => {
    if (typeof item?.targetAmount === "number") {
      item.targetAmount = roundToTwoDecimalPlaces(item?.targetAmount);
    }
  });

  return result;
};


const assignTargets = async (params) => {
  return await target.insertMany(params)
}

const roundToTwoDecimalPlaces = (number) => {
  return Math.round(number * 100) / 100;
};

module.exports = {
  addTarget,
  getTargetList,
  getRoleNameProducts,
  updateTargetDetails,
  assignTargets
}