
const reasonForFbRejectedControls= require('../controllers/reasonForFbRejectedControls');


const createReasonForFbRejected =  async (params) => {
  
    return reasonForFbRejectedControls.findOneByKey({reasonForFbRejected: params.reasonForFbRejected,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForFbRejectedControls.createReasonForFbRejected(params)
    })
    .then(result => {
        return { message: `Reason for FB rejected created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForFbRejectedList = async (params) => {

    let reasonList = reasonForFbRejectedControls.getReasonForFbRejectedList(params)
    let ListCount = reasonForFbRejectedControls.getReasonForFbRejectedListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for FB Rejected List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForFbRejected = async (params) => {
       
  return reasonForFbRejectedControls.deleteReasonForFbRejected(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForFbRejected = async (params) => {

  return reasonForFbRejectedControls.findOneByKey({ reasonForFbRejected: params.reasonForFbRejected, _id: { $ne: params?.reasonForFbRejectedId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForFbRejectedControls.updateReasonForFbRejected(params);
    })
    .then(result => {
        return { message: `Reason For FB Rejected Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForFbRejected,
    getReasonForFbRejectedList,
    deleteReasonForFbRejected,
    updateReasonForFbRejected,
}



