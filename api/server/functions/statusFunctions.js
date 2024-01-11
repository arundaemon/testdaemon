const statusControls = require('../controllers/statusControls');
const stageControls = require('../controllers/stageControls');
const customExceptions = require('../responseModels/customExceptions')
const { convertToMongoId } = require('../utils/utils');

const createStatus = async (params) => {
    return statusControls.findOneByKey({ statusName: params.statusName, isDeleted: false })
        .then(data => {
            if (data) {
                throw customExceptions.statusExists()
            }
            return statusControls.createStatus(params)
        })
        .then(result => {
            let stageQuery = { _id: params.stageId }
            let stageUpdate = { $addToSet: { linkedStatus: result._id } }

            return Promise.all([result, stageControls.updateManyByKey(stageQuery, stageUpdate)])
        })
        .then(res => {
            let [result, updatedStage] = res
            return { message: 'Status created successfully', result, updatedStage }
        })
        .catch(error => {
            throw error
        })
}

const updateStatus = async (params) => {
    return statusControls.updateStatus(params)
        .then(data => {
            return { message: 'Status updated successfully', data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getStatusList = async (params) => {
    let StatusList = statusControls.getStatusList(params);
    return Promise.all([StatusList])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Status List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}

const getAllStatus = async (params) => {
    return statusControls.getAllStatus(params)
        .then(result => {
            return { message: 'Status List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteStatus = async (params) => {
    let { _id } = params

    return statusControls.deleteStatus(params)
        .then(async result => {
            try {
                let statusQuery = { _id }
                let statusUpdate = { $unset: { stageId: 1 } }
                await updateStatusByKey(statusQuery, statusUpdate)

                let stageQuery = { _id: result.stageId }
                let stageUpdate = { $pull: { linkedStatus: _id } }
                await stageControls.updateManyByKey(stageQuery, stageUpdate)
            }
            catch (err) {
                throw err
            }
            return { message: `Status deleted successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const changeStatus = async (_id, status,modifiedBy) => {
    return statusControls.changeStatus(_id, status,modifiedBy)
        .then(async result => {
            try {
                // On Inactive remove all mapping
                if (status === 0) {
                    let statusQuery = { _id }
                    let statusUpdate = { $unset: { stageId: 1 } }
                    await updateStatusByKey(statusQuery, statusUpdate)

                    let stageQuery = { _id: result.stageId }
                    let stageUpdate = { $pull: { linkedStatus: _id } }
                    await stageControls.updateManyByKey(stageQuery, stageUpdate)
                }
            }
            catch (err) {
                throw err
            }

            return { message: `Status changed`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}

const getStatusDetails = async (id) => {
    return statusControls.getStatusDetails(id)
        .then(result => {
            return { message: `Status details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const isDuplicateStatus = async (statusName) => {
    return statusControls.isDuplicateStatus(statusName)
        .then(result => {
            if (result) {
                throw customExceptions.statusExists()
            }
            return { message: 'Success', result }

        })
        .catch(error => {
            throw { errorMessage: error }
        })
}


const mapStatusesWithStage = async (params) => {
    let stageQuery = { _id: params.stageId }
    let stageUpdate = { linkedStatus: params.linkedStatus }

    let statusQuery = { _id: { $in: params.linkedStatus } }
    let statusUpdate = { stageId: params.stageId }

    return Promise.all([statusControls.updateManyByKey(statusQuery, statusUpdate), stageControls.updateManyByKey(stageQuery, stageUpdate)])
        .then(response => {
            let [result, cycleRes] = response
            return { message: 'Stage Updated Successfully', result }
        })
        .catch(error => {
            throw error
        })
}


const unMapAvailableStatus = async (params) => {
    let { stageId, freeStatus } = params
    let freeStatusIds = freeStatus.map(cycleObj => convertToMongoId(cycleObj?._id))

    let stageQuery = { _id: stageId }
    let stageUpdate = { $pullAll: { linkedStatus: [freeStatusIds] } }

    let statusQuery = { _id: { $in: freeStatusIds } }
    let statusUpdate = { $unset: { stageId: 1 } }

    return Promise.all([statusControls.updateManyByKey(statusQuery, statusUpdate), stageControls.updateManyByKey(stageQuery, stageUpdate)])
        .then(response => {
            let [result, stageRes] = response
            return { message: 'Stage Updated Successfully', result, stageRes }
        })
        .catch(error => {
            throw error
        })
}

const updateStatusByKey = async (query, update) => {
    return statusControls.updateStatusByKey(query, update)
}

module.exports = {
    createStatus,
    updateStatus,
    getAllStatus,
    getStatusList,
    deleteStatus,
    changeStatus,
    getStatusDetails,
    isDuplicateStatus,
    mapStatusesWithStage,
    unMapAvailableStatus,
    updateStatusByKey
}