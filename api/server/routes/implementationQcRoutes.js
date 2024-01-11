const express = require('express');
const router = require('express-promise-router')();
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const implementationQcFunctions = require('../functions/implementationQcFunctions');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadQcImageToGcp', [auth.authenticateToken],upload.single('image'),  async (req, res) => {
  let image = req?.file;
  return implementationQcFunctions.uploadQcImageToGcp({...req.body, image})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getQcList',[auth.authenticateToken],async (req, res) => {
  return implementationQcFunctions.getQcList({ ...req.query})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
} )

router.post('/createQc', [auth.authenticateToken], async (req, res) => {
  return implementationQcFunctions.createQc({ ...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
});

router.put('/updateQc', async (req, res) => {
  return implementationQcFunctions.updateQc({ ...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
})

router.post('/saveQcForm', upload.array("images"), async (req, res) => {
  const {objects} = req.body;
  const files = req.files;
  console.log(req.body,'............................req body');

  const objectsWithFiles = objects.map((obj, index) => {
    console.log(obj,'..................obj');
    const file = files[index];

    return {
      ...obj,
      file: {
        fieldname: file.fieldname,
        originalname: file.originalname,
        buffer: file.buffer,
      },
    };
  });
  return implementationQcFunctions.saveQcForm(objectsWithFiles)
  .then(result => responseHandler.sendSuccess(res, result, req))
  .catch(error => responseHandler.sendError(res, error, req));
})

router.get('/getPrevQcFormData',[auth.authenticateToken], async (req, res) => {
  return implementationQcFunctions.getPrevQcFormData({...req.query })
  .then(result => responseHandler.sendSuccess(res, result, req))
  .catch(error => responseHandler.sendError(res, error, req))
});

module.exports = router;