import React, { useEffect, useState } from 'react'
import Page from '../Page'
import { ReactComponent as IconInputSearch } from './../../assets/icons/icon-input-search-light.svg';
import { Alert, Box, Button, Grid, IconButton, InputAdornment, Select, MenuItem, Snackbar, TextField, Typography } from '@mui/material'
import { useStyles } from "../../css/ClaimForm-css";
import { DisplayLoader } from "../../helper/Loader";
import Pagination from "../../pages/Pagination";
import { ReactComponent as SettingsIcon } from './../../assets/icons/icon-settings.svg'
import CloseIcon from '@mui/icons-material/Close';
import FailedInvoiceListTable from './FailedInvoiceListTable';
import FormDatePicker from '../../theme/form/theme2/FormDatePicker';
import { listInvoiceCollectionSchedule, listInvoiceIRNErrors } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { getSchoolsByCode } from '../../config/services/purchaseOrder';
import _ from 'lodash';

const FailedInvoiceList = () => {
    const classes = useStyles();
    const [loader, setLoader] = useState(false);
    const [pageNo, setPagination] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [vertical] = useState('bottom')
    const [horizontal] = useState('center')
    const [schoolNameCode, setSchoolNameCode] = useState()
    const [implementationID, setImplementationID] = useState()
    const [POId, setPOId] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [failedInvoiceList, setFailedInvoiceList] = useState([])
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    const [searchObject, setSearchObject] = useState({ invoice_data_type: "HW" })
    const [search, setSearch] = useState({})


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

    const handleInvoicetype = (e) => {
        let { value } = e.target
        setSearchObject(prevData => {
            return {
                ..._.cloneDeep(prevData),
                invoice_data_type: value
            }
        })
    }

    const handleSearch = () => {
        setSearch(searchObject)
    }

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
                setFailedInvoiceList(data);
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

    const fetchFailedInvoices = async () => {
        setLoader(true)
        setLastPage(false)
        try {
            let params = {
                uuid,
                page_offset: pageNo - 1,
                page_size: itemsPerPage,
                invoice_for: search?.invoice_data_type ?? "HW",
                school_code_name: search?.school_code_name,
                implementation_form_id: search?.implementation_form_id,
                po_code: search?.po_code,
                invoice_date_from: search?.invoice_date_from,
                invoice_date_to: search?.invoice_date_to,
                invoice_status: [1]
            };

            const res = await listInvoiceIRNErrors(params);
            let data = res?.data?.irn_error_details;
            let dataLength = data?.length
            if (dataLength == 0) {
                setLastPage(true);
                setLoader(false);
                setFailedInvoiceList([])
                return
            }
            await fetchSchoolData(data);

            if (data?.length < itemsPerPage) {
                setLastPage(true);
            }
        } catch (err) {
            console.error('An error occurred:', err);
            setLastPage(false)
            setLoader(false)
        }
    }



    useEffect(() => {
        fetchFailedInvoices()
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
                            <Typography variant='h4'>Failed E-Invoice List - ({search?.invoice_data_type === 'SW' ? "Software" : "Hardware"})</Typography>
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
                                <Typography ><strong>Total Invoice:</strong> {failedInvoiceList?.length ?? 0}</Typography>
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

                        <Grid item xs={2} md={2}>
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

                        <Grid item xs={2} md={2}>
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

                        <Grid item xs={2} md={2}>
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
                        <Grid item xs={2} md={2}>
                            <Typography mb={1} variant='subtitle1'>Invoice Type</Typography>
                            <Select
                                value={searchObject?.invoice_data_type}
                                onChange={handleInvoicetype}
                                displayEmpty
                                variant="outlined"
                                fullWidth
                                className={`crm-form-input`}
                            // placeholder='Invoice Type'
                            >
                                <MenuItem value={'HW'}>Hardware</MenuItem>
                                <MenuItem value={'SW'}>Software</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={4} md={4} mt={4}>
                            <Button variant='contained' size='medium' type='submit' sx={{ borderRadius: '5px !important' }} onClick={handleSearch}>Search</Button>
                        </Grid>
                    </Grid>

                    <Box className='crm-table-container'>
                        {loader ? (
                            <div className={classes.loader}>
                                {DisplayLoader()}
                            </div>
                        ) : (
                            failedInvoiceList?.length > 0 ? (
                                <FailedInvoiceListTable list={failedInvoiceList} pageNo={pageNo} itemsPerPage={itemsPerPage} fetchFailedInvoices={fetchFailedInvoices} />
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

export default FailedInvoiceList