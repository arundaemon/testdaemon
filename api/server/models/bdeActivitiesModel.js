const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');
let BdeActivities;

const bdeActivitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        subject: {
            type: String,
            trim: true
        },
        activityName: {
            type: String,
            trim: true
        },
        activityId: {
            type: String,
            trim: true
        },
        leadJourney: {
            type: String,
            trim: true
        },
        leadStage: {
            type: String,
            trim: true
        },
        leadStatus: {
            type: String,
            trim: true
        },
        activityScore: {
            type: Number
        },
        activityMaxScore: {
            type: Number
        },
        callActivity: { type: Boolean, default: false },
        taskActivity: { type: Boolean, default: false },
        attendanceActivity: { type: Boolean, default: false },
        approvalActivity: { type: Boolean, default: false },
        collectPaymentID:{
            type: String,
            trim: true
        },
        paymentUrl:{
            type: String,
            trim: true
        },
        paymentAmount:{
            type: Number
        },
        category: {
            type: String,
            trim: true
        },
        conversationWith: {
            type: String,
            trim: true
        },
        conversationWithName: {
            type: String,
            trim: true
        },
        callCategory: {
            type: String,
            trim: true
        },
        callId: {
            type: String,
            trim: true
        },
        refCallId:{
            type:String,
            trim: true,
            unique:true
        },
        callRecording: {
            type: String,
            trim: true
        },
        callStatus: {
            type: String,
            trim: true
        },
        business_call_type:{
            type: String,
            trim: true
        },
        callDuration: { type: Number },
        formId: {
            type: String,
            trim: true
        },
        leadId: {
            type: String,
            trim: true
        },
        leadUuid: {
            type: String,
            trim: true
        },
        disqualificationDate: { type: Date },
        reasonForDQ: {
            type: String,
            trim: true
        },
        customerResponse: {
            type: String,
            trim: true
        },
        interestedIn: {
            type: String,
            trim: true
        },
        seminar: {
            type: String,
            trim: true
        },
        languageIssue: { type: Boolean, default: false },
        knownLanguages: {
            type: String,
            trim: true
        },
        verifiedDocuments:{
            type:String,
            trim:true
        },
        featureList:{
            type:String,
            trim:true
        },
        reasonForPaPending: {
            type: String,
            trim: true
        },
        reasonForPaRejected: {
            type: String,
            trim: true
        },
        reasonForObPending: {
            type: String,
            trim: true
        },
        reasonForObRejected: {
            type: String,
            trim: true
        },
        reasonForFbPending: {
            type: String,
            trim: true
        },
        reasonForFbRejected: {
            type: String,
            trim: true
        },
        reasonForAckPending: {
            type: String,
            trim: true
        },
        reasonForAckRejected: {
            type: String,
            trim: true
        },
        startDateTime: { type: Date },
        endDateTime: { type: Date },
        followUpDateTime: { type: Date },
        class: {
            type: String,
            trim: true
        },
        board: {
            type: String,
            trim: true
        },
        school: {
            type: String,
            trim: true
        },
        comments: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        status: { type: String, enum: ['Complete', 'Pending','Init','Closed'], default: 'Pending' },
        leadOwner: {
            type: String,
            trim: true
        },
        createdBy: {
            type: String,
            trim: true
        },
        createdByName: {
            type: String,
            trim: true
        },
        createdByRoleName: {
            type: String,
            trim: true
        },
        createdByProfileName:{
            type: String,
            trim: true
        },
        Buh: {
            type: String,
            trim: true
        },
        BuhName: {
            type: String,
            trim: true
        },
        Ruh: { type: String },
        RuhName: {
            type: String,
            trim: true
        },
        InHead: {
            type: String,
            trim: true
        },
        InHeadName: {
            type: String,
            trim: true
        },
        manager1: {
            type: String,
            trim: true
        },
        manager1Name: {
            type: String,
            trim: true
        },
        manager2: {
            type: String,
            trim: true
        },
        manager2Name: {
            type: String,
            trim: true
        },
        manager3: {
            type: String,
            trim: true
        },
        manager3Name: {
            type: String,
            trim: true
        },
        manager4: {
            type: String,
            trim: true
        },
        manager4Name: {
            type: String,
            trim: true
        },
        manager5: {
            type: String,
            trim: true
        },
        manager5Name: {
            type: String,
            trim: true
        },
        manager6: {
            type: String,
            trim: true
        },
        manager6Name: {
            type: String,
            trim: true
        },
        manager7: {
            type: String,
            trim: true
        },
        manager7Name: {
            type: String,
            trim: true
        },
        manager8: {
            type: String,
            trim: true
        },
        manager8Name: {
            type: String,
            trim: true
        },
        manager9: {
            type: String,
            trim: true
        },
        manager9Name: {
            type: String,
            trim: true
        },
        manager10: {
            type: String,
            trim: true
        },
        manager10Name: {
            type: String,
            trim: true
        },
        manager11: {
            type: String,
            trim: true
        },
        manager11Name: {
            type: String,
            trim: true
        },
        manager12: {
            type: String,
            trim: true
        },
        manager12Name: {
            type: String,
            trim: true
        },
        manager13: {
            type: String,
            trim: true
        },
        manager13Name: {
            type: String,
            trim: true
        },
        manager14: {
            type: String,
            trim: true
        },
        manager14Name: {
            type: String,
            trim: true
        },
        manager15: {
            type: String,
            trim: true
        },
        manager15Name: {
            type: String,
            trim: true
        }, 
        count: {
            type: String,
            trim: true
        },
        isRefurbished: {
            type: Number,
            default: 0
        },
        productInterest: {
            type: String,
            trim: true
        },
        meetingType: {
            type: String,
            trim: true
        },
        priority: {
            type: String,
            trim: true
        },
        leadType: {                               //b2b, b2c
            type: String,
            trim: true
        },
        visitOutcome: {
            type: String,
            trim: true
        },
        contactDetails: [{
            type: Object
        }],


        products: {
            type: String,
            trim: true
        },

        edc: {
            type: Date,
            trim: true
        },
        productType: {
            type: String,
            trim: true
        },
        escUnit: {
            type: Number,
            trim: true
        },
        contactDurationInMonths: {
            type: Number,
            trim: true
        },
        ratePerStudent: {
            type: Number,
            trim: true
        },
        ratePerClassroom: {
            type: Number,
            trim: true
        },
        paymentSchedule: {
            type: String,
            trim: true
        },
        monthlyInvoice: {
            type: Number,
            trim: true
        },
        softwareContractValue: {
            type: Number,
            trim: true
        },
        hardware: {
            type: String,
            trim: true
        },
        hardwareProduct: {
            type: String,
            trim: true
        },
        hardwareContractValue: {
            type: Number,
            trim: true
        },
        minutesOfMeeting: {
            type: String,
            trim: true
        },
        studentUnit: {
            type: Number,
            trim: true
        },
        course: {
            type: String,
            trim: true
        },
        grade: {
            type: String,
            trim: true
        },
        lectureDeliveryType: {
            type: String,
            trim: true
        },
        offeringType: {
            type: String,
            trim: true
        },
        assessmentCenter: {
            type: String,
            trim: true
        },
        weeklyExclusiveDoubtSession: {
            type: String,
            trim: true
        },
        numberofStudent: {
            type: Number,
            trim: true
        },
        numberOfBatches: {
            type: Number,
            trim: true
        },
        numberOfStudentsPerBatch: {
            type: Number,
            trim: true
        },
        testPrepPackageSellingPricePerStudent: {
            type: Number,
            trim: true
        },
        assessmentCentrePricePerStudent: {
            type: Number,
            trim: true
        },
        grossSellingPricePerStudent: {
            type: Number,
            trim: true
        },
        duration: {
            type: Number,
            trim: true
        },
        grossContractValue: {
            type: Number,
            trim: true
        },
        units: {
            type: Number,
            trim: true
        },
        grades: {
            type: String,
            trim: true
        },
        grossRatePerUnit: {
            type: Number,
            trim: true
        },
        netRatePerUnit: {
            type: Number,
            trim: true
        },
        netMonthlyInvoicing: {
            type: Number,
            trim: true
        },
        totalContractValue: {
            type: Number,
            trim: true
        },
        meetingStatus: {
            type: String,
            trim: true
        },
        schoolId: {
            type: String,
            trim: true
        },
        schoolName: {
            type: String,
            trim: true
        },
        schoolCode: {
            type: String,
            trim: true
        },
        schoolAddress: {
            type: String,
            trim: true
        },
        schoolCity: {
            type: String,
            trim: true
        },
        schoolState: {
            type: String,
            trim: true
        },
        currentStage: {
            type: String,
            trim: true
        },
        currentStatus: {
            type: String,
            trim: true
        },
        ratePerUnit: {
            type: Number,
            trim: true
        },
        numberOfUnits: {
            type: Number,
            trim: true
        },
        contractDuration: {
            type: Number,
            trim: true
        },
        netSellingPriceStudent: {
            type: Number,
            trim: true
        },
        assessmentCentrePriceStudent: {
            type: Number,
            trim: true
        },
        testprepPackageSellingPriceStudent: {
            type: Number,
            trim: true
        },
        netContractValue: {
            type: Number,
            trim: true
        },
        netHardwareContractValue: {
            type: Number,
            trim: true
        },
        netESCPlusContractValue: {
            type: Number,
            trim: true
        },
        teacherUnits: {
            type: Number,
            trim: true
        },
        quantity: {
            type: Number,
            trim: true
        },  
        type: {
            type: String,
            trim: true
        } , 
        processor: {
            type: String,
            trim: true
        },
        weeklyExclusiveDoubtSessionNew: {
            type: String,
            trim: true
        },
        previousPriority: {
            type: String,
            trim: true
        },
        raisedClaim: {
            type: Boolean,
            trim: true
        },
        meetingAgenda: {
            type: String,
            trim: true
        },
        isDraft: {
            type: Boolean,
        },
        isCollection: {
            type: Boolean
        },
        collectedPayment: {
            type: Number,
            trim: true
        },
        isCollectionSubmitted: {
            type: Boolean,
            trim: true,
            default: false
        },
        isSsrSubmitted: {
            type: Boolean,
            trim: true,
            default: false
        },
        isQcSubmitted: {
            type: Boolean,
            trim: true,
            default: false
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        strict: false,
    }
)
bdeActivitySchema.virtual('schoolDetails',{
    ref:DB_MODEL_REF.SCHOOL,
    localField:'schoolCode',
    foreignField:'schoolCode',
    match: { status: USER_STATUS.ACTIVE}
})

//bdeActivitySchema.index({leadId:1,activityName:1,activityId:1,callId:1,createdByRoleName:1,startDateTime:-1},{unique:true,dropDups:true})
//bdeActivitySchema.index({updatedAt:-1},{unique:false})
module.exports = BdeActivities = mongoose.model(DB_MODEL_REF.BDEACTIVITIES, bdeActivitySchema);