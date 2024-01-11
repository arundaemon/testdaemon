
const reasonForAckPendingControls= require('../controllers/reasonForAckPendingControls');


const createReasonForAckPending =  async (params) => {
  
    return reasonForAckPendingControls.findOneByKey({reasonForAckPending: params.reasonForAckPending,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForAckPendingControls.createReasonForAckPending(params)
    })
    .then(result => {
        return { message: `Reason for Acknowledgement pending created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForAckPendingList = async (params) => {

    let reasonList = reasonForAckPendingControls.getReasonForAckPendingList(params)
    let ListCount = reasonForAckPendingControls.getReasonForAckPendingListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for Ack Pending List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForAckPending = async (params) => {
       
  return reasonForAckPendingControls.deleteReasonForAckPending(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForAckPending = async (params) => {

  return reasonForAckPendingControls.findOneByKey({ reasonForAckPending: params.reasonForAckPending, _id: { $ne: params?.reasonForAckPendingId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForAckPendingControls.updateReasonForAckPending(params);
    })
    .then(result => {
        return { message: `Reason For Ack Pending Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForAckPending,
    getReasonForAckPendingList,
    deleteReasonForAckPending,
    updateReasonForAckPending,
}



