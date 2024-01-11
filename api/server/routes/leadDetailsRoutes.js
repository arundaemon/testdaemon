const express = require('express');
const router = express.Router();
const leadDetailsFunctions = require('../functions/leadDetailsFunctions');
const responseHandler = require('../utils/responseHandler');
// const leadDetailsValidator = require('../validators/Validator')

router.get('/getLeadDetailsByLeadId', async (req, res) => { 
    return leadDetailsFunctions.getLeadDetailsByLeadId(req.query)
      .then(result => responseHandler.sendSuccess(res, result, req))
      .catch(error => responseHandler.sendError(res, error, req));
  });

module.exports= router;