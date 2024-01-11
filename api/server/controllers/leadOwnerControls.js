const leadOwner = require('../models/leadOwnerModel')
const leadOwnerLogsControls = require('../controllers/leadOwnerLogsControls')
const mongoose = require('mongoose');

const createLeadOwner = async (params) => {
  return leadOwner.create(params);
}
const createManyLeadOwner = async (params) => {
  return leadOwner.insertMany(params);
}
const updateLeadOwner = async (leadIds, params) => {
  let leadOwnerLogs = leadIds.map(leadId => {
    leadOwnerLogsControls.createLeadOwnerLogs({ leadId, params })
  })
  let query = { leadId: { $in: leadIds } };
  return leadOwner.updateMany(query, params)
}

const updateLeadInterestOwner = async (query, params) => {
  return leadOwner.updateOne(query, params)
}


module.exports = {
  createLeadOwner,
  updateLeadOwner,
  createManyLeadOwner,
  updateLeadInterestOwner
}