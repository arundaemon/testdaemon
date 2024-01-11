const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

const saveBannerValidator = async (req, res, next) => {
    let errors = [];
    let { webBanner, appBanner } = req?.files
    let { appBannerDetails, webBannerDetails } = req.body

    if (!webBanner) {
        let errorMessage = 'Web Banner Is Required';
        errors.push({ errorMessage });
    }

    if (!appBanner) {
        let errorMessage = 'App Banner Is Required';
        errors.push({ errorMessage });
    }

    if (!webBannerDetails) {
        let errorMessage = 'Web Banner Details Is Required';
        errors.push({ errorMessage });
    }

    if (!appBannerDetails) {
        let errorMessage = 'App Banner Details Is Required';
        errors.push({ errorMessage });
    }


    if (webBannerDetails)
        req.body.webBannerDetails = webBannerDetails = JSON.parse(webBannerDetails)

    if (appBannerDetails)
        req.body.appBannerDetails = appBannerDetails = JSON.parse(appBannerDetails)


    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}



const updateBannerValidator = async (req, res, next) => {
    let errors = [];
    let { appBannerDetails, webBannerDetails, bannerName, priority, startDate, endDate } = req.body

    if (!bannerName) {
        let errorMessage = 'Banner Name Is Required';
        errors.push({ errorMessage });
    }

    if (!priority) {
        let errorMessage = 'priority Is Required';
        errors.push({ errorMessage });
    }

    if (!startDate) {
        let errorMessage = 'startDate Is Required';
        errors.push({ errorMessage });
    }

    if (!endDate) {
        let errorMessage = 'endDate Is Required';
        errors.push({ errorMessage });
    }

    if (!webBannerDetails) {
        let errorMessage = 'Web Banner Details Is Required';
        errors.push({ errorMessage });
    }

    if (!appBannerDetails) {
        let errorMessage = 'App Banner Details Is Required';
        errors.push({ errorMessage });
    }

    if (webBannerDetails)
        req.body.webBannerDetails = webBannerDetails = JSON.parse(webBannerDetails)

    if (appBannerDetails)
        req.body.appBannerDetails = appBannerDetails = JSON.parse(appBannerDetails)


    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}


const deleteBannerValidator = async (req, res, next) => {
    let errors = [];
    let { bannerId } = req.body

    if (!bannerId) {
        let errorMessage = 'Banner Id Is Required';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}


const getBannersListValidator = async (req, res, next) => {
    let { pageNo, count } = req.query
    let errors = [];

    if (pageNo) {
        req.query.pageNo = pageNo = Number(pageNo)
    }

    if (count) {
        req.query.count = count = Number(count)
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}



module.exports = {
    saveBannerValidator,
    deleteBannerValidator,
    getBannersListValidator,
    updateBannerValidator,
}