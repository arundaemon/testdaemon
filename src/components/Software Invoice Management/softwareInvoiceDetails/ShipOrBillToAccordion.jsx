import React, { useContext, useEffect } from 'react'
import { useStyles } from "../../../css/HardwareInvoice-css";
import _ from 'lodash';
import { SoftwareContext } from '../UpdateSoftwareInvoiceForm';

const ShipOrBillToAccordion = ({ type }) => {
  const { softwareInvoiceData, setSoftwareInvoiceData } = useContext(SoftwareContext)
  const classes = useStyles();

  const handleStateName = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          state_name: e.target.value
        }
      }
    })
  }

  const handleAddress1 = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          address: e.target.value
        }
      }
    })
  }

  const handlePinCode = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          pincode: e.target.value
        }
      }
    })
  }

  const handleLandMark = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          landmark: e.target.value
        }
      }
    })
  }

  const handleAddress2 = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          address2: e.target.value
        }
      }
    })
  }

  const handleCity = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          schoolCityName: e.target.value
        }
      }
    })
  }

  const handleCountryName = (e) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          ...prevData.consignee_details,
          schoolCountryName: e.target.value
        }
      }
    })
  }

  return (
    <div style={{ display: 'flex' }}>
      <div className={classes.consigneelabelDivContainer}>
        <div className={classes.labelDiv}>
          <label className={classes.label}>Address Line 1</label>
          <input className={classes.inputField} disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type == "edit" ? softwareInvoiceData?.shipTo_details?.address : softwareInvoiceData?.billto_details?.address} onChange={handleAddress1} />
        </div>
        <div className={classes.labelDiv}>
          <label className={classes.label}>Pin Code</label>
          <input className={classes.inputField} disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type == "edit" ? softwareInvoiceData?.shipTo_details?.pincode : softwareInvoiceData?.billto_details?.pincode} onChange={handlePinCode} />
        </div>
        <div className={classes.labelDiv}>
          <label className={classes.label}>Country</label>
          <input className={classes.inputField} disabled={true} type="text" id="outlined-basic" value={softwareInvoiceData?.billto_details?.schoolCountryName} />
        </div>
      </div>
      <div className={classes.consigneelabelDivContainer}>
        <div className={classes.labelDiv}>
          <label className={classes.label}>Address Line 2</label>
          <input className={classes.inputField} disabled={type === "edit" ? false : true} type="text" id="outlined-basic" onChange={handleAddress2} />
        </div>
        <div className={classes.labelDiv}>
          <label className={classes.label}>City</label>
          <input className={classes.inputField} disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type == "edit" ? softwareInvoiceData?.shipTo_details?.schoolCityName : softwareInvoiceData?.billto_details?.schoolCityName} onChange={handleCity} />
        </div>
      </div>
      <div className={classes.consigneelabelDivContainer}>
        <div className={classes.labelDiv}>
          <label className={classes.label}>Landmark</label>
          <input className={classes.inputField} disabled={type === "edit" ? false : true} type="text" id="outlined-basic" onChange={handleLandMark} />
        </div>
        <div className={classes.labelDiv}>
          <label className={classes.label}>State</label>
          <input className={classes.inputField} disabled={type === "edit" ? false : true} type="text" id="outlined-basic" value={type == "edit" ? softwareInvoiceData?.shipTo_details?.state_name : softwareInvoiceData?.billto_details?.state_name} onChange={handleStateName} />
        </div>
      </div>
    </div >
  )
}

export default ShipOrBillToAccordion