const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const bdeActivitiesFunctions = require("../functions/bdeActivitiesFunctions");
const auth = require('../middlewares/auth');

router.get("/getBdeRecentActivityDetails",async(req,res) =>{
    let { leadId,status } = req.query;
    // console.log("req params",req.query)
    return bdeActivitiesFunctions.getBdeRecentActivityDetails({leadId,status})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post("/getPendingActivity",async (req,res) => {
    let params = req.body
    //console.log(params)
    return bdeActivitiesFunctions.getBdeRecentActivityDetails(params)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/createBdeActivity', [], async (req, res) => {
    let obj = req.body;
    // console.log("routes called")
    return bdeActivitiesFunctions.createBdeActivity({ ...obj })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.get("/getUserActivities",async(req,res) =>{
    let { user_id } = req.query;
    // console.log("req params inside get user activvities",req)
    return bdeActivitiesFunctions.getUserActivities({user_id})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/closePendingActivities', [], async (req, res) => {
    let obj = req.body;
    // console.log("routes called")
    return bdeActivitiesFunctions.closePendingActivities({ ...obj })
        .then(result => { return responseHandler.sendSuccess(res, result, req) })
        .catch(error => { return responseHandler.sendError(res, error, req) })
});

router.post("/logBdeActivity",async(req,res) =>{
    let obj = req.body;
    return bdeActivitiesFunctions.logBdeActivity(obj)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get("/getBdeActivities",async(req,res) =>{
    let {leadId} = req.query;
    
    return bdeActivitiesFunctions.getBdeActivities({leadId})
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/getBdeActivitiesByRoleName',async(req,res) =>{

    let {createdByRoleName,status,startDateTime,limit} = req.body;

    return bdeActivitiesFunctions.getBdeActivitiesByRoleName({createdByRoleName,status,startDateTime, limit})
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/getBdeActivitiesByRoleName',async(req,res) =>{

    let {createdByRoleName,status,startDateTime} = req.query;

    return bdeActivitiesFunctions.getBdeActivitiesByRoleName({createdByRoleName,status,startDateTime})
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getBdeActivityScore', async (req, res) => {
    let {createdByRoleName} = req.query;

    return bdeActivitiesFunctions.getBdeActivityScore({createdByRoleName})
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))
})

//---------------------------------buh score-----------------------------------------------
router.get('/getAttendanceActivity', async (req, res) => {
    let { createdByRoleName, createdByProfileName, granularity } = req.query;
    return bdeActivitiesFunctions.getAttendanceActivity({createdByRoleName, createdByProfileName, granularity})
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getCurrentMonthActivities', async (req, res) => {
    let { status, createdByRoleName } = req.query;

    return bdeActivitiesFunctions.getCurrentMonthActivities({status, createdByRoleName})
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))

})

router.post('/logMeetingActivity', async (req, res) => {
    return bdeActivitiesFunctions.logMeetingActivity({...req.body})
           .then(result => responseHandler.sendSuccess(res, result, req))
           .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/checkLeadStageStatus' , async (req, res) => {
    return bdeActivitiesFunctions.checkLeadStageStatus({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/fetchBdeActivitiesByDate', async (req, res) => {
    return bdeActivitiesFunctions.fetchBdeActivitiesByDate({...req.query})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.put('/updateActivity', async (req, res) => {
    return bdeActivitiesFunctions.updateActivity({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/getCurrentActivities', async (req, res) => {
    return bdeActivitiesFunctions.getCurrentActivities({...req.query})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

router.post('/addActivity', async (req, res) => {
    return bdeActivitiesFunctions.addActivity({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})

//-- api to fetch SSR & QC activities-------------------------
router.post('/getActivitiesByType', [auth.authenticateToken], async (req, res) => {
    return bdeActivitiesFunctions.getActivitiesByType({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.get('/getDraftActivityDetail', [auth.authenticateToken], async (req, res) => {
    return bdeActivitiesFunctions.getDraftActivityDetail({...req.query})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.post('/getCollectionTypeActivities', [auth.authenticateToken], async (req, res) => {
    return bdeActivitiesFunctions.getCollectionTypeActivities({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
});

router.put('/updateBdeActivity',[auth.authenticateToken],async (req, res) => {
    return bdeActivitiesFunctions.updateCollectionActivity({...req.body})
    .then(result => responseHandler.sendSuccess(res, result, req))
    .catch(error => responseHandler.sendError(res, error, req))
})





module.exports = router;