
const categoryControllers= require('../controllers/categoryControls');


const createCategory=  async (params) => {
  
    return categoryControllers.findOneByKey({categoryName: params.categoryName,  isDeleted: false})
    .then(categoryExist => {
        if (categoryExist)
            throw { errorMessage: "Category with this name already exist." } 
  
        return categoryControllers.createCategory(params)
    })
    .then(result => {
        return { message: `Category created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getCategoryList = async (params) => {

    let categoryList = categoryControllers.getCategoryList(params)
    let categoryListCount = categoryControllers.getCategoryListCount(params)
    
    return Promise.all([ categoryListCount, categoryList])
           .then(result => {
             let [count,categoryList ]= result
               return { message: 'Category list', count, categoryList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

module.exports={
    createCategory,
    getCategoryList,
}



