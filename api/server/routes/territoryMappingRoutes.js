const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const territoryMappingFunctions = require('../functions/territoryMappingFunctions');
const auth = require('../middlewares/auth');

router.post('/createTerritory', async (req, res) => {
  return territoryMappingFunctions.createTerritory(req.body)
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })
})

router.get('/getTerritoryList', async (req, res) => {
  let { search, pageNo, count, sortKey, sortOrder } = req.query
  return territoryMappingFunctions.getTerritoryList({ search, pageNo, count, sortKey, sortOrder })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      console.log(error, '...errrr');
      return responseHandler.sendError(res, error, req)
    })
})

router.put('/updateTerritory', async (req, res) => {
  let { territoryName, territoryCode, regionalSPOC, countryDetails, buHead1, buHead2, retailHead, citiesTagged, cityName, modifiedBy, status, createdAt, createdBy } = req.body;

  return territoryMappingFunctions.updateTerritory({ territoryCode, countryDetails, territoryName, regionalSPOC, buHead1, buHead2, retailHead, citiesTagged, cityName, modifiedBy, status, createdAt, createdBy })
    .then(result => {
      return responseHandler.sendSuccess(res, result, req)
    })
    .catch(error => {
      return responseHandler.sendError(res, error, req)
    })

})

router.get('/countTerritory', async (req, res) => {
  return territoryMappingFunctions.countTerritory()
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/duplicateTerritoryByCity', async (req, res) => {
  let { stateName, stateCode, cityName, cityCode } = req.query
  return territoryMappingFunctions.isDuplicateTerritoryByCityName(stateName, stateCode, cityName, cityCode)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getTerritoryDetails/:id', async (req, res) => {
  let { id } = req.params;
  return territoryMappingFunctions.getTerritoryDetails(id)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getTerritory', [auth.authenticateToken], async (req, res) => {
  return territoryMappingFunctions.getTerritory(req.query)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getTerritoryByCode', [auth.authenticateToken], async (req, res) => {
  return territoryMappingFunctions.getTerritoryByCode({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))

})


module.exports = router;
