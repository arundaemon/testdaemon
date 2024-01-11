import React, { useContext } from 'react';
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import _ from 'lodash';
import { Grid } from '@mui/material';

const AuthorizedSignatoryAccordion = () => {
  const { hardwareInvoiceData } = useContext(HardwareContext)
  const classes = useStyles();

  return (
    <div  >
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Signatory Name</label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.signatory_details?.signatory_name} disabled={true} />
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Signatory Designation</label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.signatory_details?.signatory_designation} disabled={true} />
          </div>
        </Grid>
      </Grid>
      
    </div>
  )
}
export default AuthorizedSignatoryAccordion