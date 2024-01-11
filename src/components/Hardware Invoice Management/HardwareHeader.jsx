import React, { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useStyles } from "../../css/HardwareInvoice-css";
import FormDatePicker from '../../theme/form/theme2/FormDatePicker';
import _ from 'lodash';
import moment from 'moment';
import toast from 'react-hot-toast';
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const HardwareHeader = ({ type, headerValue, search, setSearch, setPagination }) => {
  const [headerType] = useState(["Generate Hardware Invoices", "Generated Hardware Invoices", "Cancelled Hardware Invoices", "Generated Invoices Office To Office", "Update Hardware Invoice", "Update Invoice Office to Office", "Cancelled Invoice Office to Office"])
  const [filterObject, setFilterObject] = useState({ school_code: "", implementation_id: "", invoice_number: "", invoice_date_from: "", invoice_date_to: "" })
  const [rerenderKey, setRerenderKey] = useState(0);
  const classes = useStyles();

  const handleSchoolCode = (e) => {
    let { value } = e.target
    setFilterObject(prevData => {
      return {
        ..._.cloneDeep(prevData),
        school_code: value.trim(),
      }
    })
  }

  const handleImpId = (e) => {
    let { value } = e.target
    setFilterObject(prevData => {
      return {
        ..._.cloneDeep(prevData),
        implementation_id: value.trim(),
      }
    })
  }

  const handleInvoiceNumber = (e) => {
    let { value } = e.target
    setFilterObject(prevData => {
      return {
        ..._.cloneDeep(prevData),
        invoice_number: value.trim(),
      }
    })
  }

  const handleSearch = () => {
    if (Object.keys(filterObject)?.length == 0) {
      toast.dismiss()
      toast.error('Fill any field')
      return
    }
    setSearch(Object.fromEntries(
      Object.entries(filterObject).filter(([key, value]) => value !== undefined && value !== '' && value != null)
    ));
    setPagination(1)
  }

  const removeAllKeys = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
      return acc;
    }, {});
  }

  const forceRerender = () => {
    setRerenderKey((prevKey) => prevKey + 1);
  };

  const handleReset = () => {
    if (Object.keys(filterObject)?.length == 0) return
    setFilterObject({
      school_code: "",
      implementation_id: "",
      invoice_number: "",
      invoice_date_from: null,
      invoice_date_to: null
    })
    removeAllKeys(filterObject)
    setSearch({})
    forceRerender()
  }

  const handleDisableReset = () => {
    if (((search && Object.keys(search)?.length > 0))) return false
    return true
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div key={rerenderKey} className=''>

      <Typography component={'h1'} className='crm-page-heading'>{headerType?.[type]}</Typography>
      <Grid container spacing={2.5} sx={{ marginTop: '-10px', marginBottom: '25px' }}>
        <Grid item xs={3}>
          <div className='crm-page-hardware-header-item'>
            <Typography component={'h4'}>Total Invoices</Typography>
            <Typography component={'p'}>{headerValue?.listLength ?? 0}</Typography>
          </div>


        </Grid>
        {(type == 0) &&
          <Grid item xs={3}>
            <div className='crm-page-hardware-header-item'>
              <Typography component={'h4'}>Total HW Contract Amount</Typography>
              <Typography component={'p'}>
                <CurrencyRupeeIcon
                  sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                />
                {Number(headerValue?.totalContractValue)?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}/-
              </Typography>
            </div>
          </Grid>
        }
        {(type != 3 && type < 5) &&
          <>
            <Grid item xs={3}>
              <div className='crm-page-hardware-header-item'>
                <Typography component={'h4'}>HW Contract Amount</Typography>
                <Typography component={'p'}>{"NA"}</Typography>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className='crm-page-hardware-header-item'>
                <Typography component={'h4'}>Invoicing Due Amount</Typography>
                <Typography component={'p'}>{"NA"}</Typography>
              </div>
            </Grid>
          </>
        }
      </Grid>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Date Range</div>
        <div style={{ display: 'flex' }}>
          <FormDatePicker
            className='crm-form-input width-150px mr-1'
            value={filterObject?.invoice_date_from}
            maxDateValue={filterObject?.invoice_date_to}
            disabled={filterObject?.invoice_date_to ? true : false}
            dateFormat="DD/MM/YYYY"
            handleSelectedValue={(date) =>
              setFilterObject(prevData => {
                return {
                  ..._.cloneDeep(prevData),
                  invoice_date_from: moment(new Date(date)).format('YYYY-MM-DD'),
                }
              })}
            placeholder="From"
            iconColor='primary'
            placeholderColor='medium-dark'

          />
          <FormDatePicker
            className='crm-form-input width-150px'
            value={filterObject?.invoice_date_to}
            minDateValue={filterObject?.invoice_date_from}
            disabled={!filterObject?.invoice_date_from ? true : false}
            dateFormat="DD/MM/YYYY"
            handleSelectedValue={(date) => {
              setFilterObject(prevData => {
                return {
                  ..._.cloneDeep(prevData),
                  invoice_date_to: moment(new Date(date)).format('YYYY-MM-DD'),
                }
              })
              setSearch(prevData => {
                return {
                  ..._.cloneDeep(prevData),
                  invoice_date_from: filterObject?.invoice_date_from,
                  invoice_date_to: moment(new Date(date)).format('YYYY-MM-DD'),
                }
              })
            }}
            placeholder="To"
            iconColor='primary'
            placeholderColor='medium-dark'
          />
        </div>
      </div>

      <Typography component={'div'} className=' crm-page-hardware-header-filter-label'>Filter</Typography>
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "25%", marginRight: '20px' }}>
          <input
            value={filterObject?.school_code}
            disabled={search?.school_code ? true : false}
            onChange={handleSchoolCode}
            placeholder='School Name/Code'
            onKeyPress={(e) => handleKeyPress(e)}
            // className={classes.searchTextField}
            className='crm-form-input medium-dark'
          />
        </div>
        <div style={{ width: "25%", marginRight: '20px' }}>
          <input
            value={filterObject.implementation_id}
            disabled={search?.implementation_id ? true : false}
            onChange={handleImpId}
            placeholder='Implementation ID'
            onKeyPress={(e) => handleKeyPress(e)}
            className='crm-form-input medium-dark'
          />
        </div>
        {type != 0 &&
          <div style={{ width: "25%", marginRight: '20px' }}>
            <input
              value={filterObject.invoice_number}
              disabled={search?.invoice_number ? true : false}
              onChange={handleInvoiceNumber}
              placeholder='Invoice ID'
              onKeyPress={(e) => handleKeyPress(e)}
              className='crm-form-input medium-dark'
            />
          </div>
        }
        <div style={{ display: "flex", width: "25%" }}>
          <Button className='crm-btn mr-1' onClick={handleSearch} >Search</Button>
          <Button className='crm-btn crm-btn-outline' disabled={handleDisableReset()} onClick={handleReset} >Reset</Button>
        </div>
      </div>
    </div >
  )
}

export default HardwareHeader