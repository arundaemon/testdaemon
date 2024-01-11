//const FormMapping = require('../models/activityFormMappingModels');
const BdeActivities = require('../models/bdeActivitiesModel');
//const ActivityToActivityMapping = require('../models/activitytoactivitymappingModel')
//const FormToActivityMapping = require('../models/formtoactivitymappingModel');
const Activities = require('../models/activityModel');
const Category = require('../models/categoryModel');
const { saveLeadInterest } = require('./leadInterestControls');
const { getActivityFormNumber } = require('./activityFormMappingControls');
const { createCubeTokenCrm } = require('../config/cubeConnection');
const bdeCollectPaymentFunctions = require('../functions/bdeCollectPaymentFunctions');
const AlternateContact = require('../models/alternateContactsModel');
const orderLogModel = require('../models/orderLogModel');
const leadassignModal = require('../models/leadassignModal');
const leadStageStatusModel = require('../models/leadStageStatusModel');
const { getCubeToken, getlatestOrderId } = require('../functions/leadJourneyMappingFunctions');

const createActivityForm = async (bdeActivityObj) => {
    return createBdeActivity(bdeActivityObj)
    //return { status: "Ok" }
}

const updateLeadName = async (leadId,name) => {
    let leadObj = {
        name:name
    }
    let leadData = await leadassignModal.updateOne({leadId},leadObj,{new:false,upsert:false})
    let bdeObj = {
        name:name
    }
    let data = await BdeActivities.updateMany({leadId},bdeObj,{new:false,upsert:false})
    let bdeAllObj = {
        conversationWithName:name
    }
    let res = await BdeActivities.updateMany({leadId,conversationWith: 'Student'},bdeAllObj,{new:false,upsert:false})
    return await leadStageStatusModel.updateMany({leadId},leadObj,{new:false,upsert:false})
}

const createBdeActivity = async (bdeActivityObj) => {
    if (bdeActivityObj && bdeActivityObj.interestedIn) {
        let leadInterestObj = {            
            _id: bdeActivityObj.leadId,
            sourceName: 'Reference',
            subSourceName: 'Employee Reference',
            learningProfile: bdeActivityObj.interestedIn,
            school: bdeActivityObj.school,
            board: bdeActivityObj.board,
            class: bdeActivityObj.class,
            createdBy_Uuid: bdeActivityObj.createdBy
        }
        saveLeadInterest(leadInterestObj)
    }
    //console.log(bdeActivityObj)
    if(bdeActivityObj && bdeActivityObj.type && bdeActivityObj.type == 'offline' && bdeActivityObj.conversationWith && bdeActivityObj.conversationWith == 'Student' && bdeActivityObj.conversationWithName && bdeActivityObj.conversationWithName != bdeActivityObj.name){
        //console.log('Matched #####################################################')
        bdeActivityObj.name = bdeActivityObj.conversationWithName
        updateLeadName(bdeActivityObj.leadId,bdeActivityObj.conversationWithName)
    }

    if(bdeActivityObj && bdeActivityObj.relation){
        let alternateContacts = {
            leadId:bdeActivityObj.leadId,
            relation:bdeActivityObj.relation,
            alternateNumber:bdeActivityObj.alternateNumber,
            alternateName:bdeActivityObj.alternateName
        }
        AlternateContact.updateOne({alternateNumber:alternateContacts.alternateNumber},alternateContacts,{upsert:true,new:true},(res,err) => {
            console.log(res,err)
        })
    }

    if(bdeActivityObj && bdeActivityObj.verifiedDocuments){
        getLeadsOrderDetail(bdeActivityObj)
    }
    let activityDetail = await Activities.findOne({ID:bdeActivityObj.activityId,isDeleted:false})
    //console.log('Activity',activityDetail)
    bdeActivityObj.status = 'Complete'
    let bdeObj = await BdeActivities.findOne({callId:bdeActivityObj.callId});
    if (activityDetail) {        
        bdeActivityObj.activityName = activityDetail?.activityName
        bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""        
        bdeActivityObj.callActivity = activityDetail?.calling ? true : false
        bdeActivityObj.taskActivity = activityDetail?.task ? true:false
        bdeActivityObj.attendanceActivity = activityDetail?.attendance ? true:false
        bdeActivityObj.approvalActivity = activityDetail?.approval ? true:false
        activityDetail.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
        activityDetail.score = activityDetail?.score ? activityDetail?.score : 0
        bdeActivityObj.activityScore = activityDetail.score
        bdeActivityObj.score = activityDetail.score
        bdeActivityObj.callingScore = activityDetail.callingScore
        //if(bdeObj)
        //console.log(bdeObj)
        if(bdeObj && bdeObj.callDuration > 0){
            bdeActivityObj.callDuration = bdeObj.callDuration
        }
        if(bdeActivityObj.callActivity && bdeActivityObj.callDuration > 0){
            let totalScore = activityDetail.score + (activityDetail.callingScore * (bdeActivityObj.callDuration / 60))
            bdeActivityObj.calcScore = totalScore
            bdeActivityObj.activityScore = Math.round(totalScore)
        }        
        bdeActivityObj.activityMaxScore = activityDetail.maxScore?activityDetail.maxScore:0
        let categoryDetail = await Category.findOne({ categoryName: bdeActivityObj.category })
        if (categoryDetail) {
            let duration = categoryDetail.duration
            let startDate = new Date(bdeActivityObj.startDate)
            bdeActivityObj['startDateTime'] = new Date(bdeActivityObj.startDate)
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDate).setMinutes(startDate.getMinutes() + duration))
        } else {
            let startDate = new Date(bdeActivityObj.startDate)
            bdeActivityObj['startDateTime'] = new Date(bdeActivityObj.startDate)
            bdeActivityObj['endDateTime'] = new Date(new Date(bdeActivityObj.startDate).setMinutes(startDate.getMinutes() + 10))
        }
    }
    if(bdeActivityObj.futureActivityId){
        let futureActivityDetail = await Activities.findOne({ ID: bdeActivityObj.futureActivityId,isDeleted:false })
        if(futureActivityDetail){
            let futureObj = {
                ...bdeActivityObj,
                activityId: futureActivityDetail.ID,
                activityName: futureActivityDetail.activityName,
                category: futureActivityDetail.categoryName,
                activityScore: futureActivityDetail.score,
                callId:"",
                refCallId:bdeActivityObj.callId,
                callStatus: "",
                callDuration: 0,
                callCategory: "",
                callRecording: "",
                customerResponse: "",
                taskActivity: futureActivityDetail?.task ? true: false,
                callActivity: futureActivityDetail?.calling ? true: false,
                attendanceActivity: futureActivityDetail?.attendance ? true: false,
                approvalActivity: futureActivityDetail?.approval ? true: false,
                comments: "",
                status: 'Pending'
            }
            delete futureObj._id
            let categoryDetail = await Category.findOne({ categoryName: futureObj.category })
            if (categoryDetail) {
                let duration = categoryDetail.duration
                let startDate = new Date(bdeActivityObj.followUpDateTime)
                futureObj['startDateTime'] = new Date(bdeActivityObj.followUpDateTime)
                futureObj['endDateTime'] = new Date(new Date(bdeActivityObj.followUpDateTime).setMinutes(startDate.getMinutes() + duration))
            } else {
                let startDate = new Date(bdeActivityObj.followUpDateTime)
                futureObj['startDateTime'] = new Date(bdeActivityObj.followUpDateTime)
                futureObj['endDateTime'] = new Date(new Date(bdeActivityObj.followUpDateTime).setMinutes(startDate.getMinutes() + 10))
            }
            //console.log('Manual',futureObj)
            BdeActivities.updateOne({refCallId:bdeActivityObj.callId,leadId:bdeActivityObj.leadId},futureObj,{upsert:true,new:true},(res,err) => {
                console.log(res,err)
            })
        }
        
    }
    //console.log('Manual',bdeActivityObj)
    if(bdeActivityObj.updateActivity){
        return BdeActivities.updateOne({ _id: bdeActivityObj.updateActivity }, bdeActivityObj, { upsert: false })
    }else{
        return BdeActivities.updateOne({ callId: bdeActivityObj.callId }, bdeActivityObj, { upsert: false })
    }    
}

const logBdeActivity = async (callEventData) => {
    let activity = await BdeActivities.findOne({ callId: callEventData.uuid }).sort({updatedAt:-1}).lean()
    let activitystatus = ['Agent Missed', 'Customer Missed'].indexOf(callEventData.business_call_type) >= 0 ? 'Not Connected' : 'Connected'
    //console.log('Log Activity',activity,callEventData)
    if (activity) {
        let bdeActivityObj = {
            ...activity,
            callStatus: activitystatus,
            business_call_type:callEventData.business_call_type,
            callDuration: parseInt(callEventData.call_duration),
            callCategory: callEventData.Call_Type,
            callRecording: callEventData.resource_url
        }
        
        if (activitystatus == 'Not Connected') {
            return createActivity(bdeActivityObj)
        } else {
            return updateActivity(bdeActivityObj)
        }
    }
    //console.log(activity)
}

const createActivity = async (bdeActivityObj) => {
    bdeActivityObj['customerResponse'] = bdeActivityObj?.customerResponse ?? 'Not Connected'
    let formMapping = await getActivityFormNumber({ stageName: bdeActivityObj.leadStage, statusName: bdeActivityObj.leadStatus, customerResponse: 'Not Connected',isDeleted:false })
    //console.log(formMapping)
    if (formMapping.length > 0) {
        let mappingObj = formMapping[0]
        bdeActivityObj['status'] = 'Complete'
        bdeActivityObj['customerResponse'] = 'Not Connected'
        bdeActivityObj['subject'] = mappingObj.subject
        bdeActivityObj['formId'] = mappingObj.formId
        bdeActivityObj['activityId'] = mappingObj.activityId
        let activityDetail = await Activities.findOne({ ID: mappingObj.activityId,isDeleted:false })
        if (activityDetail) {
            bdeActivityObj.activityName = activityDetail?.activityName
            bdeActivityObj.activityId = activityDetail?.ID
            bdeActivityObj.activityMaxScore = activityDetail.maxScore?activityDetail.maxScore:0
            bdeActivityObj.callActivity = activityDetail?.calling ? true : false
            bdeActivityObj.taskActivity = activityDetail?.task
            bdeActivityObj.attendanceActivity = activityDetail?.attendance
            bdeActivityObj.approvalActivity = activityDetail?.approval
            activityDetail.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
            activityDetail.score = activityDetail?.score ? activityDetail?.score : 0
            bdeActivityObj.activityScore = activityDetail.score
            bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""
            let categoryDetail = await Category.findOne({ categoryName: bdeActivityObj.category })
            if (categoryDetail) {
                let duration = categoryDetail.duration
                let startDate = new Date()
                bdeActivityObj['startDateTime'] = startDate
                bdeActivityObj['endDateTime'] = new Date(new Date(startDate).setMinutes(startDate.getMinutes() + duration))
            } else {
                let startDate = new Date()
                bdeActivityObj['startDateTime'] = startDate
                bdeActivityObj['endDateTime'] = new Date(new Date(startDate).setMinutes(startDate.getMinutes() + 10))
            }
            if (mappingObj.futureActivityId) {
                let futureActivityDetail = await Activities.findOne({ ID: mappingObj.futureActivityId,isDeleted:false })
                if(futureActivityDetail){
                    let futureObj = {
                        ...bdeActivityObj,
                        callId:null,
                        refCallId:bdeActivityObj.callId,
                        activityId: futureActivityDetail.ID,
                        activityName: futureActivityDetail.activityName,
                        category: futureActivityDetail.categoryName,
                        activityScore: futureActivityDetail.score,
                        activityMaxScore: futureActivityDetail.maxScore?futureActivityDetail.maxScore:0,
                        callStatus: "",
                        callDuration: 0,
                        callCategory: "",
                        callRecording: "",
                        customerResponse: "",
                        taskActivity: futureActivityDetail.task,
                        callActivity: futureActivityDetail.calling ? true : false,
                        attendanceActivity: futureActivityDetail.attendance,
                        approvalActivity: futureActivityDetail.approval,
                        comments: "",
                        status: 'Pending',
                        category:futureActivityDetail?.categoryName ? futureActivityDetail?.categoryName : ""
                    }
                    let categoryDetail = await Category.findOne({ categoryName: futureObj.category })
                    if (categoryDetail) {
                        let duration = categoryDetail.duration
                        let startDate = bdeActivityObj.startDateTime
                        futureObj['startDateTime'] = new Date(new Date(startDate).setHours(startDate.getHours() + 24))
                        futureObj['endDateTime'] = new Date(new Date(futureObj.startDateTime).setMinutes(futureObj.startDateTime.getMinutes() + duration))
                    } else {
                        let startDate = bdeActivityObj.startDateTime
                        futureObj['startDateTime'] = new Date(new Date(startDate).setHours(startDate.getHours() + 24))
                        futureObj['endDateTime'] = new Date(new Date(futureObj.startDateTime).setMinutes(futureObj.startDateTime.getMinutes() + 10))
                    }
                    delete futureObj._id
                    //console.log('Auto',futureObj)
                    BdeActivities.updateOne({refCallId:bdeActivityObj.callId,leadId:bdeActivityObj.leadId},futureObj,{upsert:true,new:true},(res,err) => {
                        console.log(res,err)
                    })
                }                
            }
        }
        //console.log('Create Activity',bdeActivityObj)
        return BdeActivities.updateOne({ callId: bdeActivityObj.callId }, bdeActivityObj, { upsert: false })
    } else {
        return BdeActivities.deleteOne({ callId: bdeActivityObj.callId })
    }
}

const updateBdeActivity = async (bdeActivityObj) => {
    let activityDetail = await Activities.findOne({ ID: bdeActivityObj.activityId,isDeleted:false })
    //console.log('Update',activityDetail)
    if(activityDetail){
        //bdeActivityObj['status'] = 'Complete'
        bdeActivityObj.activityName = activityDetail?.activityName
        bdeActivityObj.activityId = activityDetail?.ID
        bdeActivityObj.callActivity = activityDetail?.calling ? true : false
        bdeActivityObj.taskActivity = activityDetail?.task ? true:false
        bdeActivityObj.attendanceActivity = activityDetail?.attendance ? true:false
        bdeActivityObj.approvalActivity = activityDetail?.approval ? true:false
        activityDetail.callingScore = activityDetail?.callingScore ? activityDetail?.callingScore : 0;
        activityDetail.score = activityDetail?.score ? activityDetail?.score : 0
        bdeActivityObj.activityScore = activityDetail.score
        bdeActivityObj.score = activityDetail.score
        bdeActivityObj.callingScore = activityDetail.callingScore
        if(bdeActivityObj.callActivity && bdeActivityObj.callDuration > 0){
            let totalScore = activityDetail.score + (activityDetail.callingScore * (bdeActivityObj.callDuration / 60))
            bdeActivityObj.calcScore = totalScore
            bdeActivityObj.activityScore = Math.round(totalScore)
        }
        bdeActivityObj.activityMaxScore = activityDetail.maxScore?activityDetail.maxScore:0        
        bdeActivityObj.category = activityDetail?.categoryName ? activityDetail?.categoryName : ""               
    }
    //console.log('Update Activity',bdeActivityObj)
    return BdeActivities.updateOne({ callId: bdeActivityObj.callId }, bdeActivityObj, { upsert: false })
}

const updateActivity = (obj) => {
    if(obj.activityId){
        updateBdeActivity(obj)
    }else{
        obj.callStatus = 'Connected'
        return BdeActivities.updateOne({ callId: obj.callId }, obj, { upsert: false })
    }    
}

const getLeadsOrderDetail = async (params) => {
    let { leadId, verifiedDocuments,customerResponse } = params;
    let token = await getCubeToken()
    let orderId = await getlatestOrderId(leadId,envConfig.EMPLOYEE_LEADS_ORDER,token.cubeToken)
    const cubeApi = await createCubeTokenCrm();
    const cubeData = await cubeApi.load({
        "measures":[],
        "order":{
            [`${envConfig.EMPLOYEE_LEADS_ORDER}.oUpdatedate`]: "desc",
            [`${envConfig.EMPLOYEE_LEADS_ORDER}.eEmpid`]: "asc",            
            [`${envConfig.EMPLOYEE_LEADS_ORDER}.oId`]: "desc",
        },
        "dimensions":[
            `${envConfig.EMPLOYEE_LEADS_ORDER}.eEmpid`,
            `${envConfig.EMPLOYEE_LEADS_ORDER}.oUpdatedate`,
            `${envConfig.EMPLOYEE_LEADS_ORDER}.oId`
        ],
        "limit":1,
        "timezone":"UTC",
        "timeDimensions":[],
        "filters":[
            {
                member: `${envConfig.EMPLOYEE_LEADS_ORDER}.oId`,
                operator: 'equals',
                values:[orderId]
            },
            {
                "member": `${envConfig.EMPLOYEE_LEADS_ORDER}.lUuid`,
                "operator":"equals",
                "values": [`${leadId}`],
            }
        ],
        "renewQuery":true,
    })
    let orderData = cubeData.rawData()
    let empcode,oms_orderno
    if(orderData.length > 0){
        empcode = orderData[0][`${envConfig.EMPLOYEE_LEADS_ORDER}.eEmpid`]
        oms_orderno = orderData[0][`${envConfig.EMPLOYEE_LEADS_ORDER}.oId`]
    }

    if(empcode && oms_orderno && verifiedDocuments && customerResponse && customerResponse.toUpperCase() == 'AUTHORIZED'){
        const orderMarked = await bdeCollectPaymentFunctions.orderMark({empcode, oms_orderno,customerResponse,verifiedDocuments})
    }else if(empcode && oms_orderno){
        let logObj = {
            leadId:leadId,
            empCode:empcode,
            omsOrderNo:oms_orderno,
            customerResponse,
            verifiedDocuments,
            errorMsg:`Customer Response Issue :- ${customerResponse}`,
            status:'Error'
        }
        orderLogModel.create(logObj)
    }
    
}

module.exports = { createActivityForm, logBdeActivity };
