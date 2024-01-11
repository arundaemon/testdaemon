const Cloud = require('@google-cloud/storage')
let EnvConfig = require('../config/env').envConfig
const path = require('path');

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: path.join(__dirname, '..', 'config', EnvConfig.GCP_KEY_FILE_NAME),
  projectId: EnvConfig.GCP_PROJECT_ID,
})

module.exports = storage