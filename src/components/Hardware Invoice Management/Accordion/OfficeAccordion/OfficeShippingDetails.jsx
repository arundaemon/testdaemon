import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { useStyles } from "../../../../css/HardwareInvoice-css";
import { HardwareContext } from '../../FillOrEditInvoiceDetails';
import { listInvoiceOffice } from '../../../../config/services/packageBundle';
import { getUserData } from '../../../../helper/randomFunction/localStorage';
import _ from 'lodash';
import toast from 'react-hot-toast';

const OfficeShippingDetails = () => {
  const { implementationDetails, hardwareInvoiceData, setHardwareInvoiceData, errorData, errorCheck } = useContext(HardwareContext)
  const [OfficeList, setOfficeList] = useState([])
  const [selectedOffice, setSelectedOffice] = useState()
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles();
  let currentUrl = window.location.pathname
  let updateOfficeUrl = currentUrl.includes("/authorised/update-office-invoice")

  const getSenderList = async () => {
    let params = {
      uuid,
      page_offset: 0,
      page_size: 100,
      status: [1],
      invoice_for: "HW"
    }
    await listInvoiceOffice(params)
      .then(res => {
        let data = res?.data?.invoice_office_details
        setOfficeList(data)
      })
      .catch(err => {
        toast.error('Something went wrong')
        console.error(err, 'Error while fetching listInvoiceOffice')
      })
  }

  const handleOfficeAddress = (item) => {
    setSelectedOffice(item)
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        bill_from_office_id: item?.office_id,
      }
    })
    delete errorData?.["bill_from_office_id"]
  }

  useEffect(() => {
    getSenderList();
  }, [])

  useEffect(() => {
    if (hardwareInvoiceData && hardwareInvoiceData.bill_from_sender_id && updateOfficeUrl) {
      const senderId = hardwareInvoiceData.bill_from_sender_id;
      const senderObject = OfficeList?.find(item => item.office_id === senderId);
      if (senderObject) {
        setSelectedOffice(senderObject);
        setHardwareInvoiceData(prevData => ({
          ...prevData,
          bill_from_office_id: senderObject.office_id
        }));
      }
    }
  }, [OfficeList?.length > 0]);

  return (
    <div style={{ display: 'flex' }}>
      <div className={classes.labelDivContainer}>
        <div className={classes.labelDivShipping}>
          <label className={classes.label}>Office Address <span style={{ color: 'red' }}>*</span></label>
          <Select
            options={OfficeList}
            getOptionLabel={(option) => (option.office_state_name + " - " + option.office_address)}
            getOptionValue={(option) => option.office_id}
            value={selectedOffice}
            onChange={handleOfficeAddress}
          />
          {errorCheck &&
            <p className={classes.alert}>{errorData?.bill_from_office_id}</p>
          }
        </div>
      </div>
    </div>
  )
}
export default OfficeShippingDetails