const customExceptions = require("../responseModels/customExceptions");
const journeyControls = require("../controllers/journeyControls");
const leadStageStatusControl = require("../controllers/leadStageStatusControls");
const manageStageStatusControls = require("../controllers/manageStageStatusControls");
const config = require("../config");
const fetch = require("node-fetch");
const redis = require("redis");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const { promisify } = require("util");
const { getCubeInstance } = require("../utils/utils");
const leadassignModal = require("../models/leadassignModal");
const LeadInteresetModel = require("../models/leadInterestModel");
const BdeactivitiesModel = require("../models/bdeActivitiesModel");
const redisClient = redis.createClient(
  config.cfg.REDIS_PORT,
  config.cfg.REDIS_HOST
);
const redisHGet = promisify(redisClient.hgetall).bind(redisClient);
const redisGet = promisify(redisClient.get).bind(redisClient);

const getLeadJourneyDetails = async (leadObj) => {
  console.log("Lead Journey-------------", leadObj);
  try {
    //reporting tool datasets
    const dynamicCubes = JSON.parse(await redisGet("apiDatasets"));
    let detail = await leadStageStatusControl.getLeadDetail(leadObj);
    //console.log('enter inside detail.length;;;;;;;;;;;;;;;;;;;;;;,', detail);
    const prevList = [];
    if (detail.length > 0) {
      // console.log('enter inside detail.length;;;;;;;;;;;;;;;;;;;;;;,', detail);
      let detailObj = detail[0];
      detailObj.leadType = leadObj?.leadType || leadObj?.leadInterestType;
      //console.log('Lead Detail',detailObj);
      return checkStageStatus(detailObj, prevList);
    }
    let journeyList = await journeyControls.getLinkedJourneyList();
    // console.log(journeyList,'...................journey list');
    for (let journey of journeyList) {
      let match = await checkLogic(
        dynamicCubes,
        journey.condition,
        journey.filterSql,
        leadObj
      );
      //console.log(match,'...........match');
      if (match) {
        let leadData = {
          leadId: leadObj.leadId,
          journeyName: journey?.journeyName,
          cycleName: "",
          stageName: "",
          statusName: "",
          previousStage: "",
          previousStatus: "",
          leadName: leadObj.name,
          mobile: leadObj.mobile,
          state: leadObj?.state,
          city: leadObj?.city,
          email: leadObj.email,
          dnd: leadObj?.dnd,
          source: leadObj?.source,
          subSource: leadObj?.subSource,
          otpVerified: leadObj?.otpVerified,
          createdDateTime: leadObj?.createdDate,
          registrationDateTime: leadObj.registrationDate
            ? leadObj.registrationDate
            : null,
          appDownloadedDate: leadObj.appDownloadedDate
            ? leadObj.appDownloadedDate
            : null,
          // b2bFlag: leadObj?.b2bFlag ? leadObj?.b2bFlag : false,
          leadType: leadObj?.leadType || leadObj?.leadInterestType,
        };
        if (journey.linkedCycle.length > 0) {
          let cycle = journey.linkedCycle[0];
          leadData.cycleName = cycle.cycleName;
          if (cycle.linkedStage.length > 0) {
            let stage = cycle.linkedStage[0];
            leadData.stageName = stage.stageName;
            if (stage.linkedStatus.length > 0) {
              let status = stage.linkedStatus[0];
              leadData.statusName = status.statusName;
            }
          }
        }
        if (leadData.stageName && leadData.statusName) {
          try {
            let data = await leadStageStatusControl.createLeadStageStatus(
              leadData
            );
            //console.log(leadData,'.........lead data upper');
            return checkStageStatus(leadData, prevList);
          } catch (err) {
            console.log(err);
            return { status: "Ok", leadData: leadData, list: prevList };
          }
        }
        break;
      }
    }
    return { status: "Ok", leadData: leadObj, list: prevList };
  } catch (err) {
    console.log("Error", err);
    throw { errorMessage: err };
  }
};

checkStageStatus = async (leadDetail, prevList = []) => {
  try {
    let parentKey = `${leadDetail.stageName.trim()} ${leadDetail.statusName.trim()}`;
    let ruleMappings = await manageStageStatusControls.getList({
      search: { key: "parent", value: parentKey },
    });
    //console.log(ruleMappings,'..............rule mappings---------------------------------');
    if (ruleMappings.length > 0) {
      const dynamicCubes = JSON.parse(await redisGet("apiDatasets"));
      for (let rule of ruleMappings) {
        let filters = rule.ruleId.filters;
        let filterSql = rule.ruleId.logic.stringValue;

        let match = await checkLogic(
          dynamicCubes,
          filters,
          filterSql,
          leadDetail
        );
        console.log(
          leadDetail.leadId,
          rule.ruleId._id,
          rule.ruleName,
          match,
          "---------------------------------------------"
        );
        if (match) {
          if (
            leadDetail.stageName != rule.stageName ||
            leadDetail.statusName != rule.statusName
          ) {
            leadDetail["previousStage"] = leadDetail.stageName;
            leadDetail["previousStatus"] = leadDetail.statusName;
            leadDetail["stageName"] = rule.stageName;
            leadDetail["statusName"] = rule.statusName;
            leadDetail["journeyName"] = rule.journeyName;
            leadDetail["cycleName"] = rule.cycleName;
            leadDetail["updatedAt"] = new Date();
            leadDetail["createdAt"] = new Date();
            let stageExists = prevList.find(
              (obj) =>
                obj.stageName === rule.stageName &&
                obj.statusName === rule.statusName
            );
            //console.log('Loop',stageExists)
            if (!stageExists) {
              let obj = JSON.parse(JSON.stringify(leadDetail));
              delete obj._id;
              prevList.push(obj);
              return checkStageStatus(leadDetail, prevList);
            } else {
              sendLoopMail(prevList, leadDetail);
              return { status: "Ok", leadData: leadDetail, list: prevList };
            }
          } else {
            break;
          }
        }
      }
    }
    return { status: "Ok", leadData: leadDetail, list: prevList };
  } catch (err) {
    console.log(err);
    return { status: "Ok", leadData: leadDetail, list: prevList };
    //throw { errorMessage: err }
  }
};

const sendLoopMail = async (list, leadObj) => {
  //console.log(leadObj)
  let mailUrl = `${config.cfg.API_GATEWAY_URL}/communication-service/communication/sendMail`;
  let action = "send_mail";
  let emSubject = "CRM Rule Loop on Lead";
  let emBody = `<html>\n 
                <head> \n 
                    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" /> \n 
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\" /> \n 
                    <title>Emailer</title> \n 
                    <link href=\"https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&amp;display=swap\" rel=\"stylesheet\" /> \n 
                </head> \n 
                <body class=\"body\" style=\"\r\n padding: 0 !important;\r\n margin: 0 !important;\r\n display: block !important;\r\n min-width: 100% !important;\r\n width: 100% !important;\r\n background: #ffffff;\r\n font-family: 'Open Sans', sans-serif;\r\n \"> \n
                    <table>
                        <thead>
                            <tr>
                            <th>Lead ID</th>
                            <th>Lead Type</th>
                            <th>Email</th>
                            <th>Rule Flow</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${leadObj.leadId}</td>
                                <td>${leadObj.leadType}</td>
                                <td>${leadObj.email ?? "NA"}</td>
                                <td>${list
                                  .map((obj, index) => {
                                    return (
                                      index +
                                      1 +
                                      ":- " +
                                      obj.stageName +
                                      "-" +
                                      obj.statusName
                                    );
                                  })
                                  .join("\\n")}
                            </tr>
                        </tbody>
                    </table>
                </body>
                </html>
                `;
  let recipientDetails = {
    toList: ["shatahayu.rahangdale@extramarks.com"],
    ccList: [
      "deepak.singh@extramarks.com",
      "jatin.agnihotri@extramarks.com",
      "ashwani.singh@extramarks.com",
    ],
  };

  let checksum = CryptoJS.SHA512(
    `${action}:${config.cfg.API_GATEWAY_KEY}:${emSubject}:${config.cfg.API_GATEWAY_SALT}`
  ).toString();
  let mailObj = {
    action,
    apiKey: config.cfg.API_GATEWAY_KEY,
    checksum,
    emSubject,
    recipientDetails,
    emBody,
    typw: "direct",
    directFlag: true,
  };
  //console.log(mailObj)
  try {
    const { data } = await axios.post(mailUrl, mailObj);
  } catch (err) {
    console.log(err);
  }
};

//reporting tool data against any lead
const checkLogic = async (dynamicCubes, condition, filterSql, leadObj) => {
  let token = await getCubeToken();
  if (token) {
    let conditionObj = {};
    let filterStr = `() => {return (${filterSql})}`;
    filterStr = filterStr
      .replace(new RegExp(/AND/g), " && ")
      .replace(new RegExp(/OR/g), " || ");
    for (let i = 1; i <= condition.length; i++) {
      let query = condition[i - 1];
      let dataset = query.dataset.dataset
        ? query.dataset.dataset
        : query.dataset.dataSetName;
      conditionObj[i] = 0;
      // console.log(dataset,'..........................dataset');
      let cubeDataset = dynamicCubes.find((obj) => obj.title == dataset);
      let dimensionNames = Object.keys(cubeDataset?.dimensions);
      let fieldName = query.parameter
        ? `${query.parameter.name}`
        : query.field && query.field.fieldName
        ? `${query.field.fieldName}`
        : `${query.field.displayName}`;
      let member = `${dataset}.${fieldName}`;
      let operator = query.operator?.selectedOperator
        ? query.operator.selectedOperator.value
        : query.operator.operatorValue;
      let filterValue = query.filterValue ? query.filterValue : query.value;
      if (["last6hr", "last12hr"].indexOf(operator) > -1) {
        let now = new Date();
        let date;
        switch (operator) {
          case "last6hr":
            date = moment(now).subtract(6, "hours").toDate();
            operator = "afterDate";
            filterValue = [date];
            break;
          case "last12hr":
            date = moment(now).subtract(12, "hours").toDate();
            operator = "afterDate";
            filterValue = [date];
            break;
          case "before6hr":
            date = moment(now).subtract(6, "hours").toDate();
            operator = "beforeDate";
            filterValue = [date];
            break;
          default:
            date = moment(now).subtract(12, "hours").toDate();
            operator = "beforeDate";
            filterValue = [date];
            break;
        }
      }
      let measure = `${dataset}.count`;
      let queryObj = {
        query: {
          measures: [measure],
          dimensions: [],
          filters: [
            {
              member: `${member}`,
              operator: `${operator}`,
              values: [...filterValue],
            },
          ],
          limit: 1,
          renewQuery: true,
        },
      };
      if (
        dimensionNames.indexOf("userId") >= 0 ||
        dimensionNames.indexOf("leadId") >= 0 ||
        dimensionNames.indexOf("lUuid") >= 0 ||
        dimensionNames.indexOf("uuid") >= 0 ||
        dimensionNames.indexOf("Id") >= 0
      ) {
        let userFilter = {
          or: [],
        };
        if (dimensionNames.indexOf("userId") >= 0) {
          userFilter.or.push({
            member: `${dataset}.userId`,
            operator: `equals`,
            values: [leadObj.leadId],
          });
        }
        if (dimensionNames.indexOf("leadId") >= 0) {
          userFilter.or.push({
            member: `${dataset}.leadId`,
            operator: `equals`,
            values: [leadObj.leadId],
          });
        }
        if (dimensionNames.indexOf("uuid") >= 0) {
          userFilter.or.push({
            member: `${dataset}.uuid`,
            operator: `equals`,
            values: [leadObj.leadId],
          });
        }
        if (dimensionNames.indexOf("lUuid") >= 0) {
          userFilter.or.push({
            member: `${dataset}.lUuid`,
            operator: `equals`,
            values: [leadObj.leadId],
          });
        }
        queryObj.query.filters.push(userFilter);
      }
      if (queryObj.query.filters[1].or.length == 1) {
        let userFilter = queryObj.query.filters[1].or[0];
        delete queryObj.query.filters[1];
        queryObj.query.filters[1] = userFilter;
      }

      if (query.concurrent) {
        queryObj["concurrent"] = query.consecutive;
      }

      try {
        let cubeData;
        if (dataset.toUpperCase().includes("ORDER")) {
          let orderId = await getlatestOrderId(
            leadObj.leadId,
            dataset,
            token.cubeToken
          );
          if (orderId) {
            queryObj.query.filters = [
              {
                member: `${dataset}.oId`,
                operator: "equals",
                values: [orderId],
              },
              ...queryObj.query.filters,
            ];
            cubeData = await getDatasetData(
              cubeDataset,
              queryObj.query,
              measure,
              token.cubeToken
            );
          } else {
            cubeData = null;
          }
        } else if (queryObj?.concurrent) {
          cubeData = await checkConsecutive(
            cubeDataset,
            queryObj,
            fieldName,
            measure,
            token.cubeToken
          );
        } else {
          // console.log(cubeDataset, queryObj.query, measure,'==================================');
          cubeData = await getDatasetData(
            cubeDataset,
            queryObj.query,
            measure,
            token.cubeToken
          );
        }
        cubeData = cubeData ? cubeData.rawData() : null;
        if (cubeData && cubeData.length > 0 && cubeData[0][measure] > 0) {
          conditionObj[i] = 1;
        }
        filterStr = filterStr.replace(
          new RegExp(`(${i})`, "g"),
          conditionObj[i]
        );
      } catch (err) {
        filterStr = filterStr.replace(
          new RegExp(`(${i})`, "g"),
          conditionObj[i]
        );
        console.log(err, queryObj.query);
      }
    }

    let match = eval(filterStr)();
    return match;
  } else {
    return 0;
  }
};

const checkConsecutive = async (
  cubeDataset,
  queryObj,
  field,
  measure,
  token
) => {
  let query = queryObj.query;
  let dataset = cubeDataset.title;
  let dimensonName = `${dataset}.${field}`;
  query.dimensions = [dimensonName];
  let coloumn, values;
  let count = queryObj?.concurrent;
  let sort = { updatedAt: -1 };
  let params = {};
  for (let filter of query.filters) {
    [dataset, coloumn] = filter?.or
      ? [dataset, "leadId"]
      : filter.member.split(".");
    values = filter?.or ? filter?.or[0].values : filter.values;
    params[coloumn] = { $in: values };
  }
  let condition = { [field]: params[field] };
  delete params[field];
  let res;
  switch (cubeDataset.tableName) {
    case "bdeactivities":
      params["status"] = "Complete";
      params["isRefurbished"] = 0;
      res = await BdeactivitiesModel.find(params)
        .sort({ updatedAt: -1 })
        .limit(count)
        .lean();
      consecutiveRecords = res.map((obj) => {
        return { [`${dimensonName}`]: obj[field] };
      });
      break;

    case "leadinterests":
      res = await LeadInteresetModel.find(params)
        .sort(sort)
        .limit(count)
        .lean();
      consecutiveRecords = res.map((obj) => {
        return { [`${dimensonName}`]: obj[field] };
      });
      break;

    case "leadassigns":
      res = await leadassignModal.find(params).sort(sort).limit(count).lean();
      consecutiveRecords = res.map((obj) => {
        return { [`${dimensonName}`]: obj[field] };
      });
      break;

    default:
      query.limit = count;
      query.measures = [];
      res = await getCubeData(query, token);
      consecutiveRecords = res.rawData();
      break;
  }
  //console.log(consecutiveRecords)
  let result = consecutiveRecords.filter(
    (obj) => condition[field]["$in"].indexOf(obj[dimensonName]) > -1
  );
  //console.log(result)
  return {
    rawData: () => {
      return result.length == consecutiveRecords.length &&
        result.length == count
        ? [{ [measure]: count }]
        : [{ [measure]: 0 }];
    },
  };
};

const getlatestOrderId = async (leadId, datasetName, token) => {
  let measure = `${datasetName}.${config.cfg.LATEST_ORDER_MEASURE}`;
  let query = {
    measures: [measure],
    dimensions: [],
    order: { [measure]: "desc" },
    filters: [
      {
        member: `${datasetName}.lUuid`,
        operator: `equals`,
        values: [leadId],
      },
    ],
    limit: 1,
    renewQuery: true,
  };
  let orderData = await getCubeData(query, token);
  orderData = orderData.rawData();
  if (orderData && orderData.length > 0 && orderData[0][measure] > 0) {
    return orderData[0][measure].toString().trim();
  } else {
    return null;
  }
};

const getCubeToken = () => {
  let url = config.cfg.REPORTING_TOOL_API + "/getToken?role=EM_CRM";
  return fetch(url, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const getDatasetData = async (cubeDataset, query, measure, token) => {
  let params = {};
  let data = 0;
  let dataset = cubeDataset.title;
  let coloumn, values;
  switch (cubeDataset.tableName) {
    case "leadassigns":
      for (let filter of query.filters) {
        [dataset, coloumn] = filter?.or
          ? [dataset, "leadId"]
          : filter.member.split(".");
        values = filter?.or ? filter?.or[0].values : filter.values;
        params[coloumn] = { $in: values };
      }
      data = await leadassignModal.countDocuments(params);
      break;
    case "leadinterests":
      for (let filter of query.filters) {
        [dataset, coloumn] = filter?.or
          ? [dataset, "leadId"]
          : filter.member.split(".");
        values = filter?.or ? filter?.or[0].values : filter.values;
        params[coloumn] = { $in: values };
      }
      data = await LeadInteresetModel.countDocuments(params);
      break;
    case "bdeactivities":
      params["status"] = "Complete";
      params["isRefurbished"] = 0;
      for (let filter of query.filters) {
        [dataset, coloumn] = filter?.or
          ? [dataset, "leadId"]
          : filter.member.split(".");
        values = filter?.or ? filter?.or[0].values : filter.values;
        params[coloumn] = { $in: values };
      }
      // console.log(params,'--------------------------------------------------------------------------')
      data = await BdeactivitiesModel.countDocuments(params);
      break;
    default:
      // console.log('default Journey check Request', cubeDataset.tableName)
      return await getCubeData(query, token);
      break;
  }
  return {
    rawData: () => {
      return data ? [{ [measure]: data }] : [{ [measure]: 0 }];
    },
  };
};

const getCubeData = (dataObj, token) => {
  let cubeApi = getCubeInstance(token);
  return cubeApi.load(dataObj);
};

module.exports = {
  getLeadJourneyDetails,
  getCubeToken,
  getlatestOrderId,
};
