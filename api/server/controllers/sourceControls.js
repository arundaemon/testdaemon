const Sources = require('../models/sourceModel');
const utils = require('../utils/utils');
const _ = require('lodash');
var mongoose = require('mongoose');


const createSource = async (params) => {
    const count = await Sources.countDocuments();
    const newCount = count + 1;
    params.leadSourceId = `LS-${newCount}`;
    const result = await Sources.create(params);
    return result;
}

const addSubSource = async (params) => {
    let { _id, subSource } = params;
    let findLeadSource = await Sources.findById(_id);
    let index = findLeadSource.subSource.length - 1;
    let i = 1;
    if (findLeadSource.subSource && findLeadSource.subSource[index]) {
        let lastElement = findLeadSource.subSource[index];
        let lastElementSubSourceId = lastElement.leadSubSourceId.split('-')[1];
        i = parseInt(lastElementSubSourceId) + 1;
    }
    subSource.forEach((data) => {
        data.leadSubSourceId = `LSS-${i}`
        //data.createdBy = 'Mohit';
        i++;
    })
    const result = await Sources.findOneAndUpdate({ _id: findLeadSource._id }, { $push: { subSource } }, { new: true });
    return result;
}

const removeSubSource = async (params) => {
    let { _id } = params;
    return Sources.update(
        { _id: mongoose.Types.ObjectId(_id) },
        {
            $pull: { subSource: { leadSubSourceId: params.leadSubSourceId } }
        },
        { safe: true }
    );
}


const deleteSource = async (params) => {
    let { _id } = params;
    let update = { isDeleted: true }
    let options = { new: true }

    return Sources.findOneAndUpdate({ _id }, update, options)
}

const updateSource = async (params) => {
    let { _id, leadSourceName, subSource, modifiedBy, modifiedBy_Uuid } = params;
    let update = {};
    let options = { new: true };

    if (leadSourceName) {
        update.leadSourceName = leadSourceName;
    }

    if (subSource) {
        update.subSource = subSource;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }
    const data = Sources.findOneAndUpdate({ _id }, update, options);
    return data;
}

const getSourceList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 };
    let query = { isDeleted: false }

    if (search) {
        query = {
            ...query,
            $or: [
                { leadSourceName: { $regex: search, $options: 'i' } },
                { leadSourceId: { $regex: search, $options: 'i' } }
            ]
        }
    }

    if (sortKey && sortOrder) {
        sort = { [sortKey]: sortOrder }
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
    const data = await Sources.find(query).sort(sort).skip(pageNo * count).limit(count).lean();
    return data;
}

const getAllSources = async (params) => {
    let { activeSource } = params;
    let query = { isDeleted: false }
    if (activeSource) {
        query.status = 1
    }
    let sort = { name: 1 }
    return Sources.find(query).sort(sort)
}

const changeStatus = async (_id, status) => {
    let options = { new: true };
    let update = { status: status };
    return Sources.findOneAndUpdate({ _id }, update, options);
}

const changeSubSourceStatus = async (params) => {
    let options = { new: true };

    let findLeadSource = await Sources.findById(params._id);
    var index = _.findIndex(findLeadSource.subSource, { leadSubSourceId: params.leadSubSourceId })
    findLeadSource.subSource[index].status = params.status;
    const result = await Sources.findOneAndUpdate({ _id: findLeadSource._id }, { subSource: findLeadSource.subSource }, options);
    return result;

}

const getAllSubSource = async (id) => {
    const data = await Sources.findById(id).select('subSource');
    return data;
}




const getSourceDetails = async (id, subSourceName) => {
    let qur = { _id: id };
    if (subSourceName) {
        qur.subSource = { $elemMatch: { leadSubSourceName: subSourceName } }

    }

    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose.Types.ObjectId(id) } });
    if (subSourceName) {
        pipeline.push({ $unwind: '$subSource' });
        pipeline.push({ $match: { 'subSource.leadSubSourceName': { $regex: subSourceName, $options: 'i' } } });
        pipeline.push({ $group: { _id: '$_id', subSource: { $push: '$subSource' } } })
    }
    let res = await Sources.aggregate(pipeline);
    return res[0];
}

const isDuplicateSource = async (leadSourceName) => {
    let query = { leadSourceName };
    const result = await Sources.findOne(query);
    return result;
}

const allSources = async () => {
    let query = { isDeleted: false }
    let sort = { name: 1 }
    return Sources.find(query).sort(sort).lean()
}


module.exports = {
    createSource,
    updateSource,
    changeStatus,
    getSourceList,
    getAllSources,
    deleteSource,
    getSourceDetails,
    isDuplicateSource,
    addSubSource,
    removeSubSource,
    changeSubSourceStatus,
    getAllSubSource,
    allSources

}