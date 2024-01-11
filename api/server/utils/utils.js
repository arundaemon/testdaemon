const crypto = require('crypto')
const { CubejsApi } = require('@cubejs-client/core');
const AppConfig = require('../config');
const ObjectId = require('mongoose').Types.ObjectId;
const CryptoJS = require("crypto-js")

const EncryptData = (dataObj) => {
    if (dataObj === 'null' || dataObj === null || dataObj === undefined || dataObj === 'undefined') {
        return dataObj
    }
    return CryptoJS.AES.encrypt(JSON.stringify(dataObj), AppConfig.cfg.LOCAL_ENCRYPTION_SECRET).toString();
}

const DecryptData = (ciphertext) => {
    if (ciphertext === 'null' || ciphertext === null || ciphertext === undefined || ciphertext === 'undefined') {
        return ciphertext
    }
    try {
        var decryptedData = CryptoJS.AES.decrypt(ciphertext, AppConfig.cfg.LOCAL_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData)
    }
    catch (err){
      //console.log(err)
      return ciphertext
    }
}

const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach((key,index) => {
    if(index == 0){
      r.push(obj);
    }
    const value = obj[key];
    if (key === searchKey) {
      r.push(value);
      if (Object.keys(value).indexOf(searchKey) > 0) {
        recursiveSearch(value, searchKey, r);
      }
    }
  });
  return r;
};

const isValidDate = (date) => {
  if (Date.parse(date.toString())) {
    return true;
  }
  else {
    return false;
  }
}

const isEmptyValue = (keyValue) => {
  if (keyValue === null || keyValue === 'null' || keyValue === undefined || keyValue === 'undefined' || keyValue === '') {
    return true
  }
  else {
    return false
  }
}

const toCamelCase = (s, dataset = false) => {
  let n = s.length;
  let str = "";
  for (let i = 0; i < n; i++) {
    if (dataset && i == 0) {
      str += s[i].toUpperCase();
    }
    else {
      if (s[i] == ' ' || s[i] == '_' || s[i] == '-') {
        str += s[i + 1].toUpperCase();
        i++;
      }
      else {
        str += s[i];
      }
    }
  }
  return str;
}


const isBoolean = (str) => {
  if (str === 'true' || str === true || str === 'false' || str === false)
    return true
  else
    return false
}

const getCubeInstance = (token) => {
  return new CubejsApi(token, {
    apiUrl: `${AppConfig.cfg.CUBE_API_URL}/cubejs-api/v1`,
  });
}

const isValidMongoId = (_id) => {
  return ObjectId.isValid(_id)
}

const convertToMongoId = (_id) => {
  return ObjectId(_id)
}

const createPasswordHash = (pwd) => {
  return crypto.pbkdf2Sync(pwd, AppConfig.cfg.USER_PASSWORD_SALT, 100, 36, `sha512`).toString(`hex`)
}

const isNullOrUndefined = (val) => {
  if (val === null || val === 'null' || val === undefined || val === 'undefined') {
    return true
  }
  else {
    return false
  }

}

const encryptData = (data) => {
  const algorithm = "aes-256-cbc";
  const initVector = AppConfig.cfg.DB_PASSWORD_VECTOR
  const securityKey = AppConfig.cfg.DB_PASSWORD_KEY
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData
}

const decryptData = (encryptedData) => {
  const algorithm = "aes-256-cbc";
  const initVector = AppConfig.cfg.DB_PASSWORD_VECTOR
  const securityKey = AppConfig.cfg.DB_PASSWORD_KEY

  try {
    const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData
  }
  catch (error) {
    return encryptedData
  }
}

const getRandomNumber = (str) => {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateRandomIncrementalNumber = (code) => {
  const randomIncrement = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const output = `${code}_${randomIncrement}`;
  return output;
}


module.exports = {
  isValidDate, isEmptyValue, toCamelCase, isBoolean,
  isValidMongoId, createPasswordHash, isNullOrUndefined,
  encryptData, decryptData, convertToMongoId, EncryptData, DecryptData,getCubeInstance,
  recursiveSearch,getRandomNumber,generateRandomIncrementalNumber
};



