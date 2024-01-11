const util = require('util')
const gc = require('./gcpStorage')
let EnvConfig = require('../config/env').envConfig
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file, folderRoute, empCode = "") => new Promise((resolve, reject) => {
  let timestamp = Date.now();
  const bucket = gc.bucket(`${EnvConfig.GCP_BUCKET_NAME}`) // should be your bucket name
  let { originalname, buffer } = file;
  if (empCode) {
    originalname = `${empCode}_${timestamp}_${originalname}`;
  }else {
    originalname = `${timestamp}_${originalname}`;
  }
  const blob = bucket.file(folderRoute + originalname.replace(/ /g, "_"))

  const blobStream = blob.createWriteStream({ resumable: false, public: true })
  blobStream.on("error", (err) => reject({ message: err.message }))

  blobStream.on('finish', () => {
    const publicUrl = (`${EnvConfig.GCP_CDN_URL}/${blob.name}`)
    resolve(publicUrl)
  })
    .end(buffer)
})

const generatePdfFromCdn = async (cdnPath) => {
  const pdfBuffer = await axios.get(cdnPath, { responseType: 'arraybuffer' });
  return PDFDocument.load(pdfBuffer.data);
}


module.exports = { uploadImage, generatePdfFromCdn }