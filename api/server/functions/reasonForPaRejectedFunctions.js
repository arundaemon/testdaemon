
const reasonForPaRejectedControls= require('../controllers/reasonForPaRejectedControls');


const createReasonForPaRejected =  async (params) => {
  
    return reasonForPaRejectedControls.findOneByKey({reasonForPaRejected: params.reasonForPaRejected,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return reasonForPaRejectedControls.createReasonForPaRejected(params)
    })
    .then(result => {
        return { message: `Reason for PA rejected created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForPaRejectedList = async (params) => {

    let reasonList = reasonForPaRejectedControls.getReasonForPaRejectedList(params)
    let ListCount = reasonForPaRejectedControls.getReasonForPaRejectedListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for PA Rejected List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForPaRejected = async (params) => {
       
  return reasonForPaRejectedControls.deleteReasonForPaRejected(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForPaRejected = async (params) => {

  return reasonForPaRejectedControls.findOneByKey({ reasonForPaRejected: params.reasonForPaRejected, _id: { $ne: params?.reasonForPaRejectedId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return reasonForPaRejectedControls.updateReasonForPaRejected(params);
    })
    .then(result => {
        return { message: `Reason For PA Rejected Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForPaRejected,
    getReasonForPaRejectedList,
    deleteReasonForPaRejected,
    updateReasonForPaRejected,
}



