
const customerResponseControls= require('../controllers/customerResponseControls');


const createCustomerResponse=  async (params) => {
  
    return customerResponseControls.findOneByKey({customerResponse: params.customerResponse,  isDeleted: false})
    .then(customerResponseExist => {
        if (customerResponseExist)
            throw { errorMessage: "Customer Response with this name already exist." } 
  
        return customerResponseControls.createCustomerResponse(params)
    })
    .then(result => {
        return { message: `Customer Response created successfully!`, result }
    })
    .catch(err => {
        throw err
    })
  }

const getCustomerResponseList = async (params) => {

    let responseList = customerResponseControls.getCustomerResponseList(params)
    let ListCount = customerResponseControls.getCustomerResponseListCount(params)
    
    return Promise.all([ ListCount, responseList])
           .then(result => {
             let [count,responseList ]= result
               return { message: 'Customer Response list', count, responseList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

const deleteCustomerResponse = async (params) => {
       
  return customerResponseControls.deleteCustomerResponse(params)
  .then( result => {
      return { message: 'Customer Response deleted successfully', result }
  })
  .catch( error => {
      return { errorMessage: error }
  })
}

const updateCustomerResponse = async (params) => {

  return customerResponseControls.findOneByKey({ customerResponse: params.customerResponse, _id: { $ne: params?.customerResponseId }, isDeleted: false })
    .then((customerResponseExist) => {
        if (customerResponseExist)
            throw `Customer Response with this name already exists!`

        return customerResponseControls.updateCustomerResponse(params);
    })
    .then(result => {
        return { message: `Customer Response Updated Successfully!`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    }) 
}

const getAllCutomerResponses = async (params) =>{
    
    let customerResponseList = customerResponseControls.getAllCutomerResponses(params);
    let customerResponsesCount= customerResponseControls.getCustomerResponseListCount(params)
    
    return Promise.all([ customerResponsesCount, customerResponseList])
           .then(result => {
             let [count,customerResponseList ]= result
               return { message: 'Customer Response list with sort,filter and pagination', count, customerResponseList }
           })
           .catch( error =>{
             throw { errorMessage: error}
           })
}

module.exports={
   createCustomerResponse,
   getCustomerResponseList,
   deleteCustomerResponse,
   updateCustomerResponse,
   getAllCutomerResponses
}



