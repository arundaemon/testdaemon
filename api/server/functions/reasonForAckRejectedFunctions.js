
const reasonForAckRejectedControls= require('../controllers/reasonForAckRejectedControls');


const createReasonForAckRejected =  async (params) => {
  
    return reasonForAckRejectedControls.findOneByKey({reasonForAckRejected: params.reasonForAckRejected,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForAckRejectedControls.createReasonForAckRejected(params)
    })
    .then(result => {
        return { message: `Reason for Acknowledgement rejected created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForAckRejectedList = async (params) => {

    let reasonList = reasonForAckRejectedControls.getReasonForAckRejectedList(params)
    let ListCount = reasonForAckRejectedControls.getReasonForAckRejectedListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for Ack Rejected List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForAckRejected = async (params) => {
       
  return reasonForAckRejectedControls.deleteReasonForAckRejected(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForAckRejected = async (params) => {

  return reasonForAckRejectedControls.findOneByKey({ reasonForAckRejected: params.reasonForAckRejected, _id: { $ne: params?.reasonForAckRejectedId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForAckRejectedControls.updateReasonForAckRejected(params);
    })
    .then(result => {
        return { message: `Reason For Ack Rejected Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForAckRejected,
    getReasonForAckRejectedList,
    deleteReasonForAckRejected,
    updateReasonForAckRejected,
}



