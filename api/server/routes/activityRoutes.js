const express = require("express");
const router = express.Router();
const activityFunctions = require("../functions/activityFunctions");
const responseHandler = require("../utils/responseHandler");
const activityValidator = require("../validators/activityValidator");

router.post("/createActivity", [], async (req, res) => {
  return activityFunctions
    .createActivity({ ...req.body })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.get(
  "/getActivityList",
  [activityValidator.validateGetActivityList],
  async (req, res) => {
    return activityFunctions
      .getActivityList({ ...req.query })
      .then((result) => {
        return responseHandler.sendSuccess(res, result, req);
      })
      .catch((error) => {
        return responseHandler.sendError(res, error, req);
      });
  }
);

router.put("/updateActivity", [], async (req, res) => {
  return activityFunctions
    .updateActivity({ ...req.body })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.put("/deleteActivity", [], async (req, res) => {
  return activityFunctions
    .deleteActivity({ ...req.body })
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

router.get("/getActivity", async (req, res) => {
  return activityFunctions
    .getActivity({ ...req.query })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.get("/getTrueActivity", async (req, res) => {
  return activityFunctions
    .getTrueActivity({ ...req.query })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.get("/getAllActivities", async (req, res) => {
  return activityFunctions
    .getAllActivities({ ...req.query })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.get("/getActivityByKey", async (req, res) => {
  return activityFunctions
    .getActivityByKey(req.query)
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.post("/getActivitiesDetail", async (req, res) => {
  return activityFunctions
    .getActivitiesDetail(req.body)
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

module.exports = router;
