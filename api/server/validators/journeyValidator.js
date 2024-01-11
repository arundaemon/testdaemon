const customExceptions = require('../responseModels/customExceptions')

const validateGetJourneyList = async (req, res, next) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
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
    validateGetJourneyList,
}