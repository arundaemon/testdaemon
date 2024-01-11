const Tasks = require('../models/taskModel');
const utils = require('../utils/utils')


const createTask=  async (params) => {

        const count= await Tasks.countDocuments();
        const newCount=count+1;
        params.taskId=`T-${newCount}`;
        const result= await Tasks.create(params);
        return result;
}


const findOneByKey = async (query, populate) => {
    return Tasks.findOne(query).populate(populate)
}


const updateTask = async (params) => {
    let query = {}
    let update = {}
    let options = { new: true }

    query._id = params.TkId

    if (params.taskName) {

        update.taskName = params.taskName
    }
    
    if (params.category){
        
        update.category = params.category
    }

    if (params.createdBy){

        update.createdBy = params.createdBy
    }

    if (params.modifiedBy){

        update.modifiedBy = params.modifiedBy
    }

    if (!utils.isEmptyValue(params.status)) {
        update.status = params.status;
    }

   
    return Tasks.findOneAndUpdate(query, update, options)
}


const deleteTask = async (params) => {
    let query = { _id: params.TkId }
    let update = { isDeleted: true }
    let options = { new: true }

    return Tasks.findOneAndUpdate(query, update, options)
}


const getTaskList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }

    if (search){

        query.taskName = { $regex: search, $options: 'i' }
    }
    if (sortKey && sortOrder) {

        sort = { [sortKey]: sortOrder }
    }

    if (utils.isEmptyValue(pageNo)){

        pageNo = 0
    }

    if (utils.isEmptyValue(count)){

        count = 0
    }

    return Tasks.find(query).sort(sort).skip(pageNo * count).limit(count).lean()
}

const getTaskListCount = async (params) => {
    let query = { isDeleted: false }
    let { search} = params

    if (search)
        query.taskName = { $regex: search, $options: 'i' }

    return Tasks.countDocuments(query)
}


const getTask = async (params) => {
    // let query = { _id: params.journeyId }
    return Tasks.findById(params.TkId);
}

const changeStatus = async (_id, status) => {
    let options = { new: true };
    let update = { status: status };
    return Tasks.findOneAndUpdate({ _id }, update, options);
}

const getAllTasks = async ( params ) => {

    let query = { isDeleted: false};
    let sort = { name:1 };
    return Tasks.find(query).select('taskName').sort(sort)
}



module.exports={
    createTask,
    findOneByKey,
    updateTask,
    deleteTask,
    getTaskList,
    getTaskListCount,
    getTask,
    changeStatus,
    getAllTasks

}