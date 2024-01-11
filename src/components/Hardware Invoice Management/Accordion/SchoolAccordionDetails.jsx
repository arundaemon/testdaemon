import { Grid, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import { getUserData } from '../../../helper/randomFunction/localStorage';
import _ from 'lodash';

const SchoolAccordionDetails = () => {
  const { implementationDetails, hardwareInvoiceData, setHardwareInvoiceData } = useContext(HardwareContext)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles();

  const handleDetails = (data) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        uuid: uuid,
        bill_to_office_id: "",
        hw_invoice_for: "SCHOOL",
        school_code: data?.schoolCode,
        implementation_id: data?.impFormNumber,
        po_code: data?.purchaseOrderCode,
        quotation_code: data?.quotationCode,
      }
    })
  }

  useEffect(() => {
    if (implementationDetails && Object.keys(implementationDetails).length > 0) {
      handleDetails(implementationDetails)
    }
  }, [implementationDetails])

  return (
    <div>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <Typography component={'h4'} >School Code</Typography>
            <Typography component={'p'}>{implementationDetails?.schoolCode}</Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <Typography component={'h4'} >School Name</Typography>
            <Typography component={'p'}>{implementationDetails?.schoolName}</Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <Typography component={'h4'} >Implementation ID</Typography>
            <Typography component={'p'}>{implementationDetails?.impFormNumber}</Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={4} >
          <div className='crm-page-invoice-accordion-form-item'>
            <Typography component={'h4'} >PO Number</Typography>
            <Typography component={'p'}>{implementationDetails?.purchaseOrderCode}</Typography>
          </div>
        </Grid>
        {/* <Grid item xs={4} sx={{ marginTop: '20px' }}>
          <Typography className={classes.label}>PO Date</Typography>
        </Grid> */}
      </Grid>
    </div>
  )
}

export default SchoolAccordionDetails