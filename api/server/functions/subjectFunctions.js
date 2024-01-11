
const subjectControls= require('../controllers/subjectControls');


const createSubject=  async (params) => {
  
    return subjectControls.findOneByKey({subjectName: params.subjectName,  isDeleted: false})
    .then(subjectExist => {
        if (subjectExist)
            throw { errorMessage: "Subject with this name already exist." } 
  
        return subjectControls.createSubject(params)
    })
    .then(result => {
        return { message: `Subject created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getSubjectList = async (params) => {

    let subjectList = subjectControls.getSubjectList(params)
    let subjectListCount = subjectControls.getSubjectListCount(params)
    
    return Promise.all([ subjectListCount, subjectList])
           .then(result => {
             let [count,subjectList ]= result
               return { message: 'Subject list', count, subjectList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const updateSubject = async (params) => {

    return subjectControls.updateSubject(params)
           .then( result => { 
              return { message: 'Subject updated successfully', result}
           })
           .catch( error => { 
             throw { errorMessage: error}
           })
}

const deleteSubject = async (params) => {

    return subjectControls.deleteSubject(params)
        .then( result => {
            return { message: 'Subject deleted successfully', result }
        })
        .catch( error => {
            return { errorMessage: error }
        })
}

const getAllSubjects = async (params) => {

 
    let subjectList = subjectControls.getAllSubjects(params);
    let subjectListCount = subjectControls.getSubjectListCount(params)
    
    return Promise.all([ subjectListCount, subjectList])
           .then(result => {
             let [count,subjectList ]= result
               return { message: 'Subject list with sort,filter and pagination', count, subjectList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
           
}


module.exports={
    createSubject,
    getSubjectList,
    updateSubject,
    deleteSubject,
    getAllSubjects

}



