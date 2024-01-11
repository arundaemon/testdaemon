
const resonForPaPendingControls= require('../controllers/reasonForPaPendingControls');


const createReasonForPaPending =  async (params) => {
  
    return resonForPaPendingControls.findOneByKey({reasonForPaPending: params.reasonForPaPending,  isDeleted: false})
    .then(exitsObj => {
        if (exitsObj)
            throw { errorMessage: "Reason with this name already exist." } 
  
        return resonForPaPendingControls.createReasonForPaPending(params)
    })
    .then(result => {
        return { message: `Reason for PA pending created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForPaPendingList = async (params) => {

    let reasonList = resonForPaPendingControls.getReasonForPaPendingList(params)
    let ListCount = resonForPaPendingControls.getReasonForPaPendingListCount(params)
    
    return Promise.all([ ListCount, reasonList])
           .then(result => {
             let [count,reasonList ]= result
               return { message: 'Reason for PA Pending List', count, reasonList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteReasonForPaPending = async (params) => {
       
  return resonForPaPendingControls.deleteReasonForPaPending(params)
  .then( result => {
      return { message: 'Deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateReasonForPaPending = async (params) => {

  return resonForPaPendingControls.findOneByKey({ reasonForPaPending: params.reasonForPaPending, _id: { $ne: params?.reasonForPaPendingId }, isDeleted: false })
    .then((exitsObj) => {
        if (exitsObj)
            throw `Reason with this name already exists!`

        return resonForPaPendingControls.updateReasonForPaPending(params);
    })
    .then(result => {
        return { message: `Reason For PA Pending Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

module.exports={
    createReasonForPaPending,
    getReasonForPaPendingList,
    deleteReasonForPaPending,
    updateReasonForPaPending,
}



