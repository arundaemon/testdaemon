import DatePicker from "react-datepicker";
import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getConfigDetails, updateConfigDetails } from '../../config/services/config'
import Page from '../Page'
import { toast } from "react-hot-toast";

const ConfigDetails = () => {
    const [id, setId] = useState('')
    const [callUrl, setCallUrl] = useState('')
    const [leadAction, setLeadAction] = useState('')
    const [leadApiKey, setLeadApiKey] = useState('')
    const [leadFreeTrialApproval, setLeadFreeTrialApproval] = useState('')
    const [orderActivity, setOrderActivity] = useState('')
    const [paymentLinkActivity, setPaymentLinkActivity] = useState('')
    const [trialActivity, setTrialActivity] = useState('')
    const [kNumbers, setKNumbers] = useState([])
    const [appVersion, setAppVersion] = useState('')
    const [createdDate, setCreatedDate] = useState(null)
    const [updateDate, setUpdateDate] = useState(null)
    const [xApiKey, setXApiKey] = useState('')
    const [authorization, setAuthorization] = useState('')
    const [inputChange, setInputChange] = useState(false)


    const handleCallUrl = (e) => {
        setCallUrl(e.target.value)
        setInputChange(true)
    }

    const handleLeadAction = (e) => {
        setLeadAction(e.target.value)
        setInputChange(true)

    }

    const handleLeadApiKey = (e) => {
        setLeadApiKey(e.target.value)
        setInputChange(true)

    }

    const handleLeadFreeTrialApproval = (e) => {
        setLeadFreeTrialApproval(e.target.value)
        setInputChange(true)

    }

    const handleOrderActivity = (e) => {
        setOrderActivity(e.target.value)
        setInputChange(true)

    }

    const handlePaymentLinkActivity = (e) => {
        setPaymentLinkActivity(e.target.value)
        setInputChange(true)

    }

    const handleTrialActivity = (e) => {
        setTrialActivity(e.target.value)
        setInputChange(true)

    }

    const handleKNumbers = (e) => {
        const value = e?.target?.value
        let values = value ? value?.split(',') : []
        setKNumbers(values)
        setInputChange(true)
    }

    const handleXApiKey = (e) => {
        setXApiKey(e.target.value)
        setInputChange(true)

    }

    const handleAuthorisation = (e) => {
        setAuthorization(e.target.value)
        setInputChange(true)
    }

    const handleAppversion = (e) => {
        setAppVersion(e.target.value)
        setInputChange(true)
    }

    const handleUpdate = () => {
        if (!inputChange) {
            toast.error("Please make any change")
            return
        }
        let filledDetails = {}
        filledDetails.callUrl = callUrl;
        filledDetails.myLeadsAction = leadAction;
        filledDetails.myLeadsApiKey = leadApiKey
        filledDetails.myLeadsFreeTrailApproval = leadFreeTrialApproval
        filledDetails.orderActivity = orderActivity
        filledDetails.paymentlinkActivity = paymentLinkActivity
        filledDetails._id = id
        filledDetails.xApiKey = xApiKey
        filledDetails.authorization = authorization
        filledDetails.trialActivity = trialActivity
        filledDetails.KNumber = kNumbers
        filledDetails.appVersion = appVersion
        updateConfig(filledDetails)
    }

    const fetchConfigDetails = () => {
        getConfigDetails()
            .then((res) => {
                let data = res?.data[0]
                setId(data?._id)
                setCallUrl(data?.callUrl)
                setLeadAction(data?.my_leads_action)
                setLeadApiKey(data?.my_leads_api_key)
                setLeadFreeTrialApproval(data?.my_leads_freetrail_approval)
                setOrderActivity(data?.orderActivity)
                setPaymentLinkActivity(data?.paymentlinkActivity)
                setTrialActivity(data?.trialActivity)
                setKNumbers(data?.K_Number)
                setCreatedDate(data?.createdAt)
                setUpdateDate(data?.updatedAt)
                setAuthorization(data?.Authorization)
                setXApiKey(data?.x_api_key)
                setAppVersion(data?.appVersion)
            })
            .catch((err) => {
                console.log(err, '..error')
            })
    }

    const updateConfig = (data) => {
        updateConfigDetails(data)
            .then((res) => {
                toast.success(res?.message)
                setInputChange(false)
            })
            .catch((err) => {
                console.log(err)
            })

    }


    useEffect(() => {
        fetchConfigDetails()
    }, [])

    return (
        <Page title="Extramarks | Update Config Details" className="main-container compaignManagenentPage datasets_container targetIncentiveManagementContainer">
            <div className='createCampaign'>

                <div className='baner-boxcontainer '>
                    <h4 className='heading' >Update Config Details</h4>
                    <div className='lableContainer'>
                        <div className='containerCol'>

                            <div className='box'>
                                <label className='boxLabel'>Call Url</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={callUrl} onChange={handleCallUrl} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>My Leads Free Trial Approval</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={leadFreeTrialApproval} onChange={handleLeadFreeTrialApproval} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>Trial Activity</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={trialActivity} onChange={handleTrialActivity} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>K Numbers</label>
                                <TextField className='label-text' maxRows={4} variant="outlined" size='small' multiline value={kNumbers} onChange={handleKNumbers} />
                            </div>

                        </div>

                        <div className='containerCol'>

                            <div className='box'>
                                <label className='boxLabel'>My Leads Action</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={leadAction} onChange={handleLeadAction} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>Order Activity</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={orderActivity} onChange={handleOrderActivity} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>X Api Key</label>
                                <TextField className='label-text' variant="outlined" size='small' multiline value={xApiKey} onChange={handleXApiKey} />
                            </div>

                            {/* <div className='box' style={{ marginRight: '10px' }}>
                                <label className='boxLabel'>Created Date</label>
                                <DatePicker disabled className="dateInput" selected={new Date(createdDate)} onChange={date => setCreatedDate(date)} />
                            </div> */}
                        </div>

                        <div className='containerCol'>
                            <div className='box'>
                                <label className='boxLabel'>My Leads Api Key</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={leadApiKey} onChange={handleLeadApiKey} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>Payment Link Activity</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={paymentLinkActivity} onChange={handlePaymentLinkActivity} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>Authorisation</label>
                                <TextField className='label-text' required name="campaignName" type="text" id="outlined-basic" variant="outlined" value={authorization} onChange={handleAuthorisation} />
                            </div>

                            <div className='box'>
                                <label className='boxLabel'>App Version</label>
                                <TextField className='label-text' required name="appVersion" type="text" id="outlined-basic" variant="outlined" value={appVersion} onChange={handleAppversion} />
                            </div>

                            {/* <div className='box'>
                                <label className='boxLabel'>Updated Date</label>
                                <DatePicker className="dateInput" selected={new Date(updateDate)} onChange={date => setUpdateDate(date)} />
                            </div> */}

                        </div>
                    </div>
                    <div className='btnContainer'>
                        <div className='saveBtn' variant='contained' onClick={handleUpdate}>Update</div>
                    </div>
                </div>
            </div>

        </Page >

    )
}

export default ConfigDetails