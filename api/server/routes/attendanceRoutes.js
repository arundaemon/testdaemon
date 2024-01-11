const express = require('express');
const router = require('express-promise-router')();
const responseHandler = require('../utils/responseHandler');
const attendanceFunctions = require('../functions/attendanceFunctions');

router.put('/createAttendanceMatrix', async (req, res) => {
    return attendanceFunctions.createAttendanceMatrix({ ...req.body })
        .then((result) => {
            return responseHandler.sendSuccess(res, result, req);
        })
        .catch((error) => {
            return responseHandler.sendError(res, error, req);
        })
});

router.get('/getAttendanceList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder } = req.query
    let { tokenPayload } = req;
    return attendanceFunctions.getAttendanceList({ search, pageNo, count, sortKey, sortOrder })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
});



router.put('/updateAttendance', async (req, res) => {
    let { _id, minTarget, maxTarget, modifiedBy, modifiedBy_Uuid, status } = req.body;
    let { tokenPayload } = req;
    return attendanceFunctions.updateAttendance({ tokenPayload, _id, minTarget, maxTarget, modifiedBy, status, modifiedBy_Uuid })
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
});
router.put('/changeStatus', async (req, res) => {

    let { _id, status } = req.body;

    return attendanceFunctions.changeStatus( _id, status )

        .then(result => responseHandler.sendSuccess(res, result, req))

        .catch(error => responseHandler.sendError(res, error, req))

})

router.put('/changeStatus', async (req, res) => {
    let { _id, status } = req.body;
    return attendanceFunctions.changeStatus( _id, status )
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})

router.get('/attendanceDetails/:id', async (req, res) => {
    let { tokenPayload } = req;
    let { id } = req.params;   
        
    return attendanceFunctions.getAttendanceDetails(id)
        .then(result => responseHandler.sendSuccess(res, result, req))
        .catch(error => responseHandler.sendError(res, error, req))
})


router.put('/addActivity', async (req, res) => {
    let { _id, activities} = req.body;
    
    let { tokenPayload } = req;

    return attendanceFunctions.addActivity({ tokenPayload, _id, activities})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.put('/updateActivity', async (req, res) => {
    
    let { tokenPayload } = req;

    return attendanceFunctions.updateActivity({ tokenPayload, ...req.body})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })
})

router.get('/getMinMaxTarget', async (req, res) => {
    let { tokenPayload } = req;
    let { role_name, profile_name } = req.query;
    return attendanceFunctions.getMinMaxTarget({ tokenPayload, role_name, profile_name})
    .then( result => {
        return responseHandler.sendSuccess(res, result, req)
    })
    .catch( error => {
        return responseHandler.sendError(res, error, req)
    })

})



module.exports = router;