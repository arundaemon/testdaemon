
const Subject = require('../models/subjectModel');
const utils = require('../utils/utils')


const findOneByKey = async (query, populate) => {
    return Subject.findOne(query).populate(populate)
}


const createSubject = async(params) => {

    return Subject.create(params)
}

const getSubjectList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }
 
    return Subject.find(query).sort(sort)

}


const getSubjectListCount = async (params) => {
    let query = { isDeleted: false }
    let { search} = params

    return Subject.countDocuments(query)
}

const updateSubject = async (params) => {

    let {subjectId, subjectName} = params;

    let query = {};
    let update = {};
    let options = { new : true };

    query._id = subjectId;

    if(subjectName){
        update.subjectName = subjectName;
    }
    
    
    return Subject.findOneAndUpdate(query,update ,options);
}

const deleteSubject = async(params) => {

    let query = { _id: params.subjectId };
    let update = { isDeleted: true};
    let options = {new : true };

    return Subject.findOneAndUpdate(query, update, options)
    
}

const getAllSubjects = async(params) => {
    let query = { isDeleted: false }
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: -1 }

    if (search){

        query.subjectName = { $regex: search, $options: 'i' }
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

    return Subject.find(query).sort(sort).skip(pageNo * count).limit(count).lean()
}

module.exports ={
    createSubject,
    getSubjectList,
    getSubjectListCount,
    findOneByKey,
    updateSubject,
    deleteSubject,
    getAllSubjects
}