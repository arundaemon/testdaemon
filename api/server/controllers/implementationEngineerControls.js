const ImplementationEngineer = require('../models/implementationAssignedEngineerModel');

const assignSsrEngineer = async (params) => {
    let query = { 
        implementationCode: params?.implementationCode,
        type: 'SSR',
    };
    return ImplementationEngineer.findOneAndUpdate(query, params, { upsert: true, new: true });
};

const assignQcEngineer = async (params) => {
    return ImplementationEngineer.create(params);
}

const getEngineerDetails = async (query) => {
    return ImplementationEngineer.find(query).lean();
};

const myAssignedTaskList = async (params) => {
    let query = { 
        type: params?.type,
        assignedEngineerRoleName: params?.assignedEngineerRoleName,
    };
    if (params?.search){
        query.implementationCode =  { $regex: params?.search, $options: 'i' };
    }

    return ImplementationEngineer.find(query).sort({updatedAt:-1}).lean();
};

module.exports = {
    getEngineerDetails,
    assignQcEngineer,
    assignSsrEngineer,
    myAssignedTaskList
}