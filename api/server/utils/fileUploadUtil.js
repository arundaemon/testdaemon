const multer = require('multer');
const {dirname,join} = require('path')
const EXPORTED_PATH = join(dirname(require.main.filename),'exportedFiles')


const exportedReportStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, EXPORTED_PATH);
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname );
    }
});

const exportUpload = multer({ storage: exportedReportStorage })


module.exports = {
  exportUpload
}