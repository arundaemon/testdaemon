import CryptoJS from "crypto-js";
import Config from '../config/settings'

export const EncryptData = (dataObj) => {
    //console.log('Encrypt',dataObj)
    if (dataObj === 'null' || dataObj === null || dataObj === undefined || dataObj === 'undefined') {
        return dataObj
    }

    return CryptoJS.AES.encrypt(JSON.stringify(dataObj), Config.LOCAL_ENCRYPTION_SECRET).toString();
}

export const DecryptData = (ciphertext) => {

    if (ciphertext === 'null' || ciphertext === null || ciphertext === undefined || ciphertext === 'undefined') {
        return ciphertext
    }

    try {
        var decryptedData = CryptoJS.AES.decrypt(ciphertext, Config.LOCAL_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData)
    }
    catch (err){
        return ciphertext
    }
}