import { Grid, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { useStyles } from "../../../css/HardwareInvoice-css";
import { getUserData } from '../../../helper/randomFunction/localStorage';
import _ from 'lodash';
import { SoftwareContext } from '../UpdateSoftwareInvoiceForm';
import moment from 'moment';
import ReactSelect from 'react-select';

const SchoolDetails = () => {
  const { softwareInvoiceData } = useContext(SoftwareContext)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles();

  return (
    <Grid container style={{ justifyContent: 'space-between' }} >
      <Grid item xs={4}>
        <Typography className={classes.label}>Implementation ID : <b>{softwareInvoiceData?.implementation_form_id}</b></Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography className={classes.label}>Invoice ID: {softwareInvoiceData?.invoice_auto_id}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography className={classes.label}>School Name : {softwareInvoiceData?.schoolDetails?.schoolName}</Typography>
      </Grid>
      <Grid item xs={4} >
        <Typography className={classes.label}>Invoice Date : {moment(softwareInvoiceData?.invoice_month).format('DD-MM-YYYY')}</Typography>
      </Grid>
      <Grid item xs={4} >
        <Typography className={classes.label}>School Code : {softwareInvoiceData?.school_code}</Typography>
      </Grid>
      <Grid item xs={4} >
        <Typography className={classes.label}>Invoice Amount : {softwareInvoiceData?.invoice_amount}</Typography>
      </Grid>
    </Grid>
  )
}

export default SchoolDetails