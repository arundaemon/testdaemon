const Project = require('../models/projectsModel');
const utils = require('../utils/utils')

const createProject = async (params) => {
    return Project.create(params)
}

const findOneByKey = async (query, populate) => {
    return Project.findOne(query).populate(populate)
}


const updateProject = async (params) => {
    let query = {}
    let update = {}
    let options = { new: true }
    query._id = params.projectId

    if (params.projectName)
        update.projectName = params.projectName

    if (params.projectDescription)
        update.projectDescription = params.projectDescription

    return Project.findOneAndUpdate(query, update, options)
}



const deleteProject = async (params) => {
    let query = { _id: params.projectId }
    let update = { isDeleted: true }
    let options = { new: true }
    return Project.findOneAndUpdate(query, update, options)
}


const getProjectList = async (params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }

    if (search)
        query.projectName = { $regex: search, $options: 'i' }

    if (sortKey && sortOrder)
        sort = { [sortKey]: sortOrder }

    if (utils.isEmptyValue(pageNo))
        pageNo = 0

    if (utils.isEmptyValue(count))
        count = 0

    return Project.find(query).sort(sort).skip(pageNo * count).limit(count)
}

const getAllProjects = async (params) => {
    let query = { isDeleted: false }
    let sort = { name: 1 }
    return Project.find(query).sort(sort).populate('parentMenu')
}


module.exports = {
    createProject,
    findOneByKey,
    updateProject,
    deleteProject,
    getProjectList,
    getAllProjects
}