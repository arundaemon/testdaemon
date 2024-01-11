const { uploadImage } = require('../middlewares/fileUploader')

const uploadTdsToGCP = async (params) => {
    let { image } = params
    let iconsFolderPath = "crm-Tds/"
    console.log(params,'.................params')

    return uploadImage(image, iconsFolderPath)
        .then(result => {
            return { message: 'File Uploaded Successfully', result }
        })
}



module.exports = {
    uploadTdsToGCP
}
