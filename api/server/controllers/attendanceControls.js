const { isValidObjectId } = require('mongoose');
const Attendance = require('../models/attendanceMatrixModel');
const utils = require('../utils/utils');

const createAttendanceMatrix = async (data) => {

    let dataPromises = data.map(attendance => {

        let query = {}
        if (attendance?.attendanceMatrixType === 'ROLE') {
            query.role_name = attendance?.role_name
        }

        if (attendance?.attendanceMatrixType === 'PROFILE') {
            query.profile_name = attendance?.profile_name
        }

        let update = { ...attendance }
        let options = { new: true, upsert: true, setDefaultsOnInsert: true }
        return Attendance.findOneAndUpdate(query, update, options);
    })

    const result = await Promise.allSettled(dataPromises);
    return result
}



const getAttendanceList = async (params) => {
    let { pageNo, count, sortKey, sortOrder, search } = params
    let sort = { created: -1 };
    let query = { isDeleted: false }

    if (search) {
        query = {
            ...query,
            $or: [{ profile_name: { $regex: search, $options: 'i' } },
            { role_name: { $regex: search, $options: 'i' } }]
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

    const result = await Attendance.find(query).populate('activityId')
        .sort(sort).skip(pageNo * count).limit(count).lean();
    return result;

}

const updateAttendance = async (params) => {
    let { _id, maxTarget, minTarget, modifiedBy, modifiedBy_Uuid, status } = params;
    let update = {};
    let options = { new: true };

    if (maxTarget) {
        update.maxTarget = maxTarget;
    }

    if (minTarget) {
        update.minTarget = minTarget;
    }

    if (!utils.isEmptyValue(status)) {
        update.status = status;
    }

    if (modifiedBy) {
        update.modifiedBy = modifiedBy;
    }

    if (modifiedBy_Uuid) {
        update.modifiedBy_Uuid = modifiedBy_Uuid;
    }

    const result = await Attendance.findOneAndUpdate({ _id }, update, options);
    return result;
}


const changeStatus = async (_id, status) => {
    let options = { new: true };
    let update = { status: status };
    return Attendance.findOneAndUpdate({ _id }, update, options);
}

const addActivity = async (params) => {
    let { _id, activities } = params;
    let update = { activities: activities }
    let options = { new: true };
    const result = await Attendance.findOneAndUpdate({ _id: _id }, update, options)
    return result;
}

const updateActivity = async (params) => {
    let update = {};
    let options = { new: true };
    let query = {};

    query._id = params._id;
    query["activities._id"] = params.activityId;

    update = { $set: { "activities.$.minTarget": params.minTarget, "activities.$.status": params.status } }

    const result = await Attendance.findOneAndUpdate(query, update, options);
    return result;
}

const getAttendanceDetails = async (id) => {
    const result = await Attendance.findById({ _id: id });
    return result;
}


const deleteManyByQuery = async (query) => {
    return Attendance.deleteMany(query);
}

const getMinMaxTarget = async (params) => {
    let { role_name, profile_name } = params;
    
    let data = await Attendance.find({role_name,status:1}).lean();
    if(data.length === 0){
        data = await Attendance.find({profile_name,status:1}).lean();
    }
    if(data.length !== 0){
        data.map(item => {
            item['Attendances.minTarget'] = item.minTarget;
            item['Attendances.maxTarget'] = item.maxTarget;
        })
    }
    return data;   
    
}


module.exports = {
    createAttendanceMatrix,
    getAttendanceList,
    updateAttendance,
    addActivity,
    updateActivity,
    changeStatus,
    getAttendanceDetails,
    deleteManyByQuery,
    getMinMaxTarget
}