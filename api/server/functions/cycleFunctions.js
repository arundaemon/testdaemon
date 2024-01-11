const cycleControls = require('../controllers/cycleControls');
const journeyControls = require('../controllers/journeyControls');
const stageControls = require('../controllers/stageControls');
const customExceptions = require('../responseModels/customExceptions');
const { convertToMongoId } = require('../utils/utils');

const createCycle = async (params) => {
    return cycleControls.isDuplicateCycle(params.cycleName)
        .then(result => {
            if (result) {
                throw customExceptions.cycleExists()
            }

            return cycleControls.createCycle(params)
        })
        .then(result => {
            return { message: `Cycle is created`, result }
        })
        .catch(error => {
            throw error
        })
}

const updateCycle = async (params) => {
    return cycleControls.isDuplicateCycle(params.cycleName, params._id)
        .then(result => {
            if (result)
                throw customExceptions.cycleExists()

            let journeyQuery = { _id: params.journeyId }
            let journeyUpdate = { linkedCycle: params.linkedCycle }
            return Promise.all([cycleControls.updateCycle(params), journeyControls.updateJourneyByKey(journeyQuery, journeyUpdate)])
        })
        .then(response => {
            let [result, journeyRes] = response
            return { message: `Cycle updated successfully`, result }
        })
        .catch(error => {
            throw error
        })
}


const mapCyclesWithJourney = async (params) => {
    let journeyQuery = { _id: params.journeyId }
    let journeyUpdate = { linkedCycle: params.linkedCycle }

    let cycleQuery = { _id: { $in: params.linkedCycle } }
    let cycleUpdate = { journeyId: params.journeyId }

    return Promise.all([cycleControls.updateManyByKey(cycleQuery, cycleUpdate), journeyControls.updateJourneyByKey(journeyQuery, journeyUpdate)])
        .then(response => {
            let [result, cycleRes] = response
            return { message: 'Cycles Updated Successfully', result }
        })
        .catch(error => {
            throw error
        })
}


const unMapAvailableCycle = async (params) => {
    let { journeyId, freeCycles } = params
    let freeCycleIds = freeCycles.map(cycleObj => convertToMongoId(cycleObj?._id))

    let journeyQuery = { _id: journeyId }
    let journeyUpdate = { $pullAll: { linkedCycle: [freeCycleIds] } }

    let cycleQuery = { _id: { $in: freeCycleIds } }
    let cycleUpdate = { $unset: { journeyId: 1 } }


    return Promise.all([cycleControls.updateManyByKey(cycleQuery, cycleUpdate), journeyControls.updateJourneyByKey(journeyQuery, journeyUpdate)])
        .then(response => {
            let [result, journeyRes] = response
            return { message: 'Cycles Updated Successfully', journeyRes }
        })
        .catch(error => {
            throw error
        })
}


const getCyclesList = async (params) => {
    let CycleList = cycleControls.getCyclesList(params);
    return Promise.all([CycleList])
        .then(response => {
            let [result] = response
            return { message: 'Cycle List', result }
        })
}

const getAllCycles = async (params) => {
    return cycleControls.getAllCycles(params)
        .then(result => {
            return { message: 'Cycle List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteCycle = async (params) => {
    let { _id } = params

    return cycleControls.deleteCycle(params)
        .then(async result => {
            try {

                let cycleQuery = { _id }
                let cycleUpdate = { linkedStage: [], $unset: { journeyId: 1 } }
                await updateCycleByKey(cycleQuery, cycleUpdate)

                let stageQuery = { cycleId: _id }
                let stageUpdate = { $unset: { cycleId: 1 } }
                await stageControls.updateManyByKey(stageQuery, stageUpdate)


                let journeyQuery = { _id: result.journeyId }
                let journeyUpdate = { $pull: { linkedCycle: _id } }
                await journeyControls.updateJourneyByKey(journeyQuery, journeyUpdate)
            }
            catch (err) {
                throw err
            }

            return { message: `Cycle deleted successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getCycleDetails = async (id) => {
    return cycleControls.getCycleDetails(id)
        .then(result => {
            return { message: `Cycle details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const isDuplicateCycle = async (cycleName, id) => {
    return cycleControls.isDuplicateCycle(cycleName, id)
        .then(result => {
            if (result) {
                throw customExceptions.cycleExists()
            }
            return { message: 'Success', result }

        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const changeStatus = async (_id, status) => {
    return cycleControls.changeStatus(_id, status)
        .then(async result => {
            try {
                // On Inactive remove all mapping
                if (status === 0) {
                    let cycleQuery = { _id }
                    let cycleUpdate = { linkedStage: [], $unset: { journeyId: 1 } }
                    await updateCycleByKey(cycleQuery, cycleUpdate)

                    let stageQuery = { cycleId: _id }
                    let stageUpdate = { $unset: { cycleId: 1 } }
                    await stageControls.updateManyByKey(stageQuery, stageUpdate)


                    let journeyQuery = { _id: result.journeyId }
                    let journeyUpdate = { $pull: { linkedCycle: _id } }
                    await journeyControls.updateJourneyByKey(journeyQuery, journeyUpdate)
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

const getAllCycleNames = async (params) => {
    return cycleControls.getAllCycleNames(params)
        .then(result => {
            return { message: `all cycle names`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}


const updateCycleByKey = async (query, update) => {
    return cycleControls.updateCycleByKey(query, update)
}

module.exports = {
    createCycle,
    updateCycle,
    getCyclesList,
    getAllCycles,
    deleteCycle,
    getCycleDetails,
    isDuplicateCycle,
    changeStatus,
    getAllCycleNames,
    updateCycleByKey,
    mapCyclesWithJourney,
    unMapAvailableCycle
}