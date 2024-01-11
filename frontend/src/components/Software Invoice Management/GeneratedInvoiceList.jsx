import React, { useEffect, useState } from 'react'
import Page from '../Page'
import { ReactComponent as IconInputSearch } from './../../assets/icons/icon-input-search-light.svg';
import { Alert, Box, Button, Grid, IconButton, InputAdornment, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material'
import { useStyles } from "../../css/ClaimForm-css";
import { DisplayLoader } from "../../helper/Loader";
import Pagination from "../../pages/Pagination";
import _ from 'lodash';
import { ReactComponent as SettingsIcon } from './../../assets/icons/icon-settings.svg'
import CloseIcon from '@mui/icons-material/Close';
import FailedInvoiceListTable from './FailedInvoiceListTable';
import FormDatePicker from '../../theme/form/theme2/FormDatePicker';
import GeneratedInvoiceListTable from './GeneratedInvoiceListTable';
import { listGeneratedInvoice } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { getSchoolsByCode } from '../../config/services/purchaseOrder';
import { BreadcrumbsFormatter } from '../../utils/utils';

const GeneratedInvoiceList = () => {

    const testData = [
        {
            implementationID: "IMPL-001",
            invoiceId: "INV-001",
            schoolName: "ABC School",
            schoolCode: "SC001",
            emiAmount: 1000,
            realizedAmount: 800,
            freeze: 'no',
            emiDate: "2023-10-31",
            dueAmount: 200,
        },
        {
            implementationID: "IMPL-002",
            invoiceId: "INV-002",
            schoolName: "XYZ School",
            schoolCode: "SC002",
            emiAmount: 1500,
            realizedAmount: 1200,
            freeze: 'yes',
            emiDate: "2023-11-15",
            dueAmount: 300,
        },
        {
            implementationID: "IMPL-003",
            invoiceId: "INV-003",
            schoolName: "123 School",
            schoolCode: "SC003",
            emiAmount: 1200,
            realizedAmount: 1000,
            freeze: 'no',
            emiDate: "2023-11-30",
            dueAmount: 200,
        }
    ];

    const classes = useStyles();
    const [loader, setLoader] = useState(false);
    const [pageNo, setPagination] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10)
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
    const [invoiceType, setInvoiceType] = useState()
    const [freeze, setFreeze] = useState()
    const [invoiceList, setInvoiceList] = useState([])
    const loginData = getUserData('loginData')
    const [searchObject, setSearchObject] = useState({})
    const [search, setSearch] = useState({})
    const uuid = loginData?.uuid


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
        value = value.trim()
        setSearchObject(prevData => {
            return {
                ..._.cloneDeep(prevData),
                school_code_name: value
            }
        })
    }

    const handleImpIdSearch = (e) => {
        let { value } = e.target
        value = value.trim()
        setSearchObject(prevData => {
            return {
                ..._.cloneDeep(prevData),
                implementation_form_id: value
            }
        })
    }

    const handlePOCodeSearch = (e) => {
        let { value } = e.target
        value = value.trim()
        setSearchObject(prevData => {
            return {
                ..._.cloneDeep(prevData),
                po_code: value
            }
        })
    }

    const handleFreeze = (e) => {
        let { value } = e.target
        setSearchObject(prevData => {
            return {
                ..._.cloneDeep(prevData),
                is_freezed: value
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
                setInvoiceList(data)
            })
            .catch(err => {
                console.error('Error while fetching school details', err)
                setLastPage(false)
                setLoader(false)
            })
    }

    const fetchGeneratedInvoice = async () => {
        setLoader(true)
        setLastPage(false)
        try {
            let params = {
                uuid,
                invoice_for: "SW",
                page_offset: pageNo - 1,
                page_size: itemsPerPage,
                invoice_status: [1],
                school_code_name: search?.school_code_name,
                implementation_form_id: search?.implementation_form_id,
                po_code: search?.po_code,
                invoice_date_from: search?.invoice_date_from,
                invoice_date_to: search?.invoice_date_to,
                is_freezed: search?.is_freezed,
                order_by: "DESC"
            };
            const res = await listGeneratedInvoice(params);
            let data = res?.data?.generated_invoice_details;
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
        fetchGeneratedInvoice()
    }, [pageNo, search])

    return (
        <>
            <Page
                title="Extramarks | Generated Invoice List"
                className="crm-page-wrapper crm-page-listing-container"
            >
                <BreadcrumbsFormatter
                    crumbs={[{label: 'Home', route: '/authorised/school-dashboard'}, {label: 'Generated Invoice List'}]}
                />

                <div className={'crm-page-container '}>
                    <Typography className='crm-page-heading' component='h1'>Generated Invoice List</Typography>

                    <Grid container spacing={2.5} mb={2.5}>
                        <Grid item md={6} xs={12}>
                            <div className='crm-page-hardware-header-item'>
                                <Typography component='h4'>Total Invoice </Typography>
                                <Typography component={'p'}>{invoiceList?.length ?? 0}</Typography>
                            </div>
                        </Grid>
                    </Grid>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Date Range</div>
                        <div style={{ display: 'flex'}}>
                            
                            <div className='crm-page-invoice-accordion-form-item'>
                                <FormDatePicker
                                    className='crm-form-input width-150px mr-1'
                                    value={searchObject?.invoice_date_from}
                                    placeholder='From'
                                    theme="medium-dark"
                                    handleSelectedValue={(date) => {
                                        setSearchObject(prevData => {
                                            return {
                                                ..._.cloneDeep(prevData),
                                                invoice_date_from: date
                                            }
                                        })
                                    }}
                                    iconColor='primary'
                                    placeholderColor='medium-dark'
                                />
                            </div>
                            <div className='crm-page-invoice-accordion-form-item'>
                                <FormDatePicker
                                    className='crm-form-input width-150px mr-1'
                                    value={searchObject?.invoice_date_to}
                                    placeholder='To'
                                    theme="medium-dark"
                                    handleSelectedValue={(date) => {
                                        setSearchObject(prevData => {
                                            return {
                                                ..._.cloneDeep(prevData),
                                                invoice_date_to: date
                                            }
                                        })
                                    }}
                                    iconColor='primary'
                                    placeholderColor='medium-dark'
                                />
                            </div>
                        </div>
                    </div>

                    <Typography component={'div'} className=' crm-page-hardware-header-filter-label'>Filter</Typography>
                    <Grid container spacing={2} mb={2.5}>
                        <Grid item md={3}>
                            <TextField
                                id="outlined-basic"
                                placeholder="School Name/Code"
                                // value={searchObject?.school_code_name}
                                onChange={handleSchoolSearch}
                                className='crm-form-input medium-dark'
                            />
                        </Grid>

                        <Grid item md={3}>
                            <TextField
                                id="outlined-basic"
                                placeholder="Implementation ID"
                                // value={searchObject?.implementation_form_id}
                                onChange={handleImpIdSearch}
                                className='crm-form-input medium-dark'
                            />
                        </Grid>

                        <Grid item md={3}>
                            <TextField
                                id="outlined-basic"
                                placeholder="PO ID"
                                // value={searchObject?.po_code}
                                onChange={handlePOCodeSearch}
                                className='crm-form-input medium-dark'
                            />
                        </Grid>

                        <Grid item md={3} >
                            <Button className='crm-btn' type='submit' onClick={handleSearch}>Search</Button>
                        </Grid>

                        <Grid item md={3}>
                            <Typography mb={1} variant='subtitle1'>Invoice Type</Typography>
                            <Select
                                value={searchObject?.invoice_data_type}
                                onChange={handleInvoicetype}
                                displayEmpty
                                variant="outlined"
                                fullWidth
                                className={`crm-form-input crm-form-select2 medium-dark`}
                            // placeholder='Invoice Type'
                            >
                                <MenuItem value={'E_INVOICE'}>E-Invoice</MenuItem>
                                <MenuItem value={'EM_INVOICE'}>EM-Invoice</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item md={3}>
                            <Typography mb={1} variant='subtitle1'>Freeze</Typography>
                            <Select
                                value={searchObject?.is_freezed}
                                onChange={handleFreeze}
                                displayEmpty
                                variant="outlined"
                                fullWidth
                                className={`crm-form-input crm-form-select2 medium-dark`}
                            // label='Select..'
                            >
                                <MenuItem value={1}>Yes</MenuItem>
                                <MenuItem value={2}>No</MenuItem>
                            </Select>
                        </Grid>

                    </Grid>

                    <Box className='crm-table-container'>
                        {loader ? (
                            <div className={classes.loader}>
                                {DisplayLoader()}
                            </div>
                        ) : (
                            invoiceList?.length > 0 ? (
                                <GeneratedInvoiceListTable list={invoiceList} />
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

export default GeneratedInvoiceList