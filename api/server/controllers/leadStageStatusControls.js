const LeadStageStatus = require('../models/leadStageStatusModel');
const BdeActivities=require('../models/bdeActivitiesModel')
const leadAssignControl = require('../controllers/leadAssignControl');
const utils = require('../utils/utils');
const config = require('../config');
const { LEAD_TYPE }= require('../constants/dbConstants');

const getLeadDetail = async (params) => {
    let { leadId } = params
    let query = {}
    if (leadId) {
        query.leadId = leadId
    }
    //console.log(query)
    const result = await LeadStageStatus.find(query)
        .sort({ updatedAt: -1 })
        .hint({leadId:1}).skip(0).limit(1).lean();
    return result
}

const createLeadStageStatus = async (leadObj) => {
    let { leadId, stageName, statusName, journeyName, cycleName, leadType } = leadObj;
    // if(leadType !== `${LEAD_TYPE.INTEREST}` && leadType !== `${LEAD_TYPE.IMPLEMENTATION}`){
    //     await leadAssignControl.updateLeadAssign({ leadId, stageName, statusName, journeyName, cycleName })
    // }
    let result = await LeadStageStatus.create({...leadObj})
    return result
}

const createManyStageStatus = async (list) => {
    let result = await LeadStageStatus.insertMany(list)
    return result
}


const updateManyByKey = async (query, update, options) => {
    return LeadStageStatus.updateMany(query, update, options);
}

const getLeadStageStatusDetails = async (id) => {
    const result = await LeadStageStatus.find({leadId:id}).hint({leadId:1}).sort({updatedAt:-1}).lean();
    result.map(item => {
        item[`${config.cfg.LEAD_STAGE}.stageName`] = item.stageName
        return item
    })
    return result;
}

const deleteLeadStageStatus = async (id) => {
    let record1= await LeadStageStatus.deleteMany({leadId:id })
    let record2= await BdeActivities.deleteMany({leadId:id })
}

module.exports = {
    getLeadDetail,
    createLeadStageStatus,
    updateManyByKey,
    getLeadStageStatusDetails,
    deleteLeadStageStatus,
    createManyStageStatus
}