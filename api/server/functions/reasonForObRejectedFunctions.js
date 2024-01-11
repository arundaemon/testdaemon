
const reasonForObRejectedControls= require('../controllers/reasonForObRejectedControls');


const createReasonForObRejected =  async (params) => {
  
    return reasonForObRejectedControls.findOneByKey({reasonForObRejected: params.reasonForObRejected,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForObRejectedControls.createReasonForObRejected(params)
    })
    .then(result => {
        return { message: `Reason for OB rejected created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForObRejectedList = async (params) => {

    let reasonList = reasonForObRejectedControls.getReasonForObRejectedList(params)
    let ListCount = reasonForObRejectedControls.getReasonForObRejectedListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for OB Rejected List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForObRejected = async (params) => {
       
  return reasonForObRejectedControls.deleteReasonForObRejected(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForObRejected = async (params) => {

  return reasonForObRejectedControls.findOneByKey({ reasonForObRejected: params.reasonForObRejected, _id: { $ne: params?.reasonForObRejectedId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForObRejectedControls.updateReasonForObRejected(params);
    })
    .then(result => {
        return { message: `Reason For OB Rejected Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForObRejected,
    getReasonForObRejectedList,
    deleteReasonForObRejected,
    updateReasonForObRejected,
}



