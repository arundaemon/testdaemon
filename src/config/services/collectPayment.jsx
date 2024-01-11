import axios from "axios"
import { url, endPoint } from '../urls'


export const collectPayment = async (params) => {
    // let { onlineprice, salesforce_orderno, contact_no, student_email, student_name, leadno, empcode,checksum } = params

    // let onlinepayment_linktype = "EMLink";
    // let sf_payid = "";
    // let data = {
    //     "onlinepayment_linktype": onlinepayment_linktype,
    //     "sf_payid": sf_payid,
    //     "onlineprice": onlineprice,
    //     "salesforce_orderno": salesforce_orderno,
    //     "contact_no": contact_no,
    //     "student_email": student_email,
    //     "leadno": leadno,
    //     "checksum":checksum,
    //     "empcode": empcode,
    //     "student_name":student_name,
    //     "source": "crm"
    // };

    let _url = `${url.backendHost}${endPoint.bdeCollectPayment.paymentCollect}`
    return await axios.post(_url,params)

}


