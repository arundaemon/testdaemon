import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { useStyles } from "../../../../css/HardwareInvoice-css";
import { HardwareContext } from '../../FillOrEditInvoiceDetails';
import { listInvoiceOffice } from '../../../../config/services/packageBundle';
import { getUserData } from '../../../../helper/randomFunction/localStorage';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { stateCodeMapping } from '../../../../config/interface/local';

const OfficeConsigneeDetails = () => {
  const { hardwareInvoiceData, setHardwareInvoiceData, errorData, errorCheck } = useContext(HardwareContext)
  const [OfficeList, setOfficeList] = useState([])
  const [selectedShipToOffice, setSelectedShipToOffice] = useState()
  const [selectedBillToOffice, setSelectedBillToOffice] = useState()
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles();
  let currentUrl = window.location.pathname
  let updateOfficeUrl = currentUrl.includes("/authorised/update-office-invoice")

  const getSenderList = () => {
    let params = {
      uuid,
      page_offset: 0,
      page_size: 100,
      status: [1],
      invoice_for: "HW"
    }
    listInvoiceOffice(params)
      .then(res => {
        let data = res?.data?.invoice_office_details
        setOfficeList(data)
      })
      .catch(err => {
        toast.error('Something went wrong!')
        console.error(err, 'Error while fetching listInvoiceOffice')
      })
  }

  const handleShipToOfficeAddress = (item) => {
    setSelectedShipToOffice(item)
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        invoice_date: new Date(),
        consignee_details: {
          name: item?.office_name,
          address: item?.office_address,
          state_name: item?.office_state_name,
          state_code: item?.office_state_code,
          pincode: item?.office_pincode,
        },
      }
    })
    delete errorData?.["consignee_details"]
  }

  const handleBillToOfficeAddress = (item) => {
    setSelectedBillToOffice(item)
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        bill_to_office_id: item?.office_id,
        billto_details: {
          name: item?.office_name,
          address: item?.office_address,
          state_name: item?.office_state_name,
          state_code: item?.office_state_code,
          pincode: item?.office_pincode,
        },
      }
    })
    delete errorData?.["bill_to_office_id"]
  }

  const fillDetails = async (details, OfficeListArray) => {
    try {
      let billToDetails = await OfficeListArray?.find(officeDetail => officeDetail?.office_id === details?.bill_to_sender_id);

      let shipToDetails = await OfficeListArray?.filter(officeDetail => officeDetail?.office_state_code === details?.consignee_details?.state_code);

      setSelectedShipToOffice(shipToDetails)
      setSelectedBillToOffice(billToDetails)

      // Assuming bill_from_sender_id and bill_to_sender_id are valid properties
      details.bill_from_office_id = details?.bill_from_sender_id
      details.bill_to_office_id = details?.bill_to_sender_id
      details.billto_details = details?.bill_to_details

      // delete details?.bill_to_details
      // delete details?.bill_from_sender_id
      // delete details?.bill_to_sender_id

      delete errorData?.bill_to_office_id;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getSenderList();
  }, [])

  useEffect(() => {
    if (updateOfficeUrl) {
      if (!hardwareInvoiceData || !OfficeList) return
      if (hardwareInvoiceData && !hardwareInvoiceData?.billto_details && OfficeList?.length > 0)
        fillDetails(hardwareInvoiceData, OfficeList)
    }

  }, [hardwareInvoiceData, updateOfficeUrl, OfficeList?.length > 0])


  return (
    <div >
      <div className={classes.labelDivContainer}>
        <div className={classes.labelDivShipping}>
          <h4>Ship To</h4>
          <label className={classes.label}>Office Address <span style={{ color: 'red' }}>*</span></label>
          <Select
            options={OfficeList}
            getOptionLabel={(option) => (option.office_state_name + " - " + option.office_address)}
            getOptionValue={(option) => option.office_id}
            value={selectedShipToOffice}
            onChange={handleShipToOfficeAddress}
          />
          {errorCheck &&
            <p className={classes.alert}>{errorData?.consignee_details}</p>
          }
        </div>
      </div>
      <div className={classes.labelDivContainer}>
        <div className={classes.labelDivShipping}>
          <h4>Bill To</h4>
          <label className={classes.label}>Office Address <span style={{ color: 'red' }}>*</span></label>
          <Select
            options={OfficeList}
            getOptionLabel={(option) => (option.office_state_name + " - " + option.office_address)}
            getOptionValue={(option) => option.office_id}
            value={selectedBillToOffice}
            onChange={handleBillToOfficeAddress}
          />
          {errorCheck &&
            <p className={classes.alert}>{errorData?.bill_to_office_id}</p>
          }
        </div>
      </div>
    </div>
  )
}

export default OfficeConsigneeDetails