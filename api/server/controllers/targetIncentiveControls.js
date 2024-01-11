const TargetIncentive = require('../models/targetIncentiveModel');

const uploadTargetIncentive = async (data) => {
    let dataPromises = data.map(dataObj => {
        let query = {}
        query.role_name = dataObj.role_name
        let update = { ...dataObj }
        let options = { new: true, upsert: true }
        return TargetIncentive.findOneAndUpdate(query, update, options);
    })

    return Promise.allSettled(dataPromises)
}

const getAllRoleIds = async () => {
    const roleList = await TargetIncentive.find();
    return roleList;
}

const getTargetIncentive = async(params) =>{
    
    let query = {};

    if(params?.role_name){
        query.role_name = JSON.parse(params?.role_name);
        const result = await TargetIncentive.find(query);
        if(result.length > 0){
            return result;
        }
    }

    if(params?.profile_name){
        query.profile_name = params?.profile_name;
        const result2 = await TargetIncentive.find(query);
        return result2;
    }
}

module.exports = {
    uploadTargetIncentive,
    getAllRoleIds,
    getTargetIncentive
}