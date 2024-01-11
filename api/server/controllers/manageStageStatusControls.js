const { resolve } = require('path');
const Stages = require('../models/manageStageModel');
const utils = require('../utils/utils');

const manageStageStatusControls = async (params) => {
    let addedList = params.addList
    let deletedList = params.deleteList
    if (deletedList.length > 0) {
        let delRes = await Stages.deleteMany({ _id: { $in: deletedList } }).catch(
            err => {
                throw { errorMessage: err }
            }
        )
    }
    if (addedList.length > 0) {
        let updateArr = addedList.filter(obj => obj._id)
        if (updateArr.length > 0) {
            for (let obj of updateArr) {
                let res = await Stages.findOneAndUpdate({ _id: obj._id }, obj)
                //console.log(res)
            }
        }
        let addList = addedList.filter(obj => !obj._id)
        //console.log(updateArr,addList)
        if (addList.length > 0) {
            let res = await Stages.insertMany(addList)
            //console.log(res)
        }
        return { msg: 'success' }
    } else {
        return { msg: 'Success' }
    }
}

const getStageStatusById = async (params) => {
    // let query= {journeyId}
    // let sort = { created: -1 }
    let query = { journeyId: params.journeyId }
    //console.log("query",query);

    return Stages.find(query)
        .populate('journeyId')
        .populate('selectCycle')
        .populate('fromStage')
        .populate('fromStatus')
        .populate('toStage')
        .populate('toStatus')
        // .sort(sort)
        .lean();


}

const getTreeList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search, journeyId } = params
    let sort = { createdAt: 1 };
    let query = {}
    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }

    if (search && search.key) {
        query[search.key] = search.value
    }

    if(journeyId){
        query['journeyId'] = journeyId
    }

    if (utils.isEmptyValue(count)) {
        count = 9999
    } else {
        count = parseInt(count);
    }

    return Stages.find(query)
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
}

const getList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { createdAt: 1 };
    let query = {}
    if (utils.isEmptyValue(pageNo)) {
        pageNo = 0
    } else {
        pageNo = parseInt(pageNo)
    }

    if (search && search.key) {
        query[search.key] = search.value
    }

    if (utils.isEmptyValue(count)) {
        count = 9999
    } else {
        count = parseInt(count);
    }

    return Stages.find(query)
        .populate('ruleId')
        .sort(sort)
        .skip(pageNo * count).limit(count).lean();
}

const getPreviewMapById = async () => {
    // let query= {journeyId}
    // let sort = { created: -1 }
    // let query={journeyId:params.journeyId}
    // console.log("query",query);

    return Stages.findOne({})


}

module.exports = {
    manageStageStatusControls,
    getStageStatusById,
    getPreviewMapById,
    getTreeList,
    getList
};