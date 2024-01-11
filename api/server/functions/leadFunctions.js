const axios = require('axios');
const xlsx = require('xlsx');
const leadControls = require('../controllers/leadControls');
const leadLogFunctions = require('../functions/leadLogFunctions');
const EnvConfig = require('../config').cfg;
const customExceptions = require('../responseModels/customExceptions');
const { checkValidPhone, checkValidEmail, checkValidName } = require('../validators/excelValidation');
const { createCubeTokenCrm } = require('../config/cubeConnection');
const { updateLogs } = require('../controllers/leadLogsControls');
const ExcelJS = require('exceljs');
const leadassignModal = require('../models/leadassignModal');
const { getLeadJourneyDetails } = require('./leadJourneyMappingFunctions');
const { updateLead } = require('./leadAssignFunction');
const { uploadImage } = require('../middlewares/fileUploader');
const { createManyStageStatus } = require('../controllers/leadStageStatusControls');

const bulkUpload = async (req, tokenPayload) => {
    //console.log('TOken',tokenPayload)
    try {
        const { campaignId, campaignName, sourceId, subSourceId, sourceName, subSourceName, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid } = req.body;
        const headers = ['Name', 'Mobile Number', 'Email', 'Board', 'Class', 'School', 'State', 'City', 'School Code', 'Reference', 'Learning Profile'];
        const sheetNamesArray = ['Student', 'Parent', 'Teacher', 'Home Tuition', 'Institute'];
        const file = xlsx.read(req.file.buffer);
        const fileName = req.file.originalname;
        const sheetNames = file.SheetNames;
        const totalSheets = sheetNames.length;
        let fileData = [];
        let flag = false;

        const result = await uploadImage(req?.file, 'crm-leads/');

        const columnsArray = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], { header: 1 })[0];

        if (JSON.stringify(columnsArray) != JSON.stringify(headers)) {
            throw customExceptions.wrongTemplate();
        }

        for(let i = 0; i < totalSheets; i++){
            if(sheetNamesArray.includes(sheetNames[i])){
                flag = true;
            }
        }

        if(!flag){
            throw customExceptions.wrongTemplate();
        }

        for (let i = 0; i < totalSheets; i++) {
            if (sheetNamesArray.includes(file.SheetNames[i])) {

                let data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

                data.map(colObj => {
                    colObj.campaignId = campaignId;
                    colObj.campaignName = campaignName;
                    colObj.sourceId = sourceId;
                    colObj.subSourceId = subSourceId;
                    colObj.sourceName = sourceName;
                    colObj.subSourceName = subSourceName;
                    colObj.createdBy = createdBy;
                    colObj.createdBy_Uuid = createdBy_Uuid;
                    colObj.modifiedBy = modifiedBy;
                    colObj.modifiedBy_Uuid = modifiedBy_Uuid;
                    colObj.userType = file.SheetNames[i].toUpperCase();

                    colObj.name = colObj['Name']
                    colObj.email = colObj['Email']
                    colObj.mobile = colObj['Mobile Number']
                    colObj.school = colObj['School']
                    colObj.reference = colObj['Reference']
                    colObj.learningProfile = colObj['Learning Profile']
                    colObj.city = colObj['City']
                    colObj.pinCode = colObj['Pincode']
                    colObj.board = colObj['Board']
                    colObj.class = colObj['Class']
                    colObj.schoolCode = colObj['School Code']
                    colObj.state = colObj['State']
                    colObj.type = 'offline'
                    colObj.countryCode = '01'
                    colObj.countryName = 'India'

                    fileData.push(colObj);
                })
            }
        }

        const logsSaved = await leadLogFunctions.saveLogs({ fileName, fileData, ...req.body })
        //uploadLead(req, tokenPayload);
        saveLeadData(req, fileData, logsSaved, tokenPayload);
        return { message: 'Leads data uploaded', logsSaved }
    } catch (err) {
        console.log(err, '...error inside catch');
        throw { errorMessage: err }
    }
}
//================================== SAVING LEAD DATA ==================================================
const saveLeadData = async (req, fileData, logsSaved, tokenPayload) => {
    let batch = logsSaved.batch;
    try {
        const cubeApi = await createCubeTokenCrm();
        let fileName = logsSaved.fileName;
        const successFile = [];
        const errorFile = [];

        leadLogFunctions.updateLogs({ batch, batchStatus: 'IN_PROGRESS' })

        for (let res of fileData) {
            let ErrorString = ''
            res.errorMessage = ''
            let ErrorString1 = validateExcelFields(res);
            let ErrorString2 = validateNameEmailPhone(res);
            ErrorString = ErrorString1 + ErrorString2;

            if (res.userType === 'STUDENT') {
                if (!res.board || !res.class || !res.school || !res.state || !res.learningProfile) {

                    if (!res.board) {
                        ErrorString = ErrorString + ' Board is required,'
                    }
                    if (!res.class) {
                        ErrorString = ErrorString + ' Class is required,'
                    }
                    if (!res.school) {
                        ErrorString = ErrorString + ' School is required,'
                    }
                    if (!res.state) {
                        ErrorString = ErrorString + ' State is required,'
                    }
                    if (!res.learningProfile) {
                        ErrorString = ErrorString + ' Learning Profile is required,'
                    }
                }

                if (ErrorString) {
                    res.errorMessage = 'Error Fields: ' + ErrorString
                    errorFile.push(res)
                }

                else {

                    const leadNotExist = leadControls.checkLeadInterest(res, tokenPayload);
                    const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                    let [leadNotExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([leadNotExist, leadNotExistInOnlineLeads])
            
                    if (leadNotExistPromise && leadNotExistInOnlineLeadsPromise) {
                        successFile.push(res)
                    }
                    else {
                        res.errorMessage = 'Lead already exists and interest saved in lead interest table'
                        errorFile.push(res)
                    }
                }
            }
            else if (res.userType === 'PARENT') {

                if (ErrorString) {
                    res.errorMessage = 'Error Fields: ' + ErrorString
                    errorFile.push(res)
                }

                else {

                    const isExist = leadControls.checkDuplicateLead(res)
                    const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                    let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                    if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                        successFile.push(res)
                    }
                    else {
                        res.errorMessage = 'Lead already exists'
                        errorFile.push(res)
                    }
                }

            }
            else if (res.userType === 'TEACHER') {
                if (!res.school) {
                    ErrorString = ErrorString + ' School is required,'
                }
                if (ErrorString) {
                    res.errorMessage = 'Error Fields: ' + ErrorString
                    errorFile.push(res)
                }
                else {
                    const isExist = leadControls.checkDuplicateLead(res)
                    const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                    let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                    if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                        successFile.push(res)
                    }
                    else {
                        res.errorMessage = 'Lead already exists'
                        errorFile.push(res)
                    }
                }
            }
            else if (res.userType === 'HOME TUITION') {

                if (ErrorString) {
                    res.errorMessage = 'Error Fields: ' + ErrorString
                    errorFile.push(res)
                }
                else {
                    const isExist = leadControls.checkDuplicateLead(res)
                    const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                    let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                    if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                        successFile.push(res)
                    }
                    else {
                        res.errorMessage = 'Lead already exists'
                        errorFile.push(res)
                    }
                }
            }
            else if (res.userType === 'INSTITUTE') {
                if (!res.school || !res.schoolCode || !res.pinCode) {
                    if (!res.school) {
                        ErrorString = ErrorString + ' School is required,'
                    }
                    if (!res.schoolCode) {
                        ErrorString = ErrorString + ' School Code is required,'
                    }
                    if (!res.pincode) {
                        ErrorString = ErrorString + ' PinCode is required,'
                    }
                    if (ErrorString) {
                        res.errorMessage = 'Error Fields: ' + ErrorString
                    }
                    errorFile.push(res)
                }

                else {
                    const isExist = leadControls.checkDuplicateLead(res)
                    const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                    let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                    if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                        successFile.push(res)
                    }
                    else {
                        res.errorMessage = 'Lead already exists'
                        errorFile.push(res)
                    }
                }
            }
        }
        await leadControls.uploadLead(successFile, tokenPayload, batch);
        const logsData = await leadLogFunctions.updateLogs({ batch, fileName, successFile, errorFile, batchStatus: 'UPLOADED', ...req.body })
        console.log({ status: 'OK', logs: logsData });

    }
    catch (error) {
        console.log(error,"::: error inside save lead data functions");
        leadLogFunctions.updateLogs({ batch, batchStatus: 'FAILED' , exception: JSON.stringify(error)})
        throw { errorMessage: error }
    }

}

//================================== UPLOAD LEADS EXCEL FILE ===========================================
const uploadLead = async (req, tokenPayload) => {
    try {
        const { campaignId, campaignName, sourceId, subSourceId, sourceName, subSourceName, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid } = req.body;

        const sheetNamesArray = ['Student', 'Parent', 'Teacher', 'Home Tuition', 'Institute'];
        const file = xlsx.read(req.file.buffer);
        const fileName = req.file.originalname;
        const sheetNames = file.SheetNames;
        const totalSheets = sheetNames.length;
        const cubeApi = await createCubeTokenCrm();
        let data = []
        const successFile = [];
        const errorFile = [];

        for (let i = 0; i < totalSheets; i++) {
            if (sheetNamesArray.includes(file.SheetNames[i])) {

                data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

                data.map(colObj => {
                    colObj.campaignId = campaignId;
                    colObj.campaignName = campaignName;
                    colObj.sourceId = sourceId;
                    colObj.subSourceId = subSourceId;
                    colObj.sourceName = sourceName;
                    colObj.subSourceName = subSourceName;
                    colObj.createdBy = createdBy;
                    colObj.createdBy_Uuid = createdBy_Uuid;
                    colObj.modifiedBy = modifiedBy;
                    colObj.modifiedBy_Uuid = modifiedBy_Uuid;

                    colObj.name = colObj['Name']
                    colObj.email = colObj['Email']
                    colObj.mobile = colObj['Mobile Number']
                    colObj.school = colObj['School']
                    //colObj.userType = colObj['User Type']
                    colObj.reference = colObj['Reference']
                    colObj.learningProfile = colObj['Learning Profile']

                    colObj.city = colObj['City']
                    colObj.cityId = colObj['cityId']
                    colObj.pinCode = colObj['Pincode']

                    colObj.board = colObj['Board']
                    colObj.boardId = colObj['boardId']

                    colObj.class = colObj['Class']
                    colObj.classId = colObj['classId']
                    colObj.schoolCode = colObj['School Code']

                    colObj.state = colObj['State']
                    colObj.stateId = colObj['stateId']
                    colObj.type = 'offline'
                    return colObj
                })

                for (res of data) {

                    let ErrorString = ''
                    res.errorMessage = ''
                    res.userType = file.SheetNames[i].toUpperCase();
                    ErrorString = validateExcelFields(res);
                    if (!checkValidEmail(res.email)) {
                        ErrorString = ErrorString + ' Invalid Email,'
                    }

                    if (!checkValidPhone(res.mobile)) {
                        ErrorString = ErrorString + ' Invalid phone,'

                    } else if (checkValidPhone(res.mobile)) {
                        res.mobile = res?.mobile
                    }

                    if (!checkValidName(res.name)) {
                        ErrorString = ErrorString + 'NAME SHOULD NOT CONTAINS SPECIAL CHARACTER'

                    } else if (checkValidName(res.name)) {
                        res.nameLower = res?.name?.toLowerCase();
                    }

                    if (file.SheetNames[i] === 'Student') {

                        if (!res.board || !res.class || !res.school || !res.state || !res.learningProfile) {

                            if (!res.board) {
                                ErrorString = ErrorString + ' Board is required,'
                            }
                            if (!res.class) {
                                ErrorString = ErrorString + ' Class is required,'
                            }
                            if (!res.school) {
                                ErrorString = ErrorString + ' School is required,'
                            }
                            if (!res.state) {
                                ErrorString = ErrorString + ' State is required,'
                            }
                            if (!res.learningProfile) {
                                ErrorString = ErrorString + ' Learning Profile is required,'
                            }
                        }

                        if (ErrorString) {
                            res.errorMessage = 'Error Fields: ' + ErrorString
                            errorFile.push(res)
                        }

                        else {

                            const leadNotExist = leadControls.checkLeadInterest(res, tokenPayload);
                            const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                            let [leadNotExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([leadNotExist, leadNotExistInOnlineLeads])
                            if (leadNotExistPromise && leadNotExistInOnlineLeadsPromise) {
                                successFile.push(res)
                            }
                            else {

                                res.errorMessage = 'Lead already exists and interest saved in lead interest table'
                                errorFile.push(res)
                            }
                        }
                    }
                    else if (file.SheetNames[i] === 'Parent') {

                        if (ErrorString) {
                            res.errorMessage = 'Error Fields: ' + ErrorString
                            errorFile.push(res)
                        }

                        else {

                            const isExist = leadControls.checkDuplicateLead(res)
                            const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                            let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                            if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                                successFile.push(res)
                            }
                            else {
                                res.errorMessage = 'Lead already exists'
                                errorFile.push(res)
                            }
                        }

                    }
                    else if (file.SheetNames[i] === 'Teacher') {
                        if (!res.school) {
                            ErrorString = ErrorString + ' School is required,'
                        }
                        if (ErrorString) {
                            res.errorMessage = 'Error Fields: ' + ErrorString
                            errorFile.push(res)
                        }



                        else {

                            const isExist = leadControls.checkDuplicateLead(res)
                            const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                            let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                            if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                                successFile.push(res)
                            }
                            else {
                                res.errorMessage = 'Lead already exists'
                                errorFile.push(res)
                            }
                        }

                    }
                    else if (file.SheetNames[i] === 'Home Tuition') {

                        if (ErrorString) {
                            res.errorMessage = 'Error Fields: ' + ErrorString
                            errorFile.push(res)
                        }

                        else {
                            const isExist = leadControls.checkDuplicateLead(res)
                            const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                            let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                            if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                                successFile.push(res)
                            }
                            else {
                                res.errorMessage = 'Lead already exists'
                                errorFile.push(res)
                            }
                        }

                    }
                    else if (file.SheetNames[i] === 'Institute') {
                        if (!res.school || !res.schoolCode || !res.pinCode) {
                            if (!res.school) {
                                ErrorString = ErrorString + ' School is required,'
                            }
                            if (!res.schoolCode) {
                                ErrorString = ErrorString + ' School Code is required,'
                            }
                            if (!res.pincode) {
                                ErrorString = ErrorString + ' PinCode is required,'
                            }
                            if (ErrorString) {
                                res.errorMessage = 'Error Fields: ' + ErrorString
                            }
                            errorFile.push(res)
                        }

                        else {
                            const isExist = leadControls.checkDuplicateLead(res)
                            const leadNotExistInOnlineLeads = leadControls.checkLeadExistInOnlineLeads(res, cubeApi, tokenPayload);
                            let [isExistPromise, leadNotExistInOnlineLeadsPromise] = await Promise.all([isExist, leadNotExistInOnlineLeads])
                            if (!isExistPromise && leadNotExistInOnlineLeadsPromise) {
                                successFile.push(res)
                            }
                            else {
                                res.errorMessage = 'Lead already exists'
                                errorFile.push(res)
                            }
                        }
                    }
                }


            }
        }

        const uploadedData = leadControls.uploadLead(successFile, tokenPayload);
        const logsData = leadLogFunctions.saveLogs({ fileName, successFile, errorFile, ...req.body })
        return Promise.all([uploadedData, logsData])
            .then(response => {
                let [result, logsSaved] = response
                console.log({ status: 'OK', message: 'Data uploaded', result, logsSaved });
            })
            .catch(error => {
                throw { errorMessage: error }
            })

    } catch (err) {
        console.log(err, '.....err inside catch');
        throw { errorMessage: err }

    }
}

//====================================================================================================


const checkLead = async (leadArr) => {
    for(let leadId of leadArr){
        let leadObj = await leadassignModal.findOne({leadId}).hint({leadId:1})
        let {leadData,list} = await getLeadJourneyDetails(leadObj)
        if(list && list.length > 0){
            createManyStageStatus(list)
        }
        let obj = {
            leadId:leadData.leadId,
            update:{
              stageName:leadData.stageName,
              statusName:leadData.statusName
            }
        }
        if(leadData.stageName && leadData.statusName){
            let data = updateLead(obj)
        }        
    }
    return {status:1,msg:"Success"}   
}

const mapDataToJson = data => {
    let newData = [];
    let header = Object.keys(data);
    let maxCount = 0;
    header.forEach((dt) => {
        if (data[dt].length > maxCount) {
            maxCount = data[dt].length;
        }
    });

    for (let i = 0; i <= maxCount; i++) {
        let obj = {};
        header.forEach((dt) => {
            //let newItem = dt.replace(/[&\/\\#,+()$~%'":*?<>{}-]/g,"").split(" ").join("_")
            obj[dt] = data[dt][i];
        });
        newData.push(obj);

    }
    return newData;
}

//============================== DOWNLOAD LEAD SAMPLE FILE =======================================
const downloadSample = async () => {
    try {
        const file = xlsx.readFile(`Sample_Leads.xlsx`);
        return file;
    }
    catch (err) {
        throw { errorMessage: err }
    }
}

//============================= LEADS LISTING =====================================================
const getLeadsList = async (params) => {
    let LeadsList = leadControls.getLeadsList(params);
    let TotalLeadCount = leadControls.getLeadListCount(params);
    return Promise.all([LeadsList, TotalLeadCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Lead List', result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

//============================= RE-WRITE SAMPLE FILE =============================================
const writeSample = async (cubeData) => {
    try {

        const file = xlsx.readFile(`Sample_Leads.xlsx`);
        //return;
        cubeData.forEach(item => {
            if (item && item.boards) {
                let data = item.boards;
                file.Sheets['Boards'] = xlsx.utils.json_to_sheet(data);
            }
            else if (item && item.classes) {
                let data = item.classes;
                file.Sheets['Classes'] = xlsx.utils.json_to_sheet(data);
            }
            else if (item && item.countryCodes) {
                let data = item.countryCodes;
                file.Sheets['Country Codes'] = xlsx.utils.json_to_sheet(data);
            }
            else if (item && item.states) {
                let data = item.states;
                file.Sheets['States'] = xlsx.utils.json_to_sheet(data);
            }
            else if (item && item.cities) {
                let data = item.cities;
                file.Sheets['Cities'] = xlsx.utils.json_to_sheet(data);
            }
            else if (item && item.stateCity) {
                let data = item.stateCity;
                let newData = mapDataToJson(data);
                file.Sheets['CityState'] = xlsx.utils.json_to_sheet(newData);
            }
            else if (item && item.boardClass) {
                let data = item.boardClass;
                let newData = mapDataToJson(data);
                file.Sheets['ClassBoard'] = xlsx.utils.json_to_sheet(newData);
            }
        })
        return xlsx.writeFile(file, `Sample_Leads.xlsx`);
    }
    catch (err) {
        throw { errorMessage: err }
    }
}

//===================================== MULTIPLE LEAD TRANSFER =========================================
const multipleLeadTransfer = async (params) => {


    let { roles } = params
    let { CUBE_API_URL } = EnvConfig

    let config = {
        headers: { 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjpbIm5vX3NlY3VyaXR5Il0sInJvbGUiOiJzdXBlcmFkbWluIiwiY29udGV4dCI6InV1aWQiLCJpYXQiOjE2NzAzOTE2ODAsImV4cCI6MTY3MDQ3ODA4MH0.smBtCSO11DOtHPCZvii22D9tnjwpeiF9TiEi9cKTtjg' },
    }

    // roles.map(roleObj => {
    //     let rulesInRole = [...roleObj.rules]

    //     rulesInRole.map(ruleObj => {
    //         config.params = { query: ruleObj.query }
    //         let leadKeys = ['name', 'mobile', 'email', 'board',
    //             'class', 'school', 'state', 'city', 'campaignId', 'sourceId', 'sourceName', 'subSourceName',
    //             'subSourceId', 'userType', 'reference', 'countryCode',
    //             'status', 'assignedToAssignedOn', 'assignedToRoleId', 'assignedToRoleCode',
    //             'assignedToRoleName', 'assignedToProfileId', 'assignedToProfileCode', 'assignedToProfileName']

    //         let leadDimensions = leadKeys?.map(key => `Leads.${key}`)

    //         if (ruleObj?.query?.dimensions)
    //             ruleObj.query.dimensions = leadDimensions

    //         return axios.get(`${CUBE_API_URL}/cubejs-api/v1/load`, config)
    //             .then(cubeResp => {
    //                 let leadsPromises = []

    //                 if (cubeResp?.data?.data?.length) {
    //                     leadsPromises = cubeResp?.data?.data?.map(leadObj => {

    //                         console.log(leadObj, "::leadObj");

    //                     })
    //                 }


    //                 return Promise.all(leadsPromises)
    //             })
    //             .then(leadRes => {
    //                 console.log(leadRes, "::res");
    //             })
    //             .catch(cubeError => {
    //                 console.log(cubeError, "::cubeError")
    //             })
    //     })




    // })


    return { message: 'Leads Assigned Successfully', result: {} }
}

//======================================================================================================
const updateOneByKey = async (query, update, options) => {
    return leadControls.updateOneByKey(query, update, options);
}

//=================================== VALIDATING EXCEL FIELDS ===========================================
const validateExcelFields = (res) => {
    let ErrorString = ''
    //res.errorMessage = ''
    if (!res.name || !res.mobile || !res.city) {
        if (!res.name) {
            ErrorString = ErrorString + ' Name is required,'
        }
        if (!res.mobile) {
            ErrorString = ErrorString + ' Mobile is required,'
        }
        if (!res.city) {
            ErrorString = ErrorString + ' City is required,'
        }
    }
    return ErrorString;
}

//==================================== VALIDATING REGEX ==============================================
const validateNameEmailPhone = (res) => {
    let ErrorString = ''
    if (res.email) {
        if (!checkValidEmail(res.email)) {
            ErrorString = ErrorString + ' Invalid Email,'
        }
    }
    if (res.mobile) {
        if (!checkValidPhone(res.mobile)) {
            ErrorString = ErrorString + ' Invalid phone,'
        }
    }
    if (res.name) {
        if (!checkValidName(res.name)) {
            ErrorString = ErrorString + 'NAME SHOULD NOT CONTAINS SPECIAL CHARACTER'
        }
    }
    return ErrorString;

}

//======================================== MACROS =====================================================
const writeMacro = async (cubeResponse) => {
    const workbook = new ExcelJS.Workbook();
    await createStudentSheet(workbook, cubeResponse);
    await createParentSheet(workbook);
    await createTeacherSheet(workbook);
    await createHomeTuitionSheet(workbook);
    await createInstituteSheet(workbook);
    await createBoardClassSheet(workbook, cubeResponse);
    await createStateCitySheet(workbook, cubeResponse);
    await createLearningProfileSheet(workbook, cubeResponse);
    await workbook.xlsx.writeFile('Sample_Leads.xlsx');
} 

//======================================== STUDENT SHEET ==============================================
const createStudentSheet = async (workbook, cubeResponse) => {
    const studentSheet = workbook.addWorksheet('Student',{
        views: [{ state: "frozen", ySplit: 1 }],
    });
    studentSheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Mobile Number', key: 'mobile', width: 30 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'Board', key: 'board', width: 32},
        { header: 'Class', key: 'class', width: 10 },
        { header: 'School', key: 'school', width: 10 },
        { header: 'State', key: 'state', width: 10 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'School Code', key: 'schoolCode', width: 10 },
        { header: 'Reference', key: 'reference', width: 10 },
        { header: 'Learning Profile', key: 'learningProfile', width: 15}
    ];
    await formatHeaders(studentSheet);
   
    studentSheet.getCell('K2').dataValidation = {
        type: 'list',
        showErrorMessage: true,
        prompt: 'Select a value from the list',
        error: 'Please select a valid value from the list',
        formulae: ['=LearningProfile!$A$2:$A$50']
    };

    const boardColumn = studentSheet.getColumn(4);       
    boardColumn.eachCell({ includeEmpty: true },(cell, rowNumber) => {
      
    if (rowNumber === 1) {
        cell.value = 'Board';
    } else {
        cell.dataValidation = {
        type: 'list',
        formulae: ['=ClassBoard!$A$1:$DE$1']
        };
    }
    });

    const classColumn = studentSheet.getColumn(5);
    classColumn.eachCell({ includeEmpty: true },(cell, rowNumber) => {
    if (rowNumber === 1) {   
        cell.value = 'Class';
    } else {
        const boardCell = studentSheet.getCell(`D${rowNumber}`);
        cell.dataValidation = {
        type: 'list',
        formulae: [`=INDIRECT(${boardCell.address} & "_Board")`]
        };
    }
    });

    const stateColumn = studentSheet.getColumn('state');       
    stateColumn.eachCell({ includeEmpty: true },(cell, rowNumber) => {
    if (rowNumber === 1) {
        cell.value = 'State';
    } else {
        cell.dataValidation = {
        type: 'list',
        formulae: ['=StateCity!$A$1:$AM$1']
        };
    }
    });

    const cityColumn = studentSheet.getColumn('city');
    cityColumn.eachCell({ includeEmpty: true },(cell, rowNumber) => {
    if (rowNumber === 1) {   
        cell.value = 'City';
    } else {
        const stateCell = studentSheet.getCell(`G${rowNumber}`);
        cell.dataValidation = {
        type: 'list',
        formulae: [`=INDIRECT(${stateCell.address})`]
        };
    }
    });
}

//======================================= PARENT SHEET =================================================
const createParentSheet = async (workbook) => {
    const parentSheet = workbook.addWorksheet('Parent',{
        views: [{ state: "frozen", ySplit: 1 }],
    });
    parentSheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Mobile Number', key: 'mobile', width: 30 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Reference', key: 'reference', width: 10 },
    ]
    await formatHeaders(parentSheet);
    parentSheet.getCell('D2').dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['=StateCity!$A$2:$AM$8000']
    }
}

//======================================= TEACHER SHEET ================================================
const createTeacherSheet = async (workbook) => {
    const teacherSheet = workbook.addWorksheet('Teacher',{
        views: [{ state: "frozen", ySplit: 1 }],
    });
    teacherSheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Mobile Number', key: 'mobile', width: 30 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'School', key: 'school', width: 10 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Reference', key: 'reference', width: 10 },
    ]
    await formatHeaders(teacherSheet);
    teacherSheet.getCell('E2').dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['=StateCity!$A$2:$AM$8000']
    }
}

//======================================= HOME TUITION SHEET ===========================================
const createHomeTuitionSheet = async (workbook) => {
    const homeTuitionSheet = workbook.addWorksheet('Home Tuition',{
        views: [{ state: "frozen", ySplit: 1 }],
    });
    homeTuitionSheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Mobile Number', key: 'mobile', width: 30 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Reference', key: 'reference', width: 10 },
    ]
    await formatHeaders(homeTuitionSheet);
    homeTuitionSheet.getCell('D2').dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['=StateCity!$A$2:$AM$8000']
    }
}

//======================================== INSTITUTE SHEET =============================================
const createInstituteSheet = async (workbook) => {
    const instituteSheet = workbook.addWorksheet('Institute',{
        views: [{ state: "frozen", ySplit: 1 }],
    });
    instituteSheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Mobile Number', key: 'mobile', width: 30 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'School', key: 'school', width: 10 },
        { header: 'School Code', key: 'schoolCode', width: 10 },
        { header: 'Pin Code', key: 'pinCode', width: 10 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Reference', key: 'reference', width: 10 },
    ]
    await formatHeaders(instituteSheet);
    instituteSheet.getCell('G2').dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['=StateCity!$A$2:$AM$8000']
    }
}

//======================================= BOARD CLASS SHEET ============================================
const createBoardClassSheet = async (workbook, cubeResponse) => {
    let boardClassList = cubeResponse[6].boardClass;
    let ClassHeader = Object.keys(boardClassList);
    const boardClassSheet = workbook.addWorksheet('ClassBoard');
    boardClassSheet.state = 'hidden'
    const mappedDta = mapDataToJson(boardClassList)
    boardListArray = []
    ClassHeader.map(item=> {
        let boardObj = {}
        let newItem = item.replace(/[&\/\\#,+()$~%'":*?<>{}-]/g,"").split(" ").join("_")
        boardObj.header = `${item}`;
        boardObj.key = `${item}`;
        boardListArray.push(boardObj)
    })
    
    boardClassSheet.columns = boardListArray;
    boardClassSheet.addRows(mappedDta);
    const firstRow = boardClassSheet.getRow(1);
    firstRow.eachCell((cell, colNumber) => {
        const cellAddress = cell.address;
        const slicedAdd = cellAddress.substring(0, cellAddress.length - 1)
        const cellValue = cell.value;
        workbook.definedNames.add( `ClassBoard!${slicedAdd}2:${slicedAdd}100`, `${cellValue}_Board`);
    })
}

//======================================= STATE CITY SHEET ==============================================
const createStateCitySheet = async (workbook, cubeResponse) => {
    let stateCityList = cubeResponse[5].stateCity;
    let StateHeader = Object.keys(stateCityList);
    const stateCitySheet = workbook.addWorksheet('StateCity');
    stateCitySheet.state = 'hidden'

    const mappedDta = mapDataToJson(stateCityList);
    stateListArray = []
    StateHeader.map(item=> {
        let stateObj = {}
        let newItem = item.replace(/[&\/\\#,+()$~%'":*?<>{}-]/g,"").split(" ").join("_")
        stateObj.header = `${item}`;
        stateObj.key = `${item}`;
        stateListArray.push(stateObj)
    })
    stateCitySheet.columns = stateListArray;
    stateCitySheet.addRows(mappedDta);
    const firstRow = stateCitySheet.getRow(1);
    firstRow.eachCell((cell, colNumber) => {
        const cellAddress = cell.address;
        const slicedAdd = cellAddress.substring(0, cellAddress.length - 1)
        const cellValue = cell.value;
        workbook.definedNames.add( `StateCity!${slicedAdd}2:${slicedAdd}8000`, `${cellValue}`);
    })

}

//======================================== LEARNING PROFILE SHEET =========================================
const createLearningProfileSheet = async (workbook, cubeResponse) => {
    let learningProfileList = cubeResponse[7].profiles;
    const profileSheet = workbook.addWorksheet('LearningProfile',{
        views: [{ state: "frozen", ySplit: 1 }],
    });
    profileSheet.state = 'hidden'

    profileSheet.columns = [
        { header: 'Learning Profile', key: 'learningProfile', width: 32 },
    ]
    profileSheet.addRows(learningProfileList)
}

//==================================== HEADER FORMATTING ================================================

const formatHeaders = async (sheet) => {
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        //cell.protection = { locked: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }, // Red
          };
    });

}

module.exports = {
    downloadSample,
    getLeadsList,
    writeSample,
    multipleLeadTransfer,
    updateOneByKey,
    bulkUpload,
    writeMacro,
    checkLead
}