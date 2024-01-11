
const reasonForDisqualificationControls= require('../controllers/reasonForDisqualificationControls');


const createReasonForDisqualifiction=  async (params) => {
  
    return reasonForDisqualificationControls.findOneByKey({reasonForDisqualification: params.reasonForDisqualification,  isDeleted: false})
    .then(reasonForDisqualificationExist => {
        if (reasonForDisqualificationExist)
            throw { errorMessage: "Reason For Disqualification with this name already exist." } 
  
        return reasonForDisqualificationControls.createReasonForDisqualifiction(params)
    })
    .then(result => {
        return { message: `Reason For Disqualification created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getReasonForDisqualificationList = async (params) => {

    let responseList = reasonForDisqualificationControls.getReasonForDisqualificationList(params)
    let ListCount = reasonForDisqualificationControls.getReasonForDisqualificationListCount(params)
    
    return Promise.all([ ListCount, responseList])
           .then(result => {
             let [count,responseList ]= result
               return { message: 'Reason For Disqualification list', count, responseList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const updateReasonForDisqualification = async (params) => {
    
    return reasonForDisqualificationControls.findOneByKey({ reasonForDisqualification: params.reasonForDisqualification, _id: { $ne: params?.reasonForDisqualificationId }, isDeleted: false })
    .then((reasonForDisqualificationExist) => {
        if (reasonForDisqualificationExist)
            throw `Reason For Disqualification with this name already exists!`

        return reasonForDisqualificationControls.updateReasonForDisqualification(params);
    })
    .then(result => {
        return { message: `Reason For Disqualification Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 

}

const deleteReasonForDisqualification = async (params) => {

    return reasonForDisqualificationControls.deleteReasonForDisqualification(params)
           .then((result) => {
              return { message: `Reason for disqualification Deleted Successfully!`, result }
           })
           .catch((error) => {
              return { errorMessage: error }
           })
}



module.exports={
    createReasonForDisqualifiction,
    getReasonForDisqualificationList,
    updateReasonForDisqualification,
    deleteReasonForDisqualification,
    

}



