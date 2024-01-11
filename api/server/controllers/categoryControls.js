
const Category = require('../models/categoryModel');


const findOneByKey = async (query, populate) => {
    return Category.findOne(query).populate(populate)
}


const createCategory = async(params) => {

    return Category.create(params)
}

const getCategoryList = async (params) => {
    let query = { isDeleted: false }
    let sort = { createdAt: -1 }

    
    return Category.find(query).sort(sort)


}


const getCategoryListCount = async (params) => {
    let query = { isDeleted: false }
    let { search} = params

    if (search)
        query.categoryName = { $regex: search, $options: 'i' }

    return Category.countDocuments(query)
}

module.exports ={
    createCategory,
    getCategoryListCount,
    getCategoryList,
    findOneByKey
}