import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import FormDatePicker from '../../../theme/form/theme2/FormDatePicker';
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import { listInvoiceOffice } from '../../../config/services/packageBundle';
import { getUserData } from '../../../helper/randomFunction/localStorage';
import _ from 'lodash';
import toast from 'react-hot-toast';
import moment from 'moment';
import { stateCodeMapping } from '../../../config/interface/local';
import { Grid } from '@mui/material';
import { ReactComponent as DropDownIcon } from "../../../assets/icons/icon-dropdown-2.svg";

const ShippingAccordionDetail = () => {
  const { implementationDetails, hardwareInvoiceData, setHardwareInvoiceData, errorData, errorCheck } = useContext(HardwareContext)
  const [senderList, setSenderList] = useState([])
  const [selectedSender, setSelectedSender] = useState()
  const [selectedSenderState, setSelectedSenderState] = useState()
  const [sendToState, setSendToState] = useState({})
  const [lastInvoiceDate, setLastInvoiceDate] = useState(null)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles();
  const currentUrl = window.location.href
  let UpdatehardwareInvoiceUrl = currentUrl.includes('/authorised/update-invoice')

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  const getSenderList = async () => {
    try {
      let params = {
        uuid,
        page_offset: 0,
        page_size: 100,
        status: [1],
        invoice_for: "HW",
      };

      const res = await listInvoiceOffice(params);
      let data = res?.data?.invoice_office_details;
      let lastDate = res?.data?.last_generated_invoice_date
      setLastInvoiceDate(lastDate)

      if (data) {
        setSenderList(data);
      }

    } catch (err) {
      toast.error('Something went wrong');
      console.error('Error while fetching listInvoiceOffice:', err);
    }
  };


  const handleSender = (item) => {
    setSelectedSender(item)
    setSelectedSenderState({ label: item?.office_state_name, value: item?.office_state_name })
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        bill_from_office_id: item?.office_id,
        signatory_details: {
          signatory_name: item?.authorised_signatory_name,
          signatory_designation: item?.authorised_signatory_designation
        }
      }
    })
    delete errorData?.["bill_from_office_id"]
  }

  const handleRecieverDetails = (data) => {
    setSendToState({ label: data?.schoolStateName, value: data?.schoolStateName })
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        billto_details: {
          name: data?.schoolName,
          address: data?.schoolAddress,
          state_name: data?.schoolStateName,
          state_code: stateCodeMapping[data?.schoolStateCode],
          pincode: data?.schoolPinCode,
        },
        uuid: uuid,
        hw_invoice_for: "SCHOOL",
        school_code: data?.schoolCode,
        implementation_id: data?.impFormNumber,
        po_code: data?.purchaseOrderCode,
        quotation_code: data?.quotationCode,
      }
    })
  }

  const handleBillingAmount = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        total_billing_amount: e.target.value
      }
    })
    delete errorData?.["invoice_date"]
  }

  const filledDetails = (data, list) => {
    let senderId = data?.bill_from_sender_id;
    let senderObjectArray = list?.filter(item => item?.office_id === senderId);
    if (senderObjectArray && senderObjectArray.length > 0) {
      setSelectedSender(senderObjectArray[0]);
      setSelectedSenderState({ label: senderObjectArray[0]?.office_state_name, value: senderObjectArray[0]?.office_state_name })
      setHardwareInvoiceData(prevData => {
        return {
          ..._.cloneDeep(prevData),
          bill_from_office_id: senderObjectArray?.[0]?.office_id
        }
      })
    }
  }

  useEffect(() => {
    getSenderList()
    if (implementationDetails && Object.keys(implementationDetails).length > 0) {
      handleRecieverDetails(implementationDetails)
    }
  }, [implementationDetails])


  useEffect(() => {
    if (!hardwareInvoiceData || !senderList) return
    if (!hardwareInvoiceData?.bill_from_office_id)
      filledDetails(hardwareInvoiceData, senderList)
  }, [currentUrl, hardwareInvoiceData, senderList])

  return (
    <div >
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Sender <span style={{ color: 'red' }}>*</span></label>
            <Select
              options={senderList}
              getOptionLabel={(option) => (option.office_state_name + " - " + option.office_address)}
              getOptionValue={(option) => option.office_id}
              value={selectedSender}
              onChange={handleSender}
              classNamePrefix="select"
              className="crm-form-input crm-react-select dark"
              components={{ DropdownIndicator }}
            />
            {errorCheck &&
              <p className={classes.alert}>{errorData?.bill_from_office_id}</p>
            }
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label>Send from (state) Autofill</label>
            <Select value={selectedSenderState} disable={true}
              classNamePrefix="select"
              className="crm-form-input crm-react-select dark"
              components={{ DropdownIndicator }}
            />

          </div>
        </Grid>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label>Receiver</label>
            <p>{`${implementationDetails?.schoolCode} - ${implementationDetails?.schoolName} - ${implementationDetails?.schoolAddress}`}</p>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Send To (state)</label>
            <Select
              value={sendToState}
              classNamePrefix="select"
              className="crm-form-input crm-react-select dark"
              components={{ DropdownIndicator }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Implementation Form</label>
            <p>{`${implementationDetails?.impFormNumber}`}</p>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Total Billing Amount</label>
            <input type="number" id="outlined-basic" disabled={true}
              value={hardwareInvoiceData?.total_billing_amount} onChange={handleBillingAmount}
              className="crm-form-input dark"
            />
            {errorCheck && <p className={classes.alert}>{errorData?.total_billing_amount}</p>}
          </div>
        </Grid>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Invoice Date <span style={{ color: 'red' }}>*</span></label>
            {(UpdatehardwareInvoiceUrl && hardwareInvoiceData?.invoice_date) &&
              <FormDatePicker
                value={hardwareInvoiceData?.invoice_date}
                handleSelectedValue={date => {
                  setHardwareInvoiceData(prevData => {
                    return {
                      ..._.cloneDeep(prevData),
                      invoice_date: moment(new Date(date)?.toDateString()).format('YYYY-MM-DD')
                    }
                  })
                  delete errorData?.["invoice_date"]
                }}
                placeholder="Select Invoice Date"
                minDateValue={lastInvoiceDate}
                maxDateValue={new Date()}
                className="crm-form-input dark"
                iconColor='primary'
              />
            }
            {!UpdatehardwareInvoiceUrl &&
              <FormDatePicker
                value={hardwareInvoiceData?.invoice_date}
                handleSelectedValue={date => {
                  setHardwareInvoiceData(prevData => {
                    return {
                      ..._.cloneDeep(prevData),
                      invoice_date: moment(new Date(date)?.toDateString()).format('YYYY-MM-DD')
                    }
                  })
                  delete errorData?.["invoice_date"]
                }}
                placeholder="Select Invoice Date"
                minDateValue={lastInvoiceDate}
                maxDateValue={new Date()}
                className="crm-form-input dark"
                iconColor='primary'
              />
            }
            {errorCheck &&
              <p className={classes.alert}>{errorData?.invoice_date}</p>
            }
          </div>
        </Grid>
      </Grid>

    </div>
  )
}

export default ShippingAccordionDetail