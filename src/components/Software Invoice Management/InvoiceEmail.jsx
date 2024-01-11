import React, { useEffect, useState } from 'react'
import Page from '../Page'
import { ReactComponent as IconInputSearch } from './../../assets/icons/icon-input-search-light.svg';
import { Alert, Box, Button, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material'
import { useStyles } from "../../css/ClaimForm-css";
import { DisplayLoader } from "../../helper/Loader";
import Pagination from "../../pages/Pagination";
import { ReactComponent as SettingsIcon } from './../../assets/icons/icon-settings.svg'
import CloseIcon from '@mui/icons-material/Close';
import FailedInvoiceListTable from './FailedInvoiceListTable';
import FormDatePicker from '../../theme/form/theme2/FormDatePicker';
import { listInvoiceCollectionSchedule, listInvoiceIRNErrors, pendingInvoiceForRelease, pendingInvoiceReport } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { getSchoolsByCode } from '../../config/services/purchaseOrder';
import _ from 'lodash';
import toast from 'react-hot-toast';
import InvoiceEmailList from './InvoiceEmailList';
import { getTerritoryByCode } from '../../config/services/territoryMapping';
import { INVOICE_ACTIONS } from '../../constants/general';

const InvoiceEmail = () => {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [vertical] = useState('bottom')
  const [horizontal] = useState('center')
  const [schoolNameCode, setSchoolNameCode] = useState()
  const [implementationID, setImplementationID] = useState()
  const [POId, setPOId] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [pendingInvoicesList, setPendingInvoiceList] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const [searchObject, setSearchObject] = useState({})
  const [search, setSearch] = useState({})
  let { CREATE_IRN, CREATE_ZIP, SEND_MAIL } = INVOICE_ACTIONS



  const handleGenerate = () => {
    setSnackBarOpen(true)
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

  const handleSchoolSearch = (e) => {
    let { value } = e.target
    value = value.trim();
    setSearchObject(prevData => {
      return {
        ..._.cloneDeep(prevData),
        school_code_name: value
      }
    })
  }

  const handleImpIdSearch = (e) => {
    let { value } = e.target
    value = value.trim();
    setSearchObject(prevData => {
      return {
        ..._.cloneDeep(prevData),
        implementation_form_id: value
      }
    })
  }

  const handlePOCodeSearch = (e) => {
    let { value } = e.target
    value = value.trim();
    setSearchObject(prevData => {
      return {
        ..._.cloneDeep(prevData),
        po_code: value
      }
    })
  }

  const handleSearch = () => {
    setSearch(searchObject)
  }

  const handleRequiredInvoiceAction = (data) => {
    let EInvoice = data?.total_e_invoice_count
    let IrnGenerated = data?.total_irn_generated_invoice_count
    let invoiceCount = data?.total_invoice_count
    let pdfCount = data?.total_pdf_generated_invoice_count
    if (EInvoice > 0 && EInvoice > IrnGenerated) {
      return CREATE_IRN
    }
    else if ((EInvoice > 0 && EInvoice > IrnGenerated) || EInvoice == 0) {
      return CREATE_ZIP
    }
    else if (invoiceCount == pdfCount) {
      return SEND_MAIL
    }
  }

  const fetchTerritoryName = async (data) => {
    let territoryCodeList = data?.map(obj => obj?.territory_code);
    getTerritoryByCode({ territoryCodeList })
      .then(res => {
        let territoryData = res?.result
        data?.forEach((item, i) => {
          let territoryDetails = territoryData?.find(obj => obj?.territoryCode === item?.territory_code);
          let invoiceAction = handleRequiredInvoiceAction(data?.[i])
          if (territoryDetails) {
            data[i] = { ...data[i], invoiceAction, territoryDetails }
          }
        })
        setPendingInvoiceList(data);
        if (data?.length < itemsPerPage) {
          setLastPage(true);
        }
        setLoader(false)
      })
      .catch(err => {
        console.error('Error while fetching school details', err)
        setLastPage(false)
        setLoader(false)
      })
  }

  const fetchpendingInvoicesList = async () => {
    setLoader(true)
    setLastPage(false)
    try {
      let params = {
        uuid,
        invoice_for: "SW",
        status: [1]
      };

      const res = await pendingInvoiceForRelease(params);
      let data = res?.data?.invoice_report_count_details;
      let dataLength = data?.length
      if (dataLength == 0) {
        setLastPage(true);
        setLoader(false);
        setPendingInvoiceList([])
        return
      }
      fetchTerritoryName(data)
      setLoader(false)
      if (data?.length < itemsPerPage) {
        setLastPage(true);
      }
    } catch (err) {
      toast.error('Something went wrong!')
      console.error('An error occurred:', err);
      setLastPage(false)
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchpendingInvoicesList()
  }, [pageNo, search])

  return (
    <>
      <Page
        title="Extramarks | Failed Invoice List"
        className=""
      >

        <div className={'crm-sd-page-container '}>
          <div className="crm-sd-claims-header">
            <div >
              <Typography variant='h4'>Software Invoice Email</Typography>
            </div>
            {/* <div className="crm-sd-claims-header">
                            <TextField
                                autoComplete="off"
                                className={`crm-form-input light width-200p`}
                                type="search"
                                placeholder="Search"
                                // value={searchTextField}
                                // onChange={handleSearch}
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
                            <div style={{ margin: '5px 0px 0px 10px' }}>
                                <SettingsIcon className={`crm-form-input`} style={{ padding: '5px 5px' }} />
                            </div>
                        </div> */}
          </div>

          <Grid container spacing={2} mb={3}>
            <Grid item md={6} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
              <Grid md={3}>
                <Typography ><strong>Total Invoice:</strong> {pendingInvoicesList?.length ?? 0}</Typography>
              </Grid>
              {/* <Grid md={5}>
                                <Typography ><strong>Total Invoice Amount:</strong> 49,092</Typography>
                            </Grid> */}
            </Grid>

            <Grid item md={6} xs={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Grid md={2}>
                <Typography mr={1} variant='subtitle1'><strong>Date Range</strong></Typography>
              </Grid>
              <Grid md={2} mr={2}>
                <FormDatePicker
                  value={searchObject?.invoice_date_from}
                  placeholder='From'
                  // minDateValue={new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)}
                  theme="medium-dark"
                  handleSelectedValue={(date) => {
                    setSearchObject(prevData => {
                      return {
                        ..._.cloneDeep(prevData),
                        invoice_date_from: date
                      }
                    })
                  }}
                />
              </Grid>
              <Grid md={2}>
                <FormDatePicker
                  value={searchObject?.invoice_date_to}
                  placeholder='To'
                  // minDateValue={new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)}
                  theme="medium-dark"
                  handleSelectedValue={(date) => {
                    setSearchObject(prevData => {
                      return {
                        ..._.cloneDeep(prevData),
                        invoice_date_to: date
                      }
                    })
                  }}
                />
              </Grid>
            </Grid>

            <Grid item md={3}>
              <Typography mb={1} variant='subtitle1'>School Name/Code</Typography>
              <TextField
                id="outlined-basic"
                className={`crm-form-input`}
                placeholder="School Name/Code"
                variant="outlined"
                // value={searchObject?.school_code_name}
                onChange={handleSchoolSearch}
                fullWidth
              />
            </Grid>

            <Grid item md={3}>
              <Typography mb={1} variant='subtitle1'>Implementation ID</Typography>
              <TextField
                id="outlined-basic"
                className={`crm-form-input`}
                placeholder="Implementation ID"
                variant="outlined"
                // value={searchObject?.implementation_form_id}
                onChange={handleImpIdSearch}
                fullWidth
              />
            </Grid>

            <Grid item md={3}>
              <Typography mb={1} variant='subtitle1'>PO ID</Typography>
              <TextField
                id="outlined-basic"
                placeholder="PO ID"
                variant="outlined"
                // value={searchObject?.po_code}
                onChange={handlePOCodeSearch}
                fullWidth
                className={`crm-form-input`}
              />
            </Grid>

            <Grid item md={3} mt={4}>
              <Button variant='contained' size='medium' type='submit' sx={{ borderRadius: '5px !important' }} onClick={handleSearch}>Search</Button>
            </Grid>
          </Grid>

          <Box className='crm-table-container'>
            {loader ? (
              <div className={classes.loader}>
                {DisplayLoader()}
              </div>
            ) : (
              pendingInvoicesList?.length > 0 ? (
                <InvoiceEmailList list={pendingInvoicesList} fetchpendingInvoicesList={fetchpendingInvoicesList}/>
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

    </>
  )
}

export default InvoiceEmail