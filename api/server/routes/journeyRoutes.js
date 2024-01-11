
const express = require('express');
const router = express.Router();
const journeyFunction = require('../functions/journeyFunction');
const responseHandler = require('../utils/responseHandler');
const menusValidator = require('../validators/menusValidator')




router.get('/getJourneyList', [menusValidator.validateGetMenusList], async (req, res) => {

  let { search, pageNo, count, sortKey, sortOrder } = req.query

  return journeyFunction.getJourneyList({ search, pageNo, count, sortKey, sortOrder })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req);
    })
})



router.post('/createJourney', [], async (req, res) => {
  return journeyFunction.createJourney({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(err => responseHandler.sendError(res, err, req))
});


router.put('/updateJourney', [], async (req, res) => {
  // let { journeyName, createdBy, modifiedBy, condition, filterSql } = req.body

  return journeyFunction.updateJourney({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/deleteJourney', [], async (req, res) => {

  return journeyFunction.deleteJourney({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

});

router.get('/getAllJourneys', async (req, res) => {

  return journeyFunction.getAllJourneys({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));

});

router.get('/getJourney', async (req, res) => {
  return journeyFunction.getJourney({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));

});

router.put('/changeStatus', async (req, res) => {
  let { _id, status } = req.body;

  return journeyFunction.changeStatus(_id, status)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getActiveJourneys', async (req, res) => {

  return journeyFunction.getActiveJourneys({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req));

})

router.get('/getB2BDefaultStageStatus', async (req, res) => {

  return journeyFunction.getB2BDefaultStageStatus()

    .then(result => responseHandler.sendSuccess(res, result, req))

    .catch(error => responseHandler.sendError(res, error, req));

})




module.exports = router;
