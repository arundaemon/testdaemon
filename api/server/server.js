//const newrelic = require('newrelic');
const app = require("express")();
var cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const moment = require("moment-timezone");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger/index");
const userRoutes = require("./routes/userRoutes");
const menusRoutes = require("./routes/menusRoutes");
const projectRoutes = require("./routes/projectRoutes");
const cycleRoutes = require("./routes/cycleRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const statusRoutes = require("./routes/statusRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const leadAssignRoutes = require("./routes/leadAssignRoutes");
const activityRoutes = require("./routes/activityRoutes");
const stageRoutes = require("./routes/stageRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const sourceRoutes = require("./routes/sourceRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leadRoutes = require("./routes/leadRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const targetIncentiveRoutes = require("./routes/targetIncentiveRoutes");
const targetIncentiveLogRoutes = require("./routes/targetIncentiveLogRoutes");
const activityFormRoutes = require("./routes/activityFormRoutes");
const taskActivityMappingRoutes = require("./routes/taskActivityRoutes");
const batchRoutes = require("./routes/batchRoutes");
const productRoutes = require("./routes/productRoutes");
const freeTrialRoutes = require("./routes/freeTrialRoutes");
const approvalRequestRoutes = require("./routes/approvalRequestRoutes");
const auth = require("./middlewares/auth");
const logger = require("./logger").logger;
const responseHandler = require("./utils/responseHandler");
const manageStageStatusRoutes = require("./routes/manageStageStatusRoutes");
const configRoutes = require("./routes/configRoutes");
const roleBasedAttendanceMatrixRoutes = require('./routes/roleBasedAttendanceMatrixRoutes');
const bdeActivities = require('./routes/bdeActivitiesRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const config = require('./config')
const activityFormMapping = require('./routes/activityFormMappingRoutes');
const leadJourneyMapping = require('./functions/leadJourneyMappingFunctions');
const hierachyRoutes = require('./routes/hierachyRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const leadInterestRoutes = require('./routes/leadInterestRoutes');
const { DecryptData } = require('./utils/utils');
const { getConfig } = require('./functions/configFunctions');
const { createBdeActivity, updateManyByKey } = require('./controllers/bdeActivitiesControls');
const subjectRoutes = require('./routes/subjectRoutes');
const customerResponseRoutes = require('./routes/customerResponseRoutes');
const reasonForDisqualificationRoutes = require('./routes/reasonForDisqualificationRoutes');
const cubeBdActivityRoutes = require('./routes/cubeBdActivityRoutes')
const bdeCollectPaymentRoute = require('./routes/bdeCollectPaymentRoutes')
const leadLogRoutes = require('./routes/leadLogsRoutes');
const leadDetailsRoutes = require('./routes/leadDetailsRoutes');
const leadStageStatusRoutes = require('./routes/leadStageStatusRoutes');
const alternateContactRoutes = require('./routes/alternateContactsRoutes');
const { updateLead } = require('./functions/leadAssignFunction');
const reasonForPaPendingRoutes = require('./routes/reasonForPaPendingRoutes');
const reasonForPaRejectedRoutes = require('./routes/reasonForPaRejectedRoutes');
const reasonForObPendingRoutes = require('./routes/reasonForObPendingRoutes');
const reasonForObRejectedRoutes = require('./routes/reasonForObRejectedRoutes');
const reasonForFbPendingRoutes = require('./routes/reasonForFbPendingRoutes');
const reasonForFbRejectedRoutes = require('./routes/reasonForFbRejectedRoutes');
const reasonForAckPendingRoutes = require('./routes/reasonForAckPendingRoutes');
const reasonForAckRejectedRoutes = require('./routes/reasonForAckRejectedRoutes');
const expenseTypeMappingRoutes = require('./routes/expenseTypeMappingRoutes');
const claimMasterRoutes = require('./routes/claimMasterRoutes');
const userClaimRoutes = require('./routes/userClaimRoutes');
const schoolRoutes = require('./routes/schoolRoutes')
const couponRequestRoutes = require('./routes/couponRequestRoutes');
const approvalMappingRoutes = require('./routes/approvalMappingRoutes');
const territoryMappingRoutes = require('./routes/territoryMappingRoutes');
const crmMasterRoutes = require('./routes/crmMasterRoutes');
const crmFieldMasterRoutes = require('./routes/crmFieldMasterRoutes');
const productMasterRoutes = require('./routes/productMasterRoutes');
const targetRoutes = require('./routes/targetRoutes');
const quotationConfigRoutes = require('./routes/quotationConfigRoutes');
const packageRoutes = require('./routes/packageRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes')
const quotationRoutes = require('./routes/quotationRoutes')
const implementationFormRoutes = require("./routes/implementationFormRoutes");
const approvalMatrixRoutes = require('./routes/approvalMatrixRoutes')
const salesApprovalRoutes = require('./routes/salesApprovalRoutes')
const alertNotificationRoutes = require('./routes/alertNotificationRoutes')
const { createManyStageStatus } = require('./controllers/leadStageStatusControls');
const implementationSiteSurveyRoutes = require('./routes/implementationSiteSurveyRoutes');
const tds = require('./routes/tds');
const dsc = require('./routes/dscRoutes');
const implementationQcRoutes = require('./routes/implementationQcRoutes');
const implementationEngineerRoutes = require('./routes/implementationEngineerRoutes');
const collectionRoutes = require('./routes/collectionRoutes');

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// app.use(formidableMiddleware());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));

//const config.cfg = require('./config/config');

dotenv.config();
// main.connectActivityDb()
//   .then((res)=>{
//     console.log(res,"result...")
//   })
//   .catch((err) =>{
//     console.log(err, "error...")
//   })
// .finally(() => client.close());
//Routes
app.use('/user', userRoutes);
app.use('/menu', menusRoutes);
app.use('/project', projectRoutes);
app.use('/cycle', cycleRoutes);
app.use('/journey', journeyRoutes);
app.use('/status', statusRoutes);
app.use('/banner', bannerRoutes);
app.use('/leadassign', leadAssignRoutes);
app.use('/activity', activityRoutes);
app.use('/stage', stageRoutes);
app.use('/rule', ruleRoutes);
app.use('/source', sourceRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/task', taskRoutes);
app.use('/lead', leadRoutes);
app.use('/campaign', campaignRoutes);
app.use('/targetIncentive', targetIncentiveRoutes);
app.use('/activityForm', activityFormRoutes);
app.use('/targetIncentiveLog', targetIncentiveLogRoutes);
app.use('/taskActivityMapping', taskActivityMappingRoutes);
app.use('/stageRuleMapping', manageStageStatusRoutes);
app.use('/config', configRoutes);
app.use('/roleBasedAttendance', roleBasedAttendanceMatrixRoutes);
app.use('/bdeActivities', bdeActivities);
app.use('/activityFormMapping', activityFormMapping)
app.use('/batch', batchRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/freeTrial', freeTrialRoutes);
app.use('/approvalRequest', approvalRequestRoutes);
app.use('/hierachy', hierachyRoutes)
app.use('/leadInterest', leadInterestRoutes);
app.use('/subject', subjectRoutes);
app.use('/customerResponse', customerResponseRoutes);
app.use('/reasonForDisqualification', reasonForDisqualificationRoutes);
app.use('/cubeBdActivity', cubeBdActivityRoutes);
app.use('/bdeCollectPayment', bdeCollectPaymentRoute);
app.use('/leadLogs', leadLogRoutes)
app.use('/bdeCollectPayment', bdeCollectPaymentRoute)
app.use('/leadDetails', leadDetailsRoutes);
app.use('/leadStageStatus', leadStageStatusRoutes);
app.use('/alternateContact', alternateContactRoutes);
app.use('/gateway', gatewayRoutes);
app.use('/reasonForPaPending', reasonForPaPendingRoutes);
app.use('/reasonForPaRejected', reasonForPaRejectedRoutes);
app.use('/reasonForObPending', reasonForObPendingRoutes);
app.use('/reasonForObRejected', reasonForObRejectedRoutes);
app.use('/reasonForFbPending', reasonForFbPendingRoutes);
app.use('/reasonForFbRejected', reasonForFbRejectedRoutes);
app.use('/reasonForAckPending', reasonForAckPendingRoutes);
app.use('/reasonForAckRejected', reasonForAckRejectedRoutes);
app.use('/territoryMapping', territoryMappingRoutes);
app.use('/expenseTypeMapping', expenseTypeMappingRoutes)
app.use('/claimMaster', claimMasterRoutes);
app.use('/userClaim', userClaimRoutes);
app.use('/school', schoolRoutes)
app.use('/couponRequest', couponRequestRoutes);
app.use('/approvalMapping', approvalMappingRoutes);
app.use('/crmMaster', crmMasterRoutes);
app.use('/crmFieldMaster', crmFieldMasterRoutes);
app.use('/productMaster', productMasterRoutes);
app.use('/target', targetRoutes);
app.use('/quotationConfig', quotationConfigRoutes);
app.use('/packages',packageRoutes)
app.use('/purchaseOrder',purchaseOrderRoutes)
app.use('/quotation',quotationRoutes)
app.use("/implementation", implementationFormRoutes);
app.use('/approvalMatrix', approvalMatrixRoutes)
app.use('/implementationSiteSurvey', implementationSiteSurveyRoutes);
app.use('/salesApproval', salesApprovalRoutes)
app.use('/alertNotification', alertNotificationRoutes)
app.use('/tds', tds);
app.use('/dsc', dsc);
app.use('/implementationQc', implementationQcRoutes);
app.use('/implementationEngineer', implementationEngineerRoutes);
app.use('/collection', collectionRoutes);

app.use(responseHandler.handleError);

const port = config.cfg.PORT;
let server = "";

app.get("/", async (req, res) => {
  res.send({ status: "OK" });
});

app.get('/serverTime',[auth.authenticateToken], (req,res) => {
  let result = { status: "OK" , dateTime: new Date()}
  responseHandler.sendSuccess(res, result, req)
})

app.get('/getVisitDetail',[auth.authenticateToken], async (req,res) => {
  let {date,schoolCode,empCode} = req.query
  let url = `${config.cfg.TLP_HOST}/cust/1/em/visits`
  let params = {
    date,
    identifier: schoolCode,
    empIden: empCode
  }
  let axiosInstance = axios.create(
    {
      headers: {
        "tlp-cid": config.cfg.TLP_ID,
        "api-key": config.cfg.TLP_APPKEY,
        "platform": 'API',
        "Content-Type": "application/json",
      }
    }
  );
  let response = await axiosInstance.get(url, {params})
  //console.log(response)
  res.send({status: 200,data:response?.data})
})

app.post('/checkLeadJourney', async (req, res) => {
  let leadObj = req.body
  try {
    let jourenyObj = await leadJourneyMapping.getLeadJourneyDetails(leadObj);
    if (jourenyObj.list && jourenyObj.list.length > 0) {
      createManyStageStatus(jourenyObj.list);
    }
    let obj = {
      leadId: leadObj.leadId,
      update: {
        stageName: jourenyObj?.leadData?.stageName,
        statusName: jourenyObj?.leadData?.statusName,
      },
    };
    let stagestatus =
      leadObj?.stageName && leadObj.statusName
        ? `${leadObj.stageName.toUpperCase().trim()} ${leadObj.statusName
            .toString()
            .toUpperCase()
            .trim()}`
        : "";
    let currentStageStatus =
      jourenyObj &&
      jourenyObj.leadData &&
      jourenyObj.leadData.stageName &&
      jourenyObj.leadData.statusName
        ? `${jourenyObj?.leadData?.stageName
            .toUpperCase()
            .trim()} ${jourenyObj?.leadData?.statusName.toUpperCase().trim()}`
        : "";
    if (
      jourenyObj &&
      jourenyObj.leadData &&
      currentStageStatus != stagestatus
    ) {
      let data = updateLead(obj);
    }
    res.send(jourenyObj);
  } catch (err) {
    console.log("checkLeadJourney", err);
    res.status(400).send({ message: "Some Error Occurred", error: err });
  }
});

app.post("/startcall", (req, res) => {
  let callData = DecryptData(req.body.params);
  getConfig()
    .then((res) => {
      return res.data[0];
    })
    .then((configObj) => {
      //console.log(configObj)
      let knowlarityNumber =
        configObj.K_Number[
          Math.floor(Math.random() * configObj.K_Number.length)
        ];
      let callObj = {
        headers: {
          "Content-Type": "application/json",
          Authorization: configObj?.Authorization,
          "x-api-key": configObj?.x_api_key,
        },
      };
      const body = {
        k_number: knowlarityNumber,
        agent_number: callData?.phoneNumber,
        customer_number: callData?.customerNumber,
        caller_id: knowlarityNumber,
      };
      let axiosInstance = axios.create();
      let url = configObj?.["callUrl"];
      //console.log(url,body,callObj)
      return axiosInstance.post(url, body, callObj);
    })
    .then((callRes) => {
      if (callRes.data.error) {
        //console.log('Error',callRes)
        return {
          status: "DND",
          error: callRes.data.error.message,
          reqConfig: callRes.config,
          knowlarityRes: callRes.data,
        };
      } else {
        let callId = callRes.data.success.call_id;
        let date = moment().format("YYYY-MM-DD hh:mm:ss");
        let bdeActivityObj = {
          ...callData,
          callId,
          activityScore: 0,
          callStatus: "Not Connected",
          startDateTime: date,
          endDateTime: moment(date).add(10, "minutes"),
          status: "Init",
        };
        //console.log('Start Call',bdeActivityObj)
        if (callData.update) {
          //pa.created_at
          updateManyByKey({ _id: callData.updateId }, bdeActivityObj, {
            upsert: false,
          });
          return { callId };
        } else {
          return createBdeActivity(bdeActivityObj);
        }
      }
    })
    .then((modelres) => {
      //console.log(modelres)
      if (modelres.status == "DND") {
        res.status(200).send(modelres);
      } else {
        res.status(200).send({ status: "Ok", callId: modelres.callId });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ status: "Error Occurred", error: err });
    });
});
//---------------------swagger start

const specs = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true, swaggerOptions: {
    validateUrl: null,
  } })
);

//============================end swagger
config.dbConnection
  .connectDb()
  .then((successRes) => {
    server = require("http").createServer(app);
    server.listen(port, () => {
      console.log(
        `Server listening on ${port}, in ${config.cfg.ENVIRONMENT} mode`
      );
      logger.info(
        `Server listening on ${port}, in ${config.cfg.ENVIRONMENT} mode`
      );
    });
    socketServer = require("./socket-server")(server);
  })
  .catch((err) => {
    console.log(err);
    process.exit();
    throw new Error("Could not connect to DB");
  });
