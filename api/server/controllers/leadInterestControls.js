const LeadInterest = require('../models/leadInterestModel');
const utils = require('../utils/utils');
const config = require('../config');
const LeadOwner = require('../models/leadOwnerModel');

const saveNewLeadInterest = async (params) => {
    try {
        LeadInterest.insertMany(params);
    } catch (err) {
        throw { errorMessage: err }
    }
}

const saveLeadInterest = async (params) => {
    try {
        let { leadId, learningProfile, board, school, sourceName, subSourceName, campaignName, roleName, profileName, campaignId, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, leadType } = params;
        let query = { leadId, learningProfile };
        //let options = { new: true, upsert: true }; 
        const result = await LeadInterest.create({
            leadId, board, school, class: params.class, learningProfile, sourceName, subSourceName, leadType, campaignName, roleName, profileName, campaignId, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid
        });
        return result;
    } catch (err) {
        throw { errorMessage: err }
    }

}

const checkLeadInterestTable = async (lead, learningProfile, board, school, newclass, campaignName) => {
    try {
        let { leadId } = lead; //leadid
        const result = await LeadInterest.findOne({
            leadId,
            learningProfile,
            board,
            school,
            class: newclass,
            campaignName
        })

        if (result) {
            return result;
        }
        return false;
    } catch (err) {
        throw { errorMessage: err }
    }
}

const getLeadInterestDetails = async (id) => {
    // console.log(id,'..id')
    let query = { leadId: id }

    let sort = { createdAt: -1 }
    const result = await LeadInterest.find(query).lean().sort(sort);
    // console.log(result,'...result');
    result.map(item => {
        item[`${config.cfg.LEAD_INTERESTS}.sourceName`] = item.sourceName

        item[`${config.cfg.LEAD_INTERESTS}.subSourceName`] = item.subSourceName

        item[`${config.cfg.LEAD_INTERESTS}.campaignName`] = item.campaignName

        item[`${config.cfg.LEAD_INTERESTS}.learningProfile`] = item.learningProfile

        item[`${config.cfg.LEAD_INTERESTS}.board`] = item.board

        item[`${config.cfg.LEAD_INTERESTS}.school`] = item.school

        item[`${config.cfg.LEAD_INTERESTS}.class`] = item.class

        item[`${config.cfg.LEAD_INTERESTS}.createdAt`] = item.createdAt

        item[`${config.cfg.LEAD_INTERESTS}.updatedAt`] = item.updatedAt


    })

    return result;

}


const updateManyByKey = async (query, update, options) => {
    return LeadInterest.updateMany(query, update, options);
}

const uniqueLeadInterest = async (id) => {
    try {
        const uniqueInterest = [];
        const result = await LeadInterest.aggregate([
            { $sort: { createdAt: -1 } },
            { $match: { leadId: id } },
            {
                $group: {
                    _id: '$learningProfile',
                    firstDocument: { $first: '$$ROOT' },
                    lastDocument: { $last: '$$ROOT' }
                }
            },
            { $sort: { 'firstDocument.createdAt': -1 } }
        ])
        result.map(item => {
            let obj = {
                [`${config.cfg.LEAD_INTERESTS}.sourceName`]: item.firstDocument.sourceName,

                [`${config.cfg.LEAD_INTERESTS}.subSourceName`]: item.firstDocument.subSourceName,

                [`${config.cfg.LEAD_INTERESTS}.campaignName`]: item.firstDocument.campaignName,

                [`${config.cfg.LEAD_INTERESTS}.learningProfile`]: item.firstDocument.learningProfile,

                [`${config.cfg.LEAD_INTERESTS}.board`]: item.firstDocument.board,

                [`${config.cfg.LEAD_INTERESTS}.school`]: item.firstDocument.school,

                [`${config.cfg.LEAD_INTERESTS}.class`]: item.firstDocument.class,

                [`${config.cfg.LEAD_INTERESTS}.createdAt`]: item.firstDocument.createdAt,

                [`${config.cfg.LEAD_INTERESTS}.updatedAt`]: item.firstDocument.updatedAt,
            }
            uniqueInterest.push(obj);
        })
        return uniqueInterest;
    }
    catch (err) {
        console.log(err, ":: error inside unique lead interest controller");
    }
}

const interestTransactionalLog = async (params) => {
    try {
        let { leadId, learningProfile, search, itemsPerPage, pageNo } = params;
        const transactionalLogs = [];

        let query = {
            leadId,
            learningProfile: { $regex: learningProfile }
        }

        if (search) {
            query = {
                ...query,
                $or: [{ sourceName: { $regex: search, $options: 'i' } },
                { subSourceName: { $regex: search, $options: 'i' } },
                { campaignName: { $regex: search, $options: 'i' } }]
            }
        }

        if (utils.isEmptyValue(pageNo)) {
            pageNo = 0
        } else {
            pageNo = parseInt(pageNo)
        }

        if (utils.isEmptyValue(itemsPerPage)) {
            itemsPerPage = 999
        } else {
            itemsPerPage = parseInt(itemsPerPage);
        }

        const result = await LeadInterest.find(query).skip(pageNo * itemsPerPage).limit(itemsPerPage);
        result.map(item => {
            let obj = {
                [`${config.cfg.LEAD_INTERESTS}.sourceName`]: item.sourceName,

                [`${config.cfg.LEAD_INTERESTS}.subSourceName`]: item.subSourceName,

                [`${config.cfg.LEAD_INTERESTS}.campaignName`]: item.campaignName,

                [`${config.cfg.LEAD_INTERESTS}.learningProfile`]: item.learningProfile,

                [`${config.cfg.LEAD_INTERESTS}.board`]: item.board,

                [`${config.cfg.LEAD_INTERESTS}.school`]: item.school,

                [`${config.cfg.LEAD_INTERESTS}.class`]: item.class,

                [`${config.cfg.LEAD_INTERESTS}.createdAt`]: item.createdAt,

                [`${config.cfg.LEAD_INTERESTS}.updatedAt`]: item.updatedAt,
            }
            transactionalLogs.push(obj);


        })
        return transactionalLogs;
    }
    catch (err) {
        console.log(err, ':: error inside interest transactional log controls');
    }
}

const createLeadInterest = (params) => {
    return LeadInterest.insertMany(params);
}

const updateLeadInterestOwner = (leadIds, params) => {
    let query = { schoolId: { $in: leadIds } }
    return LeadInterest.updateMany(query, params)
}

const updateSingleLeadInterestOwner = (query, params) => {
    return LeadInterest.updateOne(query, params)
}

const getInterestIdList = async (params) => {
    let { childRoleNames } = params;
    let interestIdArray = [];
    let query = {};
    
    if (childRoleNames && childRoleNames.length > 0) {
        query.assignedTo_role_name = {
            $in: childRoleNames
        }
    }
    const result = await LeadOwner.find(query);
    result.map(item => {
        interestIdArray.push(item?.leadInterestId);
    })
    return interestIdArray;
}

const getOwnerInterestList = async (params) => {
    let { interestIdArr, pageNo, count, sortKey, sortOrder, search, priority } = params;
    let sort = { updatedAt: -1 };
    let query = {};
    if (interestIdArr && interestIdArr.length > 0) {
        query.leadId = {
            $in: interestIdArr
        }
    }
    if (priority){
        query.priority = priority
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
    if (search) {
        query = {
            ...query,
            $or: [{ schoolName: { $regex: search, $options: 'i' } },
            { learningProfile: { $regex: search, $options: 'i'} }]
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
    const result = await LeadInterest.find(query).sort(sort)
        .skip(pageNo * count).limit(count).lean();
    return result;
}

const getOwnerInterestList1 = async (params) => {
    let { interestIdArr, pageNo, count, sortKey, sortOrder, search, priority } = params;
    let sort = { updatedAt: -1 };

    let query = {};
    let searchquery = {};
    if (interestIdArr && interestIdArr.length > 0) {
        query.leadId = {
            $in: interestIdArr
        }
    }
    if (priority) {
        query.priority = priority
    }
    if (search) {
        searchquery = {
            ...searchquery,
            $or: [{
                ['school_info.schoolName']: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                ['school_info.schoolCode']: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                ['school_info.oldSchoolCode']: {
                    $regex: search,
                    $options: 'i'
                }
            },
            ]
        }
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
    const result = await LeadInterest.aggregate([
        { $match: query },
        {
            $lookup: {
                from: "schools",
                localField: "schoolId",
                foreignField: "leadId",
                as: "school_info",
            }
        },
        {
            $unwind: {
                path: "$school_info",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: searchquery
        },
        {
            $project: {
                _id: 0,
                learningProfile: 1,
                leadId: 1,
                stageName: 1,
                edc: 1,
                edcCount: 1,
                softwareContractValue: 1,
                statusName: 1,
                schoolId: 1,
                school_info: 1,
                // school_info: {
                //     schoolName: 1
                // }
            }
        },
        {
            $sort: sort
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

const getSchoolInterests = async (params) => {
    let { schoolId } = params;
    const result = await LeadInterest.find({schoolId}).lean();
    return result;
}

const getMultipleSchoolInterests = async (params) => {
    let {schoolIdArr} = params;

    const result = await LeadInterest.aggregate([
        { $match: 
            {
                schoolId: {$in:schoolIdArr}
            }
        },
        {
            $group: {
                _id: "$schoolId",
                documents: { $push: "$$ROOT" }
            }
        }
    ]);
    return result;
}

const getOwnerInterest = async (params) => {
    let { schoolId, roleName } = params;
    let query = {
        schoolId,
        assignedTo_role_name: roleName
    }
    const result = await LeadInterest.find(query);
    return result;
}

const getHotsPipelineResult = async (params) => {
    let { childList } = params;

    let queryHots = { priority: 'HOTS' };
    let queryPipeline = { priority: 'Pipeline' };
  
    let childRolesNames = childList?.map((roleObj) => roleObj?.roleName);
  
    if (childRolesNames && childRolesNames?.length > 0) {
      queryHots.assignedTo_role_name = { $in: childRolesNames };
      queryPipeline.assignedTo_role_name = { $in: childRolesNames }
    }
  
    const hotsResult = await LeadInterest.aggregate([
      {
        $match: queryHots
      },
      {
        $group: {
          _id: "$assignedTo_role_name",
          hotsValue: { $sum: '$netContractValue' },
          records: {
            $push: "$$ROOT"
          }
        }
      }
  
    ])
  
    const pipelineResult = await LeadInterest.aggregate([
      {
        $match: queryPipeline
      },
      {
        $group: {
          _id: "$assignedTo_role_name",
          pipelineValue: { $sum: '$netContractValue' }
        }
      }
    ])
    return { hotsResult, pipelineResult };
  }

const getUserHotsPipeline = async (params) => {
    let { roleName } = params;
    let query = { assignedTo_role_name: roleName, priority: {$in: ['HOTS', 'Pipeline']} };

    const result = await LeadInterest.aggregate([
        {
            $match: query
        },
        {
            $group: {
              _id: "$learningProfile",
              netContractValue: { $sum: '$netContractValue' },
              totalUnit: { $sum: '$unit' },
              records: { $push: "$$ROOT" }
            }
          },{
            $project: {
                "_id": 1,
                "netContractValue": 1,
                "totalUnit": 1,
                "records": 1
            }
          }
        
    ])
    return result;
}

const getHotsPipelineData = async (params) => {
    let { childList } = params;
    let date = new Date();
    let start = new Date(date.getFullYear(), date.getMonth(), 1);
    let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let query = { 
        assignedTo_role_name: { $in: childList }, 
        priority: { $in: ['HOTS', 'Pipeline']},  
        updatedAt: {
            $gte: start,
            $lte: end
        } 
    };
    const result = await LeadInterest.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id:{
                    assignedTo_role_name: "$assignedTo_role_name",
                    learningProfile: "$learningProfile",
                    priority: "$priority"
                },
                totalValue: { $sum: "$netContractValue" }

            }
        }
    ])
    return result;
}

const createSchoolProduct = async (params) => {
    const result = LeadInterest.create(params);
    return result;
}

module.exports = {
    checkLeadInterestTable,
    saveLeadInterest,
    saveNewLeadInterest,
    getLeadInterestDetails,
    updateManyByKey,
    uniqueLeadInterest,
    interestTransactionalLog,
    createLeadInterest,
    updateLeadInterestOwner,
    updateSingleLeadInterestOwner,
    getInterestIdList,
    getOwnerInterestList,
    getSchoolInterests,
    getMultipleSchoolInterests,
    getOwnerInterest,
    getHotsPipelineResult,
    getUserHotsPipeline,
    getHotsPipelineData,
    createSchoolProduct,
}