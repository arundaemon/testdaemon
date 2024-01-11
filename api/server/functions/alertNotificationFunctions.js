const alertNotificationControls = require('../controllers/alertNotificationControls');

const createAlertNotification = async (params) => {
    return alertNotificationControls.createAlertNotification(params)
        .then(result => {
            return { message: `Alert Created Successfully`, result }
        }).catch(( error) => {
            throw { errorMessage: error}
        }) 
}

const updateAlertNotificationStatus = async (params) => {
    return alertNotificationControls.updateAlertNotificationStatus(params)
        .then(result => {
            return { message: `Alert Status Updated Successfully`, result }
        }).catch(( error) => {
            throw { errorMessage: error}
        })
}

const getAlertNotification = async (params) => {
    return alertNotificationControls.getAlertNotification(params)
        .then((result) => {
            return { message: "Alerts Fetched Successfully", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
}


module.exports = {
    createAlertNotification,
    getAlertNotification,
    updateAlertNotificationStatus
}