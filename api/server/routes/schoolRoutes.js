const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const schoolFunctions = require('../functions/schoolFunctions');
const auth = require('../middlewares/auth');

router.post('/createSchool', async (req, res) => {
  return schoolFunctions.createSchool(req.body)
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })
})

router.post('/getSchoolList', async (req, res) => {
  let { search, pageNo, count, sortKey, sortOrder, childRoleNames, parentRole } = req.body
  return schoolFunctions.getSchoolList({ search, pageNo, count, sortKey, sortOrder, childRoleNames, parentRole })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      console.log(error, '...errrr');
      return responseHandler.sendError(res, error, req)
    })
})

router.post('/getSchoolCodeList', async (req, res) => {
  let { search, pageNo, count, sortKey, sortOrder, childRoleNames, allSchool } = req.body

  return schoolFunctions.getSchoolCodeList({ search, pageNo, count, sortKey, sortOrder, childRoleNames, allSchool})

    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      console.log(error, '...errrr');
      return responseHandler.sendError(res, error, req)
    })
})

router.get('/schoolDetails/:id', async (req, res) => {
  let { id } = req.params;

  return schoolFunctions.getSchoolDetails(id)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/schoolBySchoolCode/:id', async (req, res) => {
  let { id } = req.params;
  return schoolFunctions.getSchoolBySchoolCode(id)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getAllSchoolList', async (req, res) => {
  return schoolFunctions.getAllSchoolList()
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateSchool', async (req, res) => {
  return schoolFunctions.updateSchool({ ...req.body })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })

})

router.put('/updateContactDetails', async (req, res) => {
  return schoolFunctions.updateContactDetails({ ...req.body })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })

})

router.get('/getBdeActivities', async (req, res) => {
  return schoolFunctions.getBdeActivities({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getBdeActivity', async (req, res) => {
  return schoolFunctions.getBdeActivity({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getEdcCount', async (req, res) => {
  return schoolFunctions.getEdcCount({ ...req.query })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

})

router.post('/getSchoolsByCode',[auth.authenticateToken], async (req, res) => {
  return schoolFunctions.getSchoolsByCode({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

} )

module.exports = router;
