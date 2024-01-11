import React, { useEffect, useState } from 'react'
import Page from '../Page'
import { ReactComponent as IconInputSearch } from './../../assets/icons/icon-input-search-light.svg';
import { Alert, Box, Button, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material'
import { useStyles } from "../../css/ClaimForm-css";
import { DisplayLoader } from "../../helper/Loader";
import Pagination from "../../pages/Pagination";
import { ReactComponent as SettingsIcon } from './../../assets/icons/icon-settings.svg'
import GenerateInvoiceListTable from './GenerateInvoiceListTable';
import CloseIcon from '@mui/icons-material/Close';
import { generateInvoiceFromSchedule, listInvoiceScheduleDetails } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { getSchoolsByCode } from '../../config/services/purchaseOrder';
import toast from 'react-hot-toast';
import _ from 'lodash'
import moment from 'moment'
import { stateCodeMapping } from '../../config/interface/local';

const GenerateInvoiceList = () => {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [invoiceList, setInvoiceList] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [lastPage, setLastPage] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [vertical] = useState('bottom')
  const [horizontal] = useState('center')
  const loginData = getUserData('loginData')
  const [filterObject, setFilterObject] = useState({})
  const [search, setSearch] = useState({})
  const uuid = loginData?.uuid

  const handleGenerate = async (data) => {
    let invoice_details = data?.map((item, i) => {
      return {
        master_schedule_auto_id: item?.master_schedule_auto_id,
        invoice_schedule_auto_id: item?.invoice_schedule_auto_id,
        pos_code: item?.po_code,
        invoice_status: "1",
        billing_details: {
          billing_name: item?.schoolDetails?.schoolName,
          billing_address: item?.schoolDetails?.address,
          billing_state: item?.schoolDetails?.state,
          billing_pin_code: item?.schoolDetails?.pinCode,
          billing_state_code: stateCodeMapping[item?.schoolDetails?.stateCode],
          billing_gstin: item?.schoolDetails?.gstNumber,
          billing_pan: "",
          billing_contact_no: item?.schoolDetails?.contactDetails?.[0]?.mobileNumber
        },
        shipping_details: {
          shipping_name: item?.schoolDetails?.schoolName,
          shipping_address: item?.schoolDetails?.address,
          shipping_state: item?.schoolDetails?.state,
          shipping_pin_code: item?.schoolDetails?.pinCode,
          shipping_state_code: stateCodeMapping[item?.schoolDetails?.stateCode],
          shipping_gstin: item?.schoolDetails?.gstNumber,
          shipping_pan: "",
          shipping_contact_no: item?.schoolDetails?.contactDetails?.[0]?.mobileNumber
        }
      }
    })
    let params = {
      uuid,
      invoice_details
    }
    try {
      let result = await generateInvoiceFromSchedule(params)
      let { status, message } = result?.data
      if (status === 1) {
        toast.dismiss()
        toast.success(message)
      }
      else {
        toast.dismiss()
        toast.error(message)
      }
      fetchInvoiceCollectionScheduleData()
    }
    catch (err) {
      toast.error('Something went wrong!')
      console.error(err, 'Error while generating')
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const fetchSchoolData = async (data) => {
    let schoolCodeArray = data?.map(obj => obj?.school_code);
    let params = { schoolCodeList: schoolCodeArray }
    getSchoolsByCode(params)
      .then(res => {
        let schoolsData = res?.result
        data?.forEach((item, i) => {
          let schoolDetails = schoolsData?.find(obj => obj?.schoolCode === item?.school_code);
          if (schoolDetails) {
            data[i] = { ...data[i], schoolDetails }
          }
        })
        setInvoiceList(data)

      })
      .catch(err => {
        console.error('Error while fetching school details', err)
      })
  }

  const getLastDayOfMonth = (date) => {
    let month = date.getMonth()
    let year = date.getFullYear()
    const lastDay = new Date(year, month + 1, 0);
    return lastDay;
  }

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

  const handleSearch = () => {
    if (Object.keys(filterObject)?.length == 0) {
      toast.dismiss()
      toast.error('Fill any field')
      return
    }
    setSearch(filterObject)
    setPagination(1)
  }

  const handleReset = () => {
    if (Object.keys(filterObject)?.length == 0) return
    setFilterObject({
      school_code: "",
      implementation_id: ""
    })
    setSearch({})
  }

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      switch (type) {
        case 'school':
          handleSearch();
          break;
        case 'implementation':
          handleSearch();
          break;
        default:
          break;
      }
    }
  };

  const handleDisableReset = () => {
    if (((search && Object.keys(search)?.length > 0))) return false
    return true
  }

  const fetchInvoiceCollectionScheduleData = async () => {
    setLastPage(false)
    setLoader(true)
    let currentDay = new Date()
    let lastDay = getLastDayOfMonth(currentDay)
    try {
      let params = {
        uuid,
        page_offset: pageNo - 1,
        page_size: itemsPerPage,
        status: [1],
        schedule_for: ["SW"],
        data_source: "invoice",
        optional_search_params: {
          billing_date_from: '2023-01-01',
          billing_date_to: moment(lastDay).format('YYYY-MM-DD')
        }
      };
      if (Object.keys(search)?.length > 0) {
        params = {
          ...params, optional_search_params: {
            ...params.optional_search_params,
          }
        }
      }

      if (search?.implementation_id?.length > 0) {
        params = {
          ...params,
          ...params.optional_search_params,
          optional_search_params: {
            ...params.optional_search_params,
            implementation_id: search?.implementation_id,
          }
        }
      }

      if (search?.school_code?.length > 0) {
        params = {
          ...params,
          ...params.optional_search_params,
          optional_search_params: {
            ...params.optional_search_params,
            school_code: search?.school_code,
          }
        }
      }
      const res = await listInvoiceScheduleDetails(params);
      let data = res?.data?.invoice_schedule_months_details;
      let dataLength = data?.length
      if (dataLength === 0) {
        setLastPage(true);
        setLoader(false);
        setInvoiceList([])
        return
      }
      await fetchSchoolData(data);
      if (dataLength < itemsPerPage) setLastPage(true)
      setLoader(false)
    } catch (err) {
      console.error('An error occurred:', err);
      setLastPage(false)
      setLoader(false)
    }
  };


  useEffect(() => {
    fetchInvoiceCollectionScheduleData()
  }, [search, pageNo])

  return (
    <div>
      <Page
        title="Extramarks | Generate S/W Invoice"
        className=""
      >

        <div className={'crm-sd-page-container '}>
          <div className="crm-sd-claims-header">
            <div >
              <Typography component='h2'>Generate Software Invoice</Typography>
            </div>
            {/* <div className="crm-sd-claims-header">
              <TextField
                autoComplete="off"
                className={`crm-form-input light width-200p`}
                type="search"
                placeholder="Search"
                // value={search}
                onChange={(e) => setSearch(e.target.value.trim())}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconInputSearch />
                    </InputAdornment>
                  ),
                }}
              />

            </div> */}
          </div>

          <Grid container spacing={2} mb={2.5}>
            <Grid item md={2}>
              <Typography component='h4'><strong>Total Invoice:</strong> {invoiceList?.length ?? 0}</Typography>
            </Grid>
          </Grid>

          <Typography component={'div'} className=' crm-page-hardware-header-filter-label'>Filter</Typography>
          <div style={{ display: "flex", width: "100%", marginBottom: '20px' }}>
            <div style={{ width: "25%", marginRight: '20px' }}>
              <input
                value={filterObject?.school_code}
                disabled={search?.school_code ? true : false}
                onChange={handleSchoolCode}
                placeholder='School Code'
                onKeyPress={(e) => handleKeyPress(e, 'school')}
                // className={classes.searchTextField}
                className='crm-form-input medium-dark mr-1'
              />
            </div>
            <div style={{ width: "25%", marginRight: '20px' }}>
              <input
                // className={classes.searchTextField}
                value={filterObject.implementation_id}
                disabled={search?.implementation_id ? true : false}
                onChange={handleImpId}
                placeholder='Implementation ID'
                onKeyPress={(e) => handleKeyPress(e, 'implementation')}
                className='crm-form-input medium-dark'

              />
            </div>

            <div style={{ display: "flex", width: "25%" }}>
              <Button className="crm-btn mr-1"  onClick={handleSearch} >Search</Button>
              <Button className='crm-btn crm-btn-outline' disabled={handleDisableReset()} onClick={handleReset} >Reset</Button>
            </div>
          </div>


          <Box className='crm-table-container'>
            {loader ? (
              <div className={classes.loader}>
                {DisplayLoader()}
              </div>
            ) : (
              invoiceList?.length > 0 ? (
                <GenerateInvoiceListTable list={invoiceList} setCheckedRows={setCheckedRows} checkedRows={checkedRows} pageNo={pageNo} itemsPerPage={itemsPerPage} />
              ) : (
                <div className={classes.noData}>
                  <p>No Data</p>
                </div>
              )
            )}
            <div className='center cm_pagination'>
              <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
            </div>
          </Box>

        </div>
      </Page>
      <Box display='flex' justifyContent={'flex-end'} alignItems={'center'} mx={2} mb={2}>
        <Button className='crm-btn crm-btn-lg' disabled={checkedRows.length > 0 ? false : true} type='submit'  onClick={() => handleGenerate(checkedRows)}>Generate</Button>
      </Box>

      {/* <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackBarOpen}
        onClose={handleClose}
        autoHideDuration={2000}
        key={vertical + horizontal}
        action={action}
      >
        <Alert sx={{ borderRadius: '5px !important', backgroundColor: '#a6a6a6', color: '#616161' }} onClose={handleClose} severity="secondary" >
          <strong>Invoice has been generated</strong>
        </Alert>
      </Snackbar> */}
    </div>
  )
}

export default GenerateInvoiceList