import React, { useState, useEffect, useRef } from 'react'
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BredArrow from '../../assets/image/bredArrow.svg'
import { Link, useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Page from "../Page";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import LeadDetailsTabs from './LeadDetailsTabs';
import LeadDetailsAccordion from './LeadDetailsAccordion';
import Avatar from "@mui/material/Avatar";
import AssignFreeTrial from "../../assets/icons/AssignFreeTrial.svg";
import IconFire from "../../assets/icons/Icon-fire.svg";
import IconCold from "../../assets/icons/Icon-cold.svg";
import IconWarm from "../../assets/icons/Icon-warm.svg";
import Divider from '@mui/material/Divider';
import CardContent from "@mui/material/CardContent";
import moment from "moment";
import AssignTrialModal from "./AssignTrialModal";
import {
    Button, Grid, Modal, Box, Typography, CircularProgress
} from "@mui/material";
import toast from 'react-hot-toast';
import _ from "lodash";
import Dialer from "./Dialer";
import { getLeadStageStatus } from "../../config/services/manageStageStatus";
import { getBdeRecentActivity, updateBdeActivity } from "../../config/services/bdeActivities";
import { setCookieData } from '../../helper/randomFunction'
import settings from '../../config/settings';
import CrossIcon from "../../assets/image/crossIcn.svg"
import PaymentIcon from "../../assets/icons/icon-payment.svg"
import { getOnlinePaymentValue } from '../../helper/randomFunction'
import { collectPayment } from '../../config/services/collectPayment';
import { fetchLeadScore } from '../../helper/DataSetFunction';
import { getLoginUserData } from '../../helper/randomFunction';
import { RegisterUser } from '../../config/services/studentRegister.jsx';
import OtpInput from 'react-otp-input';
import { UserOtpVerify } from '../../config/services/verifyOtp.jsx';
import { markBdeActivity } from '../../config/services/bdeActivities';
import { LeadDetailsInterest } from '../../config/services/leadInterest';
import { getStageByKey } from '../../config/services/stages';
import LinearProgress from '@mui/material/LinearProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { checkIsUserVerified } from '../../config/services/checkIsUserVerified';
import { ResendOtpVerify } from '../../config/services/resendOtp';
import CubeDataset from "../../config/interface";
import { isUUidUpdate } from '../../config/services/isUUIdUpdated';
import { UpdateTnc } from '../../config/services/tncUpdated';
import { leadStageStatusDetails } from '../../config/services/leadStageStatus';
import { DecryptData } from '../../utils/encryptDecrypt';
import { checkValidPhone, checkValidEmail, checkValidName } from "../../utils/utils";
import { useStyles, style, modalUseStyles, ModalStyle } from '../../css/ProfileData-css';
import { getCreatedData, redirectPage, isUserExist, isUserOnlineLeads, isUpadeUUId, mergeStepperList } from '../../helper/ProfileData';
import { activityLogger } from '../../config/services/activities';
import CoupanRequestModal from './CoupanRequestModal';



const ProfileData = ({ leadProfileData, leadObj }) => {
    const loginUserData = getLoginUserData()
    const CurrentDate = moment();

    const [recentActivityDetails, setRecentActivityDetails] = useState({});
    const [assignModal, setAssignModal] = useState(false);
    const [batchDate, setBatchDate] = useState(null);
    const [paymentCollect, setPaymentCollect] = useState(false)
    const [amountCollect, setAmountCollect] = useState()
    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [completePayment, setCompletePayment] = useState(false)
    const [leadStageStatus, setStageStatus] = useState({})
    const registrationDate = leadObj?.registrationDate ? leadObj?.registrationDate.format('DD/MM/YYYY') : ""
    const [newVerifyDate, setNewVerifyDate] = useState('')
    const createDateLeadAge = leadObj?.createDate
    const created = leadObj?.createDate.format('DD/MM/YYYY')
    const leadAge = CurrentDate.diff(createDateLeadAge, 'days') + 1
    let step1 = ["Created"];
    let step1Date = [created];
    const classes = useStyles();
    const modalClasses = modalUseStyles();
    const navigate = useNavigate();
    const [engagementScore, setEngagementScore] = useState(0)
    const params = useParams()
    const [leadInterestList, setLeadInterestList] = useState([])
    const leadInterest = settings.LEAD_INTEREST;
    const [shw_modal, setModalStatus] = useState(false);
    const [otpVerify, setOtpVerify] = useState('')
    const [crmStepperList, setCrmStepperList] = useState([])
    const [currentStage, setCurrentStage] = useState()
    const [cubeStepperList, setCubeStepperList] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [cycleName, setCycleName] = useState('')
    const [isUpadateProfile, setUpdateUUId] = useState('')
    const [close_modal, setModalClose] = useState(true)
    const [requestStamp, setRequestStamp] = useState('')
    const getStatus = useLocation();
    const [checked, setChecked] = useState(false)
    const [isOtpVerify, setUserOtpVerify] = useState(null)
    const [isVerifiedName, setVerifiedName] = useState(null)
    const [isVerifiedNumber, setVerifiedNumber] = useState(null)
    const [cookieFrame, setCookieIFrame] = useState(null)
    const [queryParams, setSearchParams] = useSearchParams()
    const [isProfile, setProfile] = useState(null);
    const [lastActivity, setLastActivity] = useState('');
    const [newLoader, setNewLoader] = useState(false)
    const [alternateContacts, setAlternateContacts] = useState([])
    const [contactPopupFlag, setContactPopupFlag] = useState(false)
    const [coupanModal, setCoupanModal] = useState(false);
    const formRef = useRef();


    if (registrationDate.length > 0) {
        step1 = [...step1, "Registered", "Verified", "Download"]
        step1Date = [...step1Date, registrationDate]
        if (newVerifyDate.length > 0) {
            step1Date = [...step1Date, newVerifyDate]
        }
    }
    else {
        step1 = [...step1, "Verified", "Registered", "Download"]
        if (newVerifyDate.length > 0) {
            step1Date = [...step1Date, newVerifyDate]
        }

    }

    const emailRegex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    const mobileRegex = new RegExp('^[0-9]{10}$');
    const validName = new RegExp('^[A-Za-z0-9 ]+$');

    const onHandleClose = () => {
        setModalClose(false)
        setModalStatus(false)
    }
    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to='/authorised/lead-Assignment'
            className={classes.breadcrumbsClass}
        >
            Listing
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            Listing Detail
        </Typography>
    ];

    const toggleCollectPayment = () => {
        setPaymentCollect(!paymentCollect)
        setAmountCollect()
        setMobile()
        setName()
        setEmail()
    }

    const handleAmountCollected = (e) => {
        let { value } = e.target
        setAmountCollect(value)
    }

    const handleNameCollect = (e) => {
        let { value } = e.target
        setName(value)
    }

    const handleMobileCollect = (e) => {
        let { value } = e.target
        setMobile(value)
    }

    const handleEmailCollect = (e) => {
        let { value } = e.target
        setEmail(value)
    }

    const handleCheckboxChange = (event) => {
        if (event?.target?.checked === true) {
            setName(leadObj?.name)
            setMobile(leadObj?.mobile)
            setEmail(leadObj?.email)
        }
        else {
            setName('')
            setMobile('')
            setEmail('')
        }

        setChecked(event?.target?.checked)
    }

    const handleOtpChange = (otp) => setOtpVerify(otp);

    const updateUserUUId = async (res) => {
        if (res?.data?.length > 0) {
            let mobile = res?.data?.[0]?.[CubeDataset.OnlineLeads.mobile]
            mobile = mobile?.slice(-10);
            // let userType = res?.data?.[0]?.[CubeDataset.OnlineLeads.userType]

            let uuid = res?.data?.[0]?.[CubeDataset.OnlineLeads.uuid]

            let createdOn = res?.data?.[0]?.[CubeDataset.OnlineLeads.createdOn]


            let params = {
                "mobile": mobile,
                "userType": leadObj?.userType,
                "uuid": uuid,
                "name": leadObj?.name,
                "createdAt": getCreatedData(createdOn, leadObj),
                "registrationDate": createdOn
            }

            let response = await isUUidUpdate(params);

            if (!(response?.data?.statusCode === 0)) {
                navigate(`/authorised/listing-details/${uuid}`)
                window.location.reload(false);
            }
            else {
                toast.error(response?.data?.error?.errorMessage)
            }
        }
    }

    const onSubmitHandler = async () => {

        var isExist = await isUserExist(leadObj);
        switch (isExist?.message_code) {
            case "LO002":
                const res = await isUserOnlineLeads(leadObj);
                updateUserUUId(res)
                break;

            case "LO010":
                const response = await isUserOnlineLeads(leadObj);
                updateUserUUId(response)
                // toast.error("User ALready Exist")
                break;

            default:
                const data = await isRegisterUser();
        }
    }

    const isRegisterUser = async () => {
        //let customerType = 1

        const data = await RegisterUser(leadObj);

        if (data?.status === 1) {
            toast.success(data?.message);
            let uuid = data?.uuid
            let request_timestamp = data?.request_timestamp

            var res = await isUpadeUUId(uuid, leadObj)

            if (res?.[0]?.status == "fulfilled" && res?.[1]?.status == "fulfilled" && res?.[2]?.status == "fulfilled" && res?.[3]?.status == "fulfilled") {
                setModalStatus(true)
                setUpdateUUId(uuid)
                setRequestStamp(request_timestamp)
            }
            else {
                setModalStatus(false)
                toast.error("No Profile Upadate")
                navigate(`/authorised/listing-details/${leadObj?.leadId}`)
            }
        }
        else if (data?.status === 0) {
            let res = await isUserOnlineLeads(leadObj);
            updateUserUUId(res)

        }
        else {
            toast.error(data?.message)
        }
    }

    const onVerifyOtp = async (event) => {
        event.preventDefault();
        let { leadId } = leadObj;
        let isUserName = isVerifiedName ? isVerifiedName : leadId;

        let params = {
            "username": isUserName,
            "otpVerify": otpVerify,
            "requestStamp": requestStamp
        }
        const data = await UserOtpVerify(params)
        if (data?.status === 1) {
            setUserOtpVerify("1")
            toast.success(data?.message)
            setModalStatus(false)
            if (isUpadateProfile) {
                UpdateTnc(isUpadateProfile)
                navigate(`/authorised/listing-details/${isUpadateProfile}`)
            }
            else {
                UpdateTnc(leadObj?.leadId)
                navigate(`/authorised/listing-details/${leadObj?.leadId}`)
            }
        }
        else {
            toast.error(data?.message)
        }
    }



    const getBdeRecentActivityDetails = () => {
        let params = { leadId: leadObj?.leadId, status: "Complete", limit: 1 }
        getBdeRecentActivity(params)
            .then((res) => {
                if (res?.result) {
                    if (res.result.length === 0) {
                        return
                    }
                    setRecentActivityDetails(res.result[0])
                } else {

                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const getEngagementScore = () => {
        return fetchLeadScore(leadObj?.leadId)
            .then((res) => {
                if (res?.loadResponses[0]?.data[0]?.[CubeDataset.LeadActivity.LeadScore])
                    setEngagementScore(res?.loadResponses[0]?.data[0]?.[CubeDataset.LeadActivity.LeadScore])
            })
            .catch((err) => {
                console.error(err, 'error')
            })
    }

    const fetchLeadStageStatus = async () => {
        setIsLoader(false)
        let params = { ...leadObj }
        getLeadStageStatus(params).
            then((res) => {
                if (res?.data) {
                    setStageStatus(res?.data?.leadData)
                    fetchStepperArray(res?.data?.leadData)
                }
            }
            )
            .catch((error) => {
                setIsLoader(true)
                console.log(error)
            })
    }

    const fetchStepperArray = (leadStage) => {
        leadStageStatusDetails(leadObj?.leadId)
            .then(res => {
                let list = res?.result
                list = list && list?.length > 0 ? list.filter(obj => obj && obj[CubeDataset.LeadStageStatus.stageName]).map(obj => { return { stageName: obj[CubeDataset.LeadStageStatus.stageName], statusName: obj["statusName"] } }) : []
                setCubeStepperList(list)
                //console.log(list)
                if (leadStage?.stageName && list) {
                    let stageName = leadStage?.stageName;
                    let params = { stageName: stageName }
                    return getStageByKey(params)
                } else {
                    return false
                }
            })
            .then(
                res => {
                    if (res) {
                        let list = res?.result?.cycleId?.linkedStage
                        list = list && list.length > 0 ? list.map(obj => { return { stageName: obj['stageName'] } }) : []
                        setCrmStepperList(list)
                        setCurrentStage(res?.result?.stageName)
                        setCycleName(res?.result?.cycleId?.cycleName)
                    }
                    setIsLoader(true)
                }
            ).catch(
                err => {
                    setIsLoader(true)
                }
            )
    }
    const stepperList = mergeStepperList(cubeStepperList, crmStepperList)

    const listCurrentStageIndex = stepperList?.findIndex(list => list?.['stageName'] === currentStage)


    const toCreateOrder = () => {
        let orderUrl = redirectPage(leadObj)?.url
        let data = loginUserData.userData
        let activityData = {
            empCode: data.employee_code,
            landing_page: 'Lead Detail Page',
            action: 'Create Order',
            event_type: 'Create Order',
            eventStep: orderUrl,
            click_type: 'Create Order',
            eventData: leadObj
        }
        activityLogger(activityData)
        navigate('/authorised/create-order', { state: { id: 1, redirectUrl: orderUrl } })
    }

    const toLeadName = () => {
        //navigate('/authorised/lead-detail', { state: { id: leadObj?.leadId } })
    }

    const toCollectPayment = () => {
        toggleCollectPayment()
    }

    const handleCoupanRequest = () => {
        //setCoupanModal(true)
        navigate(`/authorised/coupan-request/${leadObj.leadId}`)
    }

    const leadOnlinePaymentDetails = (event) => {
        event.preventDefault();

        if (amountCollect === undefined) {
            toast.error('Enter amount')
            return
        }
        if (amountCollect <= 0) {
            toast.error('Enter valid amount')
            return
        }

        if (!checked) {
            if (!checkValidName(name)) {
                toast.error('Enter valid name')
                return
            }

            if (!checkValidPhone(mobile)) {
                toast.error('Enter Valid phone number')
                return
            }
            if (!checkValidEmail(email)) {
                toast.error('Enter valid email')
                return
            }

        }
        let params = {
            checksum: getOnlinePaymentValue()?.checkSum,
            empcode: getOnlinePaymentValue()?.empId,
            contact_no: mobile ? mobile : leadObj?.mobile,
            student_email: email ? email : leadObj?.email,
            onlineprice: amountCollect,
            student_name: name ? name : leadObj?.name,
            leadno: leadObj?.leadId,
            source: 'crm',
            onlinepayment_linktype: '',
            salesforce_orderno: ''
        }
        let newObj = {
            activityType: "payment_link",
            leadId: leadObj?.leadId,
            name: name ? name : leadObj?.name,
            createdBy: loginUserData?.loginData?.uuid,
            createdByRoleName: loginUserData?.userData?.crm_role,
            createdByProfileName: loginUserData?.userData?.crm_profile,
            createdByName: loginUserData?.userData?.name,
        }



        collectPayment(params)
            .then((res) => {
                setCompletePayment(true)
                setPaymentCollect(false)
                setAmountCollect()
                setChecked(false)
                setName('')
                setEmail('')
                setMobile('')
                if (res?.data_array) {
                    newObj = {
                        ...newObj,
                        activityDetail: {
                            collectPaymentID: res?.data_array?.id,
                            paymentUrl: res?.data_array?.payment_url,
                            paymentAmount: amountCollect
                        }
                    }
                }
                check(newObj)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const check = (newObj) => {
        markBdeActivity(newObj)
            .then((res) => {
                // console.log(res,'.......res')
                if (res?.result?.status === "OK")
                    toast.success(res?.message)
            })
            .catch((err) => {
                console.error(err, 'error')
            })
    }

    const isVerifiedUser = async () => {
        const { leadId } = leadObj;
        let res = await checkIsUserVerified(leadId);
        setProfile(res?.data?.profile_image);
        setVerifiedName(res?.data?.username);
        setVerifiedNumber(res?.data?.phoneNumber);
        setUserOtpVerify(res?.data?.otp_verified);
    }

    const resendOtp = async () => {

        let Data = {
            "username": isVerifiedName,
            "mobile_number": isVerifiedNumber
        }

        const res = await ResendOtpVerify(Data);
        if (res?.status == 1) {
            setModalStatus(true)
            setOtpVerify('')
            setRequestStamp(res?.request_timestamp)
        }
    }

    const fetchInterestShown = () => {
        LeadDetailsInterest(leadObj?.leadId)
            .then((res) => {
                if (res?.result) {
                    setLeadInterestList(res?.result)
                }
            })
            .catch((err) => {
                console.error(err, 'error')
            })

    }
    let len = leadInterestList.length



    const handleVerifyDateNew = (value) => {
        let verifyDate = moment.utc(value).local().format('DD/MM/YYYY ')
        setNewVerifyDate(verifyDate)
    }

    useEffect(() => {
        document.getElementById("main-content").style.overflow = 'hidden';
        let top_header = document.querySelector('.main-header.mobile-header')
        if (top_header && window.innerWidth <= 1024) top_header.style.display = 'none'
        getBdeRecentActivityDetails()
        fetchLeadStageStatus()
        isVerifiedUser();
        setCookieData()
            .then(
                doc => {
                    setCookieIFrame(doc)
                }
            )
        let data = loginUserData.userData
        let activityData = {
            empCode: data.employee_code,
            landing_page: 'Lead Detail Page',
            action: 'View Lead',
            event_type: 'View Lead',
            eventStep: 'View Lead',
            click_type: 'View Lead',
            eventData: leadObj
        }
        activityLogger(activityData)
    }, [])

    const hierachyDetails = () => {
        let role_name = loginUserData?.userData?.crm_role
        let roleList = DecryptData(localStorage.getItem('childRoles'))
        let roleArr = roleList ? roleList?.map(obj => obj.roleName) : []
        roleArr.push(role_name)
        //console.log(roleArr,leadObj?.assignedToRoleName,roleArr.indexOf(leadObj?.assignedToRoleName))
        if (settings.ADMIN_ROLES.indexOf(role_name) < 0 && roleArr.indexOf(leadObj?.assignedToRoleName) < 0) {
            // console.log(true)
            toast.dismiss()
            toast.error('You are not authorized to access this Lead')
            navigate("/authorised/lead-Assignment")
            window.location.reload(false);
        }
    }

    const handleLastActivity = (data) => {
        let activity = data?.[0]?.['created_at']
        setLastActivity(activity)
        setNewLoader(true)
    }

    function handleKeyPress(event) {   // for submitting otp modal on pressing enter key
        if (event.key === 'Enter') {
            formRef.current.submit();
        }
    }

    useEffect(() => {
        hierachyDetails()
    }, [leadObj])

    useEffect(() => {
        getEngagementScore()
        fetchInterestShown()
    }, [leadObj?.leadId])

    useEffect(() => {
        let { leadId } = leadObj
        if (isUpadateProfile) {
            navigate({ pathname: `/authorised/listing-details/${isUpadateProfile}`, search: queryParams.toString() });
            window.location.reload(false);
        }
        else {
            navigate({ pathname: `/authorised/listing-details/${leadId}`, search: queryParams.toString() });
        }
    }, [close_modal]
    )

    return (
        <div>
            {cookieFrame}
            <div className={classes.headerContainer}>
                <img onClick={() => navigate(-1)} src='/back arrow.svg' />
                <div className={classes.headerTitle}>
                    My Lead
                </div>
            </div>

            <div className="listing-containerPage">
                <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                    separator={<img src={BredArrow} />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>

                <Page
                    title="Extramarks | Listing Details"
                    className="main-container listing-container datasets_container"
                >
                    <Grid alignItems="flex-start" container spacing={1}>
                        <Grid
                            container
                            direction="row"
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            spacing={1}
                        >
                            <Grid className={`${classes.listingGrid}`} item xs={12} sm={4} md={4.5} lg={4.5}>
                                <Card className={`${`${classes.root}  ${classes.stapper}`} `} variant="outlined">
                                    <Box className={classes.stapperBox}>
                                        <br />
                                        <Stepper activeStep={step1Date.length >= 2 ? 2 : 1} alternativeLabel className={classes.alternativeLabelClass}>
                                            {step1.map((label, i) => (
                                                <Step key={label}>
                                                    <StepLabel
                                                        icon={i >= step1Date.length ? "X" : ""}
                                                    >
                                                        <p className="listing-step-label">
                                                            {label}
                                                        </p>
                                                        <p key={i} className="listing-step-label-date">{step1Date[i]}</p>
                                                    </StepLabel>
                                                </Step>

                                            ))}
                                        </Stepper>
                                    </Box>
                                    <Divider />

                                    <div className="profileContainer">
                                        <Box
                                            className={classes.title}
                                            color="textSecondary"

                                        >
                                            <div className="listing-student-details" >
                                                <Avatar className={`listing-student-avatar ${classes.listingStudentAvtar}`} >{isProfile ? <img src={isProfile} /> : leadObj?.name?.substring(0, 1)}</Avatar>
                                                <div className="listing-student-name"
                                                >

                                                    <h2 className="name-head" onClick={toLeadName}>{leadObj?.name ? leadObj?.name : 'NA'}</h2>
                                                    <p className="name-head-sub">{leadObj.userType ? leadObj.userType : 'NA'}  <img src={engagementScore >= 100 ? IconFire : engagementScore >= 50 && engagementScore < 100 ? IconWarm : IconCold} alt="fireIcon" />&nbsp;
                                                        <span className={`${engagementScore >= 100 ? 'hotLead' : engagementScore >= 50 && engagementScore < 100 ? classes.warm : classes.cold}`}>
                                                            {engagementScore >= 100 ? 'Hot' : engagementScore >= 50 && engagementScore < 100 ? 'Warm' : 'Cold'} Lead
                                                        </span>
                                                    </p>
                                                </div>

                                                {(leadObj?.offline) ? <div className={classes.registerBtn}>
                                                    <div onClick={onSubmitHandler} className={classes.registerCreate} >Register
                                                    </div>
                                                </div> : ((isOtpVerify === "0") ? <div className={classes.registerBtn}>
                                                    <div onClick={resendOtp} className={classes.registerCreate} >Verify Otp
                                                    </div>
                                                </div> : "")}
                                            </div>
                                            <div className="listing-school-details" >
                                                <p className="colorBox">
                                                    <span>&nbsp; &nbsp; State:{leadObj?.state ? leadObj?.state : 'NA'} |

                                                        City: {leadObj?.city ? leadObj?.city : 'NA'}

                                                    </span>
                                                </p>
                                            </div>
                                        </Box>
                                        <Box className="listing-activity-details" >
                                            <div className="activity-details">
                                                <p className="tag-list-item">Mobile: <span className="subtag">{leadObj?.mobile ? leadObj?.mobile : "NA"}
                                                </span></p>
                                                <p className="tag-list-item">Email: <span className="subtag">{leadObj?.email ? leadObj?.email : "NA"}
                                                </span></p>
                                                <p className="tag-list-item">Last Activity: <b>{newLoader ? (lastActivity != undefined ? moment(new Date(lastActivity)).format('Do MMM YYYY') : 'NA') : <CircularProgress style={{ width: '13px', height: '13px' }} />} </b><span className="subtag"></span></p>
                                                <p className="tag-list-item">Lead Age: <b>{leadAge} days</b> <span className="subtag"></span></p>
                                                <p className="tag-list-item">Engagement Score: <span className="subtag">{engagementScore}</span></p>
                                            </div>
                                        </Box>

                                        <div className="listing-user-dial">
                                            {
                                                (leadProfileData?.[CubeDataset.Leadassigns.mobile]) && Object.keys(leadStageStatus).length > 0 &&
                                                <Dialer
                                                    leadStageStatus={leadStageStatus}
                                                    leadObj={leadObj}
                                                    loginUserData={loginUserData}
                                                    fetchLeadStageStatus={fetchLeadStageStatus}
                                                    queryParams={queryParams}
                                                    setSearchParams={setSearchParams}
                                                    leadProfileData={leadProfileData}
                                                    CubeDataset={CubeDataset}
                                                />
                                            }
                                            {
                                                <span
                                                    className="user-dial-item cursorPointer"
                                                    onClick={() => setAssignModal(!assignModal)}
                                                >
                                                    <img
                                                        className="user-dial-icon"
                                                        src={AssignFreeTrial}
                                                        alt="dial3"
                                                    />
                                                    <label>Assign Free Trial</label>
                                                </span>
                                            }

                                            <AssignTrialModal
                                                assignModal={assignModal}
                                                setAssignModal={setAssignModal}
                                                leadObj={leadObj}
                                                leadProfileData={leadProfileData}
                                                batchDate={batchDate}
                                                setBatchDate={setBatchDate}
                                            />
                                        </div >

                                        <div className="btnBox">
                                            {!leadObj?.offline && !(isOtpVerify === "0") ?
                                                <>
                                                    <div onClick={toCreateOrder} className="create-button" >Create Order</div>
                                                    <div onClick={toCollectPayment} className="collact-button" >Collect Payment</div>
                                                    <div style={{marginLeft:'10px'}} onClick={handleCoupanRequest} className='collact-button'>Request for coupan</div>

                                                </>
                                                :
                                                <>
                                                    <div className="create-button-disable" >Create Order</div>
                                                    <div className="collact-button-disable" >Collect Payment</div>
                                                    <div style={{marginLeft:'10px'}}  className='collact-button-disable'>Request for coupan</div>
                                                </>
                                            }

                                        </div>
                                        {coupanModal && <CoupanRequestModal coupanModal={coupanModal} setCoupanModal={setCoupanModal}/>}
                                        <div className="listing-lead">
                                            <h3 className="head-lead" >Lead Source</h3>
                                            <div className="textcontainer" >
                                                <p><b> First source / Sub source:</b> {leadInterestList[(len - 1)]?.[CubeDataset.Leadinterests.sourceName] ? leadInterestList[(len - 1)]?.[CubeDataset.Leadinterests.sourceName] : "NA"},

                                                    {leadInterestList[(len - 1)]?.[CubeDataset.Leadinterests.subSourceName] ? leadInterestList[(len - 1)]?.[CubeDataset.Leadinterests.subSourceName] : "NA"}</p>
                                                <p><b> latest source / Sub source: </b> {leadInterestList[0]?.[CubeDataset.Leadinterests.sourceName] ? leadInterestList[0]?.[CubeDataset.Leadinterests.sourceName] : "NA"},

                                                    {leadInterestList[0]?.[CubeDataset.Leadinterests.subSourceName] ? leadInterestList[0]?.[CubeDataset.Leadinterests.subSourceName] : "NA"}</p>
                                                <p><b>Journey Name: </b> {isLoader ? (leadStageStatus.journeyName ? leadStageStatus.journeyName : "NA") : <CircularProgress style={{ width: '13px', height: '13px' }} />}</p>
                                                <p><b>Cycle Name: </b> {isLoader ? (cycleName ? cycleName : "NA") : <CircularProgress style={{ width: '13px', height: '13px' }} />}</p>
                                                <p><b>Status Name: </b> {isLoader ? (leadStageStatus.statusName ? leadStageStatus.statusName : "NA") : <CircularProgress style={{ width: '13px', height: '13px' }} />}</p>
                                            </div >
                                        </div >
                                    </div >
                                </Card >
                            </Grid >

                            <Grid className="card2Container" item xs={12} md={7.5} lg={7.5}>
                                <Card className={`${classes.root}  ${classes.stapper} ${classes.lastContainer}`} variant="outlined">
                                    <br />
                                    {isLoader ?
                                        <ul style={{ listStyleType: 'none' }}>
                                            {stepperList?.map((label, i) => (
                                                <li
                                                    key={i}
                                                    style={{
                                                        display: 'inline-block',
                                                        marginRight: '100px',
                                                        marginLeft: '50px',
                                                        fontWeight: i <= listCurrentStageIndex ? '700' : 'normal'
                                                    }}
                                                >
                                                    {label?.['stageName']} {label?.['statusName']}
                                                </li>
                                            ))}
                                        </ul>
                                        :
                                        <Box sx={{ marginLeft: '20px', marginRight: 20, width: '95%' }} className={`${classes.stpper2Class} profileScroll`}>
                                            <LinearProgress />
                                        </Box>
                                    }
                                    <CardContent>
                                        <Box
                                            className={classes.title}
                                            color="textSecondary"

                                        >
                                            <LeadDetailsAccordion
                                                leadDetails={leadProfileData}
                                                leadObj={leadObj}
                                                leadInterestList={leadInterestList}
                                            />
                                            <LeadDetailsTabs
                                                recentActivityDetails={recentActivityDetails}
                                                leadDetails={leadProfileData}
                                                leadObj={leadObj}
                                                leadStageStatus={leadStageStatus}
                                                handleVerifyDateNew={handleVerifyDateNew}
                                                handleLastActivity={handleLastActivity}

                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid >
                    </Grid >
                </Page >
            </div >
            {paymentCollect && (
                <Modal
                    hideBackdrop={true}
                    open={paymentCollect}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="targetModal1"
                >
                    <Box sx={ModalStyle} style={{ width: 480, outline: 'none' }} className="modalContainer">
                        <div>
                            <img onClick={() => {
                                toggleCollectPayment();
                            }} className='crossIcon' src={CrossIcon} alt="" />
                        </div>
                        <form onSubmit={leadOnlinePaymentDetails} >
                            <Typography variant="h4" className={modalClasses.heading} >
                                Send Detail To
                            </Typography>

                            {
                                (leadObj?.email !== null && leadObj?.mobile !== null) &&
                                <div style={{ display: 'flex', marginTop: '20px' }}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox />} label={<span style={{ fontSize: '14px' }}>Keep the details same as users personal information</span>} onChange={handleCheckboxChange} />
                                    </FormGroup>
                                </div>
                            }
                            <div style={{ display: 'flex', marginTop: '20px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography className={modalClasses.contentText}>
                                    Amount to be collected
                                </Typography>
                                <input className={classes.inputStyle2} type='number' placeholder="Enter Amount" value={amountCollect} onChange={handleAmountCollected} />
                            </div>
                            {
                                !checked &&
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <Typography className={modalClasses.contentText}>
                                            Name &nbsp;&nbsp;
                                        </Typography>
                                        <input className={classes.inputStyle} type='text' placeholder="Name" value={name} onChange={handleNameCollect} />
                                    </div>


                                    <div style={{ marginBottom: '20px' }}>
                                        <Typography className={modalClasses.contentText}>
                                            Mobile &nbsp;&nbsp;
                                        </Typography>
                                        <input className={classes.inputStyle} type='number' placeholder="Mobile" value={mobile} onChange={handleMobileCollect} />
                                    </div>


                                    <div style={{ marginBottom: '30px' }}>
                                        <Typography className={modalClasses.contentText}>
                                            Email Id &nbsp;&nbsp;
                                        </Typography>
                                        <input className={classes.inputStyle} type='text' placeholder="Email Id" value={email} onChange={handleEmailCollect} />
                                    </div>
                                </div>
                            }

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                }}
                            >
                                <Button
                                    style={{ borderRadius: 4 }}
                                    variant="contained"
                                    type="submit"
                                >
                                    Generate Payment Link
                                </Button>

                            </div>
                        </form>
                    </Box >
                </Modal >
            )}

            {completePayment && (
                <Modal
                    hideBackdrop={true}
                    open={completePayment}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="targetModal1"
                >
                    <Box sx={ModalStyle} style={{ width: 550, height: 250 }} className="modalContainer">
                        <div style={{ marginTop: '50px' }}>
                            <img onClick={() => {
                                setCompletePayment(false)
                            }} className='crossIcon' src={CrossIcon} alt="" />
                        </div>
                        <div>
                            <img className={classes.iconStyle} src={PaymentIcon} alt="" />
                        </div>
                        <div style={{
                            op: '347px',
                            left: '525px',
                            width: "418px",
                            textAlign: "center",
                            color: "#202124",
                            marginTop: '20px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <b>Payment Link has been sent successfully!</b>
                        </div>
                    </Box>
                </Modal>
            )
            }

            {
                shw_modal ? <Modal
                    open={shw_modal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <form onSubmit={onVerifyOtp} ref={formRef}>
                            <div className='mdl_close'>
                                <img src="/cancel_icon.svg" onClick={onHandleClose} />
                            </div>
                            <Typography id="modal-modal-title" sx={{ textAlign: 'center' }} variant="h6" component="h2">
                                Enter OTP
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ padding: "30px 0" }} >
                                <OtpInput
                                    numInputs={6}
                                    value={otpVerify}
                                    onChange={handleOtpChange}
                                    className="testOtpBox"
                                    onKeyPress={handleKeyPress}
                                    isInputNum={true}
                                    shouldAutoFocus={true}
                                    separator={<span> <div className='mdlboxGap' /> </span>
                                    }
                                />
                            </Typography>
                            <div className='' style={{ marginLeft: "125px" }}>
                                <button className="verifyOtpbtn" type="submit" >Verify
                                </button>
                            </div>
                        </form>
                    </Box>
                </Modal> : ""
            }
        </div >
    )
}
export default ProfileData
