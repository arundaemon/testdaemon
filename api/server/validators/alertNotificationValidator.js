const customExceptions = require('../responseModels/customExceptions');


const createAlertNotificationValidator = async (req, res, next) => {
    let errors = [];
    const arrayOfObjects = req.body;
    arrayOfObjects.forEach((object, index) => {
        if (!object?.empCode) {
            let errorMessage = `empCode is required in alert ${index+1}!`;
            errors.push({ errorMessage });
        }
        if (!object.title) {
            let errorMessage = `Title is required in alert ${index+1}!`;
            errors.push({ errorMessage });
        }
        if (!object.description) {
            let errorMessage = `Description is required in alert ${index+1}!`;
            errors.push({ errorMessage });
        }
        if (!object.redirectLink) {
            let errorMessage = `RedirectLink is required in alert ${index+1}!`;
            errors.push({ errorMessage });
        }
        if (!object.notificationDate) {
            let errorMessage = `NotificationDate is required in alert ${index+1}!`;
            errors.push({ errorMessage });
        }
    });
    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, ('Validation Error'), errors));
    }
    next();
}

module.exports = {
    createAlertNotificationValidator,
}