const { ObjectId } = require('mongodb');
const Territory = require('../models/territoryMappingModel');
const utils = require('../utils/utils');

const createTerritory = async (params) => {
  try {
    const result = await Territory.insertMany(params);
    return result;
  }
  catch (err) {
    throw { errorMessage: err }
  }
}

const isDuplicateTerritoryByCityName = async (stateName, stateCode, cityName, cityCode) => {
  let query = { stateName, stateCode, cityName, cityCode }
  let data = await Territory.find(query);
  return data
}
const isDuplicateTerritory = async (territoryName) => {
  let query = { territoryName }
  let data = await Territory.findOne(query);
  return data
}

const getTerritoryList = async (params) => {
  let { pageNo, count, sortKey, sortOrder, search } = params
  let sort = { createdAt: -1 }
  let query = {}
  if (search) {
    query = {
      ...query,
      $or: [
        { territoryName: { $regex: search, $options: 'i' } },
        { modifiedBy: { $regex: search, $options: 'i' } },
        { territoryCode: { $regex: search, $options: 'i' } },
      ]
    }
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

  const result = Territory.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$territoryCode",
        territoryName: { $first: "$territoryName" },
        territoryCode: { $first: "$territoryCode" },
        modifiedBy: { $first: "$modifiedBy" },
        updatedAt: { $first: '$updatedAt' },
        createdAt: { $first: '$createdAt' },
        status: { $first: '$status' }
      }
    },
    { $sort: sort }

  ]);

  result.skip(pageNo * count).limit(count)
  return result
}

const getTerritoryListCount = async () => {
  try {
    const uniqueTerritoryCodes = await Territory.countDocuments({}).distinct("territoryCode");
    const count = uniqueTerritoryCodes.length + 1;
    let totalDigits = count.toString().length;
    let code;
    if (totalDigits < 2) {
      code = "TR00" + count
    }
    else if (totalDigits < 3) {
      code = "TR0" + count
    }
    else {
      code = "TR" + count
    }
    return code
  } catch (error) {
    console.error(error);
  }
}

const updateTerritory = async (params) => {
  let id = params?.[0]?.territoryCode
  const deleteData = await Territory.deleteMany({ territoryCode: id })
  return createTerritory(params)
}

const getTerritoryDetails = async (id) => {
  return Territory.find({ territoryCode: id });
}

const getTerritoryDetailsByCity = async (city) => {
  let data = await Territory.findOne({ citiesTagged: city })
  return { territoryCode: data?.territoryCode, territoryName: data?.territoryName }
}

const getTerritory = async (params) => {
  let query = {
    stateCode: params?.stateCode,
  }
  if (params?.cityName) {
    query.cityName = params?.cityName
  }
  return Territory.findOne(query);
}

const getTerritoryByCode = async (params) => {
  let { territoryCodeList } = params;
  let query = {};

  if (territoryCodeList && territoryCodeList.length > 0) {
    query.territoryCode = { $in: territoryCodeList };
  }

  const distinctTerritories = await Territory.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          territoryCode: '$territoryCode',
        },
        territoryName: { $first: "$territoryName" }
      },

    },
    {
      $project: {
        _id: 0, // Exclude _id field
        territoryCode: '$_id.territoryCode',
        territoryName: '$territoryName'
      }
    },
  ]);
  return distinctTerritories;
}

module.exports = {
  createTerritory,
  getTerritoryList,
  getTerritoryDetails,
  updateTerritory,
  isDuplicateTerritory,
  getTerritoryListCount,
  getTerritoryDetailsByCity,
  isDuplicateTerritoryByCityName,
  getTerritory,
  getTerritoryByCode
}