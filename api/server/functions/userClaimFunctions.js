const myClaimControls = require('../controllers/userClaimControls');
const MyClaim = require('../models/userClaimModel');
const mongoose = require('mongoose');
const { uploadImage } = require('../middlewares/fileUploader');
const approvalRequestControls = require('../controllers/approvalRequestControls');

const createMyClaim = async (req) => {
    try{
   
    let {  schoolCode, schoolName, visitNumber, visitPurpose, visitDate, requestedBy,requestBy_roleId, requestBy_name, requestBy_uuid, requestBy_ProfileName, requestBy_empCode, expenseType, unit, unitLabel, claimAmount, leadId, visitTimeIn, visitTimeOut, field ,remarks, claimRemarks} = req.body;
    let fieldLabel;
    let fieldValue;
    if(field){
     field = JSON.parse(field);
     fieldLabel = field.label;
     fieldValue = field.value;

    }
    const count = await MyClaim.countDocuments();
    const newCount = count + 1;
    let claimId = `CLAIM-${newCount}`;


        let billFile = ''
        if (req?.file) {
            billFile = await uploadImage(req?.file, 'crm-claim-bill/', requestBy_empCode);
        }


    
    return myClaimControls.createMyClaim({  claimStatus: 'PENDING AT BUH',schoolCode, fieldLabel, fieldValue, schoolName, visitNumber, visitPurpose, visitDate, claimId, requestedBy,requestBy_roleId, requestBy_name, requestBy_uuid, requestBy_ProfileName, requestBy_empCode, expenseType, unit,unitLabel, claimAmount, leadId, billFile, visitTimeIn, visitTimeOut, field ,remarks, claimRemarks })
        .then(result => {
            if(result)  return { message: `Claim Created Successfully`, result }
            else return { message: 'Parent hierarchy missing', result:null}

        })
        .catch(error => {
            throw { errorMessage: error }
        })
    }
    catch (err) {
        throw err
    }
};

const updateClaim = async (params) => {
    return myClaimControls.updateClaim(params)
        .then(data => {
            approvalRequestControls.updateCurrentStatus({currentStatus: params?.claimStatus, requestId: params?.claimId});
            return { message: `Claim status updated successfully`, data }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const getMyClaimList = async (params) => {
    let ClaimList = myClaimControls.getMyClaimList(params);
    let TotalClaimCount = myClaimControls.getMyClaimListCount(params);
    return Promise.all([ClaimList, TotalClaimCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Claim List', result, totalCount }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
};

const getUserClaimListBySchool = (params) => {
    return myClaimControls.getUserClaimListBySchool(params)
        .then(result => {
            return { message: `Claim List`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getUserClaimDetails = async (id) => {
    return myClaimControls.getUserClaimDetails(id)
        .then(result => {
            return { message: `User Claim details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const cumulativeClaimList = async (params) => {
    let list = [];
    const result = await myClaimControls.findClaimByEmpCode(params);
    result.map(item => {
        let obj = {
            remarks: params?.remarks,
            claimId: item?.claimId,
            claimStatus: params?.claimStatus,
            approvedAmount: item?.approvedAmount,
            approvedDate: params?.approvedDate,
            modifiedBy: params?.modifiedBy,
            modifiedBy_Uuid: params?.modifiedBy_Uuid,
            statusModifiedByEmpCode: params?.statusModifiedByEmpCode,
            statusModifiedByRoleName: params?.statusModifiedByRoleName
        }
        list.push(obj);
    })
    return list;
}

const bulkUpdate = async (params) => {
    try{
    let { claimList, empCodeList } = params;
    let promises = [];
    if( empCodeList && empCodeList.length > 0 ) {
        claimList = await cumulativeClaimList(params)
    }
    for (let item of claimList) {
        if (!item?.claimId) {
            throw Error('Please provide claim id')
        }
        let query = { claimId: item?.claimId }
        let update = {
            remarks: item?.remarks,
            claimStatus: item?.claimStatus,
            approvedAmount: item?.approvedAmount,
            approvedDate: item?.approvedDate,
            modifiedBy: item?.modifiedBy,
            modifiedBy_Uuid: item?.modifiedBy_Uuid,
            statusModifiedByEmpCode: item?.statusModifiedByEmpCode,
            statusModifiedByRoleName: item?.statusModifiedByRoleName
        }
        const promise = await myClaimControls.bulkUpdate(query, update);
        approvalRequestControls.updateCurrentStatus({currentStatus: item?.claimStatus, requestId: item?.claimId});
        promises.push(promise);
    }
    return Promise.all(promises)
        .then((result) => {
            return { message: `Claims updated successfully`, result }
        })
        .catch((error) => {
            console.error(error, '.....err inside  bulk update claims');
            throw { errorMessage: error, message: error.message }
        });
    }
    catch(error) {
        throw { errorMessage: error , message: error.message}
    }
};

const bulkDelete = async (params) => {
    let { claimList } = params;
    let promises = [];

    for(let item of claimList) {
        if(item.claimStatus === 'PENDING AT BUH' || item.claimStatus === 'PENDING AT L1'){
            const promise = myClaimControls.bulkDelete(item);
            promises.push(promise);
        }
    }
    return Promise.all(promises)
        .then((result) => {
            return { message: `Claims deleted successfully`, result }
        })
        .catch((error) => {
            console.error(error, '.....err inside  bulk delete claims');
            throw { errorMessage: error, message: error.message }
        });
}

const claimList = async (params) => {
    let list = myClaimControls.claimList(params);
    let TotalClaimCount = myClaimControls.claimListCount(params);
    return Promise.all([list, TotalClaimCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Claim List', result, totalCount }
        })
        .catch(error => {
            console.log(error,'...................error in claim list');
            throw { errorMessage: error }
        })
}

module.exports = {
    createMyClaim,
    getMyClaimList,
    updateClaim,
    getUserClaimDetails,
    bulkUpdate,
    bulkDelete,
    getUserClaimListBySchool,
    claimList
}