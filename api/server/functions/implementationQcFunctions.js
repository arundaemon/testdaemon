const implementationQcControls = require('../controllers/implementationQcControls');
const { uploadImage } = require('../middlewares/fileUploader');
const BdeActivities = require('../models/bdeActivitiesModel');
const { IMPLEMENTATION_STAGE, IMPLEMENTATION_STATUS } = require('../constants/dbConstants');
const implementationFormControls = require('../controllers/implementationFormControls');

const uploadQcImageToGcp = async (params) => {
    let { image, createdByEmpCode } = params;
    let iconsFolderPath = "implementation-qc/";

    return uploadImage(image, iconsFolderPath, createdByEmpCode)
        .then(result => {
            return { message: 'Image Uploaded Successfully', result }
        })
};

const getQcList = async (params) => {
    const qcList = implementationQcControls.getQcList(params);
    const listCount = implementationQcControls.getQcListCount(params);
    return Promise.all([qcList, listCount])
      .then((response) => {
        let [result, totalCount] = response;
        return { message: "Implementation QC List", result, totalCount };
      })
      .catch((error) => {
        console.log(error, "...........err in list");
        throw { errorMessage: error };
      });
  };

const createQc = async (params) => {
    try {
        let result = [];
        let statusArr = [];
        for (let item of params?.data) {
            statusArr.push(item?.status);
            if (!item?.qcCode) {
                let code = await implementationQcControls.getQcCode(item);
                item.qcCode = code;
            }           
            let data = await implementationQcControls.createQc(item);
            result.push(data);
        }
        updateImpStatus(statusArr, params?.data[0]?.implementationCode);
        return { message: 'QC created successfully', result };
    }
    catch (err) {
        console.log(err, '..............err');
        throw { errorMessage: err };
    }
};

const updateImpStatus = async (list, impCode) => {
    let stage = `${IMPLEMENTATION_STAGE.HW_IMPLEMENTATION}`;
    let status;
    const allReturned = list.every(status => status === "Return");
    const hasInstalled = list.some(status => status === "Implemented");
    const allInstalledOrReturned = list.every(status => status === "Implemented" || status === "Return");
    const hasReadyOrReturned = list.some(status => status === "Ready for Implementation" || status === "Return");

    if(allReturned) {
        status = `${IMPLEMENTATION_STATUS.CANCELLED}`;
    }else if(hasInstalled) {
        status = `${IMPLEMENTATION_STATUS.PARTIAL_INSTALLATION}`;
    }else if(allInstalledOrReturned) {
        status = `${IMPLEMENTATION_STATUS.INSTALLATION_COMPLETED}`;
    }else if(hasReadyOrReturned) {
        status = `${IMPLEMENTATION_STATUS.READY_FOR_INSTALLATION}`;
    }

    implementationFormControls.updateImplementationByStatus({impFormNumber: impCode, stage, status})

}

const updateQc = async (params) => {
    let promises = [];
    params?.data.map(item => {
        let update = implementationQcControls.updateQc(item);
        promises.push(update);
    });
    return Promise.all(promises)
        .then((result) => {
            return { message: "QC updated successfully", result };
        })
        .catch((error) => {
            throw { errorMessage: error };
        });
}

const saveQcForm = async (data) => {
    try {
        let result = [];
        for (let item of data) {
            let code = await implementationQcControls.getQcCode(item);
            item.qcCode = code;
            let data = await implementationQcControls.createQc(item);
            result.push(data);
        }
        return { message: 'QC created successfully', result };
    }
    catch (err) {
        console.log(err, ':: error inside save qc form----');
        throw { errorMessage: err };
    }

}

const getPrevQcFormData = async (params) => {
    try {
      let qcData;
      let qcActivity = await BdeActivities.find({
        leadId: params?.leadId,
        leadType: params?.leadType,
        status: "Complete",
      });
      if (qcActivity && qcActivity.length > 0) {
        qcData = await implementationQcControls.getPrevQcFormData(
          params
        );
      }
      return { message: "Previous QC Form Data", result: qcData };
    } catch (error) {
      console.log(error, ":: error in getPrevQcFormData");
      throw { errorMessage: error };
    }
  };

module.exports = {
    createQc,
    uploadQcImageToGcp,
    saveQcForm,
    updateQc,
    getPrevQcFormData,
    getQcList
}