const express = require("express");
const router = express.Router();
const responseHandler = require("../utils/responseHandler");
const auth = require("../middlewares/auth");
const implementationFormFunctions = require("../functions/implementationFormFunctions");
const { updateStatusValidator } = require("../validators/implementationValidator");

router.post("/completeForm", [auth.authenticateToken], async (req, res) => {
  let obj = req.body;
  return implementationFormFunctions
    .implementationCompleteForm({ ...obj })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.post("/getImplementationList", async (req, res) => {
  let { search, pageNo, count, sortKey, sortOrder, childRoleNames, impFormNumber, schoolName, schoolCode, startDate, endDate, invoices } = req.body;
  return implementationFormFunctions
    .getImplementationList({ search, pageNo, count, sortKey, sortOrder, childRoleNames, startDate, endDate, impFormNumber, schoolName, schoolCode, invoices })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.post('/getImplementationListWithEr', [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions.getImplementationListWithEr({ ...req.body })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
})

router.get("/getImplementationListByApprovalStatus", [auth.authenticateToken], async (req, res) => {
  let { search, pageNo, limit, sortKey, sortOrder, approvalStatus, scheduleStatus } = req.query;
  return implementationFormFunctions
    .getImplementationListByApprovalStatus({ search, pageNo, limit, sortKey, sortOrder, approvalStatus, scheduleStatus })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.get("/getImplementationList/:id", [auth.authenticateToken], async (req, res) => {
  let { id } = req.params;
  return implementationFormFunctions
    .getImplementationById(id)
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.put("/updateStatus", [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions
    .updateImplementationByStatus({ ...req.body })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.put('/updateScheduleStatus', [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions
    .updateScheduleStatus({ ...req.body })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.put("/updateActivationPackage", [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions
    .updateActivationPackage({ ...req.body })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.put('/updateAssignedEngineer', [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions.updateAssignedEngineer({ ...req.body })
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateImpApprovalStatus', [auth.authenticateToken, updateStatusValidator], async (req, res) => {
  return implementationFormFunctions.updateImpApprovalStatus(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post("/createProductField", [auth.authenticateToken], async (req, res) => {
  let obj = req.body;
  return implementationFormFunctions
    .createProductField({ ...obj })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.get("/getProductField", [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions.getProductField()
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.post("/getActivatedImplementationList", [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions
    .getActivatedImplementationList(req.body)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
})

router.put('/updateHardwareDetails', [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions.updateHardwareDetails(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateReturnedHardwareProduct', [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions.updateReturnedHardwareProduct(req.body)
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getImplementationByCondition', [auth.authenticateToken], async (req, res) => {
  return implementationFormFunctions.getImplementationByCondition({ ...req.query })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
})

module.exports = router;
