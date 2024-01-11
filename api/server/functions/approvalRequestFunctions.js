const approvalRequestControls = require('../controllers/approvalRequestControls');
const userClaimControls = require('../controllers/userClaimControls');
const customExceptions = require('../responseModels/customExceptions');
const hierachyFunctions = require('../functions/hierachyFunctions');
const ApprovalRequest = require('../models/approvalRequestModel');
const { CLAIM_STATUS } = require('../constants/dbConstants');

const createRequest = async (params) => {
  return approvalRequestControls.createRequest(params)
    .then(data => {
      return { message: `Request created successfully`, data }
    })
    .catch(error => {
      throw error
    })
}

const getRequestList = async (params) => {
  let RequestList = approvalRequestControls.getRequestList(params);
  let TotalRequestCount = approvalRequestControls.getRequestListCount(params);
  return Promise.all([RequestList, TotalRequestCount])
    .then(response => {
      let [result, totalCount] = response
      return { message: 'Request List !', result, totalCount }
    })
    .catch(error => {
      console.log(error,'............inside request list');
      throw error
    })
}

const getRequestDetails = async (id) => {
  return approvalRequestControls.getRequestDetails(id)
    .then(result => {
      return { message: `Request details`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getCumulativeReqToReject = async (params) => {
  const reqList = [];
  const result = await approvalRequestControls.getRequestByEmpCode(params);
  result?.map(item => {
    let obj = {
      _id: item?._id,
      approver_roleName: item?.approver_roleName,
      approver_empCode: item?.approver_empCode,
      requestId: item?.requestId,
      requestStatus: 'REJECTED',
      remarks: params?.remarks                          // from where
    };
    reqList.push(obj);
  })
  return reqList;

}

const approveReject = async (params) => {
  let { requestList, empCodeList } = params;
  const results = [];
  if (empCodeList && empCodeList.length > 0) {
    requestList = await getCumulativeReqToReject(params);
  }

  await Promise.all(
    requestList.map(async (item) => {
      const { result } = await getRequestDetails(item._id);
      if (result?.requestStatus === 'NEW' && result?.requestId === item.requestId && result?.approver_roleName === item.approver_roleName) {
        // if (result?.requestedForId !== item?.loggedInId) {
        //   throw customExceptions.unauthorizeAccess();
        // }

        const claimResult = userClaimControls.updateClaim({
          claimId: result?.requestId,
          claimStatus: item?.requestStatus,
          approvedDate: new Date(),
          statusModifiedByRoleName: item?.approver_roleName,
          statusModifiedByEmpCode: item?.approver_empCode,
          remarks: item?.remarks
        });
        const approvalRequestResult = approvalRequestControls.approveReject(item);
        approvalRequestControls.updateCurrentStatus({requestId: item?.requestId, currentStatus: item?.requestStatus})

        try {
          const [claimRes, requestRes] = await Promise.allSettled([
            claimResult,
            approvalRequestResult
          ]);
          results.push({
            // message: 'Success',
            claimResult: claimRes,
            requestResult: requestRes
          });
        } catch (error) {
          throw { errorMessage: error };
        }
      }
    })
  );

  return { result: results, status: 'success' };
};

const reassignRequest = async (params) => {
  try {
    let { requestList } = params;
    let promises = [];
    if (requestList && (requestList.length > 0)) {
      requestList?.map(item => {
        let obj = {
          _id: item?._id,
          approver_empCode: item?.approver_empCode,
          approver_name: item?.approver_name,
          approver_roleId: item?.approver_roleId,
          approver_roleName: item?.approver_roleName,
          approver_profileName: item?.approver_profileName
        }
        const result = approvalRequestControls.reassignRequest(obj);
        promises.push(result);
      })
      return Promise.allSettled(promises)
        .then((result) => {
          return { message: `Request Reassigned Successfully`, result }
        })
        .catch((error) => {
          console.error(error, '.....err inside log meeting ');
          throw { errorMessage: error }

        });
    }
    else {
      return approvalRequestControls.reassignRequest(params)
        .then(result => {
          return { message: ` Request Reassigned Successfully`, result }
        })
        .catch(error => {
          throw { errorMessage: error }
        })
    }
  } catch (err) {
    throw err
  }

}

const createNewApprovalRequest = async (params) => {
  try {
    let { _id, requestId } = params;
    let count = await ApprovalRequest.countDocuments();
    let newCount = count + 1;

    let requestDetails = await approvalRequestControls.getRequestDetails(_id);

    let hierachyParams = { roleName: requestDetails?.requestBy_roleId };
    const managerResponse = await hierachyFunctions.getHierachyDetails(hierachyParams);
    const hierarchyResult = managerResponse?.result;
    const approverDetails = getApproverDetails(hierarchyResult);

    let requestObj = {
      ...approverDetails,
      requestId: requestId,
      requestNumber: `REQ-${newCount}`,
      requestBy_roleId: requestDetails?.requestBy_roleId,
      requestBy_empCode: requestDetails?.requestBy_empCode,
      requestBy_name: requestDetails?.requestBy_name,
      requestType: requestDetails?.requestType,
      metaInfo: requestDetails?.metaInfo?.[0],
      requestStatus: 'NEW',
      // createdAt: new Date(),
      raisedDate: requestDetails?.raisedDate,
      shortDescription: requestDetails?.shortDescription
    }

    const result = await approvalRequestControls.createNewRequest(requestObj);
    return result;
  }
  catch (err) {
    console.log(err, "::: error inside app functions");
    throw err
  }


}

const getParentsArray = (data) => {
  let parentsArray = [];
  let parent = data?.roleName;
  parentsArray.push(parent);
  if (data?.parents) {
    const nestedParentsArray = getParentsArray(data?.parents);
    parentsArray = parentsArray.concat(nestedParentsArray);
  }
  return parentsArray;

}

const findRequest = async (params) => {
  let { requestId, approver_roleName } = params;
  let query = { requestId, approver_roleName, requestStatus: 'NEW' };
  const result = await ApprovalRequest.findOne(query);
  if (result) return true;
  else return false;
}

const getCumulativeReqToApprove = async (params) => {
  let reqList = [];
  const result = await approvalRequestControls.getRequestByEmpCode(params);
  result?.map(item => {
    let obj = {
      _id: item?._id,
      approver_roleName: item?.approver_roleName,
      approver_empCode: item?.approver_empCode,
      requestId: item?.requestId,
      requestStatus: 'APPROVED',
      remarks: params?.remarks //-----------------------remark
    };
    reqList.push(obj);
  })
  return reqList;
}

const approveClaimRequest = async (params) => {
  let { requestList, empCodeList } = params;
  let currentStatus;
  let reqCurrentStatus;
  if (empCodeList && empCodeList.length > 0) {
    requestList = await getCumulativeReqToApprove(params);
  }
  const managerResponse = await hierachyFunctions.getHierachyDetails({ roleName: 'CBO' });
  const hierarchyResult = managerResponse?.result;

  try {
    const results = [];
    for (let params of requestList) {
      let {
        _id,
        approver_roleName,
        approver_empCode,
        requestId,
        requestStatus,
        remarks,
        approverProfile,
        approvedAmount
      } = params;
      let parentsArray = getParentsArray(hierarchyResult);
      parentsArray.push('CBO');
      // let profile = getProfileName(approverProfile, approver_roleName);
      const request = await findRequest(params);
      // console.log(request, '...................................req -------------------');
      if (request) {
        const approveRequestStatus = await approvalRequestControls.approveReject({
          _id,
          requestStatus,
          remarks,
        });
        if (!(parentsArray.includes(approver_roleName))) {
          currentStatus = `${CLAIM_STATUS.PENDING_AT_CBO}`;
          const changeClaimRequest = await userClaimControls.updateClaim({
            claimId: requestId,
            statusModifiedByRoleName: approver_roleName,
            statusModifiedByEmpCode: approver_empCode,
            approvedAmount,
            claimStatus: currentStatus,
            remarks: remarks,
          });
          const newRequest = await createNewApprovalRequest({ _id, requestId });
          results.push({
            status: 'success',
            approveRequestStatus,
            changeClaimRequest,
            newRequest,
          })
        } else {
          currentStatus = `${CLAIM_STATUS.PENDING_AT_FINANCE}`;
          const changeClaimRequest = await userClaimControls.updateClaim({
            claimId: requestId,
            statusModifiedByRoleName: approver_roleName,
            statusModifiedByEmpCode: approver_empCode,
            approvedAmount,
            claimStatus: currentStatus,
            remarks: remarks,

          });
          results.push({
            status: 'success',
            approveRequestStatus,
            changeClaimRequest,
          })
        }
        approvalRequestControls.updateCurrentStatus({currentStatus, requestId:params.requestId});
      }

    }

    return {
      status: 'success',
      results
    };
  } catch (err) {
    console.log(err, ':: err inside approve claim requests');
    throw err;
  }
};



const getApproverDetails = (data) => {
  //let profileString = data?.roleName.substring(0, 3);
  let profileString = data?.profileName;
  if (profileString === 'CBO') {
    let result = {
      approver_roleId: data?.["roleID"],
      approver_empCode: data?.["userName"],
      approver_name: data?.["displayName"],
      approver_roleName: data?.["roleName"],
      approver_profileName: data?.["profileName"],
    }
    return result;
  }
  else if (data?.parents) {
    return getApproverDetails(data?.parents)
  }
  else {
    console.log({ message: "No profile found" });
  }
}

// const getProfileName = (approverProfile, approver_roleName) => {
//   let approverProfileLength = approverProfile.length;
//   let profile = approver_roleName.substring(0, approverProfileLength);
//   return profile;
// }

module.exports = {
  createRequest,
  getRequestList,
  getRequestDetails,
  approveReject,
  reassignRequest,
  approveClaimRequest,
}