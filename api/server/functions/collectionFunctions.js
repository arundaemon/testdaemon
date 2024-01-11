const { uploadImage } = require('../middlewares/fileUploader');
const axios = require('axios');

const uploadCollectionEvidence = async (params) => {
    let { file, empCode } = params;
    if (!empCode) {
        throw "Please provide emp code"
    }
    let iconsFolderPath = "collection-evidence/";

    return uploadImage(file, iconsFolderPath, empCode)
        .then(result => {
            return { message: 'Collection Evidence Uploaded Successfully', result }
        })
};

const uploadAddendumProof = async (params) => {
    let { file } = params
    let iconsFolderPath = "addendum-proof/"

    return uploadImage(file, iconsFolderPath)
        .then(result => {
            return { message: 'File Uploaded Successfully', result }
        })
}

const addendumRequestStatusUpdate = async (headerValue, tokenPayload, payload) => {
    let addendumStatus
    if (payload?.assignedToProfileName === "Manager - Collection School Sales" && payload?.status === 'Approved') {
        addendumStatus = 2
    } else if (payload?.assignedToProfileName === "Manager - Collection School Sales" && payload?.status === 'Rejected') {
        addendumStatus = 3
    } else if (payload?.assignedToProfileName === "BUH" && (payload?.status === 'Approved')) {
        addendumStatus = 4
    } else if (payload?.assignedToProfileName === "BUH" && payload?.status === 'Rejected') {
        addendumStatus = 5
    } else if (payload?.assignedToProfileName === "Finance Manager" && (payload?.status === 'Approved')) {
        addendumStatus = 6
    } else if (payload?.assignedToProfileName === "Finance Manager" && payload?.status === 'Rejected') {
        addendumStatus = 7
    } else {
        return new Promise((resolve, reject) => reject('Error in addendum status update!'))
    }
    let remarks
    if (Array.isArray(payload?.remarks)) {
        remarks = ''
    } else {
        remarks = payload?.remarks
    }
    let payloadObj = {
        school_code: payload?.schoolCode,
        uuid: payload?.createdByUuid,
        po_code: payload?.poCode?.split(',') || [],
        total_due_amount: payload?.totalDueAmount,
        collection_details: payload?.collectionDetails,
        addendum_proof_file: payload?.addendumProfileFile,
        approval_status_id: 1,
        addendum_comment: payload?.addendumComment,
        reason_id: payload?.reasonId,
        addendum_auto_id: payload?.referenceCode?.slice(4),
        modified_by: payload?.assignedToName,
        modified_on: new Date()
    }
    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateAddendum`
    let headers = {
        Authorization: headerValue?.authorization
    }
    let response
    try {
        response = await axios.post(url, payloadObj, { headers })
        if (response && response.data.status) {
            if (response.data.status == 200 || response.data.status == 1) {
                return { status: response.data.status, response: response.data }
            } else if (response.data.status == 0) {
                return { status: 400, response: response.data }
            } else {
                return { status: response.data.status, response: response.data }
            }
        } else {
            return { response: response }
        }
    } catch (err) {
        console.log('Error', err)
        if (err.response && err.response.data) {
            return { status: 'Error', error: err.response.data }
        } else {
            return { status: "Error", error: err }
        }
    }
}

module.exports = {
    uploadCollectionEvidence,
    uploadAddendumProof,
    addendumRequestStatusUpdate
}