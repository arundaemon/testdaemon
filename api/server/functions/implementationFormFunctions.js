const implementationFormControls = require("../controllers/implementationFormControls");
const ImplementationModel = require('../models/implementationFormModel');
const { getLeadJourneyDetails } = require('./leadJourneyMappingFunctions');
const { createManyStageStatus } = require('../controllers/leadStageStatusControls');
const { LEAD_TYPE } = require('../constants/dbConstants');
const { updateLead } = require('../controllers/bdeActivitiesControls');
const purchaseOrderControls = require('../controllers/purchaseOrderControls')
const packagefunctions = require('../functions/packageFunctions');
const axios = require('axios');
const implementationEngineerFunctions = require('../functions/implementationEngineerFunctions');
const leadOwnerFunctions = require('../functions/leadOwnerFunctions');

const implementationCompleteForm = async (params) => {
  // let impFormNumber = await implementationFormControls.getImpFormCode(params)
  // params.impFormNumber = impFormNumber
  // return implementationFormControls.isDuplicatePo(params.impFormNumber).then((result) => {
  //   if (result) {
  //     throw { message: "Duplicate code" }
  //   }
  return implementationFormControls.createCompleteImplementationForm(params)
    .then((result) => {
      return {
        message: `Implementation Complete Form Created successfully!`,
        result,
      }
    }).catch((err) => {
      throw err;
    });

};

const getImplementationList = async (params) => {
  let implementationList =
    implementationFormControls.getImplementationList(params);
  return Promise.all([implementationList])
    .then((response) => {
      let [result] = response;
      return { message: "Implementation List", result };
    })
    .catch((error) => {
      console.log(error, '..........error in list');
      throw { errorMessage: error };
    });
};

const getImplementationListByApprovalStatus = async (params) => {
  let implementationList =
    implementationFormControls.getImplementationListByApprovalStatus(params);
  return Promise.all([implementationList])
    .then((response) => {
      let [result] = response;
      return { message: "Implementation List", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const getImplementationById = async (id) => {
  return implementationFormControls
    .getImplementationById(id)
    .then((result) => {
      return { message: `Implementation details`, result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const updateImplementationByStatus = async (params) => {
  return implementationFormControls
    .updateImplementationByStatus(params)
    .then((result) => {
      return { message: `Implementation Status Is Successfully Updated`, result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const updateScheduleStatus = async (params) => {
  if (!params.impFormNumber) {
    throw { errorMessage: 'Please provide Implementation Form Number (impFormNumber)' }
  }
  let query = {
    impFormNumber: params.impFormNumber
  }
  let update = {
    scheduleStatus: 'Generated'
  }
  return implementationFormControls
    .updateRecord(query, update)
    .then((result) => {
      return { message: `Schedule status updated Successfully`, result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
}

const updateActivationPackage = async (params) => {
  return implementationFormControls
    .updateActivationPackage(params)
    .then((result) => {
      return { message: `Package Activated Successfully`, result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
};

const updateAssignedEngineer = async (params) => {
  try {
    let { implementationList, status, modifiedByName, modifiedByUuid, modifiedByRoleName, modifiedByProfileName, modifiedByEmpCode, ssrEngineerAssigned, qcEngineerAssigned } = params;
    let result = [];
    for (let item of implementationList) {
      let query = { impFormNumber: item?.impFormNumber, isDeleted: false };
      let update = {
        status,
        modifiedByName,
        modifiedByUuid,
        modifiedByRoleName,
        modifiedByProfileName,
        modifiedByEmpCode
      }
      if (qcEngineerAssigned) update.qcEngineerAssigned = qcEngineerAssigned;
      else if (ssrEngineerAssigned) update.ssrEngineerAssigned = ssrEngineerAssigned;
      let implementationResult = await implementationFormControls.updateAssignedEngineer(query, update);
      let engineerResult = await implementationEngineerFunctions.assignEngineer({ ...params, ...item });
      result.push({
        engineerResult,
        implementationResult
      })
    }
    return { message: 'Engineer assigned successfully', result };
  }
  catch (err) {
    console.log(err, ':: err in update engineer');
    throw { errorMessage: err };
  }
}

const updateImpApprovalStatus = async (params) => {
  return implementationFormControls
    .updateImpApprovalStatus(params)
    .then(result => {
      return { message: `Implementation Approval Status Updated Succesfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const createProductField = async (params) => {
  return implementationFormControls.createProductField(params)
    .then((result) => {
      return {
        message: `Product Fields created successfully!`,
        result,
      }
    })
    .catch((e) => {
      throw e
    })
}

const getProductField = async () => {
  return implementationFormControls.getProductField()
    .then((result) => {
      return {
        message: `Product Fields fetched Successfully!`,
        result,
      }
    })
    .catch((e) => {
      throw e
    })
}

const getActivatedImplementationList = async (params) => {
  let implementationList = await implementationFormControls.getActivatedImplementationList(params);
  return Promise.all([implementationList])
    .then((response) => {
      let [result] = response;
      return { message: "Activated Implementation List", result };
    })
    .catch((error) => {
      throw { errorMessage: error };
    });
}
const implementationStageStatus = async (leadArr, type) => {
  for (let impFormNumber of leadArr) {
    let leadObj = await ImplementationModel.findOne({ impFormNumber }).lean();
    let data = {
      leadId: leadObj?.impFormNumber,
      leadType: type,
      createdDate: leadObj?.createdAt,
      state: leadObj?.schoolStateName,
      city: leadObj?.schoolCityName,
      email: leadObj?.schoolEmailId,
    }
    let { leadData, list } = await getLeadJourneyDetails(data)
    if (list && list.length > 0) {
      createManyStageStatus(list)
    }
    let obj = {
      leadId: leadData.leadId,
      leadType: type,
      update: {
        journey: leadData.journeyName,
        cycle: leadData.cycleName,
        stage: leadData.stageName,
        status: leadData.statusName
      }
    }
    if (leadData.stageName && leadData.statusName) {
      let data = updateImplementationLead(obj)
      // updateLead(obj)
    }
  }
  return { status: 1, msg: "Success" }
}

const updateImplementationLead = async (params) => {
  if (params.impFormNumber) {
    return implementationFormControls.updateOneByKey({ impFormNumber: params.impFormNumber }, params.update, { new: true, upsert: false })
  } else {
    return null
  }
}

const updateImpByPOApproval = async (params, headerValue, tokenPayload) => {
  let purchaseOrderCode = params?.referenceCode;
  let purchaseOrder = await purchaseOrderControls.getPurchaseOrderDetails(purchaseOrderCode)
  let impList = await implementationFormControls.getImplementationById(purchaseOrderCode)
  for (let i = 0; i < impList.length; i++) {
    if (impList[i].status === 'Draft') {
      let updateApprovalData = {
        referenceCode: impList[i]?.impFormNumber,
        approvalStatus: "Approved",
        status: "New",
        modifiedByName: tokenPayload?.name,
        modifiedByRoleName: tokenPayload?.crm_role,
        modifiedByProfileName: tokenPayload?.crm_profile,
        modifiedByEmpCode: tokenPayload?.username || tokenPayload?.employee_code,
        modifiedByUuid: tokenPayload?.lead_id,
      }
      await implementationFormControls.updateApprovalStatus(updateApprovalData)
      let packageDetails = impList[i]?.productDetails;
      let packageActivationData = {
        school_code: impList[i]?.schoolCode,
        implementation_id: impList[i]?.impFormNumber,
        po_code: impList[i]?.purchaseOrderCode,
        quotation_code: impList[i]?.quotationCode,
        school_email: impList[i]?.schoolEmailId || impList[i]?.schoolAdminSPOCEmail,
        school_mobile: `+91-${impList[i]?.schoolAdminSPOCPhnNo}`,
        lecture_mode: "impartus",
        coordinator_count: Number(impList[i]?.noOfCordinators),
        city: impList[i]?.schoolCityName,
        country: impList[i]?.schoolCountryName || "India",
        country_code: 91,
        country_id: 99,
        state: impList[i]?.schoolStateName,
        activation_type: packageDetails[0].quotationFor === "ACTUAL" ? 1 : 2,
        package_details: [],
        uuid: tokenPayload?.lead_id,
      };
      let agreementEnd = new Date(purchaseOrder?.agreementEndDate)
      agreementEnd = agreementEnd.toISOString().split('T')[0];

      for (let i = 0; i < packageDetails?.length; i++) {
        if (
          packageDetails[i].productCode === "esc_plus_basic" ||
          packageDetails[i].productCode === "esc_plus_pro" ||
          packageDetails[i].productCode === "esc_plus_advanced"
        ) {
          let productObject = {
            product_code: packageDetails[i]?.productCode || "",
            package_id: packageDetails[i]?.productItemRefId || "",
            student_count: Number(packageDetails[i]?.studentCount || 0),
            teacher_count: Number(packageDetails[i]?.teacherCount || 0),
            validity: agreementEnd,
            esc_count: Number(packageDetails[i]?.implementedUnit || 0),
            mrp: Number(packageDetails[i]?.productItemMrp || 0),
            mop: Number(packageDetails[i]?.productItemMop || 0),
            selling_price: Number(packageDetails[i]?.productItemSalePrice || 0),
            version: "V001",
            syllabus_details: [
              {
                board_id: packageDetails[i]?.boardID,
                class_details: [
                  {
                    class_id: packageDetails[i]?.classID,
                  },
                ],
              },
            ],
          };
          packageActivationData.package_details.push(productObject);
        } else if (packageDetails[i].productCode === 'sip_live_class') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: Number(packageDetails[i].implementedUnit),
            teacher_count: "",
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)
        } else if (packageDetails[i].productCode === 'retail_live_class') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: Number(packageDetails[i].implementedUnit),
            teacher_count: "",
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)

        } else if (packageDetails[i].productCode === 'em_power') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: Number(packageDetails[i].studentCount),
            teacher_count: Number(packageDetails[i].teacherCount),
            esc_count: Number(packageDetails[i].implementedUnit),
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)

        } else if (packageDetails[i].productCode === 'self_study') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: Number(packageDetails[i].implementedUnit),
            teacher_count: "",
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)

        } else if (packageDetails[i].productCode === 'la') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: Number(packageDetails[i].implementedUnit),
            teacher_count: "",
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)

        } else if (packageDetails[i].productCode === 'toa') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: Number(packageDetails[i].implementedUnit),
            teacher_count: "",
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)

        } else if (packageDetails[i].productCode === 'teaching_app') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: "",
            teacher_count: Number(packageDetails[i].implementedUnit),
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)

        } else if (packageDetails[i].productCode === 'assement_centre') {
          let batchId = packageDetails[i]?.batchTiming?.batch_id || null
          let productObject = {
            product_code: packageDetails[i].productCode,
            package_id: packageDetails[i]?.productItemRefId || '',
            validity: agreementEnd,
            mrp: Number(packageDetails[i].productItemMrp),
            mop: Number(packageDetails[i].productItemMop),
            selling_price: Number(packageDetails[i].productItemSalePrice),
            version: "",
            student_count: "",
            teacher_count: Number(packageDetails[i].implementedUnit),
            esc_count: "",
            syllabus_details: [{
              board_id: packageDetails[i].boardID,
              class_details: [{
                class_id: packageDetails[i].classID,
                batch_ids: batchId ? [batchId] : []
              }]
            }]
          }
          packageActivationData.package_details.push(productObject)
        }

      }

      let payload = packageActivationData
      let url = 'https://qa-apigateway.extramarks.com/cognito-login-service/auth/b2bPackageActivation'
      let headers = {
        Authorization: headerValue.authorization
      }

      let updateImpData = {
        impFormNumber: impList[i]?.impFormNumber,
        modifiedByName: tokenPayload?.name,
        modifiedByRoleName: tokenPayload?.crm_role,
        modifiedByProfileName: tokenPayload?.crm_profile,
        modifiedByEmpCode: tokenPayload?.username || tokenPayload?.employee_code,
        modifiedByUuid: tokenPayload?.lead_id,
      }

      let response
      try {
        response = await axios.post(url, payload, { headers })
        if (response && response.data.status == 1) {
          updateImpData.packageActivation = true
          updateImpData.status = "System Activated"
          updateImpData.activationResponse = [response.data]
          await implementationFormControls.updateActivationPackage(updateImpData)
        }
      } catch (err) {
        updateImpData.packageActivation = false
        updateImpData.status = "New"
        updateImpData.activationResponse = [err?.response?.data]
        await implementationFormControls.updateActivationPackage(updateImpData)
        console.log(err)
      }
    }
  }

}

const updateHardwareDetails = async (params) => {
  return implementationFormControls.updateHardwareDetails(params)
    .then(result => {
      return { message: `Implementation Hardware Details Updated Successfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateReturnedHardwareProduct = async (params) => {
  return implementationFormControls.updateReturnedHardwareProduct(params)
    .then(result => {
      return { message: `Implementation Hardware Details Updated Successfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }

    })
}

const getImplementationByCondition = async (params) => {
  let query = {
    // stage: params?.stageName,
    status: params?.status,
    isDeleted: false
  };
  return implementationFormControls.getImplementationByCondition(query)
    .then((result) => {
      return {
        message: `Implementations fetched Successfully!`,
        result,
      }
    })
    .catch((e) => {
      throw e
    })
}

const getImplementationListWithEr = async (params) => {
  return implementationFormControls.getImplementationListWithEr(params)
  .then((result) => {
    return {
      message: `Implementation List Fetched Successfully!`,
      result,
    }
  }).catch((err) => {
    throw err;
  });
}

module.exports = {
  implementationCompleteForm,
  getImplementationList,
  getImplementationListByApprovalStatus,
  getImplementationById,
  updateImplementationByStatus,
  updateImpApprovalStatus,
  updateAssignedEngineer,
  //updateAssignedEngineer,
  createProductField,
  getProductField,
  getActivatedImplementationList,
  implementationStageStatus,
  updateActivationPackage,
  updateScheduleStatus,
  updateImpByPOApproval,
  updateHardwareDetails,
  updateReturnedHardwareProduct,
  getImplementationByCondition,
  getImplementationListWithEr
};
