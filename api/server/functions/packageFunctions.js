const { uploadImage } = require('../middlewares/fileUploader')
const axios = require('axios');


const uploadImageToGCP = async (params) => {
    let { image } = params
    let iconsFolderPath = "crm-package/"

    return uploadImage(image, iconsFolderPath)
        .then(result => {
            return { message: 'Image Uploaded Successfully', result }
        })
}


const b2bPackageActivation = async (params) => {
    let payload = params.query
    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/b2bPackageActivation`
    // let refreshToken = params.headers.refreshToken
    let headers = {
        Authorization: params.headers.authorization
    }
    let response = await axios.post(url, { params: payload, headers })
    return response
}

module.exports = {
    uploadImageToGCP,
    b2bPackageActivation
}