const customExceptions = require('../responseModels/customExceptions')

const validateGetUsersList = async (req, res, next) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let errors = []

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


const validateCreateUser = async (req, res, next) => {
    let { s_uuid, firstName, lastName, password, roleId, email, schoolCodes } = req.body
    let errors = []

    if (email) {
        req.body.email = email = email.trim().toLowerCase()
    }

    if (s_uuid) {
        req.body.s_uuid = s_uuid = s_uuid.trim().toLowerCase()
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}


const validateUserLogin = async (req, res, next) => {
    let { username, password } = req.body
    let errors = []

    if (username) {
        req.body.username = username = username.trim().toLowerCase()
    }
    if (!password) {
        let errorMessage = "Enter password"
        errors.push({ errorMessage })
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, 'Validation Error', errors))
    }

    next();
}


module.exports = {
    validateGetUsersList,
    validateCreateUser,
    validateUserLogin
}