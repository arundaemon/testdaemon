import { useState, useEffect } from 'react';
import { Container, TextField, Alert, Pagination, Grid, Modal, Divider, Typography, InputAdornment, Box, Tabs, Tab, Button } from "@mui/material";
import _ from 'lodash';
import ReactSelect from 'react-select';
import Page from "../../components/Page";
import Loader from "../Loader";
import { makeStyles } from "@mui/styles";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { getRequestList } from '../../config/services/approvalRequest';
import SearchIcon from '../../assets/icons/icon_search.svg';
import { RequestTable } from '../../components/approvalRequestManagement';
import { getAllParentRoles } from '../../config/services/hrmServices';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { approveRejectThruMapping, approveClaimThruMapping, approveReject, approveClaimRequest } from '../../config/services/approvalRequest';
import { getMappingInfo } from '../../config/services/approvalMapping';
import CubeDataset from '../../config/interface';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '4px',
};

export default function ApproveRejectModal(props) {
    let { rejectApproveModal, checkedLeads, handleRequestCancel, filtersApplied, changeModalState, fetchRequestList, fetchReportRequestList, handleOnChange, comment, rejectBtn, approveBtn } = props;
    const [reqType, setReqType] = useState();
    const [mappingDetails, setMappingDetails] = useState();
    const navigate = useNavigate();

    const getRequestType = () => {
        if (checkedLeads && checkedLeads?.length > 0) {
            if (checkedLeads[0][CubeDataset.ApprovalRequest.requestType]) {
                setReqType(checkedLeads[0][CubeDataset.ApprovalRequest.requestType])
            }
            else {
                setReqType(checkedLeads[0].requestType)
            }
        }
    }
    const validateRemarks = () => {
        if (!comment) {
            toast.error("Enter Comment!");
            return false;
        }

        return true
    }

    const fetchMappingDetails = async () => {
        let params = { approvalType: reqType };
        getMappingInfo(params)
            .then(res => {
                if (res?.result) {
                    setMappingDetails(res?.result);
                }
            })
            .catch(err => {
                console.log(err, ':: error inside fetch mapping details');
            })
    }

    const getRejectData = (checkedLeads) => {
        let requestList = [];
        if (checkedLeads && (checkedLeads.length > 0)) {
            checkedLeads?.map(item => {
                let obj = {
                    _id: item?._id || item?.[CubeDataset.ApprovalRequest._id],
                    approver_roleName: item?.approver_roleName || item?.[CubeDataset.ApprovalRequest.approverRoleName],
                    requestId: item?.requestId || item?.[CubeDataset.ApprovalRequest.requestId],
                    requestStatus: 'REJECTED',
                    remarks: comment //--------------------------------comment
                }
                requestList.push(obj);
            })
        }
        return requestList;
    }

    const handleReject = async (requestList) => {
        let params = { requestList: requestList };
        console.log(params, '.....................reject params');
        if (mappingDetails && mappingDetails?.rejectMetaInfo && mappingDetails?.rejectMetaInfo?.apiUrl) {
            let url = mappingDetails?.rejectMetaInfo?.apiUrl;
            approveRejectThruMapping({ url, params })
                .then(res => {
                    if (res?.status === 'success') {
                        toast.success('Request is rejected')
                    }
                    else {
                        toast.error('Something went wrong')

                    }

                    changeModalState();
                    // fetchRequestList('NEW');
                    localStorage.removeItem("approverRequest");
                    window.location.reload()
                    // const applyFilter = DecryptData(localStorage?.getItem("approverRequest"));
                    // if (applyFilter === null) {
                    //     fetchRequestList('NEW')
                    // }
                    // else if (filtersApplied?.length > 0) {
                    //     fetchReportRequestList()

                    // }
                })
        }
        else {
            approveReject(params)
                .then((res) => {

                    if (res?.status === 'success') {
                        toast.success('Request is rejected')


                    }
                    else {
                        toast.error('Something went wrong')

                    }
                    changeModalState();
                    // fetchRequestList('NEW');
                    // fetchRequestList('NEW');
                    localStorage.removeItem("approverRequest");
                    window.location.reload()
                    // const applyFilter = DecryptData(localStorage?.getItem("approverRequest"));
                    // if (applyFilter === null) {
                    //     fetchRequestList('NEW')
                    // }
                    // else if (filtersApplied?.length > 0) {
                    //     fetchReportRequestList()

                    // }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }
    // console.log(checkedLeads, '.......................checked leads in approve reject page');

    const getApproveData = (checkedLeads) => {
        console.log(checkedLeads, '.......................checked leads');
        let requestList = [];
        if (checkedLeads && (checkedLeads.length > 0)) {
            checkedLeads?.map(item => {
                let obj = {
                    approver_roleName: item?.approver_roleName || item?.[CubeDataset.ApprovalRequest.approverRoleName],
                    approver_empCode: item?.approver_empCode || item?.[CubeDataset.ApprovalRequest.approverEmpCode],
                    requestId: item?.requestId || item?.[CubeDataset.ApprovalRequest.requestId],
                    requestStatus: 'APPROVED',
                    remarks: comment, //--------------------------------comment
                    approverProfile: mappingDetails?.approverProfile,
                    _id: item?._id || item?.[CubeDataset.ApprovalRequest._id]
                }
                requestList.push(obj);
            })
        }
        return requestList;
    }

    const claimApproval = async (requestList) => {
        let params = { requestList };
        console.log(requestList, '...............request list');
        if (mappingDetails && mappingDetails?.approveMetaInfo && mappingDetails?.approveMetaInfo?.apiUrl) {
            let url = mappingDetails?.approveMetaInfo?.apiUrl;
            let method = mappingDetails?.approveMetaInfo?.method;

            approveClaimThruMapping({ url, params })
                .then(res => {
                    if (res?.status === 'success') {
                        toast.success('Request is Approved');
                    }
                    else {
                        toast.error('Something went wrong')
                    }
                    changeModalState();
                    // fetchRequestList('NEW');
                    // fetchRequestList('NEW');
                    localStorage.removeItem("approverRequest");
                    window.location.reload()
                    // const applyFilter = DecryptData(localStorage?.getItem("approverRequest"));
                    // if (applyFilter === null) {
                    //     fetchRequestList('NEW')
                    // }
                    // else if (filtersApplied?.length > 0) {
                    //     fetchReportRequestList()

                    // }

                })
                .catch(err => {
                    console.log(err, ':: error inside single coupon approval');
                })

        }
        else {
            approveClaimRequest(params)
                .then(res => {
                    toast.success('Request is Approved')
                    changeModalState();
                    // fetchRequestList('NEW');
                    // fetchRequestList('NEW');
                    localStorage.removeItem("approverRequest");
                    window.location.reload()
                    // const applyFilter = DecryptData(localStorage?.getItem("approverRequest"));
                    // if (applyFilter === null) {
                    //     fetchRequestList('NEW')
                    // }
                    // else if (filtersApplied?.length > 0) {
                    //     fetchReportRequestList()

                    // }

                })
                .catch(err => {
                    console.log(err, '::: err inside approve claim request');
                })
        }
    }

    const handleSubmit = async () => {
        if (validateRemarks()) {
            if (rejectBtn && checkedLeads && checkedLeads.length > 0) {
                const requestList = getRejectData(checkedLeads);
                handleReject(requestList);
            }
            if (approveBtn && checkedLeads && checkedLeads.length > 0) {
                const requestList = getApproveData(checkedLeads);
                switch (reqType) {
                    case 'Coupon': {
                        // singleCouponApproval();
                        break;
                    }
                    case 'Special Coupon': {
                        // specialCouponApproval();
                        break;
                    }
                    case 'Trial': {
                        // trialRequestApproval();
                        break;
                    }
                    case 'Claim': {
                        claimApproval(requestList);
                        break;
                    }
                    default: {
                        console.log('This is the default case');
                        break;
                    }
                }
            }
        }
    }

    useEffect(() => {
        getRequestType();
    }, [checkedLeads]);

    useEffect(() => {
        if (reqType) {
            fetchMappingDetails();
        }
    }, [reqType])


    return (
        <>
            {rejectApproveModal && (
                <Modal
                    open={true}
                    aria-labelledby="modal-modal-title"
                    sx={{ mt: 10 }}
                >
                    <Box sx={style}>
                        <Typography align="left" id="modal-modal-title">
                            <label>Comment</label>
                        </Typography>
                        <Typography id="modal-modal-description" align="left" sx={{ mt: 2 }}>
                            <Grid item xs={6} sm={6} md={6} lg={12} justifyContent="flex-end" >
                                <TextField sx={{ width: '100%' }} name='comment' value={comment} onChange={(e) => handleOnChange(e)} />
                            </Grid>
                        </Typography>

                        <Typography
                            id="modal-modal-description"
                            align="center"
                            sx={{ mt: 2 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 25,
                                }}
                            >
                                <Button
                                    style={{ marginRight: "20px", borderRadius: 4 }}
                                    onClick={handleRequestCancel}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    style={{ borderRadius: 4 }}
                                    onClick={handleSubmit}
                                    variant="contained"
                                >
                                    Submit
                                </Button>
                            </div>
                        </Typography>
                    </Box>
                </Modal>
            )}
        </>
    )
}