const express = require('express');
const router = require('express-promise-router')();
const multer = require('multer');
const leadFunctions = require('../functions/leadFunctions');
const responseHandler = require('../utils/responseHandler');
const auth = require('../middlewares/auth')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { getCubeTokenCrm } = require('../config/cubeConnection')
const ExcelJS = require('exceljs');

router.post('/uploadLead', [auth.authenticateToken],upload.single("leads"), async (req, res) => {
    let { tokenPayload } = req
    return leadFunctions.bulkUpload(req,tokenPayload)
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            console.log('error', error)
            return responseHandler.sendError(res, error, req)
        })
})

router.get('/downloadSample', async (req, res) => {
    //console.log('enter in download');

    return leadFunctions.downloadSample()
        .then(result => {
            let fileName = 'Sample_Leads.xlsx'
            return responseHandler.sendFileSuccess(res, fileName, req)
        })
        .catch(error => {
            console.log(error, '...errrr');
            return responseHandler.sendError(res, error, req)
        })
})

// router.get('/writeLeadsSample', async (req, res) => {
//     //console.log('enter');
//     try {
//         const cubeResponse = await getCubeTokenCrm(res, req);
//         leadFunctions.writeSample(cubeResponse)
//             .then(result => {
//                 let fileName = 'Sample_Leads.xlsx'
//                 return responseHandler.sendFileSuccess(res, fileName, req)
//             })
//             .catch(error => {
//                 return responseHandler.sendError(res, error, req)
//             })
//     }
//     catch (error) {
//         console.error(error);
//     }

// });

router.get('/getLeadsList', async (req, res) => {
    let { search, pageNo, count, sortKey, sortOrder, campaignId } = req.query
    let { tokenPayload } = req;

    return leadFunctions.getLeadsList({ tokenPayload, search, pageNo, count, sortKey, sortOrder, campaignId })
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

router.post('/multipleLeadTransfer', [auth.authenticateToken], async (req, res) => {
    let { tokenPayload } = req

    return leadFunctions.multipleLeadTransfer({ tokenPayload, ...req.body})
        .then(result => {
            return responseHandler.sendSuccess(res, result, req)
        })
        .catch(error => {
            return responseHandler.sendError(res, error, req)
        })
})

//=================================== MACROS ==========================================================

router.get('/writeMacro', async(req, res) => {
    try {
        const cubeResponse = await getCubeTokenCrm(res, req);
        leadFunctions.writeMacro(cubeResponse)
            .then(result => {
                let fileName = 'Sample_Leads.xlsx';
                return responseHandler.sendFileSuccess(res, fileName, req)
            })
            .catch(error => {
                return responseHandler.sendError(res, error, req)
            })
    }
    catch (error) {
        console.error(error);
    }
    return;   

})


module.exports = router;