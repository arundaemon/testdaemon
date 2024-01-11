
const taskControllers = require('../controllers/taskControls');
const customExceptions = require('../responseModels/customExceptions')


const createTask = async (params) => {
  let taskName= { $regex: params.taskName, $options: 'i' }

  return taskControllers.findOneByKey({ taskName: taskName, isDeleted: false })
    .then(taskExist => {
      if (taskExist)
        throw { errorMessage: "Task with this name already exist." }

      return taskControllers.createTask(params)
    })
    .then(result => {
      return { message: `Task created successfully!`, result }
    })
    .catch(err => {
      throw err
    })
}


const updateTask = async (params) => {

  return taskControllers.updateTask(params)
    .then(result => {
      return { message: 'Task updated successfully', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })


}

const deleteTask = async (params) => {

  return taskControllers.deleteTask(params)
    .then(result => {
      return { message: 'Task deleted successfully', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getTaskList = async (params) => {
  let taskList = taskControllers.getTaskList(params)
  let taskListCount = taskControllers.getTaskListCount(params)

  return Promise.all([taskListCount, taskList])
    .then(result => {
      let [count, taskList] = result
      return { message: 'Task list', count, taskList }
    })
    .catch(error => {
      throw { errorMessage: error }
    })

}

const getTask = (params) => {
  return taskControllers.getTask(params)
    .then((result) => {
      return { message: "Task finded successfully !", result }
    })
}

const changeStatus = (_id, status) => {
  return taskControllers.changeStatus(_id, status)
    .then(result => {
      return { message: `Status changed`, result }
    })
}

const getAllTasks = (params) =>{
 
  return taskControllers.getAllTasks(params)
       .then( result => {
          return { message: `All Tasks list`, result }
       })

}


module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTaskList,
  getTask,
  changeStatus,
  getAllTasks,

}