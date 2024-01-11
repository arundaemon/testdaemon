const leadInterestControls = require('../controllers/leadInterestControls');
//const leadAssignFunction = require('../functions/leadAssignFunction')
const leadControl = require('../controllers/leadControls')
const productMasterFunctions = require('../functions/productMasterFunctions');
const xlsx = require('xlsx');
const schoolControls = require('../controllers/schoolControls');
const mongoose = require('mongoose');
const leadOwnerControls = require('../controllers/leadOwnerControls');
const leadStageStatusControls = require('../controllers/leadStageStatusControls');
const crmMasterFunctions = require('../functions/crmMasterFunctions');

const saveNewLeadInterest = async (leads) => {
    let leadInterestArray = [];
    for (leadObj of leads) {
        let leadInterestObj = {}
        if (leadObj.userType === 'STUDENT') {
            leadInterestObj.leadId = leadObj._id,
                leadInterestObj.learningProfile = leadObj.learningProfile,
                leadInterestObj.campaignId = leadObj.campaignId,
                leadInterestObj.board = leadObj.board,
                leadInterestObj.class = leadObj.class,
                leadInterestObj.school = leadObj.school,
                leadInterestObj.campaignName = leadObj.campaignName,
                leadInterestObj.sourceName = leadObj.sourceName,
                leadInterestObj.subSourceName = leadObj.subSourceName,
                leadInterestObj.createdBy = leadObj.createdBy,
                leadInterestObj.createdBy_Uuid = leadObj.createdBy_Uuid,
                leadInterestObj.modifiedBy = leadObj.modifiedBy,
                leadInterestObj.modifiedBy_Uuid = leadObj.modifiedBy_Uuid
        }
        leadInterestArray.push(leadInterestObj)
    }
    leadInterestControls.saveNewLeadInterest(leadInterestArray);

}

const getLeadInterestDetails = async (id) => {
    return leadInterestControls.getLeadInterestDetails(id)
        .then(result => {
            return { message: `Lead Interest details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}

const saveLeadInterest = async (params) => {
    return leadInterestControls.saveLeadInterest(params)
        .then(result => {
            return { message: 'Lead interest saved', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}


const checkLeadInterestTable = async (lead, newInterest, tokenPayload = {}) => {
    try {
        let { leadId, leadType } = lead; //leadid

        let { board, school, learningProfile, sourceName, subSourceName, campaignName, campaignId, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid } = newInterest;

        const result = await leadInterestControls.checkLeadInterestTable(lead, learningProfile, board, school, newInterest.class, campaignName);

        if (!result) {
            let leadInterestData = { leadId, learningProfile, board, school, 'class': newInterest.class, sourceName, subSourceName, campaignId, campaignName, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, leadType }

            saveLeadInterest(leadInterestData)
        }

    }
    catch (err) {
        throw { errorMessage: err }

    }

}

const updateManyByKey = async (query, update, options) => {
    return leadInterestControls.updateManyByKey(query, update, options)
}

const uniqueLeadInterest = async (id) => {
    return leadInterestControls.uniqueLeadInterest(id)
        .then(result => {
            return { message: `Unique Lead Interest details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const interestTransactionalLog = async (params) => {
    let { leadId, learningProfile } = params;
    const LeadInterestList = leadInterestControls.interestTransactionalLog(params);
    const TotalCount = 20000;
    return Promise.all([LeadInterestList, TotalCount])
        .then(response => {
            let [result, totalCount] = response;
            return { message: `Lead Interest Transactional Logs`, result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getOwnerInterestList = async (params) => {
    const interestIdArr = await leadInterestControls.getInterestIdList(params);
    return leadInterestControls.getOwnerInterestList({ ...params, interestIdArr })
        .then(result => {
            return { message: `Lead Interest List According to Owner`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getSchoolInterests = async (params) => {
    return leadInterestControls.getSchoolInterests(params)
        .then(result => {
            return { message: `School Interests Fetched Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getMultipleSchoolInterests = async (params) => {
    return leadInterestControls.getMultipleSchoolInterests(params)
        .then(result => {
            return { message: `School Interests Fetched Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getProductList = async (params) => {
    try {
        let { data } = params;
        let result = [];
        const productMasterList = await productMasterFunctions.getProductMasterList();
        for (let item of data) {
            const schoolInterest = await leadInterestControls.getSchoolInterests(item);
            const diffOwnerInterest = schoolInterest.filter(obj => {
                if (obj.assignedTo_role_name !== item.roleName) return true;
            })
            const notMatchingItems = productMasterList.result.filter(item => !diffOwnerInterest.some(obj => obj.learningProfile === item));
            result.push({
                schoolId: item.schoolId,
                productList: notMatchingItems
            })

        }
        return { data: result };
    }
    catch (error) {
        throw { errorMessage: error }
    }
}

const getHotsPipelineResult = async (params) => {
    const result = await leadInterestControls.getHotsPipelineResult(params);
    const mappedData = mappedResult(result?.hotsResult, result?.pipelineResult);
    return mappedData;
}

const mappedResult = (hotsResult, pipelineResult) => {
    const mergedData = new Map();

    hotsResult.forEach(item => {
        const { _id, hotsValue } = item;
        if (mergedData.has(_id)) {
            mergedData.get(_id).hotsValue = hotsValue;
        } else {
            mergedData.set(_id, { _id, hotsValue });
        }
    });

    pipelineResult.forEach(item => {
        const { _id, pipelineValue } = item;
        if (mergedData.has(_id)) {
            mergedData.get(_id).pipelineValue = pipelineValue;
        } else {
            mergedData.set(_id, { _id, pipelineValue });
        }
    });
    const mergedArray = Array.from(mergedData.values());
    return mergedArray;
}

const getUserHotsPipeline = async (params) => {
    try {
        const result = await leadInterestControls.getUserHotsPipeline(params);
        calculateTotalContractValueByPriority(result);
        return { message: `Data fetched successfully`, result };
    }
    catch (error) {
        console.log(error, '::::::: error in get user hots pipeline function');
        throw { errorMessage: error };
    }

}

const calculateTotalContractValueByPriority = (data) => {
    const result = {};
    let roleWise = {};
    data.map(item => {
        const id = item._id;
        result[id] = {};
        hotsValue = { unit: 0, value: 0 };
        let pipelineValue = { unit: 0, value: 0 };
        let roleName = '';
        item.records.forEach(record => {
            const priority = record?.priority;
            const unit = record?.unit || 0;
            const contractValue = record?.netContractValue || 0;
            roleName = record?.assignedTo_role_name;

            if (priority === 'HOTS') {
                if (contractValue) {
                    hotsValue.value = hotsValue.value + parseInt(contractValue);
                }
                if (unit) {
                    hotsValue.unit = hotsValue.unit + parseInt(unit);
                }
            }
            if (priority === 'Pipeline') {
                if (contractValue) {
                    pipelineValue.value = pipelineValue.value + parseInt(contractValue);
                }
                if (unit) {
                    pipelineValue.unit = pipelineValue.unit + parseInt(unit);
                }
            }

        });
        item.hotsValue = hotsValue;
        item.pipelineValue = pipelineValue;
        delete item.records;
    });
    return { data };
}

const getDataByUserAndProduct = async (params) => {
    const result = await leadInterestControls.getHotsPipelineData(params);
    return result;
}

const migrateProducts = async (params) => {
    try {
        const file = xlsx.readFile('Product_Stage_Status.csv');
        let data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
        let errorFile = []
        const productsData = await crmMasterFunctions.getAllProductList();
        let productList = productsData?.result?.map(item => {
            return item?.value;
        })
        let result = [];
        for (let item of data) {
            let schoolDetails = await schoolControls.getSchoolData({ schoolCode: item?.['School Code'] });
            
            if (productList.includes(item?.['Product'])) {
                let id = mongoose.Types.ObjectId();
                const leadInterestResult = createSchoolProduct(id, item, schoolDetails);
                const leadOwnerResult = createLeadOwner(id, item, schoolDetails);
                const leadStageStatusResult = createLeadStageStatus(id, item, schoolDetails);

                const [leadInterest, leadOwner, leadStageStatus] = await Promise.all([leadInterestResult, leadOwnerResult, leadStageStatusResult]);
                result.push({ leadInterest, leadOwner, leadStageStatus })
            }
            else {
                item.errorMessage = 'Wrong Product';
                errorFile.push(item);
            }
        }
        return { message: 'Products Saved', result, errorFile };
    }
    catch (error) {
        console.log(error, ':: error in migrate products functions');
        throw { errorMessage: error };
    }
}

const createSchoolProduct = async (id, item, schoolDetails) => {
    let leadInterestObj = {
        leadId: id,
        learningProfile: item?.['Product'],
        leadInterestType: 'B2B',
        schoolId: schoolDetails?.leadId,
        schoolCode: item?.['School Code'],
        school: item?.['School Name'],
        assignedTo_role_name: item?.['Role'],
        assignedTo_displayName: item?.['Owner'],
        assignedTo_profile_name: item?.['Profile'],
        assignedTo_userName: item?.['Emp Code'],
        stageName: item?.['Stage'],
        statusName: item?.['Status'],
        sourceName: 'Reference',
        subSourceName: 'Employee_Reference',
    }
    const result = await leadInterestControls.createSchoolProduct(leadInterestObj);
    return result;
}

const createLeadOwner = async (id, item, schoolDetails) => {
    let leadOwnerObj = {
        leadId: schoolDetails?.leadId,
        leadInterestId: id,
        name: item?.['Product'],
        leadType: 'B2B',
        assignedTo_role_name: item?.['Role'],
        assignedTo_displayName: item?.['Owner'],
        assignedTo_profile_name: item?.['Profile'],
        assignedTo_userName: item?.['Emp Code']
    }
    const result = await leadOwnerControls.createLeadOwner(leadOwnerObj);
    return result;

}

const createLeadStageStatus = async (id, item, schoolDetails) => {
    let leadStageStatusObj = {
        leadId: id,
        journeyName: item?.['Journey'],
        cycleName: item?.['Cycle'],
        stageName: item?.['Stage'],
        statusName: item?.['Status'],
        source: 'Reference',
        subSource: 'Employee_Reference',
        state: schoolDetails?.state,
        city: schoolDetails?.city,
        leadType: 'B2B'
    }
    const result = await leadStageStatusControls.createLeadStageStatus(leadStageStatusObj);
    return result;

}




module.exports = {
    saveLeadInterest,
    checkLeadInterestTable,
    saveNewLeadInterest,
    updateManyByKey,
    getLeadInterestDetails,
    uniqueLeadInterest,
    interestTransactionalLog,
    getOwnerInterestList,
    getSchoolInterests,
    getMultipleSchoolInterests,
    getProductList,
    getHotsPipelineResult,
    getUserHotsPipeline,
    getDataByUserAndProduct,
    migrateProducts,
}