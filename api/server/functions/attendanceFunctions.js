const attendanceControls = require('../controllers/attendanceControls');
const { MATRIX_TYPE } = require('../constants/dbConstants');

const createAttendanceMatrix = async (params) => {
    let { attendanceMatrixType, attendanceMatrixArray, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, minTarget, maxTarget } = params;
    let bulkInsertArray = [];

    attendanceMatrixArray.map((data) => {
        let matrixObject = { attendanceMatrixType, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, minTarget, maxTarget }

        if (attendanceMatrixType === MATRIX_TYPE.PROFILE) {
            matrixObject.profile_id = data.profile_id;
            matrixObject.profile_code = data.profile_code;
            matrixObject.profile_name = data.profile_name;
        }
        else if (attendanceMatrixType === MATRIX_TYPE.ROLE) {
            matrixObject.profile_id = data.profile_id;
            matrixObject.profile_code = data.profile_code;
            matrixObject.profile_name = data.profile_name;
            matrixObject.role_id = data.role_id;
            matrixObject.role_code = data.role_code;
            matrixObject.role_name = data.role_name;
        }

        bulkInsertArray.push(matrixObject);
    })


    return attendanceControls.createAttendanceMatrix(bulkInsertArray)
        .then(async result => {
            let deletedRolesResult = {}

            if (attendanceMatrixType === MATRIX_TYPE.PROFILE) {
                let updatedProfileName = attendanceMatrixArray?.map(obj => obj?.profile_name)
                let deleteQuery = { attendanceMatrixType: MATRIX_TYPE.ROLE, profile_name: { $in: updatedProfileName } }

                if (updatedProfileName?.length)
                deletedRolesResult = await attendanceControls.deleteManyByQuery(deleteQuery)
            }

            return { message: 'Attendance Matrix Created Successfully', result, deletedRolesResult }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}



const getAttendanceList = async (params) => {
    let AttendanceList = attendanceControls.getAttendanceList(params);
    return Promise.all([AttendanceList])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Attendance Matrix List !', result }
        })
}

const updateAttendance = async (params) => {
    return attendanceControls.updateAttendance(params)
        .then(data => {
            return { message: 'Attendance Matrix updated successfully', data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}

const changeStatus = async (_id, status) => {

    return attendanceControls.changeStatus(_id, status)

        .then(result => {
            return { message: `Status changed`, result }

        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const addActivity = async (params) => {
    return attendanceControls.addActivity(params)
        .then(result => {
            return { message: 'Attendance matrix updated with new activities successfully', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updateActivity = async (params) => {
    return attendanceControls.updateActivity(params)
        .then(result => {
            return { message: 'updated the activities of a role/profile with successfully', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getAttendanceDetails = async (id) => {
    return attendanceControls.getAttendanceDetails(id)
        .then(result => {
            return { message: `Attendance details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getMinMaxTarget = async (id) => {
    return attendanceControls.getMinMaxTarget(id)
        .then(result => {
            return { message: `Min Max Target`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}
module.exports = {
    createAttendanceMatrix,
    getAttendanceList,
    updateAttendance,
    addActivity,
    updateActivity,
    changeStatus,
    getAttendanceDetails,
    getMinMaxTarget

}