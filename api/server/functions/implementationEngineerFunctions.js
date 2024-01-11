const implementationEngineerControls = require('../controllers/implementationEngineerControls');
const implementationControls = require('../controllers/implementationFormControls');
const customExceptions = require('../responseModels/customExceptions');

const assignEngineer = async (params) => {
    try {
        let result;
        let ifExist = await implementationEngineerControls.getEngineerDetails({ implementationCode: params?.impFormNumber, type: params?.type, assignedEngineerRoleName: params?.assignedEngineerRoleName, isDeleted: false });
        if (ifExist && ifExist.length > 0) {
            return "This engineer is already assigned";
        }
        let impDetail = await implementationControls.getImplementationByCondition({ impFormNumber: params?.impFormNumber });
        let data = {
            implementationCode: params?.impFormNumber,
            type: params?.type,
            isPrimary: true,
            assignedEngineerName: params?.assignedEngineerName,
            assignedEngineerEmpCode: params?.assignedEngineerEmpCode,
            assignedEngineerRoleName: params?.assignedEngineerRoleName,
            assignedEngineerProfileName: params?.assignedEngineerProfileName,
            createdByName: params?.modifiedByName,
            createdByRoleName: params?.modifiedByRoleName,
            createdByProfileName: params?.modifiedByProfileName,
            createdByEmpCode: params?.modifiedByEmpCode,
            createdByUuid: params?.modifiedByUuid,
            schoolId: impDetail[0]?.schoolId,
            schoolCode: impDetail[0]?.schoolCode,
            schoolName: impDetail[0]?.schoolName,
            schoolPinCode: impDetail[0]?.schoolPinCode,
            schoolAddress: impDetail[0]?.schoolAddress,
            schoolEmailId: impDetail[0]?.schoolEmailId,
            schoolCountryCode: impDetail[0]?.schoolCountryCode,
            schoolCountryName: impDetail[0]?.schoolCountryName,
            schoolType: impDetail[0]?.schoolType,
            schoolStateCode: impDetail[0]?.schoolStateCode,
            schoolStateName: impDetail[0]?.schoolStateName,
            schoolCityCode: impDetail[0]?.schoolCityCode,
            schoolCityName: impDetail[0]?.schoolCityName
        }
        switch (params?.type) {
            case 'SSR': {
                result = await implementationEngineerControls.assignSsrEngineer(data);
                break;
            }
            case 'QC': {
                // let details = await implementationEngineerControls.getEngineerDetails({ implementationCode: params?.formNum, type: params?.type, isDeleted: false });
                // if (details && details.length > 0) {
                //     data.isPrimary = false;
                // } else {
                //     data.isPrimary = true;
                // }
                result = await implementationEngineerControls.assignQcEngineer(data);
            }
        }
        return result;
    }
    catch (err) {
        console.log(err,':: error in engineer fun');
        throw { errorMessage: err };
    }
}

const getEngineerDetails = async (params) => {
    let query = {
        implementationCode: params?.implementationCode,
        type: params?.type,
        isDeleted: false
    }
    return implementationEngineerControls.getEngineerDetails(query)
    .then((result) => {
      return {
        message: `Engineer details fetched successfully`,
        result,
      }
    })
    .catch((e) => {
      throw e
    })
}

const myAssignedTaskList = async (params) => {
    return implementationEngineerControls.myAssignedTaskList(params)
    .then((result) => {
      return {
        message: `Assigned task list fetched successfully`,
        result,
      }
    })
    .catch((e) => {
      throw e
    })
}

module.exports = {
    assignEngineer,
    getEngineerDetails,
    myAssignedTaskList
}