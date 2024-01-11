const manageStageStatusControls = require('../controllers/manageStageStatusControls');
const customExceptions = require('../responseModels/customExceptions')

const manageStageStatus = async (params) => {  

    return manageStageStatusControls.manageStageStatusControls(params)
        .then((result) => {
            return { message: "Stage Staus Mapping created", result }
        })
        .catch(( error) => {
            throw { errorMessage: error}
        }) 
    // return { message: 'Stage Staus Mapping created' , data }
}

const getStageStatusById = async (params) => {

    return manageStageStatusControls.getStageStatusById(params)
    .then((result) => {
        return { message: "Stage Status Mapping found successfully !", result }
    })
    .catch(( error) => {
        throw { errorMessage: error}
    })    
}

const getPreviewMapById = async () => {
    return manageStageStatusControls.getPreviewMapById()
    .then((result) => {
        return { message: "Stage Status Mapping found successfully !", result }
    })
    .catch(( error) => {
        throw { errorMessage: error}
    })    
}

const getTreeList = async (params) => {
    return manageStageStatusControls.getTreeList(params)
    .then((result) => {
        return { message: "Tree List !", result }
    })
    .catch(( error) => {
        throw { errorMessage: error}
    })    
}

module.exports = {
    manageStageStatus,
    getStageStatusById,
    getPreviewMapById,
    getTreeList
};