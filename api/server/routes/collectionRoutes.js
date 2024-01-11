const express = require('express');
const router = require('express-promise-router')();
const auth = require('../middlewares/auth');
const responseHandler = require('../utils/responseHandler');
const collectionFunctions = require('../functions/collectionFunctions');
const multer = require('multer');
const storage = multer.memoryStorage();

const uploadEvidence = multer({ storage: storage });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.post('/uploadCollectionEvidence', [auth.authenticateToken], uploadEvidence.single('file'), async (req, res) => {
  let file = req?.file;
  return collectionFunctions.uploadCollectionEvidence({ ...req.body, file })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/uploadAddendumProof', upload.single('file'), async (req, res) => {
  let { tokenPayload } = req;
  let file = req?.file

  return collectionFunctions.uploadAddendumProof({ ...req.body, file, tokenPayload })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});


module.exports = router;