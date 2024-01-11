import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { useStyles } from "../../../css/HardwareInvoice-css";
import _ from 'lodash';
import { Grid } from '@mui/material';
import { SoftwareContext } from '../UpdateSoftwareInvoiceForm';

const InvoiceDetails = () => {
  const { softwareInvoiceData, setSoftwareInvoiceData } = useContext(SoftwareContext)
  const classes = useStyles();

  let supplyTypeOptions = [
    {
      label: 'B2B-Business to Business',
      value: 'B2B'
    }
  ]

  let transactionTypeOptions = [
    {
      label: 'REG-Regular',
      value: 'REG'
    }
  ]

  let invoiceStatusOptions = [
    {
      label: 'Invoice Sent',
      value: '2'
    },
    {
      label: 'Cancelled',
      value: '3'
    }
  ]

  const handleInvoiceStatus = (data) => {
    let { value } = data
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        invoice_status: value,
        invoiceStatus: data
      }
    })
  }

  return (
    <Grid container style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
      <Grid item xs={3} style={{ marginRight: '20px' }}>
        <label className={classes.label}>Invoice Status</label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={softwareInvoiceData?.invoiceStatus}
          options={invoiceStatusOptions}
          onChange={handleInvoiceStatus}
        />
      </Grid>
      <Grid item xs={3} style={{ marginRight: '20px' }}>
        <label className={classes.label}>Supply Type</label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={supplyTypeOptions?.[0]}
          options={supplyTypeOptions}
        />
      </Grid>
      <Grid item xs={3} style={{ marginRight: '20px' }}>
        <label className={classes.label}>Transaction Type</label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          options={transactionTypeOptions}
          value={transactionTypeOptions?.[0]}
        />
      </Grid>
    </Grid>

  )
}
export default InvoiceDetails