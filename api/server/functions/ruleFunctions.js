
const ruleControls = require('../controllers/ruleControls')
const customExceptions = require('../responseModels/customExceptions')

const createRule = async (params) => {
    return ruleControls.findOneByKey({ ruleName: params.ruleName, isDeleted: false })
        .then(ruleExist => {
            if (ruleExist)
                throw { errorMessage: "Rule With This Name Already Exist" }

            return ruleControls.createRule(params)
        })
        .then(result => {
            return { message: `Rule Created Successfully!`, result }
        })
        .catch(error => {
            throw error
        })
}


const updateRule = async (params) => {
    return ruleControls.findOneByKey({ _id: { $ne: params.ruleId }, ruleName: params.ruleName, isDeleted: false })
        .then(ruleExist => {
            if (ruleExist)
                throw { errorMessage: "Rule With This Name Already Exist" }

            return ruleControls.updateRule(params)
        })
        .then(result => {
            return { message: `Rule Updated Successfully!`, result }
        })
        .catch(error => {
            throw error
        })
}


const deleteRule = async (params) => {
    return ruleControls.deleteRule(params)
        .then(result => {
            return { message: `Rule Deleted Successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getRuleList = async (params) => {
    let RuleList = ruleControls.getRuleList(params)
    //let RuleListCount = ruleControls.getRuleListCount(params)

    return Promise.all([RuleList])
        .then(response => {
            let [result] = response
            return { message: 'Rule List', result }
        })
}


const getRuleDetails = async (params) => {
    return ruleControls.findOneByKey({ _id: params.ruleId })
        .then(result => {
            return { message: `Rule Details!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getRulesByRole = async (params) => {
    let { tokenPayload } = params

    return ruleControls.findManyByKey({ 'rolesLinked.role_name': { $in: [tokenPayload.crm_role] } })
        .then(result => {
            return { message: `Rule Details!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    createRule,
    updateRule,
    deleteRule,
    getRuleList,
    getRuleDetails,
    getRulesByRole
}