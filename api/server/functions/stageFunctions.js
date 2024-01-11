const stageControls = require('../controllers/stageControls');
const cycleControls = require('../controllers/cycleControls');
const statusControls = require('../controllers/statusControls');
const customExceptions = require('../responseModels/customExceptions')
const { convertToMongoId } = require('../utils/utils');

const createStage = async (params) => {

    let stageName = { $regex: params.stageName, $options: 'i' }

    return stageControls.findOneByKey({ stageName: stageName, isDeleted: false })
        .then(data => {
            if (data) {
                throw { errorMessage: "Stage already exist." }
                // throw customExceptions.stageExists()
            }

            return stageControls.createStage(params)
        })
        .then(result => {
            return { message: 'Stage Created Successfully', result }
        })
        .catch(error => {
            throw error
        })
}

const updateStage = async (params) => {
    return stageControls.findOneByKey({ stageName: params.stageName, isDeleted: false, _id: { $ne: params._id } })
        .then(data => {
            if (data) {
                throw customExceptions.stageExists()
            }

            let cycleQuery = { _id: params.cycleId }
            let cycleUpdate = { linkedStage: params.linkedStage }
            return Promise.all([stageControls.updateStage(params), cycleControls.updateCycleByKey(cycleQuery, cycleUpdate)])
        })
        .then(response => {
            let [result, cycleRes] = response
            return { message: 'Stage Updated Successfully', result }
        })
        .catch(error => {
            throw error
        })
}

const mapStagesWithCycle = async (params) => {
    let cycleQuery = { _id: params.cycleId }
    let cycleUpdate = { linkedStage: params.linkedStage }

    let stageQuery = { _id: { $in: params.linkedStage } }
    let stageUpdate = { cycleId: params.cycleId }

    return Promise.all([stageControls.updateManyByKey(stageQuery, stageUpdate), cycleControls.updateCycleByKey(cycleQuery, cycleUpdate)])
        .then(response => {
            let [result, cycleRes] = response
            return { message: 'Stage Updated Successfully', result }
        })
        .catch(error => {
            throw error
        })
}


const unMapAvailableStage = async (params) => {
    let { cycleId, freeStages } = params
    let freeStageIds = freeStages.map(cycleObj => convertToMongoId(cycleObj?._id))

    let cycleQuery = { _id: cycleId }
    let cycleUpdate = { $pullAll: { linkedStage: [freeStageIds] } }


    let stageQuery = { _id: { $in: freeStageIds } }
    let stageUpdate = { $unset: { cycleId: 1 } }

    return Promise.all([stageControls.updateManyByKey(stageQuery, stageUpdate), cycleControls.updateCycleByKey(cycleQuery, cycleUpdate)])
        .then(response => {
            let [result, cycleRes] = response
            return { message: 'Stage Updated Successfully', result, cycleRes }
        })
        .catch(error => {
            throw error
        })
}




const getStageList = async (params) => {
    let StageList = stageControls.getStageList(params);

    return Promise.all([StageList])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Stage List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getAllStages = async (params) => {
    return stageControls.getAllStages(params)
        .then(result => {
            return { message: 'Stage List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteStage = async (params) => {
    let { _id } = params

    return stageControls.deleteStage(params)
        .then(async result => {
            try {
                let stageQuery = { _id }
                let stageUpdate = { linkedStatus: [], $unset: { cycleId: 1 } }
                await updateStageByKey(stageQuery, stageUpdate)

                let statusQuery = { stageId: _id }
                let statusUpdate = { $unset: { stageId: 1 } }
                await statusControls.updateManyByKey(statusQuery, statusUpdate)

                let cycleQuery = { _id: result.cycleId }
                let cycleUpdate = { $pull: { linkedStage: _id } }
                await cycleControls.updateCycleByKey(cycleQuery, cycleUpdate)
            }
            catch (err) {
                throw err
            }

            return { message: `Stage deleted successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getStageDetails = async (id) => {
    return stageControls.getStageDetails(id)
        .then(result => {
            return { message: `Stage details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const isDuplicateStage = async (stageName) => {
    return stageControls.isDuplicateStage(stageName)
        .then(result => {
            if (result) {
                throw customExceptions.stageExists()
            }
            return { message: 'Success', result }

        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const changeStatus = async (_id, status, modifiedBy) => {
    return stageControls.changeStatus(_id, status, modifiedBy)
        .then(async result => {
            try {
                // On Inactive remove all mapping
                if (status === 0) {
                    let stageQuery = { _id }
                    let stageUpdate = { linkedStatus: [], $unset: { cycleId: 1 } }
                    await updateStageByKey(stageQuery, stageUpdate)

                    let statusQuery = { stageId: _id }
                    let statusUpdate = { $unset: { stageId: 1 } }
                    await statusControls.updateManyByKey(statusQuery, statusUpdate)

                    let cycleQuery = { _id: result.cycleId }
                    let cycleUpdate = { $pull: { linkedStage: _id } }
                    await cycleControls.updateCycleByKey(cycleQuery, cycleUpdate)
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


const updateStageByKey = async (query, update) => {
    return stageControls.updateStageByKey(query, update)
}

const getStageByKey = (params) => {
    return stageControls.findOneByKey(params)
        .then((result) => {
            return { message: "Stage By Key.", result }
        })
}


module.exports = {
    createStage,
    updateStage,
    getAllStages,
    getStageList,
    getStageDetails,
    isDuplicateStage,
    changeStatus,
    deleteStage,
    mapStagesWithCycle,
    updateStageByKey,
    unMapAvailableStage,
    getStageByKey
}