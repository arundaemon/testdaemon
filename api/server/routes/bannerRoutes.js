const router = require('express-promise-router')();
const bannerfunctions = require('../functions/bannerfunctions');
const responseHandler = require('../utils/responseHandler');
const bannerValidator = require('../validators/bannerValidator');
const multer = require('multer')


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

const bannerUpload = upload.fields([{ name: 'webBanner', maxCount: 1 }, { name: 'appBanner', maxCount: 1 },
{ name: 'webBannerPdf', maxCount: 1 }, { name: 'appBannerPdf', maxCount: 1 }
])

router.post('/saveBanner', bannerUpload, bannerValidator.saveBannerValidator, async (req, res) => {
  let { tokenPayload } = req;
  let { webBanner, appBanner, webBannerPdf, appBannerPdf } = req?.files

  let webBannerImage = webBanner[0]
  let appBannerImage = appBanner[0]
  let webBannerPdfFile = null
  let appBannerPdfFile = null


  if (webBannerPdf?.[0]) {
    webBannerPdfFile = webBannerPdf?.[0]
  }

  if (appBannerPdf?.[0]) {
    appBannerPdfFile = appBannerPdf?.[0]
  }

  return bannerfunctions.saveBanner({ ...req.body, webBannerImage, appBannerImage, webBannerPdfFile, appBannerPdfFile, tokenPayload })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});


router.post('/uploadImageToGCP', upload.single('image'), async (req, res) => {
  let { tokenPayload } = req;
  let image = req?.file

  return bannerfunctions.uploadImageToGCP({ ...req.body, image, tokenPayload })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/updateBanner', bannerUpload, bannerValidator.updateBannerValidator, async (req, res) => {
  let { tokenPayload } = req;
  let { webBanner, appBanner, webBannerPdf, appBannerPdf } = req?.files

  let webBannerImage = null
  let appBannerImage = null
  let webBannerPdfFile = null
  let appBannerPdfFile = null

  if (webBanner) {
    webBannerImage = webBanner[0]
  }

  if (appBanner) {
    appBannerImage = appBanner[0]
  }

  if (webBannerPdf?.[0]) {
    webBannerPdfFile = webBannerPdf?.[0]
  }

  if (appBannerPdf?.[0]) {
    appBannerPdfFile = appBannerPdf?.[0]
  }

  return bannerfunctions.updateBanner({ ...req.body, webBannerImage, appBannerImage, webBannerPdfFile, appBannerPdfFile, tokenPayload })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});


router.put('/updateBannerStatus', [], async (req, res) => {
  let { tokenPayload } = req;

  return bannerfunctions.updateBannerStatus({ ...req.body, tokenPayload })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});


router.put('/deleteBanner', [bannerValidator.deleteBannerValidator], async (req, res) => {
  let { tokenPayload } = req

  return bannerfunctions.deleteBanner({ tokenPayload, ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getBannersList', [bannerValidator.getBannersListValidator], async (req, res) => {
  let { tokenPayload } = req

  return bannerfunctions.getBannersList({ tokenPayload, ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})


router.get('/getBannerDetails', async (req, res) => {
  return bannerfunctions.getBannerDetails({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));
})

router.get('/getAllActiveBanners', async (req, res) => {

  let { tokenPayload } = req;

  return bannerfunctions.getAllActiveBanners({ tokenPayload, ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})




module.exports = router;