const AlertNotification = require('../models/alertNotificationModel.js');

const createAlertNotification = async (alerts) => {
    const createdAlerts = [];
    for (let i = 0; i < alerts.length; i++) {
        try {
            const createdAlert = await AlertNotification.create(alerts[i]);
            createdAlerts.push(createdAlert);
        } catch (error) {
            return new Promise((resolve, reject) => reject('Error while creating alertNotification'))  
        }
    }
    return createdAlerts;
}

const updateAlertNotificationStatus = async (params) => {
    if(!params._id){
        return new Promise((resolve, reject) => reject('Please provide Notification Id!'))
    }
    let query = {
        _id: params._id
    }
    let update = {
        status: true,
    }
    let options = { new: true };
    const result = await AlertNotification.findByIdAndUpdate(query, update, options);
    return result;
}

const getAlertNotification = async (params) => {
    let { empCode } = params;
    let sort = { createdAt: -1 };
    if(empCode){
        let today = new Date().toISOString().split('T')[0]; 
        let query = { 
            empCode: { $regex: empCode, $options: "i" },
            status: false,
            notificationDate: { $lte: today }
        };
        const result = await AlertNotification.find(query).sort(sort);
        return result
    } else {
        return new Promise((resolve,reject) => reject('Please provide empCode'))
    }

}


module.exports = {
    createAlertNotification,
    getAlertNotification,
    updateAlertNotificationStatus
}
