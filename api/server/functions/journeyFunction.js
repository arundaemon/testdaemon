const journeyControls = require("../controllers/journeyControls");
const cycleControls = require("../controllers/cycleControls");
const config = require('../config');
const customExceptions = require("../responseModels/customExceptions");

const createJourney = async (params) => {
  let journeyName = { $regex: params.journeyName, $options: "i" };

  return journeyControls
    .findOneByKey({ journeyName: journeyName, isDeleted: false })
    .then((journeyExist) => {
      if (journeyExist) throw { errorMessage: "Journey already exist." };

      return journeyControls.createJourney(params);
    })
    .then((result) => {
      return { message: `Journey created successfully!`, result };
    })
    .catch((err) => {
      throw err;
    });
};

const updateJourney = async (params) => {
  return journeyControls
    .findOneByKey({
      journeyName: params.journeyName,
      _id: { $ne: params?.journeyId },
      isDeleted: false,
    })
    .then((journeyExist) => {
      if (journeyExist) throw `Journey  with this name already exists!`;

      return journeyControls.updateJourney(params);
    })
    .then((result) => {
      return { message: `Journey Updated Successfully!`, result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getJourneyList = async (params) => {
  let { search, pageNo, count, sortKey, sortOrder } = params;

  let journeyList = journeyControls.getJourneyList({
    search,
    pageNo,
    count,
    sortKey,
    sortOrder,
  });

  return Promise.all([journeyList]).then((res) => {
    let [result] = res;

    return { message: "Journeys list", result };
  });
};

const deleteJourney = async (params) => {
  let { journeyId: _id } = params;

  return journeyControls.deleteJourney(params).then(async (result) => {
    try {
      let journeyQuery = { _id };
      let journeyUpdate = { linkedCycle: [] };
      await updateJourneyByKey(journeyQuery, journeyUpdate);

      let cycleQuery = { journeyId: _id };
      let cycleUpdate = { $unset: { journeyId: 1 } };
      await cycleControls.updateManyByKey(cycleQuery, cycleUpdate);
    } catch (err) {
      throw err;
    }
    return { message: "Journey deleted successfully !", result };
  });
};

const getAllJourneys = async (params) => {
  return journeyControls.getAllJourneys(params).then((result) => {
    return { message: "All Journey list", result };
  });
};

const getJourney = async (params) => {
  return journeyControls.getJourney(params).then((result) => {
    return { message: "Journey finded successfully !", result };
  });
};

const changeStatus = async (_id, status) => {
  return journeyControls.changeStatus(_id, status).then(async (result) => {
    try {
      if (status === 0) {
        let journeyQuery = { _id };
        let journeyUpdate = { linkedCycle: [] };
        await updateJourneyByKey(journeyQuery, journeyUpdate);

        let cycleQuery = { journeyId: _id };
        let cycleUpdate = { $unset: { journeyId: 1 } };
        await cycleControls.updateManyByKey(cycleQuery, cycleUpdate);
      }
    } catch (err) {
      throw err;
    }
    return { message: `Status changed`, result };
  });
};

const updateJourneyByKey = async (query, update) => {
  return journeyControls.updateJourneyByKey(query, update);
};

const getActiveJourneys = async (params) => {
  return journeyControls.getActiveJourneys(params).then((result) => {
    return { message: "All the Active Journey list", result };
  });
};

const getB2BDefaultStageStatus = async () => {
  try {
    let data = {};

    const result = await journeyControls.getLinkedJourneyList();

    result.map((journey) => {
      if (journey?.journeyName === `${config.cfg.B2B_JOURNEY}`) {
        if (journey?.linkedCycle.length > 0) {
          let cycle = journey.linkedCycle[0];

          data.cycleName = cycle.cycleName;

          if (cycle?.linkedStage.length > 0) {
            let stage = cycle.linkedStage[0];

            data.stageName = stage.stageName;

            if (stage?.linkedStatus.length > 0) {
              let status = stage.linkedStatus[0];

              data.statusName = status.statusName;
            }
          }
        }
      }
    });

    return { message: "Default Stage Status", data };
  } catch (error) {
    console.log(error, "........err in default stage status of b2b");

    throw { errorMessage: error };
  }
};

module.exports = {
  createJourney,
  updateJourney,
  getJourneyList,
  deleteJourney,
  getAllJourneys,
  getJourney,
  changeStatus,
  updateJourneyByKey,
  getActiveJourneys,
  getB2BDefaultStageStatus,
};
