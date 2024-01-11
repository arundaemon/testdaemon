import React, { useContext, useEffect } from 'react'
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import { getSchoolBySchoolCode } from '../../../config/services/school';
import _ from 'lodash';
import { stateCodeMapping } from '../../../config/interface/local';
import { Grid } from '@mui/material';

const ConsigneeDetailsFields = ({ type }) => {
  const { implementationDetails, hardwareInvoiceData, setHardwareInvoiceData, errorCheck, errorData } = useContext(HardwareContext)
  const classes = useStyles();

  const handleName = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          name: e.target.value
        }
      }
    })
    delete errorData?.["name"]
  }

  const handleStateName = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          state_name: e.target.value
        }
      }
    })
  }

  const handleAddress1 = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          address: e.target.value
        }
      }
    })
  }

  const handlePinCode = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          pincode: e.target.value
        }
      }
    })
    delete errorData?.["pincode"]

  }

  const handleLandMark = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          landmark: e.target.value
        }
      }
    })
  }

  const handleGSTIN = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          gstin: e.target.value
        }
      }
    })
  }

  const handleStateCode = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          state_code: e.target.value
        }
      }
    })
    delete errorData?.["state_code"]
  }

  const handlePan = (e) => {
    let { value } = e.target
    if (value?.length > 10) return
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          pan_no: (value).toUpperCase()
        }
      }
    })
  }

  const handleAddress2 = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          address2: e.target.value
        }
      }
    })
  }

  const handleCity = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          schoolCityName: e.target.value
        }
      }
    })
  }

  const handleCountryName = (e) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          schoolCountryName: e.target.value
        }
      }
    })
  }

  const handleContactNumber = (e) => {
    let { value } = e.target
    if (value?.length > 10) return
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          ...prevData.consignee_details,
          contact_number: value
        }
      }
    })
    if (value?.length >= 10)
      delete errorData?.["contact_number"]

  }

  const getSchoolDetails = async (schoolCode) => {
    await getSchoolBySchoolCode(schoolCode)
      .then(res => {
        let schoolData = res?.result;
        handleConsigneeDetails(schoolData)
      })
      .catch(err => {
        console.error(err, 'Error while fetching school details')
      })

  }

  const handleConsigneeDetails = (data) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        consignee_details: {
          name: data?.schoolName,
          address: data?.address,
          state_name: data?.state,
          state_code: stateCodeMapping[data?.stateCode],
          pincode: data?.pinCode,
          schoolCountryName: data?.country,
          schoolCityName: data?.city,
          gstin: data?.gstNumber,
          contact_number: data?.contactDetails?.[0]?.mobileNumber
        },
        billto_details: {
          name: data?.schoolName,
          address: data?.address,
          state_name: data?.state,
          state_code: stateCodeMapping[data?.stateCode],
          pincode: data?.pinCode,
          schoolCountryName: data?.country,
          schoolCityName: data?.city,
          gstin: data?.gstNumber,
          contact_number: data?.contactDetails?.[0]?.mobileNumber
        }
      }
    })
  }

  useEffect(() => {
    if (implementationDetails && Object.keys(implementationDetails).length > 0) {
      getSchoolDetails(implementationDetails?.schoolCode)
    }
  }, [implementationDetails])

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>

          {
            type === "edit" ? (
              <>
                <label >Name <span style={{ color: 'red' }}>*</span></label>
                <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.consignee_details?.name} onChange={handleName} />
                {errorCheck && <p className={classes.alert}>{errorData?.name}</p>}
              </>
            ) : (
              <>
                <label >Name</label>
                <input className='crm-form-input medium-dark' disabled={true} type="text" id="outlined-basic" value={hardwareInvoiceData?.billto_details?.name} />
              </>
            )
          }

        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >Address Line 1</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.address : hardwareInvoiceData?.billto_details?.address} onChange={handleAddress1} />
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >Address Line 2</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.address2 : hardwareInvoiceData?.billto_details?.address2} onChange={handleAddress2} />
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >LandMark</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.landmark : hardwareInvoiceData?.billto_details?.landmark} onChange={handleLandMark} />
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>

          {type === "edit" ?
            <>
              <label >Pin Code<span style={{ color: 'red' }}>*</span></label>

              <input className='crm-form-input medium-dark' type="number" id="outlined-basic" value={hardwareInvoiceData?.consignee_details?.pincode} onChange={handlePinCode} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.pincode}</p>
              )
              }
            </>
            :
            <>
              <label >Pin Code</label>

              <input className='crm-form-input medium-dark' disabled={true} type="number" id="outlined-basic" value={hardwareInvoiceData?.billto_details?.pincode} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.billing_pincode}</p>
              )
              }

            </>
          }

        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >City</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.schoolCityName : hardwareInvoiceData?.billto_details?.schoolCityName} onChange={handleCity} />
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >State</label>

          {type === "edit" ?
            <>
              <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.consignee_details?.state_name} onChange={handleStateName} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.state_name}</p>
              )
              }
            </>
            :
            <input className='crm-form-input medium-dark' disabled={true} type="text" id="outlined-basic" value={hardwareInvoiceData?.billto_details?.state_name} />
          }
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>

          {type === "edit" ?
            <>
              <label >State Code<span style={{ color: 'red' }}>*</span></label>

              <input className='crm-form-input medium-dark' type="text" id="outlined-basic" value={hardwareInvoiceData?.consignee_details?.state_code} onChange={handleStateCode} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.state_code}</p>
              )
              }
            </>
            :
            <>
              <label >State Code</label>

              <input className='crm-form-input medium-dark' disabled={true} type="text" id="outlined-basic" value={hardwareInvoiceData?.billto_details?.state_code} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.billing_state_code}</p>
              )
              }

            </>
          }

        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >Country</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.schoolCountryName : hardwareInvoiceData?.billto_details?.schoolCountryName} onChange={handleCountryName} />
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >GSTIN</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.gstin : hardwareInvoiceData?.billto_details?.gstin} onChange={handleGSTIN} />
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          <label >PAN</label>
          <input className='crm-form-input medium-dark' disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type === "edit" ? hardwareInvoiceData?.consignee_details?.pan_no : hardwareInvoiceData?.billto_details?.pan_no} onChange={handlePan} />
        </div>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <div className='crm-page-invoice-accordion-form-item'>
          {type === "edit" ?
            <>
              <label >Contact Number<span style={{ color: 'red' }}>*</span></label>

              <input className='crm-form-input medium-dark' type="number" id="outlined-basic" value={hardwareInvoiceData?.consignee_details?.contact_number} onChange={handleContactNumber} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.contact_number}</p>
              )
              }
            </>
            :
            <>
              <label >Contact Number</label>

              <input className='crm-form-input medium-dark' disabled={true} type="number" id="outlined-basic" value={hardwareInvoiceData?.billto_details?.contact_number} />
              {errorCheck && (
                <p className={classes.alert}>{errorData?.billing_contact_number}</p>
              )
              }

            </>
          }
        </div>
      </Grid>
    </Grid >
  )
}

export default ConsigneeDetailsFields