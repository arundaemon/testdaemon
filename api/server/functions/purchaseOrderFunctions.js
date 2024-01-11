const purchaseOrderControls = require('../controllers/purchaseOrderControls')
const quotationFunctions = require('../functions/quotationFunctions')
const { uploadImage, generatePdfFromCdn } = require('../middlewares/fileUploader')
const customExceptions = require('../responseModels/customExceptions')
const implementationFormFunctions = require("../functions/implementationFormFunctions");
const { CRM_PROFILE } = require('../constants/dbConstants');
const axios = require("axios");
const archiver = require('archiver');
const fs = require('fs');

const uploadPurchaseOrderToGCP = async (params) => {
    let { image } = params
    let iconsFolderPath = "crm-purchaseOrder/"

    return uploadImage(image, iconsFolderPath)
        .then(result => {
            return { message: 'File Uploaded Successfully', result }
        })
}

const createPurchaseOrder = async ({ params, reqHeaders }) => {
    try {
        let purchaseOrderCode = await purchaseOrderControls.getPurchaseOrderCode(params);
        params.purchaseOrderCode = purchaseOrderCode;

        let payload = params?.assignApprovalData;
        payload = { ...payload, referenceCode: purchaseOrderCode };

        const isDuplicate = await purchaseOrderControls.isDuplicatePo(params.quotationCode);

        if (isDuplicate) {
            throw customExceptions.purchaseOrderExists();
        }

        const addPurchaseOrder = await purchaseOrderControls.createPurchaseOrder(params);

        try {
            let url = "https://qa-crm-api.extramarks.com/salesApproval/assignApprovalRequest";
            let headers = {
                accesstoken: reqHeaders.accesstoken,
            };

            await axios.post(url, payload, { headers });

            return { message: `Purchase Order Created Successfully`, result: [addPurchaseOrder] };
        } catch (err) {
            throw err;
        }
    } catch (error) {
        throw error;
    }
};




const getPurchaseOrderList = async (params) => {
    let PurchaseOrderList = purchaseOrderControls.getPurchaseOrderList(params);
    return Promise.all([PurchaseOrderList])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Purchase Order List!', result }
        })
}

const deletePurchaseOrder = async (params) => {
    return purchaseOrderControls.deletePurchaseOrder(params)
        .then(result => {
            return { message: `Purchase Order Deleted Successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getPurchaseOrderDetails = async (id) => {
    return purchaseOrderControls.getPurchaseOrderDetails(id)
        .then(result => {
            return { message: `Purchase Order details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getPOListBySchoolCode = async (id) => {
    return purchaseOrderControls.getPOListBySchoolCode(id)
        .then(result => {
            return { message: `Purchase Order details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updatePurchaseOrderStatus = async (params) => {
    return purchaseOrderControls.updatePurchaseOrderStatus(params)
        .then(result => {
            return { message: `Purchase Order Status Updated`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const updatePurchaseOrderApprovalStatus = async (params, headers, tokenPayload) => {
    return purchaseOrderControls.updatePurchaseOrderApprovalStatus(params)
        .then(async (result) => {
            let flag = calculateTotalAdvance(result);
            if (params?.status.toLowerCase() === "rejected") {
                let query = { quotationCode: params.quotationCode, isPoGenerated: false }
                let update = { isPoGenerated: false }
                return quotationFunctions.updateIsPoGenerated(query)
            } if (params?.status.toLowerCase() === "approved" && params?.modifiedByProfileName.includes(`${CRM_PROFILE.FINANCE}`) && result?.isAdvance && flag) {
                // await implementationFormFunctions.updateImpByPOApproval(params, headers, tokenPayload)
                await addAdvancePayment(result, headers, tokenPayload);
            }
            return { message: `Purchase Order Approval Status Updated`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const calculateTotalAdvance = (data) => {
    let total = 0;
    data?.advanceDetailsMode.map(item => {
        total += Number(item?.bankAmount)
    })
    if (total === (data?.totalAdvanceHardwareAmount + data?.totalAdvanceSoftwareAmount)) return true;
    else return false;
}

const addAdvancePayment = async (params, reqHeaders, tokenPayload) => {
    let payload = {
        uuid: params?.modifiedByUuid,
        school_code: params?.schoolCode,
        quotation_code: params?.quotationCode,
        po_code: params?.purchaseOrderCode,
        total_hw_advance_amount: params?.totalAdvanceHardwareAmount,
        total_sw_advance_amount: params?.totalAdvanceSoftwareAmount,
        payment_date: params?.advanceDetailsMode[0]?.paymentDate,
        payment_details: getValue(params)
    };
    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addAdvancePaymentDetails`;
    let headers = {
        Authorization: reqHeaders.authorization
    };

    try {
        let response = await axios.post(url, payload, { headers });
    } catch (err) {
        console.log(err, ":: error inside add advance payment......");
        throw { errorMessage: err }
    }
}

const getValue = (data) => {
    let arr = [];
    data?.advanceDetailsMode.map(item => {
        let obj = {
            payment_mode_id: item?.paymentModeId,
            receiver_bank_id: item?.reciever_bank_id,
            payment_evidence_file_path: item?.paymentProofUrl,
            deposit_amount: item?.bankAmount,
            payment_evidence_no: item?.advanceDetailsRefNo
        }
        arr.push(obj);
    });
    return arr;
}

const generatePaymentProofZip = async (params) => {
    try {
        let { cdnPaths } = params;
        const pdfDocs = await Promise.all(cdnPaths.map(generatePdfFromCdn));
        const zipBuffer = await createZip(pdfDocs);
        const localPath = './PaymentProof.zip';
        fs.writeFileSync(localPath, zipBuffer);
    } catch (err) {
        console.log(err, ':: error in generate pdf zip');
        throw { errorMessage: err };
    }
};

const createZip = async (pdfDocs) => {
    try {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const buffers = [];

        archive.on('data', (buffer) => buffers.push(buffer));
        archive.on('error', (err) => console.error('Error creating ZIP:', err));

        for (let i = 0; i < pdfDocs.length; i++) {
            const pdfDoc = pdfDocs[i];
            const pdfBytes = await pdfDoc.save();
            const pdfBuffer = Buffer.from(pdfBytes);
            archive.append(pdfBuffer, { name: `File_${i + 1}.pdf` });
        }

        archive.finalize();

        await new Promise((resolve) => archive.on('end', resolve));

        const zipBuffer = Buffer.concat(buffers);

        return zipBuffer;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
  




module.exports = {
    createPurchaseOrder,
    getPurchaseOrderList,
    uploadPurchaseOrderToGCP,
    deletePurchaseOrder,
    getPurchaseOrderDetails,
    getPOListBySchoolCode,
    updatePurchaseOrderStatus,
    updatePurchaseOrderApprovalStatus,
    generatePaymentProofZip
}