const xlsx = require('xlsx');
const targetIncentiveControls = require('../controllers/targetIncentiveControls');
const targetControls = require('../controllers/targetControls');
const targetIncentiveLogFunctions = require('../functions/targetIncentiveLogFunctions')
const productMasterFunctions = require('./productMasterFunctions')
const crmMasterControls = require('../controllers/crmMasterControls');
const leadInterestFunctions = require('../functions/leadInterestFunctions');
const hierarchyFunctions = require('../functions/hierachyFunctions');
const utils = require('../utils/utils');
const { response } = require('express');
const moment = require('moment');

const addTarget = async (req) => {
  const file = xlsx.read(req.file.buffer);
  const fileName = req.file.originalname;
  let { roleName } = req.body;
  const successFile = [];
  const errorFile = [];
  // const childRoles = [];
  const sheetNames = file.SheetNames;
  const totalSheets = sheetNames.length;
  let duplicate = false
  let { createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, targetMonth } = req.body

  const { roleList } = await hierarchyFunctions.getChildRoles({ role_name:roleName });

  let childRoles = roleList?.map(item => item?.roleName)

  for (let i = 0; i < totalSheets; i++) {
    const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);


    if (data?.length === 0) {
      throw { errorMessage: 'Empty File' }
    }


    // data.forEach((res) => {
    for (let res of data) {
      let ErrorString = ''
      res.message = ''


      if ((!res?.['Employee Name'] || !res?.['Employee Code']
        || (res?.['Role Name'] && !childRoles.includes(res?.['Role Name']))
        || !res?.['Role Name'] || !res?.['Profile Name']
        || !res?.['Product']) || res?.['Monthly Target Value'] < 0 || isNaN(res?.['Monthly Target Value'])) {

        if (!res?.['Employee Name']) {
          ErrorString = ErrorString + ' EmployeeName is required,'
        }
        if (!res?.['Employee Code']) {
          ErrorString = ErrorString + ' EmployeeCode is required,'
        }
        if (!res?.['Role Name']) {
          ErrorString = ErrorString + ' RoleName is required,'
        }
        if (!res?.['Profile Name']) {
          ErrorString = ErrorString + ' ProfileName is required,'
        }
        if (!res?.['Product']) {
          ErrorString = ErrorString + ' Product is required,'
        }
        if (res?.['Monthly Target Value'] < 0 || isNaN(res?.['Monthly Target Value'])) {
          ErrorString = ErrorString + ' Invalid Monthly Target Value Found,'
        }
        if (res?.['Role Name'] && !childRoles.includes(res?.['Role Name'])) {
          ErrorString = ErrorString + ' Not exist in child role list, '
        }

        if (ErrorString) {
          res.message = ErrorString
        }
        errorFile.push(res)
      }

      else {
        if (!checkDuplicate(successFile, res)) {
          res.message = 'Uploaded'
          successFile.push(res)
        }
        else {
          errorFile.push(res)
          duplicate = true
          res.message = "Duplicate entry"
        }
      }

    }
  }

  const uploadedData = targetControls.addTarget(successFile, targetMonth, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid);

  return Promise.all([uploadedData])
    .then(response => {
      let [result] = response
      let data = { message: `Data uploaded for team members`, result, successFile, errorFile }
      if (duplicate) {
        data.message = 'Data uploaded- duplicate entries found'
      }
      return data
    })
    .catch(error => {
      throw { errorMessage: error }
    })
  
};

const checkDuplicate = (arr, obj) => {
  return arr.some(res => (res?.['Employee Name'] === obj?.['Employee Name'] && res?.['Employee Code'] === obj?.['Employee Code'] && res?.['Role Name'] === obj?.['Role Name'] && res?.['Profile Name'] === obj?.['Profile Name'] && res?.Product === obj?.Product && res?.Target === obj?.Target));
}

const getProductList = async () => {
  let productList = [];
  const products = await crmMasterControls.getAllProductList();
  products.map(item => {
    productList.push(item?.value);
  });
  return productList;

}

const downloadSampleTarget = async (params) => {
  const products = await getProductList();

  var Heading = [["Employee Name", "Employee Code", "Role Name", "Profile Name", "Product", "HOTS Units", "HOTS Value", "Pipleline Units", "Pipeline Value", "TotalValue", "Monthly Units", "Monthly Target Value"]];

  let roleList = [];

  params?.data?.all_child_roles?.map(item => {
    roleList.push(item?.roleName)
  })

  let roleProfile = [];

  const hotsPipeline = await leadInterestFunctions.getDataByUserAndProduct({ childList: roleList })

  if (params?.data && params?.data?.all_child_roles) {
    for (let item of params?.data?.all_child_roles) {
      const temp = {};
      let role_name = item.roleName;
      let profile_name = item.profileName;
      temp.empName = item.displayName;
      temp.empCode = item.userName;
      temp.role_name = role_name;
      temp.profile_name = profile_name;
      temp.product = '';
      temp.hotsUnits = 0;
      temp.hotsValue = 0;
      temp.pipelineUnits = 0;
      temp.pipelineValue = 0;
      temp.totalValue = 0;
      temp.monthlyUnits = 0
      temp.monthlyTargetValue = 0;
      roleProfile.push(temp);
    }
  }

  let csvData = []

  roleProfile.forEach((obj, index) => {
    const repeatedObjects = products.map((p, i) => {
      const hotsData = hotsPipeline.find(item => { if (obj?.role_name === item?._id?.assignedTo_role_name && p === item?._id?.learningProfile && item?._id?.priority === 'HOTS') return item; })
      const pipelineData = hotsPipeline.find(item => { if (obj?.role_name === item?._id?.assignedTo_role_name && p === item?._id?.learningProfile && item?._id?.priority === 'Pipeline') return item; })

      let hots = hotsData?.totalValue || 0;
      let pipeline = pipelineData?.totalValue || 0;
      let updatedProduct = { ...obj }
      updatedProduct.product = p
      updatedProduct.hotsValue = hots;
      updatedProduct.pipelineValue = pipeline;
      updatedProduct.totalValue = hots + pipeline;
      return updatedProduct;
    });
    csvData.push(...repeatedObjects);
  });

  const workBook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet([]);
  xlsx.utils.sheet_add_aoa(workSheet, Heading);
  xlsx.utils.sheet_add_json(workSheet, csvData, { origin: 'A2', skipHeader: true });
  xlsx.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
  return xlsx.writeFile(workBook, `Sample_Target_Incentive.csv`);
}

const finalTargetList = (result, mappedData) => {
  const combinedData = [];

  for (let i = 0; i < result.length; i++) {
    const id = result[i]._id;
    let obj2 = mappedData.find(obj => obj._id === id) || {};

    if (!obj2.hotsValue) {
      obj2.hotsValue = 0;
    }
    if (!obj2.pipelineValue) {
      obj2.pipelineValue = 0;
    }
    const mergedObj = { ...result[i], ...obj2 };
    combinedData.push(mergedObj);
  }
  return combinedData;
}

const getTargetList = async (params) => {
  try {
    let { range } = params
    let targetMonthArray = await handleStartMonth(range)
    let startDate = targetMonthArray?.[0]
    let endDate = targetMonthArray?.[targetMonthArray?.length - 1]
    params.startDate = startDate
    params.endDate = endDate
    const targetList = await targetControls.getTargetList(params);
    const hotsPipelineResult = await leadInterestFunctions.getHotsPipelineResult(params);
    const finalList = finalTargetList(targetList, hotsPipelineResult);
    return { message: 'Target List', data: finalList };
  }
  catch (error) {
    throw { errorMessage: error }
  }

}

const updateTargetDetails = async (params) => {
  let { range, targetAmount } = params
  let targetMonthArray = await handleStartMonth(range)
  let rangeLength = targetMonthArray?.length
  let startDate = targetMonthArray?.[0]
  let endDate = targetMonthArray?.[rangeLength - 1]
  params.startDate = startDate
  params.endDate = endDate
  params.targetAmount = targetAmount / rangeLength

  return targetControls.updateTargetDetails(params)
    .then(data => {
      return { message: `Target updated successfully`, data }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getRoleNameProducts = async (params) => {
  let { roleName, range } = params
  let targetMonthArray = await handleStartMonth(range)
  let startDate = targetMonthArray?.[0]
  let endDate = targetMonthArray?.[targetMonthArray?.length - 1]
  return targetControls.getRoleNameProducts({ roleName, startDate, endDate })
    .then(result => {
      return { message: `All Targets for ${params.roleName}`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const assignTargets = async (params) => {
  let { data, range } = params
  let targetMonthArray = await handleStartMonth(range)
  let totalTarget = []
  let rangeLength = targetMonthArray?.length

  for (let i = 0; i < data?.length; i++) {
    let obj = data?.[i]
    if (obj?.targetAmount < 0) {
      throw { errorMessage: 'Invlaid Target Value' };
    }
    for (let j = 0; j < targetMonthArray?.length; j++) {
      let targetMonth = targetMonthArray?.[j]
      let copyObj = { ...obj }
      copyObj.targetMonth = targetMonth
      copyObj.targetUnit = copyObj.targetUnit
      copyObj.targetAmount = (copyObj.targetAmount / rangeLength)
      totalTarget.push(copyObj)
    }
  }
  return targetControls.assignTargets(totalTarget)
    .then(result => {
      return { message: `Targets Assigned successfully`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const handleStartMonth = async (range) => {
  let startMonth;
  let targetMonthArray = []
  let currentDate = new Date()
  let currentMonth = currentDate.getMonth()
  let currentYear = currentDate.getFullYear()
  let curentQuarter = Math.ceil((currentMonth + 1) / 3)

  if (range === 'month') {
    startMonth = moment(new Date(currentYear, currentMonth, 1)).local().format('YYYY-MM-DD')
    targetMonthArray.push(startMonth)
  }
  else if (range === 'year') {
    let financialMonth = 3
    for (let i = 0; i < 12; i++) {
      let date = moment(new Date(currentYear, financialMonth, 1)).local().format('YYYY-MM-DD')
      financialMonth++;
      if (financialMonth === 12) {
        financialMonth = 0
        currentYear++
      }
      targetMonthArray.push(date)
    }
  }
  else {
    let quarterStartMonth = (curentQuarter - 1) * 3;
    for (let i = 0; i < 3; i++) {
      let date = moment(new Date(currentYear, quarterStartMonth + i, 1)).local().format('YYYY-MM-DD')
      targetMonthArray.push(date)
    }
  }
  return targetMonthArray
}

module.exports = {
  downloadSampleTarget,
  addTarget,
  getTargetList,
  getRoleNameProducts,
  updateTargetDetails,
  assignTargets
}