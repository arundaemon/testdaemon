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
import ViewLeadAccordion from './ViewLeadAccordion';



const ViewProfileData = ({ leadProfileData, leadObj }) => {
    const loginUserData = getLoginUserData()
    const CurrentDate = moment();

    const [recentActivityDetails, setRecentActivityDetails] = useState({});
    const [leadStageStatus, setStageStatus] = useState({})
    const registrationDate = leadObj?.registrationDate ? leadObj?.registrationDate.format('DD/MM/YYYY') : ""
    const [newVerifyDate, setNewVerifyDate] = useState('')
    const createDateLeadAge = leadObj?.createDate
    const created = leadObj?.createDate.format('DD/MM/YYYY')
    const leadAge = CurrentDate.diff(createDateLeadAge, 'days') + 1
    let step1 = ["Created"];
    let step1Date = [created];
    const classes = useStyles();
    const navigate = useNavigate();
    const [engagementScore, setEngagementScore] = useState(0)
    const [leadInterestList, setLeadInterestList] = useState([])
    const [crmStepperList, setCrmStepperList] = useState([])
    const [currentStage, setCurrentStage] = useState()
    const [cubeStepperList, setCubeStepperList] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [cycleName, setCycleName] = useState('')
    const [isProfile, setProfile] = useState(null);
    const [lastActivity, setLastActivity] = useState('');
    const [newLoader, setNewLoader] = useState(false)
    const [cookieFrame, setCookieIFrame] = useState(null)

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

    useEffect(() => {
        hierachyDetails()
    }, [leadObj])

    useEffect(() => {
        getEngagementScore()
        fetchInterestShown()
    }, [leadObj?.leadId])

    useEffect(()=>fetchInterestShown())


    return (
        <div>
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

                                                    <h2 className="name-head">{leadObj?.name ? leadObj?.name : 'NA'}</h2>
                                                    <p className="name-head-sub">{leadObj.userType ? leadObj.userType : 'NA'}  <img src={engagementScore >= 100 ? IconFire : engagementScore >= 50 && engagementScore < 100 ? IconWarm : IconCold} alt="fireIcon" />&nbsp;
                                                        <span className={`${engagementScore >= 100 ? 'hotLead' : engagementScore >= 50 && engagementScore < 100 ? classes.warm : classes.cold}`}>
                                                            {engagementScore >= 100 ? 'Hot' : engagementScore >= 50 && engagementScore < 100 ? 'Warm' : 'Cold'} Lead
                                                        </span>
                                                    </p>
                                                </div>
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
                                            <ViewLeadAccordion
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
            </div>
        </div >
    )
}
export default ViewProfileData;