const activityControllers = require("../controllers/activityControls");
const customExceptions = require("../responseModels/customExceptions");

const createActivity = async (params) => {
  let { ID } = params;

  return activityControllers
    .findOneByKey({ activityName: params.activityName, isDeleted: false })
    .then((activityExist) => {
      if (activityExist)
        throw { errorMessage: "Activity with this name already exist." };

      return activityControllers.findOneByKey({ ID, isDeleted: false });
    })
    .then((activityExist) => {
      if (activityExist && ID)
        throw { errorMessage: "Activity ID Already Exist." };

      return activityControllers.createActivity(params);
    })
    .then((result) => {
      return { message: `Activity created successfully!`, result };
    })
    .catch((err) => {
      throw err;
    });
};

const updateActivity = async (params) => {
  let { ID, activityId } = params;

  return activityControllers
    .findOneByKey({ ID, isDeleted: false, _id: { $ne: activityId } })
    .then((activityExist) => {
      if (activityExist) throw "Activity ID Already Exist.";

      return activityControllers.updateActivity(params);
    })
    .then((result) => {
      return { message: "Activity updated successfully", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const deleteActivity = async (params) => {
  return activityControllers
    .deleteActivity(params)
    .then((result) => {
      return { message: "Activity deleted successfully", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getActivityList = async (params) => {
  //console.log(params, "getting the activity");

  let activityList = activityControllers.getActivityList(params);

  return Promise.all([activityList])
    .then((result) => {
      let [activityList] = result;
      return { message: "Activity list", activityList };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getActivity = (params) => {
  return activityControllers.getActivity(params).then((result) => {
    return { message: "Activity finded successfully !", result };
  });
};

const getTrueActivity = (params) => {
  return activityControllers.getTrueActivity(params).then((result) => {
    return { message: "Activity finded successfully !", result };
  });
};

const getAllActivities = (params) => {
  return activityControllers.getAllActivities(params).then((result) => {
    return { message: "All Activity List.", result };
  });
};

const getActivityByKey = (params) => {
  return activityControllers.findOneByKey(params).then((result) => {
    return { message: "Activity By Key.", result };
  });
};

const getActivitiesDetail = (params) => {
  return activityControllers.getActivitiesDetail(params).then((result) => {
    return { message: "Activities by activity id", result };
  });
};

module.exports = {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityList,
  getActivity,
  getTrueActivity,
  getAllActivities,
  getActivityByKey,
  getActivitiesDetail
};
