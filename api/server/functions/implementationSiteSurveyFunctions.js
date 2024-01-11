const implementationSiteSurveyControls = require("../controllers/implementationSiteSurveyControls");
const { uploadImage } = require("../middlewares/fileUploader");
const implementationFormFunction = require("../functions/implementationFormFunctions");
const xlsx = require("xlsx");
const BdeActivities = require("../models/bdeActivitiesModel");
const bdeActivityControls = require('../controllers/bdeActivitiesControls');
const { IMPLEMENTATION_STAGE } = require('../constants/dbConstants');
const customExceptions = require('../responseModels/customExceptions');

const createSiteSurvey = async (params) => {
  try {
    let path = "";
    const keysToParse = [
      "IFPOnlineConfiguration",
      "serverConfiguration",
      "classRoomDetails",
      "standaloneOnlineConfiguration",
      "productDetails"
];

    if (params?.file) {
      path = await uploadImage(
        params?.file,
        "site-survey-consent/",
        params?.createdByEmpCode
      );
      params.consentFile = path;
    }
    keysToParse.forEach((key) => {
      if (params[key] && typeof params[key] === "string") {
        params[key] = JSON.parse(params[key]);
      }
    });
    if (!params?.siteSurveyCode) {
      if(!params?.file) throw customExceptions.consentFileRequired();
      let siteSurveyCode =
        await implementationSiteSurveyControls.getSiteSurveyCode(params);
      params.siteSurveyCode = siteSurveyCode;
    }

    return implementationSiteSurveyControls
      .createSiteSurvey({ ...params})
      .then((result) => {
        if (result) {
          let obj = {
            impFormNumber: params?.implementationCode,
            status: "SSR Submitted",
            modifiedByName: params?.createdByName,
            modifiedByRoleName: params?.createdByRoleName,
            modifiedByProfileName: params?.createdByProfileName,
            modifiedByEmpCode: params?.createdByEmpCode,
            modifiedByUuid: params?.createdByUuid,
          };
          implementationFormFunction.updateImplementationByStatus(obj);
          updateSSRActivity(params);
        }
        return { message: `Site Survey Form Submitted Successfully!`, result };
      })
      .catch((error) => {
        console.log(error, ":: error in create fun");
        throw { errorMessage: error };
      });
  } catch (error) {
    console.log(error, ":: err in create fun");
    throw { errorMessage: error };
  }
};

const updateSSRActivity = async (params) => {
  let { implementationCode, createdByRoleName } = params;
  let query = {
    leadId: implementationCode,
    createdByRoleName,
    status: 'Complete',
    subject: `${IMPLEMENTATION_STAGE.SITE_SURVEY}`
  }
  let update = {
    isSsrSubmitted: true
  }
  let options = { new: true };
  bdeActivityControls.updateManyByKey(query, update, options);
}

const getSiteSurveyList = async (params) => {
  const surveyList = implementationSiteSurveyControls.getSiteSurveyList(params);
  const listCount =
    implementationSiteSurveyControls.getSiteSurveyListCount(params);
  return Promise.all([surveyList, listCount])
    .then((response) => {
      let [result, totalCount] = response;
      return { message: "Site Survey List", result, totalCount };
    })
    .catch((error) => {
      console.log(error, "...........err in list");
      throw { errorMessage: error };
    });
};

const getSiteSurveyDetails = async (params) => {
  return implementationSiteSurveyControls
    .getSiteSurveyDetails(params)
    .then((result) => {
      return { message: "Implementation Site Survey Detail", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getDataFromExcel = async (req) => {
  try {
    const file = xlsx.read(req.file.buffer);
    const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    return { message: "Excel data fetched successfully", data };
  } catch (error) {
    console.log(error, ":: error in excel fun");
    throw { errorMessage: error };
  }
};

const getPrevSsrFormData = async (params) => {
  try {
    let ssrData;
    let ssrActivity = await BdeActivities.find({
      leadId: params?.leadId,
      leadType: params?.leadType,
      status: "Complete",
    });
    if (ssrActivity && ssrActivity.length > 0) {
      ssrData = await implementationSiteSurveyControls.getPrevSsrFormData(
        params
      );
    }
    return { message: "Previous SSR Form Data", result: ssrData };
  } catch (error) {
    console.log(error, ":: error in getPrevSsrFormData");
    throw { errorMessage: error };
  }
};

const updateApprovalStatus = async (params) => {
  return implementationSiteSurveyControls.updateApprovalStatus(params)
    .then((result) => {
      let obj = {
        status: params?.status,
        impFormNumber: params?.referenceCode,
        modifiedByName: params?.modifiedByName,
        modifiedByRoleName: params?.modifiedByRoleName,
        modifiedByProfileName: params?.modifiedByProfileName,
        modifiedByEmpCode: params?.modifiedByEmpCode,
        modifiedByUuid: params?.modifiedByUuid,
      };
      implementationFormFunction.updateImplementationByStatus(obj)
      return { message: "Implementation Site Survey Approved", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};


module.exports = {
  createSiteSurvey,
  getSiteSurveyList,
  getSiteSurveyDetails,
  getDataFromExcel,
  getPrevSsrFormData,
  updateApprovalStatus
};
