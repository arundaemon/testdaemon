
const reasonForFbPendingControls= require('../controllers/reasonForFbPendingControls');


const createReasonForFbPending =  async (params) => {
  
    return reasonForFbPendingControls.findOneByKey({reasonForFbPending: params.reasonForFbPending,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForFbPendingControls.createReasonForFbPending(params)
    })
    .then(result => {
        return { message: `Reason for FB pending created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForFbPendingList = async (params) => {

    let reasonList = reasonForFbPendingControls.getReasonForFbPendingList(params)
    let ListCount = reasonForFbPendingControls.getReasonForFbPendingListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for FB Pending List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForFbPending = async (params) => {
       
  return reasonForFbPendingControls.deleteReasonForFbPending(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForFbPending = async (params) => {

  return reasonForFbPendingControls.findOneByKey({ reasonForFbPending: params.reasonForFbPending, _id: { $ne: params?.reasonForFbPendingId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForFbPendingControls.updateReasonForFbPending(params);
    })
    .then(result => {
        return { message: `Reason For FB Pending Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForFbPending,
    getReasonForFbPendingList,
    deleteReasonForFbPending,
    updateReasonForFbPending,
}



