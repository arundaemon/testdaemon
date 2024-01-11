const RoleBasedAttendanceMatrix = require('../models/roleBasedAttendanceActivitiesModel');

const createRoleBasedAttendanceMatrix =  async (params) => {
        const result2 = await RoleBasedAttendanceMatrix.create(params);
        return result2;
}

const getRoleBasedAttendanceMatrixById =  async (params) => {
    // console.log("params inside",params)
    let { ID } = params
    let query = { ID }
    const result= await RoleBasedAttendanceMatrix.find(query);
    return result;
}

const deleteRoleBasedAttendanceMatrixById =  async (params) => {
    // console.log("params inside",params)
    let { ID } = params
    let query = { ID }
    const result= await RoleBasedAttendanceMatrix.deleteMany(query);
    return result;
}

const clearRoleBasedAttendanceMatrix =  async (params) => {
    // console.log("params inside",params)
    const result= await RoleBasedAttendanceMatrix.deleteMany(params);
    return result;
}
// roleBasedAttendanceMatrixControls

const updateRoleBasedAttendanceMatrixById =  async (params) => {


    let data = [...params];
    let dataForUpdate = [];
    let dataForDelete = [];

    data.forEach(item => {
        const {status} = item;
        if(parseInt(status)){
            const { ID } = item;
            let { id, ...updateLatest } = item;
            let query = { id, ID};
            let update = {
                ...updateLatest
            };
            let options = { new: true, upsert: true};
            dataForUpdate.push(RoleBasedAttendanceMatrix.findOneAndUpdate(query,update,options));
        }else{
            let { id,ID } = item;
            let query = { id , ID};
            dataForDelete.push(RoleBasedAttendanceMatrix.findOneAndDelete(query))
        }
    })
    const result = await Promise.allSettled([...dataForDelete,...dataForUpdate]);
    return result

}

const findByIdAndDelete =  async (params) => {
    // console.log("params inside",params)
    let { id,ID } = params;
    let query = { id , ID}
    const result= await RoleBasedAttendanceMatrix.findOneAndDelete(query);
    // console.log("result inside update",result)
    return result;
}

module.exports={
    createRoleBasedAttendanceMatrix,
    getRoleBasedAttendanceMatrixById,
    deleteRoleBasedAttendanceMatrixById,
    updateRoleBasedAttendanceMatrixById,
    clearRoleBasedAttendanceMatrix,
    findByIdAndDelete
}