
const userControls = require('../controllers/userControls')
const menusFunctions = require('../functions/menusFunctions')
const { createPasswordHash } = require('../utils/utils')
const { TOKEN_EXPIRY } = require('../constants/dbConstants')
const EnvConfig = require('../config').cfg
const customExceptions = require('../responseModels/customExceptions')
const jwt = require('jsonwebtoken');

const generateUserToken = async (params) => {
    let tokenPayload = { crm_profile: [params.crm_profile] ?? 'NO_ROLE' }

    let GetRoleAssignedMenus = await menusFunctions?.getAllSideBarMenus({ tokenPayload })

    let menusAllowed = []

    GetRoleAssignedMenus?.map(routeObj => {
        menusAllowed.push({ name: routeObj?.name, route: routeObj?.route })
    })

    let UserToken = jwt.sign(params, EnvConfig.TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY });
    return { result: { UserToken, menusAllowed } }
}


const createUser = async (params) => {
    let findUserSuuid
    let findUserEmail

    if (params.s_uuid)
        findUserSuuid = userControls.findOneByKey({ s_uuid: params.s_uuid, isDeleted: false })

    if (params.email)
        findUserEmail = userControls.findOneByKey({ email: params.email, isDeleted: false })


    let [suuidExist, emailExist] = await Promise.all([findUserSuuid, findUserEmail])

    if (suuidExist) {
        throw customExceptions.userKeyExist('Employee Code')
    }
    else if (emailExist) {
        throw customExceptions.userKeyExist('Email')
    }

    params.password = createPasswordHash(params.password)
    return userControls.addUser(params)
        .then(result => {
            return { message: `User created successfully!`, result }
        })
}


const userLogin = async (params) => {
    let findUserQuery = { $or: [{ s_uuid: params.username }, { email: params.username }] }
    let userExist = await userControls.findOneByKey(findUserQuery)

    if (!userExist)
        throw customExceptions.userUuidDontExist()

    params.password = createPasswordHash(params.password)


    findUserQuery.password = params.password
    findUserQuery.isDeleted = false

    return userControls.findOneByKey(findUserQuery)
        .then(async UserData => {
            if (!UserData)
                throw customExceptions.wrongCredentials()

            if (UserData.status === 0)
                throw customExceptions.userDeactivated()

            let tokenObj = {
                uuid: UserData.s_uuid,
                s_uuid: UserData.s_uuid,
                role: UserData.role
            }

            if (UserData.email) {
                tokenObj.email = UserData.email
            }

            if (UserData.schoolCodes) {
                tokenObj.school_code = UserData.schoolCodes
            }

            if (UserData.roleId) {
                tokenObj.roleId = UserData.roleId
            }


            let userToken = await getToken(tokenObj)
            return { message: 'Logged In Successfully', userData: UserData, ...userToken }
        })
}

const findOneByKey = async (query) => {
    return userControls.findOneByKey(query)
}


const getUsersList = async (params) => {
    let { search, pageNo, count, sortKey, sortOrder } = params

    let UserList = userControls.getUsersList({ search, pageNo, count, sortKey, sortOrder })
    let TotalUserCount = userControls.getUsersListCount(params)
    let [result, totalCount] = await Promise.all([UserList, TotalUserCount])

    result.map(roleObj => {
        roleObj.roleDetails = { ...roleObj.roleId }
        return roleObj.roleId = roleObj.roleId._id
    })

    return { message: 'User Type!', result, totalCount }
}


const updateUser = async (params) => {
    let { userId } = params;
    let findUserSuuid
    let findUserEmail

    if (params.s_uuid)
        findUserSuuid = userControls.findOneByKey({ s_uuid: params.s_uuid, isDeleted: false, _id: { $ne: userId } })

    if (params.email)
        findUserEmail = userControls.findOneByKey({ email: params.email, isDeleted: false, _id: { $ne: userId } })


    let [suuidExist, emailExist] = await Promise.all([findUserSuuid, findUserEmail])

    if (suuidExist) {
        throw customExceptions.userKeyExist('Employee Code')
    }
    else if (emailExist) {
        throw customExceptions.userKeyExist('Email')
    }

    if (params.password) {
        params.password = createPasswordHash(params.password)
    }

    let result = await userControls.updateUser(params);
    return { message: 'User Details Updated Successfully!', result }
}


const deleteUser = async (params) => {
    let result = await userControls.deleteUser(params);
    return { message: 'User Deleted Successfully!', result }
}


module.exports = {
    findOneByKey,
    createUser,
    userLogin,
    getUsersList,
    updateUser,
    deleteUser,
    generateUserToken
}