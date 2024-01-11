
const reasonForObPendingControls= require('../controllers/reasonForObPendingControls');


const createReasonForObPending =  async (params) => {
  
    return reasonForObPendingControls.findOneByKey({reasonForObPending: params.reasonForObPending,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForObPendingControls.createReasonForObPending(params)
    })
    .then(result => {
        return { message: `Reason for OB pending created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForObPendingList = async (params) => {

    let reasonList = reasonForObPendingControls.getReasonForObPendingList(params)
    let ListCount = reasonForObPendingControls.getReasonForObPendingListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for OB Pending List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForObPending = async (params) => {
       
  return reasonForObPendingControls.deleteReasonForObPending(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForObPending = async (params) => {

  return reasonForObPendingControls.findOneByKey({ reasonForObPending: params.reasonForObPending, _id: { $ne: params?.reasonForObPendingId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForObPendingControls.updateReasonForObPending(params);
    })
    .then(result => {
        return { message: `Reason For OB Pending Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForObPending,
    getReasonForObPendingList,
    deleteReasonForObPending,
    updateReasonForObPending,
}



