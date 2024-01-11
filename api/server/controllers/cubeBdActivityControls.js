const CubeBdActivities = require('../models/cubeBdActivitiesModel')


const createCubeBDActivity = async (params) => {

  return CubeBdActivities.create(params)
}

const findByKey = async (query, populate) => {
  return CubeBdActivities.find(query).populate(populate)
}

module.exports ={
  createCubeBDActivity,
  findByKey
}