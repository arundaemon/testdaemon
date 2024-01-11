const leadOwnerLogs = require('../models/leadOwnerLogsModel')
const mongoose = require('mongoose');

const createLeadOwnerLogs = async (params) => {
  return leadOwnerLogs.create(params);
}

const createManyLeadOwnerLogs = async (params) => {
  return leadOwnerLogs.insertMany(params);
}

module.exports = {
  createLeadOwnerLogs,
  createManyLeadOwnerLogs
}