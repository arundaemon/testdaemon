const configControls = require("../controllers/configControls");

const createConfig = async (params) => {    
    return configControls.createConfigData(params)
        .then(data => {
            return { message: `Config created successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getConfig = async () => {    
    return configControls.getConfigData()
        .then(data => {
            // console.log("data after fetch",data)
            return { message: `Config fetched successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updateConfig = async (params) => {
    return configControls.updateConfig(params)
        .then(data => {
            return { message: `Config updated successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getAppVersion = async () => {
    return configControls.getAppVersion()
        .then(data => {
            //console.log("data after fetch",data)
            return { message: `App Version`, version:data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    getConfig,
    createConfig,
    updateConfig,
    getAppVersion
}