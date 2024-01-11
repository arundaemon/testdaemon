const SchoolLogs = require('../models/schoolLogsModel')

const createSchoolLogs = async (params) => {
  return SchoolLogs.create(params);
}

module.exports = {
  createSchoolLogs,
}