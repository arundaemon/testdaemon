import React, { useContext, useEffect, useState } from 'react'
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import _ from 'lodash';
import ConsigneeDetailsFields from './ConsigneeDetailsFields';
import { Typography } from '@mui/material';

const ConsigneeAccordionDetail = () => {
  return (
    <div>
      <Typography component={'h2'} style={{marginBottom: '20px'}}>Ship to<span style={{color: 'red'}}>*</span></Typography>
      <ConsigneeDetailsFields type={"edit"} />
      <Typography component={'h2'} style={{ marginTop: '30px', marginBottom: '20px'}}>Bill to<span style={{color: 'red'}}>*</span></Typography>
      <ConsigneeDetailsFields type={"noEdit"} />
    </div>
  )
}
export default ConsigneeAccordionDetail