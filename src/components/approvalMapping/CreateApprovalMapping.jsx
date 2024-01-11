import React, { useEffect, useState } from 'react'
import Page from "../Page";
import { useNavigate, useParams, Link } from 'react-router-dom';
import BredArrow from '../../assets/image/bredArrow.svg';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { Container, TextField, Button, Grid, Checkbox, Box, FormGroup,Typography, FormControlLabel, Breadcrumbs } from "@mui/material";
import Select from 'react-select';
import _ from 'lodash';
import toast from 'react-hot-toast';
import TextArea from 'antd/es/input/TextArea';
import { makeStyles } from "@mui/styles";
import { getRolesList } from '../../config/services/hrmServices';
import { createApprovalMapping, getApprovalMappingDetails, updateApprovalMapping } from '../../config/services/approvalMapping';

const useStyles = makeStyles((theme) => ({
    breadCrumb: {
        marginLeft: '20px',
        marginBottom: '10px'
    },
}))

export default function CreateApprovalMapping() {
    const [recordForEdit, setRecordForEdit] = useState({});
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [rolesList, setRoleslist] = useState([])
    const navigate = useNavigate();
    let { mappingId } = useParams();
    const classes = useStyles();

    const methodList = [
        { label: 'POST', value: 'POST' },
        { label: 'GET', value: 'GET' },
        { label: 'PUT', value: 'PUT'}
    ]

    const approvalTypeList = [
        { label: 'Coupon', value: 'Coupon' },
        { label: 'Special Coupon', value: 'Special Coupon'},
        { label: 'Claim', value: 'Claim'}        
    ]

    const fetchRolesList = () => {
        let params = { action: "profile" }
        getRolesList(params)
            .then(res => {
                if (res?.data?.response?.data) {
                    res?.data?.response?.data?.map(roleObj=>{
                        roleObj.label = roleObj?.profile_name
                        roleObj.value = roleObj.profile_name
                    })

                    setRoleslist(res?.data?.response?.data);
                }
                else {
                    console.error(res)
                }
            })
    }

    const fetchMappingDetails = async () => {
        getApprovalMappingDetails(mappingId)
            .then(res => {
                if (res?.result) {
                    let obj = {
                        _id: res?.result?._id,
                        approvalType: { label: res?.result?.approvalType, value: res?.result?.approvalType },
                        approverProfile: { label: res?.result?.approverProfile, value: res?.result?.approverProfile },
                        approve: res?.result?.isApprove,
                        approveApiUrl: res?.result?.approveMetaInfo?.apiUrl,
                        approveMethod: { label: res?.result?.approveMetaInfo?.method, value: res?.result?.approveMetaInfo?.method },
                        approverPostJson: res?.result?.approveMetaInfo?.postJsonTemplate,
                        reject: res?.result?.isReject,
                        rejectApiUrl: res?.result?.rejectMetaInfo?.apiUrl,
                        rejectMethod: { label: res?.result?.rejectMetaInfo?.method, value: res?.result?.rejectMetaInfo?.method },
                        rejectPostJson: res?.result?.rejectMetaInfo?.postJsonTemplate,
                        reassign: res?.result?.isReassign,
                        assignToUser: res?.result?.isAssignToUser
                    }
                    res?.result?.approveMetaInfo?.communicationVia?.map(item => {
                        switch (item?.type) {
                            case 'Mail': {
                                obj.approveMail = true;
                                obj.approveMailReqTemplate = item?.templateForRequester;
                                obj.approveMailAppTemplate = item?.templateForApprover
                                break;
                            }
                            case 'WhatsApp': {
                                obj.approveWhatsapp = true;
                                obj.approveWhatsappAppTemplate = item?.templateForApprover;
                                obj.approveWhatsappReqTemplate = item?.templateForRequester;
                                break;
                            }
                            case 'Push Notification': {
                                obj.approvePushNotification = true;
                                obj.approvePushNotificationAppTemplate = item?.templateForApprover;
                                obj.approvePushNotificationReqTemplate = item?.templateForRequester;
                                break;
                            }
                            case 'SMS': {
                                obj.approveSms = true;
                                obj.approveSmsAppTemplate = item?.templateForApprover;
                                obj.approveSmsReqTemplate = item?.templateForRequester;
                                break;
                            }
                            default: {
                                console.log('this is the approve default case');
                            }
                        }
                    })
                    res?.result?.rejectMetaInfo?.communicationVia?.map(item => {
                        switch (item?.type) {
                            case 'Mail': {
                                obj.rejectMail = true;
                                obj.rejectMailReqTemplate = item?.templateForRequester;
                                obj.rejectMailAppTemplate = item?.templateForApprover
                                break;
                            }
                            case 'WhatsApp': {
                                obj.rejectWhatsapp = true;
                                obj.rejectWhatsappAppTemplate = item?.templateForApprover;
                                obj.rejectWhatsappReqTemplate = item?.templateForRequester;
                                break;
                            }
                            case 'Push Notification': {
                                obj.rejectPushNotification = true;
                                obj.rejectPushNotificationAppTemplate = item?.templateForApprover;
                                obj.rejectPushNotificationReqTemplate = item?.templateForRequester;
                                break;
                            }
                            case 'SMS': {
                                obj.rejectSms = true;
                                obj.rejectSmsAppTemplate = item?.templateForApprover;
                                obj.rejectSmsReqTemplate = item?.templateForRequester;
                                break;
                            }
                            default: {
                                console.log('this is the reject default case');
                            }
                        }
                    })
                    setRecordForEdit(obj)
                }
                // setRecordForEdit(obj)
            })
    }

    const handleSelectApproveMethod = (newSelectValue) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.approveMethod = newSelectValue;
        setRecordForEdit(filledDetails)
    }

    const handleSelectApprovalType = (newSelectValue) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.approvalType = newSelectValue;
        setRecordForEdit(filledDetails)
    }

    const handleSelectApproverProfile = (newSelectValue) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.approverProfile = newSelectValue;
        setRecordForEdit(filledDetails)
    }

    const handleSelectRejectMethod = (newSelectValue) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.rejectMethod = newSelectValue;
        setRecordForEdit(filledDetails)
    }

    const handleOnChange = (e) => {
        let { value, name, checked } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        if (name === 'approvalType') {
            filledDetails[name] = value;
        }
        if (name === 'approverProfile') {
            filledDetails[name] = value
        }
        if (name === 'approverPostJson') {
            filledDetails[name] = value
        }
        if (name === 'rejectPostJson') {
            filledDetails[name] = value
        }
        if (name === 'approve') {
            filledDetails[name] = checked
        }
        if (name === 'reject') {
            filledDetails[name] = checked
        }
        if (name === 'approveApiUrl') {
            filledDetails[name] = value
        }
        if (name === 'rejectApiUrl') {
            filledDetails[name] = value
        }
        if (name === 'approveMail') {
            filledDetails[name] = checked
        }
        if (name === 'rejectMail') {
            filledDetails[name] = checked
        }
        if (name === 'approveWhatsapp') {
            filledDetails[name] = checked
        }
        if (name === 'rejectWhatsapp') {
            filledDetails[name] = checked
        }
        if (name === 'approvePushNotification') {
            filledDetails[name] = checked
        }
        if (name === 'approvePushNotificationReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approvePushNotificationAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'rejectPushNotification') {
            filledDetails[name] = checked
        }
        if (name === 'rejectPushNotificationReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'rejectPushNotificationAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approveSms') {
            filledDetails[name] = checked
        }
        if (name === 'approveSmsReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approveSmsAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approveMailReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approveMailAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approveWhatsappReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'approveWhatsappAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'rejectMailReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'rejectMailAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'rejectWhatsappReqTemp') {
            filledDetails[name] = value
        }
        if (name === 'rejectWhatsappAppTemp') {
            filledDetails[name] = value
        }
        if (name === 'rejectSms') {
            filledDetails[name] = checked
        }
        if (name === 'rejectSmsReqTemplate') {
            filledDetails[name] = value
        }
        if (name === 'rejectSmsAppTemplate') {
            filledDetails[name] = value
        }
        if (name === 'reassign') {
            filledDetails[name] = checked
        }
        if (name === 'assignToUser') {
            filledDetails[name] = checked
        }
        setRecordForEdit(filledDetails)
    }

    const validateFields = (params) => {
        let { approvalType, approverProfile } = params;
        if (!approvalType) {
            toast.error('Please enter type of approval');
            return false;
        }
        if (!approverProfile) {
            toast.error('Please enter approver profile')
            return false;
        }
        return true;
    }

    const createApproveMetaInfo = () => {
        return ({
            apiUrl: recordForEdit?.approveApiUrl,
            method: recordForEdit?.approveMethod?.value,
            postJsonTemplate: recordForEdit?.approverPostJson,
            communicationVia: createApproveCommVia()
        })
    }

    const createApproveCommVia = () => {
        let array = []
        if (recordForEdit?.approveMail) {
            let obj = {};
            obj.type = 'Mail'
            obj.templateForRequester = recordForEdit?.approveMailReqTemplate
            obj.templateForApprover = recordForEdit?.approveMailAppTemplate
            array.push(obj)
        }
        if (recordForEdit?.approveWhatsapp) {
            let obj = {
                type: 'WhatsApp',
                templateForRequester: recordForEdit?.approveWhatsappReqTemplate,
                templateForApprover: recordForEdit?.approveWhatsappAppTemplate
            }
            array.push(obj)
        }
        if (recordForEdit?.approvePushNotification) {
            let obj = {
                type: 'Push Notification',
                templateForRequester: recordForEdit?.approvePushNotificationReqTemplate,
                templateForApprover: recordForEdit?.approvePushNotificationAppTemplate
            }
            array.push(obj);
        }
        if (recordForEdit?.approveSms) {
            let obj = {
                type: 'SMS',
                templateForRequester: recordForEdit?.approveSmsReqTemplate,
                templateForApprover: recordForEdit?.approveSmsAppTemplate
            }
            array.push(obj);
        }
        return array;

    }

    const createRejectCommVia = () => {
        let array = []
        if (recordForEdit?.rejectMail) {
            let obj = {};
            obj.type = 'Mail'
            obj.templateForRequester = recordForEdit?.rejectMailReqTemplate
            obj.templateForApprover = recordForEdit?.rejectMailAppTemplate
            array.push(obj)
        }
        else if (recordForEdit?.rejectWhatsapp) {
            let obj = {
                type: 'WhatsApp',
                templateForRequester: recordForEdit?.rejectWhatsappReqTemplate,
                templateForApprover: recordForEdit?.rejectWhatsappAppTemplate
            }
            array.push(obj)
        }
        else if (recordForEdit?.rejectPushNotification) {
            let obj = {
                type: 'Push Notification',
                templateForRequester: recordForEdit?.rejectPushNotificationReqTemplate,
                templateForApprover: recordForEdit?.rejectPushNotificationAppTemplate
            }
            array.push(obj);
        }
        else if (recordForEdit?.rejectSms) {
            let obj = {
                type: 'SMS',
                templateForRequester: recordForEdit?.rejectSmsReqTemplate,
                templateForApprover: recordForEdit?.rejectSmsAppTemplate
            }
            array.push(obj);
        }
        return array;

    }

    const createRejectMetaInfo = () => {
        return ({
            apiUrl: recordForEdit?.rejectApiUrl,
            method: recordForEdit?.rejectMethod?.value,
            postJsonTemplate: recordForEdit?.rejectPostJson,
            communicationVia: createRejectCommVia()
        })
    }

    const addOrEdit = async () => {
        if (validateFields(recordForEdit)) {
            let paramsObj = {
                approvalType: recordForEdit?.approvalType?.value,
                approverProfile: recordForEdit?.approverProfile?.value,
                isApprove: recordForEdit?.approve,
                approveMetaInfo: createApproveMetaInfo(),
                isReject: recordForEdit?.reject,
                rejectMetaInfo: createRejectMetaInfo(),
                isReassign: recordForEdit?.reassign,
                isAssignToUser: recordForEdit?.assignToUser,
            }
            if (recordForEdit?._id) {
                let newObj = {
                    ...paramsObj,
                    _id: recordForEdit?._id,
                    modifiedBy: modifiedBy,
                    modifiedBy_Uuid: modifiedBy_Uuid
                }
                updateApprovalMapping(newObj)
                    .then(res => {
                        if(res?.result){
                            toast.success(res?.message);
                            navigate('/authorised/approval-mapping');
                        }
                    })
                    .catch(err => {
                        console.log(err, ':: err inside catch update');
                    })


            }
            else {
               let newObj = {
                ...paramsObj,
                createdBy: createdBy,
                modifiedBy: modifiedBy,
                createdBy_Uuid: createdBy_Uuid,
                modifiedBy_Uuid: modifiedBy_Uuid
               }
                createApprovalMapping(newObj)
                    .then(res => {
                        if (res?.data) {
                            toast.success(res?.message);
                            navigate('/authorised/approval-mapping');
                        }
                    })
            }
        }

    }

    const handleSave = () => {
        addOrEdit();
        // setRecordForEdit({});
    }

    const handleCancel = () => {
        navigate('/authorised/approval-mapping');
    }

    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to='/authorised/approval-mapping'
            className={classes.breadcrumbsClass}
        >
            Listing
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            {"Approval Mapping"}
        </Typography>
    ];

    useEffect(() => {
        if (mappingId) {
            fetchMappingDetails();
        }
    }, [])
    useEffect(() => fetchRolesList(), []);


    return (
        <>
            <Page title="Extramarks | Create Campaign" >
            <div className={classes.breadCrumb}>
                <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                    separator={<img src={BredArrow} />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
                <div className="tableCardContainer">
                    <h4 className='heading' >Approval Mapping</h4>
                    <Box>
                        <Grid container spacing={2} marginTop={2}>
                            <Grid item xs={12} sm={6} >
                                <label>Type of Approval</label>
                                <Select placeholder="Select" options={approvalTypeList} name='approvalType' value={recordForEdit?.approvalType} onChange={handleSelectApprovalType} />
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <label>Approver Profile</label>
                                <Select placeholder="Select" options={rolesList} name='approverProfile' value={recordForEdit?.approverProfile} onChange={handleSelectApproverProfile} />
                            </Grid>
                            <Grid item xs={12} sm={6} marginTop={2}>
                                <label style={{ fontsize: '24px' }}>Action Performed</label>

                                <FormGroup>
                                    <FormControlLabel name='approve' checked={true} onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.approve ? true : false} />} label='Approve' />
                                </FormGroup>
                                {recordForEdit?.approve === true ? <>
                                    <label>
                                    API URL:
                                    <input type="text" name='approveApiUrl' value={recordForEdit?.approveApiUrl} onChange={handleOnChange}
                                        style={{ width: '300px', height: '30px', marginLeft: '10px' }} />
                                </label>

                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                    <span style={{ marginRight: '1rem' }}>Method:</span>
                                    <div style={{ width: '150px' }}>
                                        <Select placeholder="Select" options={methodList} name='approveMethod' value={recordForEdit?.approveMethod} onChange={handleSelectApproveMethod} />
                                    </div>
                                </div>
                                {(recordForEdit?.approveMethod?.value === 'POST' || recordForEdit?.approveMethod?.value === 'PUT') ?
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                        <span style={{ marginRight: '1rem' }}>Template to post JSON:</span>
                                        <div style={{ width: '300px' }}>
                                            <TextArea name='approverPostJson' value={recordForEdit?.approverPostJson} onChange={handleOnChange}></TextArea>
                                        </div>
                                    </div> : ''
                                }
                                </> : ''}
                               

                                {/* <div style={{ marginTop: '20px' }}>
                                    <label>Communication via</label>
                                    <FormGroup>
                                        <FormControlLabel name='approveMail' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.approveMail ? true : false} />} label='Mail' />
                                    </FormGroup>
                                    {recordForEdit?.approveMail === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approveMailReqTemplate' value={recordForEdit?.approveMailReqTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approveMailAppTemplate' value={recordForEdit?.approveMailAppTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }

                                    <FormGroup>
                                        <FormControlLabel name='approveWhatsapp' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.approveWhatsapp ? true : false} />} label='WhatsApp' />
                                    </FormGroup>
                                    {recordForEdit?.approveWhatsapp === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approveWhatsappReqTemplate' value={recordForEdit?.approveWhatsappReqTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approveWhatsappAppTemplate' value={recordForEdit?.approveWhatsappAppTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }

                                    <FormGroup>
                                        <FormControlLabel name='approvePushNotification' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.approvePushNotification ? true : false} />} label='Push Notification' />
                                    </FormGroup>
                                    {recordForEdit?.approvePushNotification === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approvePushNotificationReqTemplate' value={recordForEdit?.approvePushNotificationReqTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approvePushNotificationAppTemplate' value={recordForEdit?.approvePushNotificationAppTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }
                                    <FormGroup>
                                        <FormControlLabel name='approveSms' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.approveSms ? true : false} />} label='SMS' />
                                    </FormGroup>
                                    {recordForEdit?.approveSms === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approveSmsReqTemplate' value={recordForEdit?.approveSmsReqTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='approveSmsAppTemplate' value={recordForEdit?.approveSmsAppTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }
                                </div> */}


                            </Grid>
                            <Grid item xs={12} sm={6} marginTop={5}>
                                <FormGroup>
                                    <FormControlLabel name='reject' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.reject ? true : false} />} label='Reject' />
                                </FormGroup>
                                {recordForEdit?.reject === true ? <>
                                    <label>
                                    API URL:
                                    <input type="text" name='rejectApiUrl' value={recordForEdit?.rejectApiUrl} onChange={handleOnChange}
                                        style={{ width: '300px', height: '30px', marginLeft: '10px' }} />
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                    <span style={{ marginRight: '1rem' }}>Method:</span>
                                    <div style={{ width: '150px' }}>
                                        <Select placeholder="Select" options={methodList} name='rejectMethod' value={recordForEdit?.rejectMethod} onChange={handleSelectRejectMethod} />
                                    </div>

                                </div>
                                {(recordForEdit?.rejectMethod?.value === 'POST' || recordForEdit?.rejectMethod?.value === 'PUT') ?
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                        <span style={{ marginRight: '1rem' }}>Template to post JSON:</span>
                                        <div style={{ width: '300px' }}>
                                            <TextArea name='rejectPostJson' value={recordForEdit?.rejectPostJson} onChange={handleOnChange}></TextArea>
                                        </div>
                                    </div> : ''
                                }
                                </> : ''}
                                

                                {/* <div style={{ marginTop: '20px' }}>
                                    <label>Communication via</label>
                                    <FormGroup>
                                        <FormControlLabel name='rejectMail' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.rejectMail ? true : false} />} label='Mail' />
                                    </FormGroup>
                                    {recordForEdit?.rejectMail === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectMailReqTemplate' value={recordForEdit?.rejectMailReqTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectMailAppTemplate' value={recordForEdit?.rejectMailAppTemplate} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }

                                    <FormGroup>
                                        <FormControlLabel name='rejectWhatsapp' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.rejectWhatsapp ? true : false} />} label='WhatsApp' />
                                    </FormGroup>
                                    {recordForEdit?.rejectWhatsapp === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectWhatsappReqTemp' value={recordForEdit?.rejectWhatsappReqTemp} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectWhatsappAppTemp' value={recordForEdit?.rejectWhatsappAppTemp} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }

                                    <FormGroup>
                                        <FormControlLabel name='rejectPushNotification' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.rejectPushNotification ? true : false} />} label='Push Notification' />
                                    </FormGroup>
                                    {recordForEdit?.rejectPushNotification === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectPushNotificationReqTemp' value={recordForEdit?.rejectPushNotificationReqTemp} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectPushNotificationAppTemp' value={recordForEdit?.rejectPushNotificationAppTemp} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }
                                    <FormGroup>
                                        <FormControlLabel name='rejectSms' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.rejectSms ? true : false} />} label='SMS' />
                                    </FormGroup>
                                    {recordForEdit?.rejectSms === true ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Requester:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectSmsReqTemp' value={recordForEdit?.rejectSmsReqTemp} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ marginRight: '1rem' }}>Template for Approver:</span>
                                                <div style={{ width: '300px' }}>
                                                    <TextArea name='rejectSmsAppTemp' value={recordForEdit?.rejectSmsAppTemp} onChange={handleOnChange}></TextArea>
                                                </div>
                                            </div>
                                        </> : ''
                                    }
                                </div> */}
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <FormGroup>
                                    <FormControlLabel name='reassign' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.reassign ? true : false} />} label='Reassign' />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <FormGroup>
                                    <FormControlLabel name='assignToUser' onChange={handleOnChange} control={<Checkbox checked={recordForEdit?.assignToUser ? true : false} />} label='Assign to User' />
                                </FormGroup>
                            </Grid>
                        </Grid>


                    </Box>
                </div>
                <div align='right' >
                    <Button style={{ width: '100px' }} variant='outlined' onClick={handleCancel}>Cancel</Button>
                    <Button style={{ width: '100px', marginLeft: '10px' }} variant='contained' onClick={handleSave}>Save</Button>
                </div>

            </Page>
        </>

    )
}