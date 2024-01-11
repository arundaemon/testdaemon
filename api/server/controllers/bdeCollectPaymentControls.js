const bdeCollectPaymentModel = require("../models/bdeCollectPaymentModel");


const createBdeCollectPaymentActivity = async (params) => {
    return bdeCollectPaymentModel.create(params);
}

module.exports = {
    createBdeCollectPaymentActivity
}