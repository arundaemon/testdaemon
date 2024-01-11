const BdeActivitiesModel = require("../models/bdeActivitiesModel");
const UserActivitySchema = require('../models/userActivityModel');
const Activities = require('../models/activityModel');
const ConfigModel = require('../models/configModel');
const Category = require('../models/categoryModel');
const LeadStageStatus = require('../models/leadStageStatusModel');
const RoleBasedAttendanceActivity = require('../models/roleBasedAttendanceActivitiesModel');
const { getHierachyDetails } = require("../functions/hierachyFunctions");
const { recursiveSearch } = require("../utils/utils");
const moment = require('moment');
const bdeActivitiesModel = require("../models/bdeActivitiesModel");
const LeadOwner = require('../models/leadOwnerModel');
const LeadInterest = require('../models/leadInterestModel');
const config = require('../config')
const utils = require('../utils/utils')
const School = require('../models/schoolModel');
const { getLeadJourneyDetails } = require('../functions/leadJourneyMappingFunctions');
const { createManyStageStatus } = require('../controllers/leadStageStatusControls');
const { DB_MODEL_REF, LEAD_TYPE } = require("../constants/dbConstants");
const { updateOneByKey } = require('../controllers/implementationFormControls');

const getBdeRecentActivityDetails = async (params) => {
    let sort = { startDateTime: -1 };
    return BdeActivitiesModel.find(params).sort(sort).limit(1);
}

const getLastBdeActivityDetails = async (params) => {
    let sort = { updatedAt: -1 };
    return BdeActivitiesModel.find(params).sort(sort).limit(1);
}

const logBdeActivity = async (obj) => {
    let config = await ConfigModel.findOne({}).lean()
    if (!obj.createdByRoleName || !obj.createdBy || !obj.createdByName || !obj.createdByProfileName) {
        throw Error('Please Provide createdBy Details')
    }
    if (!obj.leadId) {
        throw Error('Please Provide lead ID')
    }
    let roleList = []
    try {
        let res = await getHierachyDetails({ roleName: obj.createdByRoleName })
        //console.log(res)
        roleList = recursiveSearch(res.result, 'parents')
    } catch (err) {

    }
    let leadObj = await LeadStageStatus.findOne({ leadId: obj.leadId }).sort({ updatedAt: -1 }).lean()
    if (leadObj) {

        let managerObj = {}
        let counter = 1
        roleList.forEach(
            (obj, index) => {
                let roleName = obj.roleName.toUpperCase()
                if (roleName.includes('BUH')) {
                    managerObj['Buh'] = obj.roleName
                    managerObj['BuhName'] = obj.displayName
                } else if (roleName.includes('RUH') || roleName.includes('RBUH')) {
                    managerObj['Ruh'] = obj.roleName
                    managerObj['RuhName'] = obj.displayName
                } else if (roleName.includes('INDIAHEAD') || roleName.includes('IBH')) {
                    managerObj['InHead'] = obj.roleName
                    managerObj['InHeadName'] = obj.displayName
                } else {
                    managerObj[`manager${counter}`] = obj.roleName
                    managerObj[`manager${counter}Name`] = obj.displayName
                    counter++
                }
            }
        )
        switch (obj.activityType) {
            case 'order':
                createOrderActivity({ orderActivity: config.orderActivity, ...obj, ...obj.activityDetail, ...managerObj, ...leadObj, status: 'Complete', _id: null })
                break;
            case 'trial':
                createTrialActivity({ trialActivity: config.trialActivity, ...obj, ...obj.activityDetail, ...managerObj, ...leadObj, status: 'Complete', _id: null })
                break;
            case 'payment_link':
                createPaymentActivity({ paymentlinkActivity: config.paymentlinkActivity, ...obj, ...obj.activityDetail, ...managerObj, ...leadObj, status: 'Complete', _id: null })
                break;
            default:
                throw Error('Please Provide valid activity Type')
                break;
        }
        return { status: "OK" }
    } else {
        throw Error('Invalid lead ID')
    }
}

const isActivityExist = async (data) => {

    const prevActivity = await bdeActivitiesModel.find({ leadId: data?.leadId, schoolId: data?.schoolId, status: 'Complete' })
        .sort({ updatedAt: -1 }).limit(1);
    return prevActivity;
}

const createMeetingActivity = async (bdeActivityObj) => {
    try {
        let currentActivity = {};
        let futureActivity = {};

        if (!bdeActivityObj.activityId || !bdeActivityObj.futureActivityId) {
            throw Error('Please provide activity id and future activity id')
        }
        const isExist = await isActivityExist(bdeActivityObj);
        if (isExist.length > 0) {
            bdeActivityObj.previousPriority = isExist[0]?.priority;
        }
        let activityDetail = await Activities.findOne({ ID: bdeActivityObj.activityId, isDeleted: false }).lean();

        bdeActivityObj.status = 'Complete'

        if (activityDetail) {
            bdeActivityObj.isRefurbished = 0;
            bdeActivityObj.isCollectionSubmitted = false;
            bdeActivityObj.isSsrSubmitted = false,
            bdeActivityObj.isQcSubmitted = false,
            bdeActivityObj.activityName = activityDetail?.activityName
            bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""
            bdeActivityObj.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
            bdeActivityObj.score = activityDetail?.score ? activityDetail?.score : 0
            bdeActivityObj.activityScore = activityDetail.score
            bdeActivityObj.callActivity = activityDetail?.calling ? true : false
            bdeActivityObj.taskActivity = activityDetail?.task ? true : false
            bdeActivityObj.attendanceActivity = activityDetail?.attendance ? true : false
            bdeActivityObj.approvalActivity = activityDetail?.approval ? true : false
            bdeActivityObj.activityMaxScore = activityDetail.maxScore ? activityDetail.maxScore : 0
            bdeActivityObj.refCallId = Date.now(),

                currentActivity = await BdeActivitiesModel.findOneAndUpdate({ leadId: bdeActivityObj?.leadId, status: 'Pending' }, bdeActivityObj, { upsert: true, new: true });
            if (currentActivity) {
                await updateStageStatus(currentActivity);
            }
        }


        if (bdeActivityObj.meetingStatus === 'Meeting Happened') {
            await updateInterest(bdeActivityObj);
        }
        if (bdeActivityObj?.followUpDateTime){
            const futureObj = {
                ...bdeActivityObj,
                activityId: bdeActivityObj?.futureActivityId,
                startDateTime: bdeActivityObj?.followUpDateTime
            }
            futureActivity = await addActivity(futureObj); 
        }              
       
        return { currentActivity, futureActivity };
    }
    catch (error) {
        console.log(error, ':: error in create meeting activity');
        throw error;
    }

}

const getValue = (bdeActivityObj) => {
    let value = '';
    switch (bdeActivityObj.name) {
        case 'ESC Plus': {
            value = bdeActivityObj?.escUnit;
            break;
        }
        case 'SIP': {
            value = bdeActivityObj?.studentUnit;
            break;
        }
        case 'Assessment Centre': {
            value = bdeActivityObj?.units;
            break;
        }
        case 'Learning App': {
            value = bdeActivityObj?.units;
            break;
        }
        case 'Hardware': {
            value = bdeActivityObj?.quantity;
            break;
        }
    }
    return value;
}

const updateInterest = async (bdeActivityObj) => {
    let query = { leadId: bdeActivityObj?.leadId };
    let update = {
        priority: bdeActivityObj.priority,
        edc: bdeActivityObj.edc,
        softwareContractValue: bdeActivityObj.softwareContractValue,
        edcCount: 1,
    };
    if (bdeActivityObj.priority === 'HOTS' || bdeActivityObj.priority === 'Pipeline') {
        update = {
            ...update,
            netContractValue: bdeActivityObj.netContractValue,
            unit: getValue(bdeActivityObj)
        }
    }
    const edcExisted = await LeadInterest.findOne(query);
    if (edcExisted?.edc) {
        let date1 = JSON.stringify(edcExisted?.edc);
        let date2 = bdeActivityObj?.edc
        const extractedDate1 = date1.substring(1, 11);
        const extractedDate2 = date2;
        if (extractedDate1 !== extractedDate2) {
            let edcCount = edcExisted.edcCount ?? 1
            update.edcCount = edcCount + 1;
        }
        else {
            if (edcExisted?.edcCount) {
                update.edcCount = edcExisted.edcCount
            }
        }
    }
    LeadInterest.findOneAndUpdate(query, update, { new: true });

}

const createOrderActivity = async (bdeActivityObj) => {
    let activityDetail = await Activities.findOne({ ID: bdeActivityObj.orderActivity, isDeleted: false }).lean()
    //let bdeActivityObj = obj
    if (activityDetail) {
        bdeActivityObj.activityName = activityDetail?.activityName
        bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""
        activityDetail.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
        activityDetail.score = activityDetail?.score ? activityDetail?.score : 0
        bdeActivityObj.activityScore = activityDetail.score
        bdeActivityObj.callActivity = activityDetail?.calling ? true : false
        bdeActivityObj.taskActivity = activityDetail?.task ? true : false
        bdeActivityObj.attendanceActivity = activityDetail?.attendance ? true : false
        bdeActivityObj.approvalActivity = activityDetail?.approval ? true : false
        bdeActivityObj.activityMaxScore = activityDetail.maxScore ? activityDetail.maxScore : 0
        bdeActivityObj.createdAt = new Date()
        bdeActivityObj.updatedAt = new Date()
        let categoryDetail = await Category.findOne({ categoryName: bdeActivityObj.category })
        if (categoryDetail) {
            let duration = categoryDetail.duration
            let startDate = new Date(moment().utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss'))
            bdeActivityObj['startDateTime'] = startDate
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDateTime).setMinutes(startDate.getMinutes() + duration))
        } else {
            let startDate = new Date(moment().utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss'))
            bdeActivityObj['startDateTime'] = startDate
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDateTime).setMinutes(startDate.getMinutes() + 10))
        }
        //console.log(bdeActivityObj)
        BdeActivitiesModel.create(bdeActivityObj)
    }
}

const createTrialActivity = async (bdeActivityObj) => {
    let activityDetail = await Activities.findOne({ ID: bdeActivityObj.trialActivity, isDeleted: false }).lean()
    if (activityDetail) {
        bdeActivityObj.activityName = activityDetail?.activityName
        bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""
        activityDetail.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
        activityDetail.score = activityDetail?.score ? activityDetail?.score : 0
        bdeActivityObj.activityScore = activityDetail.score
        bdeActivityObj.callActivity = activityDetail?.calling ? true : false
        bdeActivityObj.taskActivity = activityDetail?.task ? true : false
        bdeActivityObj.attendanceActivity = activityDetail?.attendance ? true : false
        bdeActivityObj.approvalActivity = activityDetail?.approval ? true : false
        bdeActivityObj.activityMaxScore = activityDetail.maxScore ? activityDetail.maxScore : 0
        bdeActivityObj.createdAt = new Date()
        bdeActivityObj.updatedAt = new Date()
        let categoryDetail = await Category.findOne({ categoryName: bdeActivityObj.category })
        if (categoryDetail) {
            let duration = categoryDetail.duration
            let startDate = new Date(moment().utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss'))
            bdeActivityObj['startDateTime'] = startDate
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDateTime).setMinutes(startDate.getMinutes() + duration))
        } else {
            let startDate = new Date(moment().utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss'))
            bdeActivityObj['startDateTime'] = startDate
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDateTime).setMinutes(startDate.getMinutes() + 10))
        }
        BdeActivitiesModel.create(bdeActivityObj)
    }
}

const createPaymentActivity = async (bdeActivityObj) => {
    let activityDetail = await Activities.findOne({ ID: bdeActivityObj.paymentlinkActivity, isDeleted: false }).lean()
    if (activityDetail) {
        bdeActivityObj.activityName = activityDetail?.activityName
        bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""
        activityDetail.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
        activityDetail.score = activityDetail?.score ? activityDetail?.score : 0
        bdeActivityObj.activityScore = activityDetail.score
        bdeActivityObj.callActivity = activityDetail?.calling ? true : false
        bdeActivityObj.taskActivity = activityDetail?.task ? true : false
        bdeActivityObj.attendanceActivity = activityDetail?.attendance ? true : false
        bdeActivityObj.approvalActivity = activityDetail?.approval ? true : false
        bdeActivityObj.activityMaxScore = activityDetail.maxScore ? activityDetail.maxScore : 0
        bdeActivityObj.createdAt = new Date()
        bdeActivityObj.updatedAt = new Date()
        let categoryDetail = await Category.findOne({ categoryName: bdeActivityObj.category })
        if (categoryDetail) {
            let duration = categoryDetail.duration
            let startDate = new Date(moment().utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss'))
            bdeActivityObj['startDateTime'] = startDate
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDateTime).setMinutes(startDate.getMinutes() + duration))
        } else {
            let startDate = new Date(moment().utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss'))
            bdeActivityObj['startDateTime'] = startDate
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDateTime).setMinutes(startDate.getMinutes() + 10))
        }
        BdeActivitiesModel.create(bdeActivityObj)
    }
}

const createBdeActivity = async (params) => {
    return BdeActivitiesModel.create(params);
}

const getUserActivities = async (params) => {
    let pageNo = 0
    count = 100
    return UserActivitySchema.find(params).hint({ user_id: 1 }).sort({ created_at: -1 }).skip(pageNo * count).limit(count).lean()
}

const updateManyByKey = async (query, update, options) => {
    return BdeActivitiesModel.updateMany(query, update, options);
}

const findOneByKey = async (query, populate) => {
    return BdeActivitiesModel.findOne(query).populate(populate)
}

const transferFutureActivities = async (params) => {
    let { _id, createdByName, createdByProfileName, createdByRoleName } = params;
    let query = { _id };
    let update = {
        createdByName, createdByProfileName, createdByRoleName
    };
    let options = { new: true };
    return BdeActivitiesModel.findOneAndUpdate(query, update, options)
}

const getBdeActivities = async (params) => {

    let pageNo = 0;
    let count = 100;
    let hint = { updatedAt: -1 }
    let query = {
        status: 'Complete',
        //updatedAt:{$gt:moment().utc().subtract(100,'days')}
    }

    //params.status="Complete";

    if (params?.status) {
        query.status = params.status
    }

    if (params.leadId) {
        query.leadId = params.leadId
        hint = { leadId: 1 }
    }

    if (params && params.status && params.leadId) {
        hint = { status: 1, updatedAt: 1, leadId: 1 }
    }

    if (params.roleList) {
        query['createdByRoleName'] = typeof params.roleList == 'object' ? { $in: params.roleList } : params.roleList
        hint = { updatedAt: 1, createdByRoleName: 1 }
    }

    if (params.taskFlag) {
        query['taskActivity'] = params.taskFlag
    }

    if (params.attendanceFlag) {
        query['attendanceActivity'] = params.attendanceFlag
    }

    const data = await BdeActivitiesModel.find(query)
        .hint(hint)
        .sort({ startDateTime: -1 })
        .skip(pageNo * count)
        .limit(count)
        .lean();

    const modifiedResult = data.map(modKey => {

        modKey[`${config.cfg.BDE_ACTIVITIES}._id`] = modKey._id ? modKey._id : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.leadId`] = modKey.leadId ? modKey.leadId : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.activityName`] = modKey.activityName ? modKey.activityName : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.customerResponse`] = modKey.customerResponse ? modKey.customerResponse : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.conversationWith`] = modKey.conversation ? modKey.conversation : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callDuration`] = modKey.callDuration ? modKey.callDuration : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callRecording`] = modKey.callRecording ? modKey.callRecording : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callStatus`] = modKey.callStatus ? modKey.callStatus : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.reasonForDQ`] = modKey.reasonForDQ ? modKey.reasonForDQ : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.interestedIn`] = modKey.interestedIn ? modKey.interestedIn : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.name`] = modKey.name ? modKey.name : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.comments`] = modKey.comments ? modKey.comments : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.startDateTime`] = modKey.startDateTime ? modKey.startDateTime : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdByName`] = modKey.createdByName ? modKey.createdByName : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdByProfileName`] = modKey.createdByProfileName ? modKey.createdByProfileName : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.paymentUrl`] = modKey.paymentUrl ? modKey.paymentUrl : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.paymentAmount`] = modKey.paymentAmount ? modKey.paymentAmount : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdAt`] = modKey.createdAt ? modKey.createdAt : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.knownLanguages`] = modKey.knownLanguages ? modKey.knownLanguages : null;
        modKey[`${config.cfg.BDE_ACTIVITIES}.status`] = modKey.status ? modKey.status : null;

        return modKey;
    })

    return modifiedResult;

}

const closePendingActivities = async (params) => {
    let query = {
        leadId: params.leadId,
        status: 'Pending'
    }
    let update = {
        status: 'Closed'
    }
    return BdeActivitiesModel.updateMany(query, update, { new: false, upsert: false })
}

const getBdeActivitiesByRoleName = async (params) => {
    let query = {
        //updatedAt:{$gt:moment().utc().subtract(100,'days')},
    }
    if (params.createdByRoleName) {
        query.createdByRoleName = params.createdByRoleName
    }
    if (params.status) {
        query.status = params.status
    }
    if (params.startDateTime) {
        query.startDateTime = params.startDateTime
    }
    let pageNo = 0;
    let count = 0;
    if (utils.isEmptyValue(params.pageNo) && !isNaN(parseInt(params.pageNo))) {
        pageNo = parseInt(params.pageNo)
    } else {
        pageNo = 0
    }

    if (utils.isEmptyValue(params.limit) && !isNaN(parseInt(params.limit))) {
        count = parseInt(params.limit)
    }
    //console.log('List',count,pageNo)

    const data = await BdeActivitiesModel.find(query)
        .hint({ updatedAt: 1, createdByRoleName: 1 })
        .sort({ startDateTime: -1 })
        .skip(pageNo * count)
        .limit(count)
        .lean();

    const modifiedResult = data.map(modKey => {

        modKey[`${config.cfg.BDE_ACTIVITIES}.Id`] = modKey._id;
        modKey[`${config.cfg.BDE_ACTIVITIES}.leadId`] = modKey.leadId;
        modKey[`${config.cfg.BDE_ACTIVITIES}.activityName`] = modKey.activityName;
        modKey[`${config.cfg.BDE_ACTIVITIES}.customerResponse`] = modKey.customerResponse;
        modKey[`${config.cfg.BDE_ACTIVITIES}.conversationWith`] = modKey.conversation;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callDuration`] = modKey.callDuration;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callRecording`] = modKey.callRecording ? modKey.callRecording : "null";
        modKey[`${config.cfg.BDE_ACTIVITIES}.callStatus`] = modKey.callStatus;
        modKey[`${config.cfg.BDE_ACTIVITIES}.reasonForDQ`] = modKey.reasonForDQ;
        modKey[`${config.cfg.BDE_ACTIVITIES}.interestedIn`] = modKey.interestedIn;
        modKey[`${config.cfg.BDE_ACTIVITIES}.name`] = modKey.name;
        modKey[`${config.cfg.BDE_ACTIVITIES}.comments`] = modKey.comments;
        modKey[`${config.cfg.BDE_ACTIVITIES}.startDateTime`] = modKey.startDateTime;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdByName`] = modKey.createdByName;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdByProfileName`] = modKey.createdByProfileName;
        modKey[`${config.cfg.BDE_ACTIVITIES}.paymentUrl`] = modKey.paymentUrl;
        modKey[`${config.cfg.BDE_ACTIVITIES}.paymentAmount`] = modKey.paymentAmount;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdAt`] = modKey.createdAt;
        modKey[`${config.cfg.BDE_ACTIVITIES}.knownLanguages`] = modKey.knownLanguages;
        modKey[`${config.cfg.BDE_ACTIVITIES}.status`] = modKey.status;
        modKey[`${config.cfg.BDE_ACTIVITIES}.category`] = modKey.category;
        modKey[`${config.cfg.BDE_ACTIVITIES}.endDateTime`] = modKey.endDateTime;
        modKey[`${config.cfg.BDE_ACTIVITIES}.count`] = modKey.count;

        return modKey;
    })

    return modifiedResult;
}

const getBdeActivityScore = async (params) => {
    let { createdByRoleName } = params;
    let sumPoint = 0;

    const result = await BdeActivitiesModel.aggregate([
        {
            $match: {
                createdByRoleName,
                attendanceActivity: true
            }
        },

        {
            $group: {
                _id: "$activityId",
                activityScoreSum: { $sum: "$activityScore" },
                createdByRoleName: { "$first": "$createdByRoleName" },
                activityId: { "$first": "$activityId" },

            }
        },
        {
            $lookup: {
                from: "activities",
                let: { "activityId": "$activityId" },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": { "$eq": ["$ID", "$$activityId"] },
                            "userType": "Employee"
                        }
                    },
                    { "$project": { "maxScore": 1, "ID": 1, "userType": 1 } }
                ],
                as: "activities"
            }
        },
        {
            "$unwind": "$activities"
        },
        {

            $project: {
                _id: 1,
                activityId: "activityId",
                createdByRoleName: 1,
                activityScore: 1,
                activityScoreSum: 1,
                maxScore: "$activities.maxScore",
                userType: "$activities.userType",
                totalScore: {
                    $cond: {
                        if: { $gt: ["$activities.maxScore", "$activityScoreSum"] },
                        then: "$activityScoreSum",
                        else: '$activities.maxScore'
                    }
                }
            }
        }
    ])
    // result.map(item => {
    //     item["Bdeactivities.activityId"] = item._id
    //     item["Bdeactivities.totalActivityScore"] = item.activityScoreSum
    //     item["Bdeactivities.createdByRoleName"] = item.createdByRoleName
    //     item["Activities.maxScore"] = item.maxScore
    //     item["Activities.userType"] = item.userType
    // })
    result.map(item => {
        sumPoint += item.totalScore;

    })
    const obj = {
        [`${config.cfg.BDE_ACTIVITIES}.activityScore`]: sumPoint
    }
    return obj;
}

const activitiesRoleProfileUnion = async (params) => {
    let { createdByRoleName, createdByProfileName } = params;
    let roleActivity = [];

    const roleBasedActivities = await RoleBasedAttendanceActivity.find({ role_name: createdByRoleName }).select('activityId activityName profile_name role_name weeklyTarget dailyTarget monthlyTarget').lean();

    roleBasedActivities.map(item => {
        roleActivity.push(item.activityId);
    })

    const profileBasedActivities = await RoleBasedAttendanceActivity.find({
        profile_name: createdByProfileName,
        activityId: { $nin: roleActivity }
    }).select('activityId activityName profile_name role_name weeklyTarget dailyTarget monthlyTarget').lean();

    let mergedActivities = roleBasedActivities.concat(profileBasedActivities);
    return mergedActivities;
}

const getAttendanceActivity = async (params) => {
    let { activities, granularity } = params;
    let query = {};

    if (granularity === 'Today') {
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        let end = new Date();
        end.setHours(23, 59, 59, 999);
        query.startDateTime = {
            $gte: start,
            $lte: end
        }
    }

    if (granularity === 'This Week') {
        let start = new Date(moment().startOf('iWeek').format('YYYY-MM-DD'));
        start.setHours(0, 0, 0, 0);
        let end = new Date(moment().endOf('iWeek').format('YYYY-MM-DD'));
        end.setHours(23, 59, 59, 999);
        query.startDateTime = {
            $gte: start,
            $lte: end
        }
    }

    if (granularity === 'This Month') {
        let date = new Date();
        let start = new Date(date.getFullYear(), date.getMonth(), 1);
        let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //let start =new Date(moment().startOf('iMonth').format('YYYY-MM-DD'));
        start.setHours(0, 0, 0, 0);
        //let end = new Date(moment().startOf('Month').format('YYYY-MM-DD'));
        end.setHours(23, 59, 59, 999);
        query.startDateTime = {
            $gte: start,
            $lte: end
        }

    }
    let pipeline = [];
    pipeline.push({
        $match: {
            activityId: { $in: activities },
            attendanceActivity: true,
            startDateTime: query.startDateTime
        }
    });
    let activityIdGroup =
    {
        $group: {
            _id: {
                activityId: "$activityId"
            },
            activityName: { $first: "$activityName" },
            createdByRoleName: { $first: "$createdByRoleName" },
            activityIdCount: { $sum: 1 },
            activityData: {
                $push: {
                    buh: "$Buh",
                    createdByRoleName: "$createdByRoleName",
                    inHead: "$InHead"
                }
            }
        }
    }
    pipeline.push(activityIdGroup)

    let project = {
        $project: {
            activityData: 1,
            activityId: 1,
            activityIdCount: 1,
            buh: 1,
            inHead: 1,
            activityName: 1,
            createdByRoleName: 1
        }
    }
    pipeline.push(project)

    const result = await bdeActivitiesModel.aggregate(pipeline)

    result.map((item) => {
        let buhArr = new Set();
        let roleArr = new Set();
        item.buhCount = 0;
        item.createdByRoleNameCount = 0;
        item.inHeadCount = 0;
        item.activityData && item.activityData.length && item.activityData.map(dt => {
            if (dt.buh) ++item.buhCount;
            if (dt.inHead) ++item.inHeadCount;
            if (dt.createdByRoleName) ++item.createdByRoleNameCount;

            buhArr.add(dt.buh);
            roleArr.add(dt.createdByRoleName);
        });
        item.buhAverage = parseFloat(item.buhCount / item.activityIdCount).toFixed(5);
        item.nationalAverage = parseFloat(item.inHeadCount / item.activityIdCount).toFixed(5);
        //Average by group unique
        item.buhGroupAverage = parseFloat(buhArr.size / (buhArr.size + roleArr.size)).toFixed(5);
        delete item.activityData;
        item.buhGroupCount = buhArr.size;
        item.createdByRoleNameGroupCount = roleArr.size;
    })
    return result;
}

const getCurrentMonthActivities = async (params) => {
    let { status, createdByRoleName } = params;
    let date = new Date();
    let start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    let query = {
        status,
        createdByRoleName,
        startDateTime: {
            $gt: start,
            $lte: end
        }
    }
    const result = await bdeActivitiesModel.find(query).lean();

    const modifiedResult = result.map(modKey => {

        modKey[`${config.cfg.BDE_ACTIVITIES}.Id`] = modKey._id;
        modKey[`${config.cfg.BDE_ACTIVITIES}.leadId`] = modKey.leadId;
        modKey[`${config.cfg.BDE_ACTIVITIES}.activityName`] = modKey.activityName;
        modKey[`${config.cfg.BDE_ACTIVITIES}.customerResponse`] = modKey.customerResponse;
        modKey[`${config.cfg.BDE_ACTIVITIES}.conversationWith`] = modKey.conversation;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callDuration`] = modKey.callDuration;
        modKey[`${config.cfg.BDE_ACTIVITIES}.callRecording`] = modKey.callRecording ? modKey.callRecording : "null";
        modKey[`${config.cfg.BDE_ACTIVITIES}.callStatus`] = modKey.callStatus;
        modKey[`${config.cfg.BDE_ACTIVITIES}.reasonForDQ`] = modKey.reasonForDQ;
        modKey[`${config.cfg.BDE_ACTIVITIES}.interestedIn`] = modKey.interestedIn;
        modKey[`${config.cfg.BDE_ACTIVITIES}.name`] = modKey.name;
        modKey[`${config.cfg.BDE_ACTIVITIES}.comments`] = modKey.comments;
        modKey[`${config.cfg.BDE_ACTIVITIES}.startDateTime`] = modKey.startDateTime;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdByName`] = modKey.createdByName;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdByProfileName`] = modKey.createdByProfileName;
        modKey[`${config.cfg.BDE_ACTIVITIES}.paymentUrl`] = modKey.paymentUrl;
        modKey[`${config.cfg.BDE_ACTIVITIES}.paymentAmount`] = modKey.paymentAmount;
        modKey[`${config.cfg.BDE_ACTIVITIES}.createdAt`] = modKey.createdAt;
        modKey[`${config.cfg.BDE_ACTIVITIES}.knownLanguages`] = modKey.knownLanguages;
        modKey[`${config.cfg.BDE_ACTIVITIES}.status`] = modKey.status;
        modKey[`${config.cfg.BDE_ACTIVITIES}.category`] = modKey.category;
        modKey[`${config.cfg.BDE_ACTIVITIES}.endDateTime`] = modKey.endDateTime;

        return modKey;
    })

    return modifiedResult;
    // return result;
}

// to update the activities after the lead is refurbished
const updateActivityRefurbish = async (params) => {
    let { leadId } = params;
    const query1 = {
        leadId,
        status: 'Complete'
    }
    const update1 = {
        isRefurbished: 1
    }
    const query2 = {
        leadId,
        status: { $in: ["Init", "Pending"] }
    }
    const update2 = {
        status: "Closed"
    }
    const updateComplete = await bdeActivitiesModel.updateMany(query1, update1);
    const updateInitPending = await bdeActivitiesModel.updateMany(query2, update2);
    return { updateComplete, updateInitPending }
}

// To fetch the my planner activities list for the dashboard
const fetchBdeActivitiesByDate = async (params) => {
    let { meetingDate, roleName, granularity, raisedClaim } = params;
    let result = [];

    let query = {
        createdByRoleName: roleName, status: 'Pending',
    }

    if (meetingDate) {
        query = {
            ...query,
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime", timezone: "+00:00" } },
                    meetingDate
                ]
            },

        }
    }

    if (granularity === 'This Week') {
        let date = new Date();
        let start = new Date(moment().startOf('isoWeek').format('YYYY-MM-DD'));
        // let end = date;
        let end = new Date(date.setDate(date.getDate() - 1));
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        query.startDateTime = {
            $gte: start,
            $lte: end
        }
    }

    if (granularity === 'This Month') {
        let date = new Date();
        let start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2);
        // let end = date;
        let end = new Date(date.setDate(date.getDate() - 1));

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        query.startDateTime = {
            $gte: start,
            $lte: end
        }

    }

    if (raisedClaim) {
        query.status = 'Complete',
            query.raisedClaim = true
    }

    // console.log(query, '.........................query');

    const activities = await bdeActivitiesModel.aggregate([
        { $match: query },
        { $lookup: { from: DB_MODEL_REF.SCHOOL, localField: 'schoolCode', foreignField: 'schoolCode', as: 'schoolDetails' } },
        {
            $group: {
                // _id: "$schoolId",
                _id: {
                    schoolId: "$schoolId",
                    activityDate: "$startDateTime"
                },
                name: { $push: { $ifNull: ["$name", null] } },
                meetingDate: { $push: { $ifNull: ["$startDateTime", null] } },
                schoolName: { "$first": "$schoolName" },
                schoolCity: { "$first": "$schoolCity" },
                schoolState: { "$first": "$schoolState" },
                schoolCode: { "$first": "$schoolCode" },
                schoolId: { "$first": "$schoolId" },
                activityDate: { "$first": "$startDateTime" },
                schoolDetails: { "$first": "$schoolDetails" },
                activityName: { "$first": "$activityName", },
                meetingAgenda: { "$first": "$meetingAgenda" },
                referenceType: { $push: { $ifNull: ["$referenceType", null] } },
                referenceCode: { $push: { $ifNull: ["$referenceCode", null] } },
                meetingType: { $push: { $ifNull: ["$meetingType", null] } },
                leadType: { $push: { $ifNull: ["$leadType", null] } }
            }
        },
        { $sort: { meetingDate: 1 } }
    ]);
    for (let obj of activities) {
        let schoolDetails = obj.schoolDetails.length > 0 ? obj.schoolDetails[0] : {}
        delete obj.schoolDetails
        obj.contactDetails = schoolDetails?.contactDetails;
        obj.lat = schoolDetails?.latitude
        obj.long = schoolDetails?.longitude
        obj.geoTag = schoolDetails?.geoTagId
        delete obj.schoolDetails
        result.push(obj);
    }
    return result;
}


// to add future activity on dashboard
const addActivity = async (params) => {
    let newActivity = {};
    if (!params.activityId) {
        throw Error('Please provide activity id')
    }
    let activityDetail = await Activities.findOne({ ID: params.activityId, isDeleted: false }).lean();
    if (activityDetail) {
        let futureObj = {
            leadId: params?.leadId,
            leadType: params?.leadType,
            name: params?.name,
            learningProfileCode: params?.learningProfileCode,
            learningProfileRefId: params?.learningProfileRefId,
            learningProfileGroupCode: params?.learningProfileGroupCode,
            learningProfileGroupName: params?.learningProfileGroupName,
            schoolId: params?.schoolId,
            schoolName: params?.schoolName,
            schoolCode: params?.schoolCode,
            schoolAddress: params?.schoolAddress,
            schoolCity: params?.schoolCity,
            schoolState: params?.schoolState,
            activityId: activityDetail.ID,
            activityName: activityDetail.activityName,
            category: activityDetail.categoryName,
            activityScore: activityDetail.score,
            taskActivity: activityDetail?.task ? true : false,
            callActivity: activityDetail?.calling ? true : false,
            attendanceActivity: activityDetail?.attendance ? true : false,
            approvalActivity: activityDetail?.approval ? true : false,
            status: 'Pending',
            createdBy: params?.createdBy,
            createdByName: params?.createdByName,
            createdByRoleName: params?.createdByRoleName,
            createdByProfileName: params?.createdByProfileName,
            isRefurbished: 0,
            refCallId: Date.now(),
            startDateTime: params?.startDateTime,
            meetingAgenda: params?.meetingAgenda,
            // referenceCode: params?.referenceCode,
            // referenceType: params?.referenceType,
            meetingType: params?.meetingType
        }

        newActivity = await bdeActivitiesModel.findOneAndUpdate({ leadId: params.leadId, status: 'Pending' }, futureObj, { upsert: true, new: true });
    }
    return newActivity;
}

const transferActivitiesBySchool = async (params) => {
    let { leadIdArray, updateObj } = params;
    let query = { status: 'Pending', schoolId: { $in: leadIdArray } };
    let update = {
        createdBy: updateObj.createdBy,
        createdByName: updateObj.assignedTo_displayName,
        createdByRoleName: updateObj.assignedTo_role_name,
        createdByProfileName: updateObj.assignedTo_profile_name
    };
    const result = await bdeActivitiesModel.updateMany(query, update);
}

const transferActivitiesByInterest = async (params) => {
    let { leadId, updateObj } = params;
    let query = { leadId, status: 'Pending' };
    let update = {
        createdBy: updateObj.createdBy,
        createdByName: updateObj.assignedTo_displayName,
        createdByRoleName: updateObj.assignedTo_role_name,
        createdByProfileName: updateObj.assignedTo_profile_name
    };
    const result = await bdeActivitiesModel.updateOne(query, update);
}



const getCurrentActivities = async (params) => {
    let { leadId } = params;
    let query = {
        leadId: leadId,
        status: 'Complete'
    };
    const result = await bdeActivitiesModel.find(query);
    return result;
}

const updateStageStatus = async (params) => {
    let leadArr = [
        {
            leadId: params?.leadId,
            learningProfile: params?.name,
            createdAt: params?.createdAt,
        }]
    let obj = {
        interest: leadArr,
        state: params?.schoolState,
        city: params?.schoolCity,
        leadInterestType: params?.leadType
    }
    checkLeadStageStatus(obj);
}

const checkLeadStageStatus = async (params) => {
    try {
        let { interest, state, city, schoolEmailId, leadInterestType } = params;
        let data;
        for (let item of interest) {
            const leadObj = {
                leadId: item.leadId,
                journeyName: '',
                cycleName: '',
                stageName: '',
                statusName: '',
                name: item.learningProfile,
                mobile: '',
                state: state,
                city: city,
                email: schoolEmailId,
                dnd: item?.dnd || null,   // not in school obj
                source: item?.sourceName,   //not 
                subSource: item?.subSourceName,   //not
                otpVerified: item?.otpVerified || null,   //not
                createdDate: item?.createdAt,
                registrationDate: item?.registrationDate ? item?.registrationDate : null,
                appDownloadedDate: item?.appDownloadedDate ? item?.appDownloadedDate : null,
                // b2bFlag: true,
                //leadType: 'INTEREST',
                leadType: leadInterestType,
            }
            //console.log('Lead Journey',leadObj)
            let { leadData, list } = await getLeadJourneyDetails(leadObj)
            if (list && list.length > 0) {
                createManyStageStatus(list)
            }


            let obj = {
                leadId: leadData.leadId,
                leadType: leadObj?.leadType,
                update: {
                    stageName: leadData.stageName,
                    statusName: leadData.statusName
                }
            }
            if (leadData.stageName && leadData.statusName) {
                data = await updateLead(obj)
            }
        }
        return { status: 1, msg: "Success", data }
    } catch (err) {
        console.log(err, ":: err inside check lead stage status");
        throw { errorMessage: err }
    }
}

const updateLead = async (params) => {
    if (params.leadId) {
        const updateInterest = await LeadInterest.findOneAndUpdate({ leadId: params.leadId }, params.update, { new: true, upsert: false });
        return updateInterest;
    } else {
        return null
    }

}

const getActivitiesByType = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, childRoleNames, meetingStatus, customerResponse, ssrFlag, qcFlag } = params;
    let sort = { updatedAt: -1 };
    let query = {
        meetingStatus,
        customerResponse: { $in: customerResponse }
    };
    if (ssrFlag) {
        query.isSsrSubmitted = false;
    }
    if (qcFlag) {
        query.isQcSubmitted = false;
    }
    if (search) {
        query.leadId = { $regex: search, $options: 'i' }
    }
    if (childRoleNames && childRoleNames.length > 0) {
        query.createdByRoleName = { $in: childRoleNames };
    }
    if (sortKey && sortOrder) {
        if (sortOrder == -1)
            sort = {
                [sortKey]: -1
            }
        else
            sort = {
                [sortKey]: 1
            }
    }
    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }
    if (utils.isEmptyValue(count)) {
        count = 999
    } else {
        count = parseInt(count);
    }

    const result = await bdeActivitiesModel.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: "$leadId",
                documents: {
                    $push: "$$ROOT"
                },
            }
        },
        {
            $sort: { "documents.updatedAt": -1 } 
        },
        {
            $skip: pageNo * count
        },
        {
            $limit: count
        }
    ]);

    return result;
}

const getActivitiesByTypeCount = async (params) => {
    let query = {
        meetingStatus: params?.meetingStatus,
        customerResponse: { $in: params?.customerResponse }
    };
    if (params?.ssrFlag) query.isSsrSubmitted = false;
    if (params?.qcFlag) query.isQcSubmitted = false;
    if (params?.search) {
        query.leadId = { $regex: params?.search, $options: 'i' }
    }
    if (params?.childRoleNames && params?.childRoleNames.length > 0) {
        query.createdByRoleName = { $in: params?.childRoleNames };
    }
    const result = await bdeActivitiesModel.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: "$leadId"
            }
        },
        {
            $count: "totalDocuments"
        }
    ]);

    const totalDocumentsAfterGrouping = result.length > 0 ? result[0].totalDocuments : 0;
    return totalDocumentsAfterGrouping;
}

const getDraftActivityDetail = async (params) => {
    let { meetingDate, roleName } = params;
    let query = { isDraft: true, status: 'Pending', createdByRoleName: roleName };
    if (meetingDate) {
        query = {
            ...query,
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$startDateTime", timezone: "+00:00" } },
                    meetingDate
                ]
            },

        }
    }
    let result = await bdeActivitiesModel.find(query).lean();
    result.map(item => {
        item.activityDate = item?.startDateTime;
        return item;
    });
    return result;
}

const getCollectionTypeActivities = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, childRoleNames, isCollection, } = params;
    let sort = { updatedAt: -1 };
    let query = { isCollection, isCollectionSubmitted: false };
    if (search) {
        query.leadId = { $regex: search, $options: 'i' }
    }
    if (childRoleNames && childRoleNames.length > 0) {
        query.createdByRoleName = { $in: childRoleNames };
    }
    if (sortKey && sortOrder) {
        if (sortOrder == -1)
            sort = {
                [sortKey]: -1
            }
        else
            sort = {
                [sortKey]: 1
            }
    }
    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }
    if (utils.isEmptyValue(count)) {
        count = 999
    } else {
        count = parseInt(count);
    }

    const result = await bdeActivitiesModel.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: {
                    schoolId: "$schoolId",
                    startDateTime: "$startDateTime"
                },
                max: { $max: "$updatedAt" },
                documents: {
                    $push: "$$ROOT"
                },
            }
        },
        {
            $sort: { "_id.startDateTime": -1, "documents.updatedAt": -1 }
        },
        {
            $skip: pageNo * count
        },
        {
            $limit: count
        }
    ]);
    return result;
}

const getCollectionActivitiesCount = async (params) => {
    let { search, childRoleNames, isCollection } = params;
    let query = { isCollection, isCollectionSubmitted: false };
    if (search) {
        query.leadId = { $regex: search, $options: 'i' }
    }
    if (childRoleNames && childRoleNames.length > 0) {
        query.createdByRoleName = { $in: childRoleNames };
    }
    const result = await bdeActivitiesModel.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: {
                    schoolId: "$schoolId",
                    startDateTime: "$startDateTime"
                }
            }
        },
        {
            $count: "totalDocuments"
        }
    ]);

    const totalDocumentsAfterGrouping = result.length > 0 ? result[0].totalDocuments : 0;
    return totalDocumentsAfterGrouping;
}





module.exports = {
    getBdeRecentActivityDetails,
    createBdeActivity,
    getUserActivities,
    findOneByKey,
    updateManyByKey,
    logBdeActivity,
    transferFutureActivities,
    getBdeActivities,
    getBdeActivitiesByRoleName,
    getBdeActivityScore,
    activitiesRoleProfileUnion,
    getAttendanceActivity,
    getCurrentMonthActivities,
    closePendingActivities,
    updateActivityRefurbish,
    createMeetingActivity,
    fetchBdeActivitiesByDate,
    addActivity,
    transferActivitiesBySchool,
    transferActivitiesByInterest,
    getCurrentActivities,
    getLastBdeActivityDetails,
    checkLeadStageStatus,
    updateLead,
    getDraftActivityDetail,
    getActivitiesByType,
    getActivitiesByTypeCount,
    getCollectionTypeActivities,
    getCollectionActivitiesCount
}