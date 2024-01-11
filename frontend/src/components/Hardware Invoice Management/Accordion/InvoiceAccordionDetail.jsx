import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import _ from 'lodash';
import { Grid } from '@mui/material';
import { ReactComponent as DropDownIcon } from "../../../assets/icons/icon-dropdown-2.svg";

const InvoiceAccordionDetail = () => {
  const { setHardwareInvoiceData } = useContext(HardwareContext)
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

  const handleInvoiceDetails = () => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        invoice_details: {
          supply_type: supplyTypeOptions?.[0]?.value,
          transaction_type: transactionTypeOptions?.[0]?.value,
        }
      };
    });
  }

  useEffect(() => {
    handleInvoiceDetails()
  }, [])

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  return (
    <div>
      <Grid container spacing={2.5}  >
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label>Supply Type<span style={{ color: 'red' }}>*</span></label>
            <Select
              className="crm-form-input crm-react-select dark"
              classNamePrefix="select"
              value={supplyTypeOptions?.[0]}
              options={supplyTypeOptions}
              components={{ DropdownIndicator }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={4} >
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Transaction Type<span style={{ color: 'red' }}>*</span></label>
            <Select
              className="crm-form-input crm-react-select dark"
              classNamePrefix="select"
              options={transactionTypeOptions}
              value={transactionTypeOptions?.[0]}
              components={{ DropdownIndicator }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
export default InvoiceAccordionDetail