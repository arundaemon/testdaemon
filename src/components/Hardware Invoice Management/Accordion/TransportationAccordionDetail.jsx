import React, { useContext, useEffect } from 'react'
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import { useStyles } from "../../../css/HardwareInvoice-css";
import _ from 'lodash';
import { Grid } from '@mui/material';

const TransportationAccordionDetail = () => {
  const { hardwareInvoiceData, setHardwareInvoiceData, errorData, errorCheck } = useContext(HardwareContext)
  const classes = useStyles();

  const handleTransportationDetails = () => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        transportation_details: {
          payment_term: "As Per Contract",
          e_reference_number: "As Per Contract"
        }
      }
    })
  }

  const handleTransportMode = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        transportation_details: {
          ...prevData.transportation_details,
          mode_of_transport: e.target.value
        }
      }
    })
    delete errorData?.["mode_of_transport"]
  }

  const handleDocketNumber = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        transportation_details: {
          ...prevData.transportation_details,
          docket_number: e.target.value
        }
      }
    })
  }

  const handleVehicleNumber = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        transportation_details: {
          ...prevData.transportation_details,
          vehicle_number: e.target.value
        }
      }
    })
  }

  const handleTransporterName = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        transportation_details: {
          ...prevData.transportation_details,
          transporter_name: e.target.value
        }
      }
    })
  }

  useEffect(() => {
    handleTransportationDetails()
  }, [])

  return (
    <div >
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Payment Terms <span style={{ color: 'red' }}>*</span></label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.transportation_details?.payment_term} />
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Electric Reference Number <span style={{ color: 'red' }}>*</span></label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.transportation_details?.e_reference_number} />
          </div>
        </Grid>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Mode of Transport <span style={{ color: 'red' }}>*</span></label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.transportation_details?.mode_of_transport} onChange={handleTransportMode} />
            {errorCheck &&
              <p className={classes.alert}>{errorData?.mode_of_transport}</p>
            }
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Vehicle Number </label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.transportation_details?.vehicle_number} onChange={handleVehicleNumber} />
          </div>
        </Grid>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Docket Number</label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.transportation_details?.docket_number} onChange={handleDocketNumber} />
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className='crm-page-invoice-accordion-form-item'>
            <label >Transporter Name </label>
            <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.transportation_details?.transporter_name} onChange={handleTransporterName} />
          </div>
        </Grid>
      </Grid>
      
    </div>
  )
}

export default TransportationAccordionDetail