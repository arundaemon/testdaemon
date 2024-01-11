const { envConfig } = require('../config/env');
const axios = require('axios');


const npsRequestStatusUpdate = async (headerValue, tokenPayload, payload) => {
    let npsStatus
    if(payload?.assignedToProfileName === "Manager - Collection School Sales" && payload?.status === 'Approved'){
        npsStatus = 2
    }else if(payload?.assignedToProfileName  === "Manager - Collection School Sales" && payload?.status === 'Rejected'){
        npsStatus = 3
    }else if(payload?.assignedToProfileName  === "Test_Admin" && (payload?.status === 'Adjusted' || payload?.status === 'Approved')){
        npsStatus = 4
    }else if(payload?.assignedToProfileName  === "Test_Admin" && payload?.status === 'Rejected'){
        npsStatus = 5
    }else {
        return new Promise((resolve, reject) => reject('Error in nps status update!'))
    }
    let remarks 
    if(Array.isArray(payload?.remarks)){
        remarks = ''
    }else{
        remarks = payload?.remarks
    }

    let payloadObj = {
        uuid: payload?.uuid,
        request_type: payload?.request_type,
        product_codes: payload?.product_codes,
        schedule_for: payload?.schedule_for,
        po_code: payload?.po_code,
        quotation_code: payload?.quotation_code,
        implementation_form_id: payload?.implementation_form_id,
        school_code: payload?.school_code,
        state_code: payload?.state_code,
        territory_code: payload?.territory_code,
        billing_start_date: payload?.billing_start_date,
        total_contract_months: payload?.total_contract_months,
        total_payable_months: payload?.total_payable_months,
        total_contract_amount: payload?.total_contract_amount,
        total_software_invoice_amount: payload?.total_software_invoice_amount,
        total_hardware_invoice_amount: payload?.total_hardware_invoice_amount,
        user_hierarchy_json: payload?.user_hierarchy_json,
        status: 1,
        nps_details: payload?.nps_details,
        // advance_payment_details: payload?.advance_payment_details,
        invoice_collection_schedule_details: payload?.invoice_collection_schedule_details,
    }
    payloadObj.nps_details['nps_request_status'] = npsStatus
    payloadObj.nps_details['approval_rejection_remarks'] = remarks

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addInvoiceCollectionSchedule`
    let headers = {
        Authorization: headerValue?.authorization
    }
    let response
    try{
        response = await axios.post(url,payloadObj,{headers})
        if(response && response.data.status){
            if(response.data.status == 200 || response.data.status == 1){
                return {status: response.data.status, response: response.data}
            }else if(response.data.status == 0){
                return {status: 400, response: response.data}
            }else{
                return {status: response.data.status, response: response.data}
            }
        }else{
            return {response : response}
        }
    }catch(err){
        console.log('Error',err)
        if(err.response && err.response.data){
            return { status: 'Error' , error:err.response.data}
        }else{
            return {status:"Error",error:err}
        }        
    }
}

module.exports = {
    npsRequestStatusUpdate
}