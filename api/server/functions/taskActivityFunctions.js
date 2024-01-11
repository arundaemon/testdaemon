const taskActivityControllers= require('../controllers/taskActivityControls');
const customExceptions = require('../responseModels/customExceptions');



const createTaskActivityMapping= async (params) => {

        const data = await taskActivityControllers.createTaskActivityMapping(params);
        return { message: 'Activity and Task mapped succesfully' , data }
    
}

const getTaskActivityMappingList = async (params) => {
        let taskActivityMappingList = taskActivityControllers.getTaskActivityMappingList(params);
        let totalTaskactivityMappingCount = taskActivityControllers.getTaskActivityMappingListCount(params);
        let [result, totalCount] = await Promise.all([taskActivityMappingList, totalTaskactivityMappingCount])
        return { message: 'Task Activity Mapping List !', result, totalCount }
    
}

const changeStatus = async ( _id, status ) => {
    return taskActivityControllers.changeStatus( _id, status )
        .then(result => {
            return { message: `Status changed`, result }          
        })

}

module.exports={
    createTaskActivityMapping,
    getTaskActivityMappingList,
    changeStatus,
}