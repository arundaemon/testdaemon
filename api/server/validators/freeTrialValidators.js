const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const createFreeTrialValidators = async (req, res, next) => {
    let errors = [];
    // console.log("req inside validators",req.body);
    const { trial_activation_request } = req.body;
    const { email } = trial_activation_request[0];
    // console.log("email inside api",email)
    // const {empcode, action, apikey,trial_activation_request} = req.body;
    // const {uuid, email, mobile, name, board_id, syllabus_id, product_id, city, state, batch_id} = trial_activation_request;
    // // let { cycleName } = req.body;
    // // let customErrorMessage = ""

    if (!email) {
        let errorMessage = customErrorMessage = 'Email is not Present for lead. So you cannot apply ';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}

module.exports = {
    createFreeTrialValidators
}