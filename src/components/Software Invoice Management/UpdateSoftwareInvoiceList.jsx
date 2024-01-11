import React from 'react'
import { Box, Checkbox, FormLabel, IconButton, Modal, Button, OutlinedInput, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextareaAutosize, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactSelect from "react-select";
import { listGeneratedInvoice, updateInvoiceDetails } from '../../config/services/packageBundle';
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import Page from "../Page";
import toast from 'react-hot-toast';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { getSchoolsByCode } from '../../config/services/purchaseOrder';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as FeatherDownloadIcon } from './../../assets/image/downloadIcon.svg'
import { useStyles } from "../../css/HardwareInvoice-css";
import { DisplayLoader } from '../../helper/Loader';
import Pagination from '../../pages/Pagination';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const PAYMENT_STATUS_CODE_MAP = {
    1: 'All Invoice',
    2: 'Freeze Yes',
    3: 'Freeze No',
    4: 'Cancelled Invoices',
    5: 'Invoice Sent'
}

let options = [
    { label: "Yes", value: "1" },
    { label: "No", value: "2" },
]

let invoiceOptions = [
    { label: "E-Invoice", value: "E-INVOICE" },
    { label: "EM-Invoice", value: "EM-INVOICE" },
]

const UpdateSoftwareInvoiceList = () => {
    const PAGE_SIZE = 10;
    const loginData = getUserData('loginData');
    const [tabValue, setTabValue] = useState(0);
    const [listData, setListData] = useState(null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(false)
    const [invoiceList, setInvoiceList] = useState([])
    const [loader, setLoader] = useState(false);
    const [schoolCode, setSchoolCode] = useState('');
    const [impFormId, setImpFormId] = useState('');
    const [poId, setPoId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selected, setSelected] = useState([]);
    const [freeze, setFreeze] = useState(null);
    const [invoiceType, setInvoiceType] = useState([]);
    const [invoiceAmount, setInvoiceAmount] = useState(0)
    const classes = useStyles()



    const handleTabChange = (event, newValue) => {
        setPage(1);
        // setListData(null);
        setInvoiceList([])
        setTabValue(newValue);
    };

    const fetchGeneratedInvoice = async () => {
        setLoader(true)
        setLastPage(false)
        try {
            let params = {
                uuid: loginData?.uuid,
                invoice_for: "SW",
                page_offset: page - 1,
                page_size: PAGE_SIZE,
                // order_by: "invoice_date",
                // order: "DESC"
            }
            if (tabValue == 0) {
                params = {
                    ...params,
                    invoice_status: [1, 2, 3],
                };
            }
            else if (tabValue == 1) {
                params = {
                    ...params,
                    invoice_status: [1],
                    is_freezed: 1,

                };
            }
            else if (tabValue == 2) {
                params = {
                    ...params,
                    invoice_status: [1],
                    is_freezed: 2,

                };
            }
            else if (tabValue == 3) {
                params = {
                    ...params,
                    invoice_status: [3],
                };
            }
            else if (tabValue == 4) {
                params = {
                    ...params,
                    invoice_status: [2],
                };
            }

            if (schoolCode?.length > 0) {
                params = {
                    ...params,
                    school_code_name: schoolCode
                }
            }

            if (impFormId?.length > 0) {
                params = {
                    ...params,
                    implementation_form_id: impFormId
                }
            }

            if (poId?.length > 0) {
                params = {
                    ...params,
                    po_code: poId
                }
            }

            if (poId?.length > 0) {
                params = {
                    ...params,
                    po_code: poId
                }
            }

            if (freeze != null) {
                params = {
                    ...params,
                    is_freezed: freeze?.value
                }
            }

            if (invoiceType != null) {
                params = {
                    ...params,
                    invoice_data_type: invoiceType?.value
                }
            }

            if (fromDate) {
                params = {
                    ...params,
                    invoice_date_from: fromDate
                }
            }

            if (toDate) {
                params = {
                    ...params,
                    invoice_date_to: toDate
                }
            }


            const res = await listGeneratedInvoice(params);
            let data = res?.data?.generated_invoice_details;
            let invoiceAmountSum = data?.reduce((total, item) => total + item?.invoice_amount, 0)
            let dataLength = data?.length
            if (dataLength == 0) {
                setLastPage(true);
                setInvoiceList([])
                setInvoiceAmount(0)
                setLoader(false)
                return
            }
            if (dataLength < 10) setLastPage(true)
            setInvoiceAmount(invoiceAmountSum)
            await fetchSchoolData(data);
            setLoader(false)
        } catch (err) {
            console.error('An error occurred:', err);
            toast.error('Something went wrong!')
            setLastPage(false)
            setLoader(false)
        }
    };


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
                // setLastPage(false)
                setLoader(false)
            })
    }

    useEffect(() => {
        fetchGeneratedInvoice();
    }, [page, tabValue]);

    const handleSearch = () => {
        fetchGeneratedInvoice();
    }

    return (

        <Page title="Extramarks | Update Software Invoice" className="main-container">
            <div className="tableCardContainer">
                <Paper>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p className={classes.header}>Update Software Invoice</p>
                    </div>
                    <Grid container sx={{ marginTop: '-10px', marginBottom: '25px' }}>
                        <Grid item xs={3} md={3} >
                            <Typography><b>Total Invoice </b>: {invoiceList?.length ?? 0}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <Typography><b>Total Invoice Amount </b>: {invoiceAmount?.toFixed(2) + "/-"}</Typography>
                        </Grid>

                    </Grid>
                    <div className="mainContainer">
                        <Box
                            sx={{
                                display: "flex",
                                marginBottom: "20px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <FormLabel>School Name/Code</FormLabel>
                                <OutlinedInput onChange={(e) => setSchoolCode(e.target.value)} value={schoolCode} placeholder="Enter School Name/Code" size="small" />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "20px",
                                }}
                            >
                                <FormLabel>Implementation ID</FormLabel>
                                <OutlinedInput onChange={(e) => setImpFormId(e.target.value)} value={impFormId} placeholder="Enter Implementation ID" size="small" />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "20px",
                                }}
                            >
                                <FormLabel>PO ID</FormLabel>
                                <OutlinedInput onChange={(e) => setPoId(e.target.value)} value={poId} placeholder="Enter PO ID" size="small" />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "20px",
                                    width: "200px",
                                }}
                            >
                                <FormLabel>Freeze</FormLabel>
                                <ReactSelect
                                    onChange={(value) => setFreeze(value)}
                                    value={freeze}
                                    options={options}
                                    placeholder="Select"
                                    isClearable={true}
                                />
                            </Box>


                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "20px",
                                    width: "200px",
                                }}
                            >
                                <FormLabel>Invoice Type</FormLabel>
                                <ReactSelect
                                    onChange={(value) => setInvoiceType(value)}
                                    value={invoiceType}
                                    options={invoiceOptions}
                                    placeholder="Select"
                                    isClearable={true}
                                />
                            </Box>


                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography component="h5">Date Range</Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: "200px",
                                    }}
                                >
                                    <FormDatePicker
                                        placeholder="From"
                                        style={{ marginRight: '40px' }}
                                        value={fromDate}
                                        handleSelectedValue={(value) => setFromDate(moment(value).format('YYYY-MM-DD'))}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        marginLeft: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: "200px",
                                    }}
                                >
                                    <FormDatePicker
                                        placeholder="To"
                                        style={{ marginRight: '40px' }}
                                        value={toDate}
                                        handleSelectedValue={(value) => setToDate(moment(value).format('YYYY-MM-DD'))}
                                    />
                                </Box>

                                <Button
                                    style={{ marginLeft: '20px' }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleSearch}
                                >
                                    Search
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "20px",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                    <Tab label="All Invoice" {...a11yProps(0)} />
                                    <Tab label="Freeze Yes" {...a11yProps(1)} />
                                    <Tab label="Freeze No" {...a11yProps(2)} />
                                    <Tab label="Cancelled Invoices" {...a11yProps(3)} />
                                    <Tab label="Invoice Sent" {...a11yProps(4)} />
                                </Tabs>
                            </Box>

                        </Box>
                        {/* tabs */}
                        <CustomTabPanel value={tabValue} index={0}>
                            <AllTab tabValue={tabValue} loader={loader} listData={invoiceList} page={page} setPage={setPage} selected={selected} setSelected={setSelected} lastPage={lastPage} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <AllTab tabValue={tabValue} loader={loader} listData={invoiceList} page={page} setPage={setPage} selected={selected} setSelected={setSelected} lastPage={lastPage} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={2}>
                            <AllTab tabValue={tabValue} loader={loader} listData={invoiceList} page={page} setPage={setPage} selected={selected} setSelected={setSelected} lastPage={lastPage} />
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={3}>
                            <AllTab tabValue={tabValue} loader={loader} listData={invoiceList} page={page} setPage={setPage} selected={selected} setSelected={setSelected} lastPage={lastPage} />
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={4}>
                            <AllTab tabValue={tabValue} loader={loader} listData={invoiceList} page={page} setPage={setPage} selected={selected} setSelected={setSelected} lastPage={lastPage} />
                        </CustomTabPanel>
                    </div>
                </Paper>

            </div>
        </Page>

    )
}

export default UpdateSoftwareInvoiceList


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const iconButtonStyles = makeStyles((theme) => ({
    iconButton: {
        border: "1px solid",
        borderColor: theme.palette.primary.lighter,
        '&:hover': {
            borderColor: theme.palette.primary.main,
        },
        '&:last-child': {
            marginLeft: "20px",
        }
    },
}));


function AllTab({ loader, listData, page, setPage, selected, setSelected, tabValue, lastPage }) {
    const ClassNames = iconButtonStyles();
    const [list, setList] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [checkedRows, setCheckedRows] = useState([]);
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    const navigate = useNavigate()
    const classes = useStyles()

    const handleUpdateInvoice = (data) => {
        let { invoice_auto_id } = data
        navigate(`/authorised/update-software-invoice/${invoice_auto_id}`, { state: { softwareInvoiceRowData: data } })
    }

    const handleFreeze = async (data) => {
        data?.map(async (item) => {
            try {
                let params = {
                    uuid,
                    invoice_auto_id: item?.invoice_auto_id,
                    is_freezed: 1,
                };
                const res = await updateInvoiceDetails(params);
                let { message, status } = res?.data;
                if (status === 1) {
                    toast.success(message);
                    setCheckedRows([])
                } else if (status === 0) {
                    toast.dismiss();
                    toast.error(message);
                }
            } catch (err) {
                console.error('An error occurred:', err);
            }
        });
    };


    const isSelectAllChecked = () => {
        let validData = listData?.filter(item => item.is_freezed != 1)
        return (
            (validData?.length > 0 && validData.length === checkedRows.length) ||
            (validData?.length > 0 &&
                validData.length === checkedRows.length)
        );
    };

    const handleSelectAll = (event) => {
        let validData = listData?.filter(item => item.is_freezed != 1)
        if (validData?.length === 0) {
            toast.dismiss()
            toast.error('Freezed Invoices can not be selected!')
            return
        }
        if (event.target.checked) {
            setCheckedRows(validData);
        } else {
            setCheckedRows([]);
        }
    };

    const isChecked = (row) => {
        return checkedRows.includes(row);
    };

    const handleRowCheck = (event, row) => {
        if (row?.is_freezed === 1) {
            toast.dismiss()
            toast.error('Freezed Invoice can not be selected!')
            return
        }
        if (event.target.checked) {
            setCheckedRows([...checkedRows, row]);
        } else {
            setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
        }
    };


    useEffect(() => {
        if (listData?.length <= 0) {
            setList([])
            return
        } else {
            setList(listData)
        }

    }, [listData])

    if (!listData) return null;

    return (
        <Box sx={{ width: '100%' }}>
            {loader ?
                <div className={classes.loader}>
                    {DisplayLoader()}
                </div>
                :
                listData?.length === 0 ?
                    <div className={classes.noData}>
                        <p>No Data Available</p>
                    </div> :
                    <>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" className="custom-table datasets-table" >
                                    <TableHead>
                                        <TableRow className="cm_table_head">
                                            {tabValue == 0 ?
                                                <TableCell style={{ width: "max-content" }}>
                                                    <Checkbox
                                                        checked={isSelectAllChecked()}
                                                        onChange={handleSelectAll}
                                                    />
                                                </TableCell>
                                                :
                                                null}
                                            <TableCell align='left'>Implementation ID</TableCell>
                                            <TableCell align='left'>Invoice ID</TableCell>
                                            <TableCell align='left'>School Name</TableCell>
                                            <TableCell align='left'>School Code</TableCell>
                                            <TableCell align='left'>EMI Amount</TableCell>
                                            {(tabValue == 1 || tabValue == 2) ?
                                                null :
                                                <TableCell align='left'>Freeze</TableCell>

                                            }
                                            <TableCell align='left'>Invoice Date</TableCell>
                                            <TableCell align='left'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list?.length > 0 &&
                                            list.map((row, i) => (
                                                <TableRow
                                                    key={i}
                                                >
                                                    {tabValue == 0 ?
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={isChecked(row)}
                                                                onChange={(event) => handleRowCheck(event, row)}
                                                            />
                                                        </TableCell>
                                                        : null
                                                    }
                                                    <TableCell >{row?.implementation_form_id ?? "NA"}</TableCell>
                                                    <TableCell >{row?.invoice_number ?? "NA"}</TableCell>
                                                    <TableCell >{row?.schoolDetails?.schoolName ?? "NA"}</TableCell>
                                                    <TableCell >{row?.school_code ?? "NA"}</TableCell>
                                                    <TableCell >

                                                        <CurrencyRupeeIcon
                                                            sx={{ position: "relative", top: "2px", fontSize: "15px" }}
                                                        />
                                                        {Number(row?.invoice_amount)?.toLocaleString("en-IN", {
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </TableCell>
                                                    {(tabValue == 1 || tabValue == 2) ?
                                                        null :
                                                        <TableCell >{row?.is_freezed === 1 ? "Yes" : "No"}</TableCell>

                                                    }
                                                    <TableCell>{row?.invoice_month ? moment(row?.invoice_month).format('DD-MM-YYYY') : "NA"}
                                                    </TableCell>
                                                    <TableCell >
                                                        {tabValue < 3 ?
                                                            <span style={{ cursor: 'pointer', color: '#4482FB', marginRight: '10px', textDecoration: 'underline' }} onClick={() => handleUpdateInvoice(row)}>{"Update"}</span>
                                                            :
                                                            <span style={{ cursor: row?.invoice_file_path ? "cursor" : "not-allowed" }}>
                                                                <a href={row?.invoice_file_path}>
                                                                    <FeatherDownloadIcon />
                                                                </a>
                                                            </span>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className='center cm_pagination'>
                                <Pagination pageNo={page} setPagination={setPage} lastPage={lastPage} />
                            </div>
                        </Paper>
                        {checkedRows?.length > 0 &&
                            <div className={classes.btnContainer}>
                                <Button
                                    style={{ marginRight: "20px", borderRadius: 4 }}
                                    onClick={() => {
                                        setCheckedRows([])
                                    }}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>


                                <Button
                                    name={"Save"}
                                    className={classes.actionBtn}
                                    onClick={() => {
                                        handleFreeze(checkedRows)
                                    }}
                                    variant="contained"
                                >
                                    Freeze
                                </Button>
                            </div>
                        }
                    </>
            }

        </Box >
    )
}
