import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BredArrow from '../../assets/image/bredArrow.svg'
import { Button, TextField, Typography, Grid, Modal, Fade, Box, Stack, Divider, Breadcrumbs } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import moment from 'moment';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { getRequestDetails, approveReject, singleCouponRequest, approveClaimRequest, approveClaimThruMapping, approveRejectThruMapping, specialCouponApproveThruMapping, singleCouponApproveThruMapping, reassignRequest, specialCouponRequest } from '../../config/services/approvalRequest';
import CoupanDetailsTable from '../MyLeads/CoupanDetailsTable';
import RequestCards from './RequestCards';
import { getAllParentRoles, approveSingleCoupon } from '../../config/services/hrmServices';
import ReactSelect from 'react-select';
import { makeStyles } from "@mui/styles";
import TextArea from 'antd/es/input/TextArea';
import { trialFormSubmit } from '../../config/services/lead';
import { getLoginUserData } from '../../helper/randomFunction';
import { getMappingInfo } from '../../config/services/approvalMapping';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '4px',
};

const useStyles = makeStyles((theme) => ({
    breadCrumb: {
        marginLeft: '20px',
        marginBottom: '10px'
    },
    global: {
        borderRadius: "8px",
        padding: "20px",
        paddingBottom: "50px",
        marginLeft: '15px'
        // margin: "20px",
    },
    cardContainer: {
        display: "flex",
        flexWrap: "wrap",
        display: "flex",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridGap: "10px"
    },
    loader: {
        marginBottom: "-17px",
        marginLeft: "25px",
        marginRight: "25px"
    },
    header: {
        marginBottom: '10px',
        fontSize: "inherit",
        fontWeight: "400",
        marginTop: "-9px",
    },
    label: {
        font: "normal normal 600 14px/ 38px Open Sans",
        letterSpacing: "0px",
        color: "#85888A",
    },
    input: {
        // borderColor: '#85888A',
        border: '1px solid #cccccc',
        borderRadius: '6px',
        padding: '8px 15px',
        fontSize: '18px',
    },
    container: {
        display: "flex",
        marginTop: "20px",
        flexDirection: "column",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "20px",
        marginBottom: '10px',
        marginTop: '20px'
    },
    submitButton: {
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: "22px",
        cursor: "pointer",
        borderRadius: "4px",
        color: "white",
        border: "1px solid #F45E29",
        padding: "12px 24px",
        background: "#F45E29",
        marginLeft: "20px"
    },
    cancelButton: {
        border: "1px solid #F45E29",
        padding: "12px 24px",
        color: "#F45E29",
        borderRadius: "4px",
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: "22px",
        cursor: "pointer",
        marginRight: '20px'
    },
    newRequestButton: {
        border: "1px solid #F45E29",
        padding: "8px 15px",
        color: "#F45E29",
        borderRadius: "4px",
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: "22px",
        cursor: "pointer",
        float: 'right',
        position: 'absolute',
        right: '0'
    },
    textArea: {
        border: '1px solid #cccccc',
        borderRadius: '6px',
        padding: '8px 15px',
        fontSize: '18px',
        height: '200px'
    },
    pageContainer: {
        width: "calc(33% - 30px)",
        marginRight: "100px",
    },
    page: {
        boxShadow: "0px 0px 8px rgb(0 0 0 / 16%)",
        borderRadius: "8px",
        padding: "20px",
        paddingBottom: "50px",
        margin: "20px",
    },
    emptyArray: {
        marginLeft: "600px",
        color: "rgb(244, 94, 41)",
        fontWeight: "500"
    }
}));

export default function RequestDetails() {
    const [requestDetails, setRequestDetails] = useState();
    const [recordForEdit, setRecordForEdit] = useState({});
    const [reassignModal, setReassignModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [mappingDetails, setMappingDetails] = useState();
    const [parentsList, setParentsList] = useState([]);
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const { request_id,requestedBy } = useParams();
    const navigate = useNavigate();
    const classes = useStyles();

    // const [loggedInId] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);

    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to={requestedBy ? `/authorised/approver-request-management/${requestedBy}` : '/authorised/approver-request-management' }
            className={classes.breadcrumbsClass}
        >
            Listing
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            {"Request Details"}
        </Typography>
    ];

    const fetchRequestDetails = async () => {
        getRequestDetails(request_id)
            .then(res => {
                if (res?.result)
                    setRequestDetails(res?.result)
            })

    }

    const handleFilterByRole = (value) => {
        setSelectedUser(value)
    }

    const validateRemarks = () => {
        if (!remarks) {
            toast.error("Enter Remarks Value!");
            return false;
        }

        return true
    }

    const handleReject = () => {
        if (validateRemarks()) {
            let requestList = [];
            let obj = {
                _id: request_id,
                requestStatus: 'REJECTED',
                remarks
            }
            requestList.push(obj);
            let params = { requestList };
            if (mappingDetails && mappingDetails?.rejectMetaInfo && mappingDetails?.rejectMetaInfo?.apiUrl) {
                let url = mappingDetails?.rejectMetaInfo?.apiUrl;
                approveRejectThruMapping({ url, params })
                    .then(res => {
                        toast.error('Request is rejected')
                        if(requestedBy){
                            navigate(`/authorised/approver-request-management/${requestedBy}`)
                        }
                        else{
                            navigate('/authorised/approver-request-management');
                        }
                        
                    })
            }
            else {
                approveReject(params)
                    .then((res) => {
                        toast.success('Request is rejected')
                        // navigate('/authorised/approver-request-management');
                        if(requestedBy){
                            navigate(`/authorised/approver-request-management/${requestedBy}`)
                        }
                        else{
                            navigate('/authorised/approver-request-management');
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
    }

    const singleCouponApproval = async () => {
        if (mappingDetails && mappingDetails?.approveMetaInfo && mappingDetails?.approveMetaInfo?.apiUrl) {
            let url = mappingDetails?.approveMetaInfo?.apiUrl;
            let method = mappingDetails?.approveMetaInfo?.method;
            let params = {
                approver_empcode: requestDetails?.approver_empCode,
                requester_empcode: requestDetails?.requestBy_empCode,
                approver_role_id: requestDetails?.approver_roleId,
                metaInfo: requestDetails?.metaInfo,
                remarks: remarks,
                _id: request_id
            }
            singleCouponApproveThruMapping({ url, params })
                .then(res => {
                    if (res?.mesagges === 'failed') {
                        toast.error('Coupon limit exceeded');
                        navigate('/authorised/approver-request-management');
                    }
                    if (res?.mesagges === 'success') {
                        toast.success('Coupon data inserted successfully');
                        navigate('/authorised/approver-request-management');
                    }

                })
                .catch(err => {
                    console.log(err, ':: error inside single coupon approval');
                })

        }
        else {
            let params = {
                _id: request_id,
                requestStatus: 'APPROVED',
                remarks
            }
            approveReject(params)
                .then((res) => {
                    toast.error('Request is Approved')
                    navigate('/authorised/approver-request-management');
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const specialCouponApproval = async () => {
        if (mappingDetails && mappingDetails?.approveMetaInfo && mappingDetails?.approveMetaInfo?.apiUrl) {
            let url = mappingDetails?.approveMetaInfo?.apiUrl;
            let method = mappingDetails?.approveMetaInfo?.method;
            let params = {
                requestBy_empCode: requestDetails?.requestBy_empCode,
                requestBy_roleId: requestDetails?.trialCreatorDetails?.requestBy_roleId,
                requestBy_ProfileName: requestDetails?.trialCreatorDetails?.requestBy_ProfileName,
                metaInfo: requestDetails?.metaInfo,
                _id: request_id
            }
            specialCouponApproveThruMapping({ url, params })
                .then(res => {
                    if (res?.mesagges === 'failed') {
                        toast.error('Coupon limit exceeded');
                        navigate('/authorised/approver-request-management');
                    }
                    if (res?.mesagges === 'success') {
                        toast.success('Coupon data inserted successfully');
                        navigate('/authorised/approver-request-management');
                    }

                })
                .catch(err => {
                    console.log(err, ':: error inside single coupon approval');
                })

        }
        else {
            let params = {
                _id: request_id,
                requestStatus: 'APPROVED',
                remarks
            }
            approveReject(params)
                .then((res) => {
                    toast.success('Request is Approved')
                    navigate('/authorised/approver-request-management');
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const claimApproval = async () => {
        let requestList = [];
        let obj = {
            approver_roleName: requestDetails?.approver_roleName,
            approver_empCode: requestDetails?.approver_empCode,
            requestId: requestDetails?.requestId,
            requestStatus: 'APPROVED',
            remarks: remarks,
            approverProfile: mappingDetails?.approverProfile,
            _id: request_id
        }
        requestList.push(obj);
        let params = { requestList };
        if (mappingDetails && mappingDetails?.approveMetaInfo && mappingDetails?.approveMetaInfo?.apiUrl) {
            let url = mappingDetails?.approveMetaInfo?.apiUrl;
            let method = mappingDetails?.approveMetaInfo?.method;
            // let params = {
            //     approver_roleName: requestDetails?.approver_roleName,
            //     requestId: requestDetails?.requestId,
            //     requestStatus: 'APPROVED',
            //     remarks: remarks,
            //     approverProfile: mappingDetails?.approverProfile,
            //     _id: request_id
            // }
            approveClaimThruMapping({ url, params })
                .then(res => {
                    console.log(res, '....res from claim approval');
                    if (res?.status === 'success') {
                        toast.success('Request is Approved');
                        // navigate('/authorised/approver-request-management');
                        if(requestedBy){
                            navigate(`/authorised/approver-request-management/${requestedBy}`)
                        }
                        else{
                            navigate('/authorised/approver-request-management');
                        }
                    }

                })
                .catch(err => {
                    console.log(err, ':: error inside single coupon approval');
                })

        }
        else {
            approveClaimRequest(params)
                .then(res => {
                    toast.success('Request is Approved')
                    // navigate('/authorised/approver-request-management');
                    if(requestedBy){
                        navigate(`/authorised/approver-request-management/${requestedBy}`)
                    }
                    else{
                        navigate('/authorised/approver-request-management');
                    }
                })
                .catch(err => {
                    console.log(err, '::: err inside approve claim request');
                })

        }
    }

    const handleApprove = async (params) => {
        //let { requestType } = params;
        if (validateRemarks()) {
            switch (requestDetails?.requestType) {
                case 'Coupon': {
                    singleCouponApproval();
                    break;
                }
                case 'Special Coupon': {
                    specialCouponApproval();
                    break;
                }
                case 'Trial': {
                    trialRequestApproval();
                    break;
                }
                case 'Claim': {
                    claimApproval();
                    break;
                }
                default: {
                    console.log('This is the default case');
                    break;
                }
            }
        }
    }

    const fetchMappingDetails = async () => {
        let params = { approvalType: requestDetails?.requestType };
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

    const trialRequestApproval = () => {
        // if(validateRemarks()){
        //         setLoading(true)
        let trialData = JSON.parse(requestDetails?.trialData[0]);
        let trialCreatorDetails = requestDetails?.trialCreatorDetails;
        let trial_activation_request = [...trialData?.trial_activation_request].map((request) => { return { ...request, isapproval: "Yes" } })
        let data = {
            ...trialData,
            trial_activation_request,
            trialCreatorDetails,
            trialType: "bulk"
        }

        trialFormSubmit(data)
            .then((res) => {
                if (res?.data?.responseData) {
                    if (res?.data?.responseData?.mesagges === 'success') {

                        let errors = res?.data?.responseData?.data_array?.map((trial) => {
                            if (trial?.msg === "Free Trial Assigned Successfully") {
                                return true
                            } else {
                                return false;
                            }
                        });

                        let errorFlag = errors.some((error) => error === true);

                        if (!errorFlag) {
                            toast.error("Free trial Failed");
                            setLoading(false);
                            return;
                        }

                        let params = {
                            _id: request_id,
                            requestStatus: 'APPROVED',
                            remarks
                        }
                        approveReject(params)
                            .then((result) => {
                                toast.success('Request is Approved');
                                navigate('/authorised/approver-request-management');
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                    }
                } else if (res?.data?.error) {
                    let message;

                    if (res?.data?.error?.errorMessage) {
                        message = res?.data?.error?.errorMessage;
                    }

                    if (res?.data?.error?.output) {
                        message = res?.data?.error?.output;
                    }
                    toast.error(message)
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err, "..error");
                setLoading(false);
            });
        // }
    }

    const handleOnChange = (e) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        setRemarks(e.target.value)
        filledDetails.remarks = e.target.value;
    }

    const allParentsList = (object, parentsArr) => {
        let newObj = {
            displayName: object?.displayName,
            roleName: object?.roleName,
            roleID: object?.roleID,
            userName: object?.userName
        }
        parentsArr.push(newObj);
        if (object?.parents) {
            return allParentsList(object?.parents, parentsArr)
        }
        else {
            return parentsArr;
        }
    }

    const handleReassign = () => {
        setReassignModal(!reassignModal)
    }

    const fetchAllParentRoles = async () => {

        getAllParentRoles({ role_name: requestDetails?.approver_roleName })
            .then(res => {
                let allParents = res?.data?.response?.data?.parents;
                if (allParents) {
                    let allData = allParentsList(allParents, []);
                    if (allData?.length > 0) {
                        setParentsList([...allData]);
                    }
                }
            })
            .catch(err => {
                console.log(err, ":: error inside catch");
            })
    }

    const handleReassignRequest = async () => {
        let params = {
            _id: request_id,
            approver_empCode: selectedUser?.userName,
            approver_roleId: selectedUser?.roleID,
            approver_roleName: selectedUser?.roleName,
            approver_name: selectedUser?.displayName
        }
        if (!params?.approver_roleName) {
            toast.error('Please Select User');
            return;
        }
        reassignRequest(params)
            .then(res => {
                if (res?.result) {
                    toast.success(`${requestDetails.requestType} request is reassigned successfully`);
                    setReassignModal(!reassignModal);
                    // navigate('/authorised/approver-request-management');
                    setSelectedUser('')
                    if(requestedBy){
                        navigate(`/authorised/approver-request-management/${requestedBy}`)
                    }
                    else{
                        navigate('/authorised/approver-request-management');
                    }
                }
            })
            .catch(err => {
                console.log(err, '....error inside catch');
            })
    }

    const isRequestByLoggedInUser = (requestData) => {
        let LoggedInUserEmpId = getLoginUserData()?.userData?.username

        if (requestData?.requestBy_empCode?.toLowerCase() === LoggedInUserEmpId?.toLowerCase()) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (request_id) {
            fetchRequestDetails()
        }
    }, [])

    useEffect(() => {
        if (requestDetails?.requestType === 'Claim' || requestDetails?.requestType === 'Coupon' || requestDetails?.requestType === 'Special Coupon') {
            fetchAllParentRoles();
        }
        fetchMappingDetails();
    }, [requestDetails])


    return (
        <>
            <div className={classes.breadCrumb}>
                <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                    separator={<img src={BredArrow} />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
            <div className={classes.global}>
                <div className={classes.header} align='left'> <h3>REQUEST DETAILS</h3> </div>
                <div className={classes.header} align='right'> <h3>Status: {requestDetails?.requestStatus}</h3> </div>

                {/* <div>
                <CoupanDetailsTable requestObj={requestDetails} />
            </div> */}
                <div className="App">
                    <div className={classes.cardContainer}>
                        {requestDetails?.metaInfo?.map((data, index) => (
                            <RequestCards key={index} data={data} /> //change
                        ))}
                    </div>
                </div >
                <Box style={{ marginRight: '10px' }}>
                    {(isRequestByLoggedInUser(requestDetails) || requestDetails?.requestStatus === 'APPROVED' || requestDetails?.requestStatus === 'REJECTED') ?
                        null
                        : <>
                            <Grid item xs={12} md={6} marginTop={2}>
                                <b style={{ fontWeight: '600' }}>Approver Remarks</b>
                                <TextArea className={classes.textArea} value={remarks} onChange={handleOnChange} />
                            </Grid>
                        </>
                    }
                </Box>
            </div>
            <Box align="right" marginTop={2}>
                {(isRequestByLoggedInUser(requestDetails) || requestDetails?.requestStatus === 'APPROVED' || requestDetails?.requestStatus === 'REJECTED') ?
                    null
                    : <>
                        {mappingDetails?.isReassign ?
                            <Button className="btn" variant='outlined' type="submit" onClick={handleReassign}>Reassign</Button>
                            : ''}
                        {mappingDetails?.isReject ?
                            <Button style={{ marginLeft: '10px', fontSize: '15px' }} className="btn" variant="outlined" type="submit" onClick={handleReject} >Reject</Button>
                            : ''
                        }
                        {mappingDetails?.isApprove ?
                            <Button style={{ marginLeft: '10px', fontSize: '15px' }} className="btn" variant="outlined" type="submit" onClick={handleApprove}>Approve</Button>
                            : ''
                        }
                    </>
                }
            </Box>

            {reassignModal && (
                <Modal
                    open={true}
                    aria-labelledby="modal-modal-title"
                    sx={{ mt: 10 }}
                >
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title">
                            <div style={{ fontWeight: 600, fontSize: 18 }}>
                                {" "}
                                Select User{" "}
                            </div>
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            align="center"
                            sx={{ mt: 2 }}
                        >
                            <Grid
                                item
                                xs={6}
                                sm={6}
                                md={6}
                                lg={12}
                                justifyContent="flex-end"
                            >
                                <ReactSelect
                                    sx={{ fontSize: "20px" }}
                                    classNamePrefix="select"
                                    options={parentsList}
                                    getOptionLabel={(option) => (option.displayName + ' (' + option.roleName + ')')}
                                    getOptionValue={(option) => option}
                                    onChange={handleFilterByRole}
                                    placeholder="Filter By Role"
                                    className="width-100 font-14"
                                    value={selectedUser}
                                />
                            </Grid>
                        </Typography>
                        <Typography>
                            <Divider />
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
                                    onClick={() => {
                                        setReassignModal(!reassignModal)
                                        setSelectedUser('');
                                    }}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    style={{ borderRadius: 4 }}
                                    onClick={handleReassignRequest}
                                    variant="contained"
                                >
                                    Reassign
                                </Button>
                            </div>
                        </Typography>
                    </Box>
                </Modal>
            )}
        </>
    )

}


















