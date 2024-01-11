const bdeActivitiesControls = require("../controllers/bdeActivitiesControls");
const customExceptions = require('../responseModels/customExceptions');
const LeadOwner = require('../models/leadOwnerModel');
const Activities = require('../models/activityModel');
const LeadInterest = require('../models/leadInterestModel');
const { getLeadJourneyDetails } = require('./leadJourneyMappingFunctions');
const leadOwnerLogsControls = require('../controllers/leadOwnerLogsControls');
const mongoose = require('mongoose');
const moment = require('moment');
const bdeActivitiesModel = require("../models/bdeActivitiesModel");
const { createManyStageStatus } = require("../controllers/leadStageStatusControls");
const {IMPLEMENTATION_STAGE} = require('../constants/dbConstants');

const getBdeRecentActivityDetails = async (params) => {
    return bdeActivitiesControls.getBdeRecentActivityDetails(params)
        .then(result => {
            return { message: `bde Details fetched successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const createBdeActivity = async (params) => {
    // console.log("functions called")
    return bdeActivitiesControls.createBdeActivity(params)
        .then(result => {
            return { message: `bde activity created successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getUserActivities = async (params) => {
    return bdeActivitiesControls.getUserActivities(params)
        .then(result => {
            return { message: `User Activities List Fetched Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const closePendingActivities = async (params) => {
    return bdeActivitiesControls.closePendingActivities(params)
        .then(result => {
            return { message: `Activities Closed Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const logBdeActivity = async (obj) => {
    return bdeActivitiesControls.logBdeActivity(obj)
        .then(result => {
            return { message: `Activity Logged Successfully`, result }
        })
        .catch(error => {
            //console.log(error)
            return { errorMessage: error.message }
        })
}

const transferFutureActivities = async (params) => {
    return bdeActivitiesControls.transferFutureActivities(params)
        .then(result => {
            return { message: 'Future Activities Transfered Successfully', result }
        })
        .catch(error => {
            return { errorMessage: error }
        })
}

const getBdeActivities = async (params) => {

    return bdeActivitiesControls.getBdeActivities(params)
        .then(result => {
            return { message: `Bde Activities List Fetched Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getBdeActivitiesByRoleName = async (params) => {

    return bdeActivitiesControls.getBdeActivitiesByRoleName(params)
        .then(result => {
            return { message: `Bde Activities List Fetched on the basis of Role Name Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getBdeActivityScore = async (params) => {
    let { createdByRoleName } = params;

    let result = await bdeActivitiesControls.getBdeActivityScore({ createdByRoleName });
    return result
}

const getAttendanceActivity = async (params) => {
    let { createdByRoleName, createdByProfileName, granularity } = params;
    let activities = [];
    let finalResult = [];

    let mergedActivities = await bdeActivitiesControls.activitiesRoleProfileUnion({ createdByRoleName, createdByProfileName });
    mergedActivities.map(item => {
        activities.push(item.activityId)
    })
    const countActivities = await bdeActivitiesControls.getAttendanceActivity({ mergedActivities, activities, granularity });
    mergedActivities.map(mergeObj => {
        mergeObj.activityIdCount = 0;
        mergeObj.buhCount = 0;
        mergeObj.createdByRoleNameCount = 0;
        mergeObj.inHeadCount = 0;
        mergeObj.buhAverage = 0;
        mergeObj.nationalAverage = 0;
        countActivities.filter(countObj => {


            if (mergeObj.activityId === countObj._id.activityId) {
                mergeObj.activityIdCount = countObj.activityIdCount
                mergeObj.buhCount = countObj.buhCount
                mergeObj.createdByRoleNameCount = countObj.createdByRoleNameCount
                mergeObj.inHeadCount = countObj.inHeadCount
                mergeObj.buhAverage = countObj.buhAverage
                mergeObj.nationalAverage = countObj.nationalAverage

            }
        })

    })

    return mergedActivities
}

const getCurrentMonthActivities = async (params) => {
    return bdeActivitiesControls.getCurrentMonthActivities(params)
        .then(result => {
            return { message: `Activities fetched successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}

const logMeetingActivity = async (params) => {
    try {
        let { activityObj } = params;
        let promises = [];

        for (let data of activityObj) {
           
            if (!data.leadId && data.leadType === 'INTEREST') {
                let newId = mongoose.Types.ObjectId();
                data.newId = newId;
                const ownerResult = await saveLeadOwner(data);
                const interestResult = await saveLeadInterest(data);
                data.leadId = interestResult?.leadId;
            }

            let promise = await bdeActivitiesControls.createMeetingActivity(data);
            promises.push(promise);
        }
        return Promise.all(promises)
            .then((result) => {
                return { message: `Activities logged successfully`, result }
            })
            .catch((error) => {
                console.error(error, '.....err inside log meeting ');
                throw { errorMessage: error, message: error.message }

            });


    }
    catch (err) {
        console.log(err, ':: err inside log meeting functions');
        throw { errorMessage: err }
    }

}

const saveLeadInterest = async (obj) => {
    try {
        let { newId, leadStage, leadStatus, name, schoolCode, schoolName,priority,edc, schoolId, leadType, ownerType, createdBy, createdByName, createdByRoleName, createdByProfileName, empCode } = obj;
        let newObj = {
            leadId: newId,
            learningProfile: name,
            leadInterestType: 'B2B',
            priority: priority,
            edc: edc,
            schoolId: schoolId,
            schoolCode: schoolCode,
            school: schoolName,
            assignedTo_role_name: createdByRoleName,
            assignedTo_displayName: createdByName,
            assignedTo_userName: empCode,
            assignedTo_profile_name: createdByProfileName,
            statusName: leadStatus,
            stageName: leadStage,
            sourceName: 'Reference',
            subSourceName: 'Employee_Reference',
            learningProfileCode: obj?.learningProfileCode,
            learningProfileRefId: obj?.learningProfileRefId,
            learningProfileGroupCode: obj?.learningProfileGroupCode,
            learningProfileGroupName: obj?.learningProfileGroupName
        };
        const isExists = await LeadInterest.findOne({assignedTo_userName: empCode, learningProfile:name, schoolId: schoolId});
        if (!isExists){
            const result = await LeadInterest.create(newObj);
            return result;
        }
    }
    catch (err) {
        console.log(err, ':: err inside save lead interest');

        throw { errorMessage: err }
    }
}

const saveLeadOwner = async (obj) => {
    try {
        let { newId, leadId, leadType, ownerType, name, schoolId, ownerLeadId, createdBy, createdByName, createdByRoleName, createdByProfileName, empCode } = obj;
        let newObj = {
            leadId: schoolId, //schoolId
            leadInterestId: newId,
            name: name,
            leadType: 'B2B',
            ownerType,
            assignedTo_role_name: createdByRoleName,
            assignedTo_displayName: createdByName,
            assignedTo_userName: empCode,
            assignedTo_profile_name: createdByProfileName,
            assignedTo_assignedOn: new Date()
        };
        const result = await LeadOwner.create(newObj);
        leadOwnerLogsControls.createLeadOwnerLogs(newObj);

        return result;
    }
    catch (err) {
        console.log(err, ':: err inside save lead owner');
        throw { errorMessage: err }
    }
}

const checkLeadStageStatus = async (params) => {
    try{
        const result = await bdeActivitiesControls.checkLeadStageStatus(params);
        return result;
    }
    catch (error) {
        console.log(error,':: err inside check lead stage status functions');
        throw { errorMessage: error };
    }
}

const fetchBdeActivitiesByDate = async (params) => {
    try{
    return bdeActivitiesControls.fetchBdeActivitiesByDate(params)
        .then(result => {
            return { message: `Bde Activities List Fetched Successfully`, result }
        }).catch(error => {
            throw { errorMessage: error }
        })
    }
    catch(err){
        console.log(err,'............error in fetchBdeActivitiesByDate');
        throw err;
    }
}
const getCurrentActivities = async (params) => {
    return bdeActivitiesControls.getCurrentActivities(params)
        .then(result => {
            return { message: `Activities fetched successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const addActivity = async (params) => {
    try{
    let { activityObj } = params;
    let promises = [];

    for(let data of activityObj){
        if (!data?.leadType) {
            throw Error('Please Provide lead type')
        }
        if (!data.leadId && data.leadType === 'INTEREST') {
            let newId = mongoose.Types.ObjectId();
            data.newId = newId;
            const ownerResult = await saveLeadOwner(data);
            const interestResult = await saveLeadInterest(data);
            data.leadId = interestResult?.leadId;
        }
        let promise = bdeActivitiesControls.addActivity(data);
        getLeadJourneyDetails(data).then(
            res => {
                let { leadData,list } = res
                if(list && list.length > 0){
                    createManyStageStatus(list)
                }
                let obj = {
                    leadId:leadData.leadId,
                    leadType: data?.leadType,
                    update:{
                      stageName:leadData.stageName,
                      statusName:leadData.statusName
                    }
                }
                if(leadData.stageName && leadData.statusName){
                    let data = bdeActivitiesControls.updateLead(obj)                    
                } 
            }
        )
        promises.push(promise);
    }
    return Promise.all(promises)
            .then((result) => {
                return { message: `Activities added successfully`, result }
            })
            .catch((error) => {
                console.error(error, '.....err inside log meeting ');
                throw { errorMessage: error, message: error.message }

            });
    }
    catch(err){
        console.log(err,':: error inside add activity');
        throw { errorMessage: err }
    }


}

const updateActivity = async (params) => {
    let { leadId, isQcSubmitted, createdByRoleName } = params;
    let query = {leadId: {$in: [leadId]}, status: 'Complete', createdByRoleName, subject: `${IMPLEMENTATION_STAGE.HARDWARE_QC}`};
    let options = { new: true };
    let update = {};
    if(isQcSubmitted) update.isQcSubmitted = true;
    return bdeActivitiesControls.updateManyByKey(query, update, options)
    .then(result => {
        return { message: `Activity Updated Successfully`, result }
    })
    .catch(error => {
        console.log(error,'..................errrrrr')
        throw { errorMessage: error }
    })
}

const getActivitiesByType = async (params) => {
    const activityList = bdeActivitiesControls.getActivitiesByType(params);
    const listCount = bdeActivitiesControls.getActivitiesByTypeCount(params);
    return Promise.all([activityList, listCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'BDE Activities Fetched Successfully', result, totalCount }
        })
        .catch(error => {
            console.log(error, '...........err in list');
            throw { errorMessage: error }
        })
}

const getDraftActivityDetail = async (params) => {
    return bdeActivitiesControls.getDraftActivityDetail(params)
        .then(result => {
            return { message: `Draft Activities Data Fetched Successfully`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getCollectionTypeActivities = async (params) => {
    const activityList = bdeActivitiesControls.getCollectionTypeActivities(params);
    const listCount = bdeActivitiesControls.getCollectionActivitiesCount(params);
    return Promise.all([activityList, listCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'BDE Activities Fetched Successfully', result, totalCount }
        })
        .catch(error => {
            console.log(error, '...........err in list');
            throw { errorMessage: error }
        })
}

const updateCollectionActivity = async (params) => {
    let query = {
        _id: { $in: params.idList },                             //can take lead id for update
        isCollection: true
    };
    let options = { new: true };
    let update = { isCollectionSubmitted: true };
    return bdeActivitiesControls.updateManyByKey(query, update, options)
    .then(result => {
        return { message: `Collection Submitted Successfully`, result }
    })
    .catch(error => {
        throw { errorMessage: error }
    })
}


module.exports = {
    getBdeRecentActivityDetails,
    createBdeActivity,
    getUserActivities,
    logBdeActivity,
    transferFutureActivities,
    getBdeActivities,
    getBdeActivitiesByRoleName,
    getBdeActivityScore,
    getAttendanceActivity,
    getCurrentMonthActivities,
    closePendingActivities,
    logMeetingActivity,
    checkLeadStageStatus,
    fetchBdeActivitiesByDate,
    addActivity,
    getCurrentActivities,
    getDraftActivityDetail,
    getActivitiesByType,
    getCollectionTypeActivities,
    updateCollectionActivity,
    updateActivity  
}