const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const tdsFunctions = require('../functions/tdsFunctions');
const multer = require('multer');
const auth = require('../middlewares/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})


router.post('/uploadTdsToGcp', [auth.authenticateToken], upload.single('image'), async (req, res) => {
    let { tokenPayload } = req;
    let image = req?.file
    console.log('............enetr in routes')
  
    return tdsFunctions.uploadTdsToGCP({ ...req.body, image, tokenPayload })
      .then(result => responseHandler.sendSuccess(res, result, req))
      .catch(error => responseHandler.sendError(res, error, req))
  });


  module.exports = router;
  