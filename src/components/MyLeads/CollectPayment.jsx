import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { useLocation } from 'react-router-dom';
import { redirectPage } from '../../helper/randomFunction'
import { getOnlinePaymentValue } from '../../helper/randomFunction'
import { collectPayment } from '../../config/services/collectPayment';
import settings from '../../config/settings';
import { toast } from 'react-hot-toast';



const CollectPayment = () => {
    const [paymentUrl, setPaymentUrl] = useState('')
    const user = settings.ONLINE_LEADS;
    const location = useLocation();
    const leadProfileData = location.state.leadProfileData
    const url = redirectPage()

    const leadOnlinePaymentDetails = () => {
        let params = {
            checksum: getOnlinePaymentValue()?.checkSum, empcode: getOnlinePaymentValue()?.empId, contact_no: leadProfileData?.[`${user}.mobile`],
            student_email: leadProfileData?.[`${user}.email`], student_name: leadProfileData?.[`${user}.username`], leadno: leadProfileData?.[`${user}.uuid`], source: 'crm', onlinepayment_linktype: '', onlineprice: '', salesforce_orderno: ''
        }
        collectPayment(params)
            .then((res) => {
                setPaymentUrl(res?.data?.data_array?.payment_url)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        leadOnlinePaymentDetails()
    }, [])

    return (
        <div>
            <Iframe src={url} width="100%" height="880px" />
        </div>
    )
}
export default CollectPayment