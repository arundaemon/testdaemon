const activityFormMappingControllers = require("../controllers/activityFormMappingControls");
const bdeActivityControllers = require("../controllers/bdeActivitiesControls");
const customExceptions = require("../responseModels/customExceptions");
const { param } = require("../routes/crmMasterRoutes");
const xlsx = require('xlsx');
const { MIGRATION_STAGE_STATUS } = require('../constants/dbConstants');
const moment = require('moment');
const CrmFieldMaster = require('../models/crmFieldMasterModel');


const getActivityFormNumber = async (params) => {
  // console.log("functions")
  return activityFormMappingControllers
    .getActivityFormNumber(params)
    .then((result) => {
      return { message: "Activity Form Number Fetched  successfully", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getFormToActivity = async (params) => {
  // console.log("functions")
  return activityFormMappingControllers
    .getFormToActivity(params)
    .then((result) => {
      return { message: "Form To Activity Fetched  successfully", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getActivityToActivity = async (params) => {
  // console.log("functions")
  return activityFormMappingControllers
    .getActivityToActivity(params)
    .then((result) => {
      return { message: "Activity To Activity Fetched  successfully", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const createActivityFormMapping = async (params) => {
  return activityFormMappingControllers
    .isDuplicateCombination(params)
    .then((result) => {
      if (result) {
        throw customExceptions.duplicateCombination();
      }
      return activityFormMappingControllers.createActivityFormMapping(params);
    })
    .then((result) => {
      return { message: `Activity Form Mapping is created`, result };
    })
    .catch((error) => {
      throw error;
    });
};

const createFormMappingProductArray = async (params) => {
  let { product } = params;
  let newParams = product?.map((item) => {
    return {
      ...params,
      product: item?.value,
      productCode: item?.productCode,
      refId: item?.refId,
      groupCode: item?.groupCode

    };
  });
  return activityFormMappingControllers
    .createActivityFormMapping(newParams)
    .then((result) => {
      return { message: `Activity Form Mapping is created`, result };
    })
    .catch((error) => {
      throw error;
    });
};

const getActivityFormMappingList = async (params) => {
  let MappingList =
    activityFormMappingControllers.getActivityFormMappingList(params);

  return Promise.all([MappingList])
    .then((response) => {
      let [result] = response;
      return { message: "Mapping List", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getDependentFields = async (params) => {
  let { customerResponse, leadStage, leadStatus, subject, priority, name, } =
    params;

  if (!customerResponse) {
    let response = {
      statusCode: 0,
      result: {},
      message: "CustomerResponse not found",
    };
    return response;
  }

  if (!leadStage) {
    let response = {
      statusCode: 0,
      result: {},
      message: "StageName not found",
    };
    return response;
  }

  if (!subject) {
    let response = {
      statusCode: 0,
      result: {},
      message: "Subject not found",
    };
    return response;
  }

  // if (!priority) {
  //   let response = {
  //     statusCode: 0,
  //     result: {},
  //     message: "Priority not found",
  //   };
  //   return response;
  // }

  if (!leadStatus) {
    let response = {
      statusCode: 0,
      result: {},
      message: "statusName not found",
    };
    return response;
  }

  let bdeParam = { leadId: "" };

  if (params.priority == "HOTS" || params.priority == "Pipeline") {
    bdeParam.leadId = params.leadId;
    bdeParam.status = 'Complete'
  }

  let activityFormMapping =
    await activityFormMappingControllers.getDependentFields(params);

  let bdeActivityObj = await bdeActivityControllers.getLastBdeActivityDetails(
    bdeParam
  );

  if (bdeActivityObj.length === 0 && leadStage === MIGRATION_STAGE_STATUS.STAGE && leadStatus === MIGRATION_STAGE_STATUS.STATUS) {
    bdeActivityObj = await getExcelFormValue(params);
  }

  return Promise.allSettled([activityFormMapping, bdeActivityObj])
    .then((result) => {
      return { message: `Details`, result };
    })
    .catch((error) => {
      throw error;
    });
};

const getExcelFormValue = async (params) => {
  try {
    const file = xlsx.readFile('Hots data upload.csv');
    let data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    let formFieldValues = [];
    for (let item of data) {
      if (item?.['School Code'] === params?.schoolCode && item?.['Product'] === params?.name) {
        let obj = {
          schoolCode: item?.['School Code'],
          schoolName: item?.['School Name'],
          product: item?.['Product'],
          productType: item?.['Product Type'],
          escUnit: item?.['ESC Unit'],
          contactDurationInMonths: item?.['Contact Duration In Months'],
          ratePerStudent: item?.['Rate Per Student'],
          ratePerClassroom: item?.['Rate Per Classroom or Months'],
          paymentSchedule: item?.['Payment Schedule'],
          monthlyInvoice: item?.['Monthly Invoice'],
          softwareContractValue: item?.['Software Contract Value'],
          hardware: item?.['Hardware'],
          hardwareProduct: item?.['Hardware Product'],
          hardwareContractValue: item?.['Hardware Contract Value'],
          studentUnit: item?.['Student Unit'],
          course: item?.['Course'],
          grade: item?.['Grade'],
          lectureDeliveryType: item?.['Lecture Delivery Type'],
          offeringType: item?.['Offering Type'],
          assessmentCenter: item?.['Assessment Centre'],
          weeklyExclusiveDoubtSession: item?.['Weekly Exclusive Doubt Session'],
          weeklyExclusiveDoubtSessionNew: item?.['Weekly Exclusive doubt Session'],
          numberofStudent: item?.['Number of Student'],
          numberOfBatches: item?.['Number Of batches'],
          numberOfStudentsPerBatch: item?.['Number Of Students Per batches'],
          testPrepPackageSellingPricePerStudent: item?.['Test Prep Package Selling Price Per Student'],
          assessmentCentrePricePerStudent: item?.['Assessment Centre Price Per Student'],
          grossSellingPricePerStudent: item?.['Gross Selling Price Per Student'],
          duration: item?.['Duration'],
          grossContractValue: item?.['Gross Contract Value'],
          units: item?.['Units'],
          grades: item?.['Grades'],
          grossRatePerUnit: item?.['Gross Rate Per Unit'],
          netRatePerUnit: item?.['Net Rate Per Unit'],
          netMonthlyInvoicing: item?.['Net Monthly Invoicing'],
          ratePerUnit: item?.['Rate Per Unit'],
          numberOfUnits: item?.['Number Of Units'],
          contractDuration: item?.['Contract Duration'],
          netSellingPriceStudent: item?.['Net Selling Price Student'],
          netContractValue: item?.['Net Contract Value'],
          netHardwareContractValue: item?.['Net Hardware Contract Value'],
          netESCPlusContractValue: item?.['Net ESC Plus Contract Value'],
          teacherUnits: item?.['Teacher Units'],
          quantity: item?.['Quantity'],
          edc: moment(item?.['EDC'], 'DD-MM-YYYY').toDate()
        }
        formFieldValues.push(obj);
        break;
      }
    }
    return formFieldValues;

  }
  catch (error) {
    console.log(error, '... error in excel form value');
    throw { errorMessage: error }
  }
}

const getActivityMappingDetails = async (params) => {
  let { stageName, statusName, productCode, type } = params;

  if (!stageName) {
    let response = {
      statusCode: 0,
      result: {},
      message: "StageName not found",
    };
    return response;
  }

  if (!statusName) {
    let response = {
      statusCode: 0,
      result: {},
      message: "StatusName not found",
    };
    return response;
  }

  let query = { stageName, statusName, isDeleted: false };
  if (type !== 'Implementation') {
    query.productCode = productCode;
  }

  return activityFormMappingControllers
    .getActivityMappingDetails(query)
    .then((result) => {
      return {
        message: `Activity Form Mapping Details on the basis of ${params.stageName} and ${params.statusName}`,
        result,
      };
    })
    .catch((error) => {
      throw error;
    });
};

const updateActivityFormMapping = async (params) => {
  return activityFormMappingControllers
    .isDuplicateCombination(params)
    .then((result) => {
      if (result) {
        throw customExceptions.duplicateCombination();
      }
      return activityFormMappingControllers.updateActivityFormMapping(params);
    })
    .then((result) => {
      return { message: `Activity Form Mapping is updated`, result };
    })
    .catch((error) => {
      throw error;
    });
};

const deleteActivityFormMapping = async (params) => {
  return activityFormMappingControllers
    .deleteActivityFormMapping(params)
    .then((result) => {
      return { message: `Activity Form Mapping Deleted Successfully!`, result };
    });
};

const getDetails = async (params) => {
  try{
  let { data } = params;
  let promise = [];
  for (let item of data) {
    let obj = {
      productCode: item.productCode,
      stageName: item.leadStage,
      statusName: item.leadStatus,
      meetingStatus: item.meetingStatus,
      type: item?.type
    };
    const result = activityFormMappingControllers.getDetails(obj);
    promise.push(result);
  }
  return Promise.all(promise)
    .then((result) => {
      let finalResult = [];
      result.map((item) => {
        if (!item) {
          let obj = {
            activityId: "",
            futureActivityId: "",
          };
          finalResult.push(obj);
        } else {
          finalResult.push(item);
        }
      });
      return { message: `Details fetched successfully`, finalResult };
    })
    .catch((error) => {
      console.error(error, ".....err inside get details ");
      throw { errorMessage: error };
    });
  }catch(error) {
    console.error(error, ".....err inside get details ");
    throw { errorMessage: error };
  }
};

const getHotsField = async (params) => {
  try {
    const result = await activityFormMappingControllers.getHotsField(params);
    let hotsFieldSet = new Map();
    result?.forEach(item => {
      item?.dependentFields?.forEach(field => {
        hotsFieldSet.set(field?.fieldName, field);
      });
    });
    let hotsField = Array.from(hotsFieldSet, ([name, value]) => (value));
    return { message: 'HOTS & Pipeline Field Fetched Successfully', result: hotsField };
  }
  catch (error) {
    throw { errorMessage: error }
  }

}

const updateDependentFields = async (params) => {
  const fieldData = await CrmFieldMaster.findById(params?._id);
  const result = await activityFormMappingControllers.updateDependentFields({ fieldCode: fieldData?.fieldCode, ...params });
  return result;
}

module.exports = {
  getActivityFormNumber,
  getFormToActivity,
  getActivityToActivity,
  createActivityFormMapping,
  getActivityFormMappingList,
  updateActivityFormMapping,
  deleteActivityFormMapping,
  getDependentFields,
  getActivityMappingDetails,
  getDetails,
  createFormMappingProductArray,
  getHotsField,
  updateDependentFields
};
