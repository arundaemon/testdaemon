const _ = require('lodash')
//var defaultConfig = require('./config')
var dbConnection = require('./dbConnection')
var cfg = {};
//console.log(process.env,process.env.env)
var environment = process.env.NODE_ENV || 'local';

var defaultEnvConfig = {
    USER_PASSWORD_SALT: 'gf%$#vFD543@',
    DB_PASSWORD_KEY: 'PHmMFNGxGiSKJJ#tMuKpnr#tN@jNWy1h',
    DB_PASSWORD_VECTOR: 'tK8*OW#dIsh2tYhd',
    TOKEN_SECRET: 'gf%$#vFD543@',
}

// ENV Config
switch (environment) {
    case 'local':
    case 'localhost':
        envConfig = require('./env/local.js');
        break;
    case 'dev':
        envConfig = require('./env/dev');
        break;
    case 'test':
        envConfig = require('./env/test');
        break;
    case 'prod':
        envConfig = require('./env/prod');
        break;
    case 'uat':
        envConfig = require('./env/staging');
        break;
    default:
        envConfig = require('./env/local.js');
        break;
}

// Create Final Config JSON by extending env from default
cfg = _.extend(defaultEnvConfig, envConfig);

// ========================== Export Module Start ==========================
module.exports = {
    cfg,
    dbConnection
}
// ========================== Export Module End ============================
