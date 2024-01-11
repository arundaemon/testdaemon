
const projectControls = require('../controllers/projectControls')
const customExceptions = require('../responseModels/customExceptions')

const createProject = async (params) => {
    return projectControls.findOneByKey({ projectName: params.projectName, isDeleted: false })
        .then(projectExist => {
            if (projectExist)
                throw "Project With This Name Already Exist"

            return projectControls.createProject(params)
        })
        .then(result => {
            return { message: `Project Created Successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updateProject = async (params) => {
    return projectControls.findOneByKey({ _id: { $ne: params.projectId }, projectName: params.projectName })
        .then(projectExist => {
            if (projectExist)
                throw "Project With This Name Already Exist"

            return projectControls.updateProject(params)
        })
        .then(result => {
            return { message: `Project Updated Successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}


const deleteProject = async (params) => {
    return projectControls.deleteProject(params)
        .then(result => {
            return { message: `Project Deleted Successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getProjectList = async (params) => {
    let ProjectList = projectControls.getProjectList(params)

    return Promise.all([ProjectList])
        .then(response => {
            let [result] = response
            return { message: 'Project List', result }
        })
}

const getAllProjects = async (params) => {
    return projectControls.getAllProjects(params)
        .then(result => {
            return { message: 'Project List', result }
        })
}




module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProjectList,
    getAllProjects,
}