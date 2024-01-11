const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let AlertNotification;
let alertNotificationSchema = new mongoose.Schema({

    title: { type: String, trim: true },
    description: { type: String, trim: true },
    redirectLink: { type: String, trim: true},
    empCode: { type: Array, trim: true },
    status: { type: Boolean, default: false },
    notificationDate: { type: String, trim: true },

},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

module.exports = AlertNotification = mongoose.model(DB_MODEL_REF.ALERTNOTIFICATION, alertNotificationSchema);