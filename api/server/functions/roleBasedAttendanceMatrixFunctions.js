const roleBasedAttendanceMatrixControls = require('../controllers/roleBasedAttendanceMatrixControls');
const customExceptions = require('../responseModels/customExceptions')

const createRoleBasedAttendanceMatrix =  async (params) => {

    // console.log("params inside",params)
    const {selectedRoleBasedAttendanceMatrix ,ID} = params;
    const query = { ID }
    try {
            if(selectedRoleBasedAttendanceMatrix.length !== 0){
                    const result1 = await roleBasedAttendanceMatrixControls.getRoleBasedAttendanceMatrixById(query);
                    if(result1.length !== 0){
                        await roleBasedAttendanceMatrixControls.deleteRoleBasedAttendanceMatrixById(query)
                    }
                    const result2 = await roleBasedAttendanceMatrixControls.createRoleBasedAttendanceMatrix([...selectedRoleBasedAttendanceMatrix]);
                    return { message: `RoleBasedAttendanceMatrix created successfully!`, result: result2 }
            
            }else{
                
                    const result3 = await roleBasedAttendanceMatrixControls.clearRoleBasedAttendanceMatrix(query);
                    return { message: `RoleBasedAttendanceMatrix database cleard  successfully!`, result: result3 }
            }
        } catch (error) {
             throw error
        }
}

const getRoleBasedAttendanceMatrixById =  async (params) => {

    return roleBasedAttendanceMatrixControls.getRoleBasedAttendanceMatrixById(params)
    .then(result => {
        return { message: `RoleBasedAttendanceMatrix fetched successfully!`, result }
    })
    .catch(err => {
        throw err
    })
}

const updateRoleBasedAttendanceMatrixById =  async (params) => {

        return roleBasedAttendanceMatrixControls.updateRoleBasedAttendanceMatrixById(params)
        .then(result => {
            return { message: `RoleBasedAttendanceMatrix updated successfully!`, result }
        })
        .catch(err => {
            throw err
        })
}

module.exports= {
    createRoleBasedAttendanceMatrix,
    getRoleBasedAttendanceMatrixById,
    updateRoleBasedAttendanceMatrixById
}