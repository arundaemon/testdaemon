const _ = require('lodash')

const dotenv = require('dotenv');
dotenv.config();

let environment = process.env.NODE_ENV || 'local';
let envConfig = {}
// ENV Config

switch (environment) {
    case 'local':
    case 'localhost':
        envConfig = require('./local');
        break;
    case 'test':
        envConfig = require('./test');
        break;
    case 'prod':
        envConfig = require('./prod');
        break;
    case 'dev':
        envConfig = require('./dev');
        break;
    case 'uat':
        envConfig = require('./staging');
        break;
    default:
        envConfig = require('./local');
        break;
}


// ========================== Export Module Start ==========================
module.exports = {
    envConfig
}
// ========================== Export Module End ============================
