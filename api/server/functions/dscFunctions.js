const { uploadImage } = require('../middlewares/fileUploader')

const uploadDscToGCP = async (params) => {
    let { image } = params
    let iconsFolderPath = "crm-Dsc/"
    
    return uploadImage(image, iconsFolderPath)
        .then(result => {
            return { message: 'File Uploaded Successfully', result }
        })
}



module.exports = {
    uploadDscToGCP
}