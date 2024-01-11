const xlsx = require('xlsx');
const targetIncentiveControls = require('../controllers/targetIncentiveControls');
const targetIncentiveLogFunctions = require('../functions/targetIncentiveLogFunctions')
const utils = require('../utils/utils')

const uploadTargetIncentive = async (req) => {
    const file = xlsx.read(req.file.buffer);
    const fileName = req.file.originalname;
    const successFile = [];
    const errorFile = [];
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;
    let duplicate = false

    for (let i = 0; i < totalSheets; i++) {
        const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

        if (!data.length) {
            throw { errorMessage: 'Empty File' }
        }

        data.map(colObj => {
            colObj.role_name = colObj['Role Name']
            colObj.profile_name = colObj['Profile Name']
            //colObj.incentive = colObj['Incentive']
            colObj.target = colObj['Target']
            colObj.empName = colObj['Employee Name']
            colObj.empCode = colObj['Employee Code']
            return colObj
        })

        data.forEach((res) => {
            let ErrorString = ''
            res.errorMessage = ''

            if ((!res.role_name || !res.profile_name || utils.isEmptyValue(res.target))) {

                if (!res.role_name) {
                    ErrorString = ErrorString + ' Role is required,'
                }
                if (!res.profile_name) {
                    ErrorString = ErrorString + ' Profile is required,'
                }
                // if (utils.isEmptyValue(res.incentive)) {
                //     ErrorString = ErrorString + ' Incentive is required,'
                // }
                // if (!utils.isEmptyValue(res.incentive) && !Number.isInteger(Number(res.incentive))) {
                //     ErrorString = ErrorString + ' Incentive should be integer,'
                // }
                if (utils.isEmptyValue(res.target)) {
                    ErrorString = ErrorString + ' Target is required,'
                }
                if (!utils.isEmptyValue(res.target) && !Number.isInteger(Number(res.target))) {
                    ErrorString = ErrorString + ' Target should be integer,'
                }

                if (ErrorString) {
                    res.errorMessage = 'Error Fields: ' + ErrorString
                }

                errorFile.push(res)
            }
            else {
                if (!checkDuplicate(successFile, res))
                    successFile.push(res)
                else {
                    errorFile.push(res)
                    duplicate = true
                    res.errorMessage = "Duplicate entry"
                }
            }
        })
    }

    const uploadedData = targetIncentiveControls.uploadTargetIncentive(successFile);
    const logsData = targetIncentiveLogFunctions.saveLogs({ fileName, successFile, errorFile, ...req.body })
    return Promise.all([uploadedData, logsData])
        .then(response => {
            let [result, logsSaved] = response
            let data = { message: 'Data uploaded', result, logsSaved }
            if (duplicate) {
                data.message = 'Data uploaded- duplicate entries found'
            }
            return data
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const checkDuplicate = (arr, obj) => {
    return arr.some(res => (res.empCode === obj.empCode && res.empName === obj.empName && res.target === obj.target && res.role_name === obj.role_name && res.profile_name === obj.profile_name));
}


const downloadSample = async (params) => {
    const roles = await targetIncentiveControls.getAllRoleIds();
    var Heading = [["Employee Name", "Employee Code", "Role Name", "Profile Name", "Target",],];

    let roleList = [];
    roles.map(item => {
        roleList[item.role_name] = item
    })

    const roleProfile = [];
    params.data && params.data.all_child_roles.map(item => {
        const temp = {};
        let role_name = item.roleName;
        let profile_name = item.profileName;
        temp.empName = item.displayName;
        temp.empCode = item.userName;
        temp.role_name = role_name;
        temp.profile_name = profile_name;
        //temp.incentive = roleList[role_name] ? roleList[role_name].incentive : 0;
        temp.target = roleList[role_name] ? roleList[role_name].target : 0;

        roleProfile.push(temp);
    });

    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.sheet_add_aoa(workSheet, Heading);
    xlsx.utils.sheet_add_json(workSheet, roleProfile, { origin: 'A2', skipHeader: true });
    xlsx.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    return xlsx.writeFile(workBook, `Sample_Target_Incentive.csv`);
}

const getTargetIncentive = (params) => {
    return targetIncentiveControls.getTargetIncentive(params)
        .then(result => {
            return { message: 'Target Incentive Fetched Successfully!', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

module.exports = {
    uploadTargetIncentive,
    downloadSample,
    getTargetIncentive
}