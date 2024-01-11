import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Checkbox, FormLabel, IconButton, Modal, OutlinedInput, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextareaAutosize, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from 'react-hot-toast';
import ReactSelect from "react-select";
import { listReasonMaster, masterDataList } from '../../config/services/packageBundle';
import { approvePaymentFinance, getPaymentDepositCases, rejectPaymentDepositCases } from '../../config/services/paymentCollectionManagment';
import { getUserData } from '../../helper/randomFunction/localStorage';
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import Page from "../Page";
import Button from "../controls/Button";

const PAYMENT_STATUS_CODE_MAP = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
}

export default function PaymentDepositCases() {
    const PAGE_SIZE = 10;
    const loginData = getUserData('loginData');
    const [tabValue, setTabValue] = useState(0);
    const [listData, setListData] = useState(null);
    const [page, setPage] = useState(0);
    const [schoolCode, setSchoolCode] = useState('');
    const [impFormId, setImpFormId] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selected, setSelected] = useState([]);
    const paymentModeData = useModeOfPaymentData(loginData?.uuid);
    const rejectReasonData = useRejectReasonData(loginData?.uuid);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState(null);
    const [rejectRemark, setRejectRemark] = useState('');
    const [isChequeReject, setIsChequeReject] = useState(false);
    const isPaymentModeWithCheckCase = useMemo(() => {
        const items = listData?.filter(item => selected.includes(item.cpd_id));
        if (items?.length === 0) return false;
        return items?.every(item => item.payment_mode_id === 3);
    }, [selected, listData]);

    const handleTabChange = (event, newValue) => {
        setPage(0);
        setListData(null);
        setTabValue(newValue);
    };

    const getListData = useCallback(async () => {
        let params = {
            uuid: loginData?.uuid,
            page_size: PAGE_SIZE,
            page_offset: page,
            order_by: "deposit_auto_id",
            order: "DESC",
            status: [1],
        }
        if (schoolCode && schoolCode?.length > 0) params.school_code = schoolCode;
        if (impFormId && impFormId?.length > 0) params.imp_form_id = impFormId;
        if (modeOfPayment) params.payment_mode_id = modeOfPayment?.id || 1;
        if (fromDate && fromDate?.length > 0) params.collected_date_from = fromDate;
        if (toDate && toDate?.length > 0) params.collected_date_to = toDate;
        if (tabValue === 0) params.payment_approval_status = [1];
        if (tabValue === 1) params.payment_approval_status = [2];
        if (tabValue === 2) params.payment_approval_status = [3];

        try {
            const response = await getPaymentDepositCases(params);
            setListData(response?.data?.payment_details);
            // console.log(response)
        } catch (error) {
            console.log(error)
        }
    }, [page, tabValue, schoolCode, impFormId, modeOfPayment, fromDate, toDate])

    useEffect(() => {
        getListData();
    }, [page, tabValue]);

    const handleSearch = () => {
        getListData();
    }

    const rejectPayment = () => {
        if (selected.length === 0) return;
        setRejectModalOpen(true);
    }

    const approvePayment = async () => {
        try {
            if (selected.length === 0) return;
            if (selected.length > 1) return toast.error('Please select only one item');
            const item = listData.find(item => item.cpd_id === selected[0]);
            if (!item) return;
            await approvePaymentFinance({
                uuid: loginData?.uuid,
                cpd_ids: [item.cpd_id],
                // payment_details: [{
                //     deposit_auto_id: item.deposit_auto_id,
                //     payment_mode_id: item.payment_mode_id,
                // }],
            });
            getListData();
            setSelected([]);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleReject = async () => {
        if (!rejectReason && !rejectReason.length) return;
        try {
            await rejectPaymentDepositCases({
                uuid: loginData?.uuid,
                payment_approval_status: isChequeReject ? 4 : 3,
                rejection_reason_id: rejectReason?.value,
                rejection_reason_comment: rejectRemark,
                cpd_ids: selected,
            });
            if(isChequeReject) setIsChequeReject(false);
            setRejectModalOpen(false);
            getListData();
            setRejectReason(null);
            setRejectRemark('');
            setSelected([]);
        } catch (error) {
            console.log(error)
        }
    }

    const bounceChequePayment = async () => {
        setIsChequeReject(true);
        setRejectModalOpen(true);
        // await rejectPaymentDepositCases({
        //     uuid: loginData?.uuid,
        //     payment_approval_status: 4,
        //     cpd_ids: selected,
        // });
        // getListData();
        // setSelected([]);
    }

    const approveChequePayment = () => {
        approvePayment()
    }

    return (
        <Page title="Extramarks | Payment Deposit Cases" className="main-container">
            <div className="tableCardContainer">
                <Paper>
                    <Box className="crm-sd-heading">
                        <Typography component="h2">Deposit Cases</Typography>
                    </Box>
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
                                <OutlinedInput onChange={(e) => setSchoolCode(e.target.value)} value={schoolCode} placeholder="Enter" size="small" />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "20px",
                                }}
                            >
                                <FormLabel>Implementation ID</FormLabel>
                                <OutlinedInput onChange={(e) => setImpFormId(e.target.value)} value={impFormId} placeholder="Enter" size="small" />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "20px",
                                }}
                            >
                                <FormLabel>Mode of Payment</FormLabel>
                                <ReactSelect
                                    onChange={(value) => setModeOfPayment(value)}
                                    value={modeOfPayment}
                                    options={paymentModeData?.list || []}
                                    placeholder="Select"
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
                                        format="YYYY-MM-DD"
                                        handleSelectedValue={(value) => {
                                            setFromDate(value)
                                        }}
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
                                        format="YYYY-MM-DD"
                                        handleSelectedValue={(value) => setToDate(value)}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        marginLeft: "20px",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        text="Search"
                                        size="small"
                                        onClick={handleSearch}
                                    />
                                </Box>

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
                                    <Tab label="Pending" {...a11yProps(0)} />
                                    <Tab label="Approved" {...a11yProps(1)} />
                                    <Tab label="Rejected" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <Box
                                flex
                            >
                                {
                                    isPaymentModeWithCheckCase && tabValue === 1
                                        ? (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    text="Bounce"
                                                    size="small"
                                                    onClick={bounceChequePayment}
                                                />
                                                <Button
                                                    variant="outlined"
                                                    text="Payment Received"
                                                    size="small"
                                                    onClick={approveChequePayment}
                                                />
                                            </>
                                        )
                                        : null
                                }
                                {
                                    tabValue === 0
                                        ? (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    text="Reject"
                                                    size="small"
                                                    onClick={rejectPayment}
                                                />
                                                <Button
                                                    variant="outlined"
                                                    text="Approve"
                                                    size="small"
                                                    onClick={approvePayment}
                                                    disabled={selected.length !== 1}
                                                />
                                            </>
                                        )
                                        : null
                                }

                            </Box>
                        </Box>
                        {/* tabs */}
                        <CustomTabPanel value={tabValue} index={0}>
                            <AllTab tabValue={tabValue} listData={listData} page={page} setPage={setPage} selected={selected} setSelected={setSelected} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <AllTab tabValue={tabValue} listData={listData} page={page} setPage={setPage} selected={selected} setSelected={setSelected} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={2}>
                            <AllTab tabValue={tabValue} listData={listData} page={page} setPage={setPage} selected={selected} setSelected={setSelected} />
                        </CustomTabPanel>
                    </div>
                </Paper>
                <Modal
                    open={rejectModalOpen}
                    onClose={() => setRejectModalOpen(false)}
                    aria-labelledby="reject-modal"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            width: 400
                        }}>
                        <ReactSelect
                            onChange={(value) => setRejectReason(value)}
                            value={rejectReason}
                            options={rejectReasonData?.list || []}
                            placeholder="Select"
                        />
                        <Box
                            sx={{
                                marginTop: '20px',
                                marginBottom: '20px',
                            }}
                        >
                            <TextareaAutosize defaultValue={rejectRemark} onChange={(e) => setRejectRemark(e.target.value)} aria-label="minimum height" minRows={5} placeholder="Reason" style={{ width: '100%' }} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button onClick={handleReject} variant="outlined" text="Reject" size="small" />
                        </Box>
                    </Box>
                </Modal>
            </div>
        </Page>
    )
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function generateRandomDefaultData() {
    return {
        id: Math.floor(Math.random() * 100),
        collection_date: "2021-10-25",
        collected_by: `Collected By ${Math.floor(Math.random() * 100)}`,
        school_code: `DL${Math.floor(Math.random() * 100)}`,
        school_name: `School ${Math.floor(Math.random() * 100)}`,
        emi_month: "january-march",
        amount: Math.floor(Math.random() * 1000),
        deposit_for: "SIP",
        deposit_mode: "Cash",
        deposit_date: "2021-10-25",
        chq_dd_recpt_no: "123456789",
        payment_evidence: "https://www.google.com",
        status: "Pending",
    }
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

function AllTab({ listData, page, setPage, selected, setSelected, tabValue }) {
    const ClassNames = iconButtonStyles();
    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (!listData) return;
        const data = listData?.map((item) => {
            return {
                id: item.cpd_id,
                cpd_id: item.cpd_id,
                collection_date: item.collection_date,
                collected_by: `Collected By ${item.collected_by_empname}`,
                school_code: item.school_code,
                school_name: `Default school name`,
                emi_month: "january-march (default)",
                amount: item.deposit_amount,
                deposit_for: item.product_name,
                deposit_mode: item.payment_mode_name,
                deposit_date: item.deposit_date,
                chq_dd_recpt_no: item.payment_evidence_no,
                payment_evidence: item?.payment_evidence_file_path,
                status: PAYMENT_STATUS_CODE_MAP[item.payment_approval_status] || "Pending",
            }
        })
        setRows([...data]);
    }, [listData])
    const [rowsPerPage, setRowsPerPage] = useState(10);
    if (!listData) return null;

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = tabValue === 1 ? rows.filter(item => item.deposit_mode?.toLowerCase() === 'cheque').map((n) => n.id) : rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rows.length}
                            showSelection={tabValue === 0 || tabValue === 1}
                        />
                        <TableBody>
                            {
                                rows.length > 0
                                    ? rows.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${row?.id}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={`${row.id}`}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                {
                                                    (tabValue === 0 || (tabValue === 1 && row.deposit_mode?.toLowerCase() === 'cheque'))
                                                        ? (
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    color="primary"
                                                                    checked={isItemSelected}
                                                                    inputProps={{
                                                                        'aria-labelledby': labelId,
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        ) : <TableCell padding="checkbox"></TableCell>
                                                }
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.collection_date}
                                                </TableCell>
                                                <TableCell align="right">{row.collected_by}</TableCell>
                                                <TableCell align="right">{row.school_code}</TableCell>
                                                {/* <TableCell align="right">{row.school_name}</TableCell> */}
                                                {/* <TableCell align="right">{row.emi_month}</TableCell> */}
                                                <TableCell align="right">{row.amount}</TableCell>
                                                <TableCell align="right">{row.deposit_for}</TableCell>
                                                <TableCell align="right">{row.deposit_mode}</TableCell>
                                                <TableCell align="right">{row.deposit_date}</TableCell>
                                                <TableCell align="right">{row.chq_dd_recpt_no}</TableCell>
                                                <TableCell align="center">
                                                    {
                                                        row.payment_evidence
                                                            ? (
                                                                <IconButton
                                                                    as='a'
                                                                    href={row.payment_evidence}
                                                                    target="_blank"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <DownloadIcon />
                                                                </IconButton>
                                                            ) : null
                                                    }

                                                    {/* {row.payment_evidence} */}
                                                </TableCell>
                                                <TableCell align="right">{row.status}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                    : (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center">No data</TableCell>
                                        </TableRow>
                                    )
                            }
                            {/* {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px',
                    }}
                >
                    <IconButton
                        color="primary"
                        size="large"
                        className={ClassNames.iconButton}
                        disabled={page === 0}
                        onClick={() => setPage((prevPage) => prevPage - 1)}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        size="large"
                        className={ClassNames.iconButton}
                        disabled={rows.length < rowsPerPage}
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
                {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
            </Paper>
        </Box>
    )
}

const headCells = [
    {
        id: 'collection-date',
        numeric: false,
        disablePadding: true,
        label: 'Collection Date',
    },
    {
        id: 'collected-by',
        numeric: false,
        disablePadding: false,
        label: 'Collected By',
    },
    {
        id: 'school-code',
        numeric: false,
        disablePadding: false,
        label: 'School Code',
    },
    // {
    //     id: 'school-name',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'School Name',
    // },
    // {
    //     id: 'emi-month',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'EMI Month',
    // },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Amount (Rs.)',
    },
    {
        id: 'deposit-for',
        numeric: false,
        disablePadding: false,
        label: 'Deposit For',
    },
    {
        id: 'deposit-mode',
        numeric: false,
        disablePadding: false,
        label: 'Deposit Mode',
    },
    {
        id: 'deposit-date',
        numeric: false,
        disablePadding: false,
        label: 'Deposit Date',
    },
    {
        id: 'chq-dd-recpt-no',
        numeric: false,
        disablePadding: false,
        label: 'Chq/DD/Recpt No.',
    },
    {
        id: 'payment-evidence',
        numeric: false,
        disablePadding: false,
        label: 'Payment Evidence',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
];

const useEnhancedTableHeadStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
    },
    tableCell: {
        color: `${theme.palette.primary.contrastText} !important`,
    }
}));

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount, showSelection } = props;
    const classes = useEnhancedTableHeadStyles();
    return (
        <TableHead
            classes={{
                root: classes.root,
            }}
        >
            <TableRow>
                {
                    showSelection
                        ? (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={rowCount > 0 && numSelected === rowCount}
                                    onChange={onSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all deposit cases',
                                    }}
                                />
                            </TableCell>
                        )
                        : <TableCell padding="checkbox"></TableCell>
                }
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        className={classes.tableCell}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function useModeOfPaymentData(uuid) {
    const [state, setState] = useState({
        list: [],
        loading: false,
        error: null,
    });
    useEffect(() => {
        getModeOfPaymentData();
    }, []);

    async function getModeOfPaymentData() {
        try {
            setState((prevState) => {
                return {
                    ...prevState,
                    loading: true,
                    error: null,
                }
            });
            const response = await masterDataList({
                master_data_type: "payment_mode",
                status: [1],
                uuid,
            });
            // console.log(response);
            setState((prevState) => {
                return {
                    ...prevState,
                    loading: false,
                    list: response?.data?.master_data_list?.map(item => ({ ...item, label: item.name, value: item.id })),
                }
            });
        } catch (error) {
            console.log(error);
            setState((prevState) => {
                return {
                    ...prevState,
                    loading: false,
                    error,
                }
            });
        }
    }
    return state
}
function useRejectReasonData(uuid) {
    const [state, setState] = useState({
        list: [],
        loading: false,
        error: null,
    });
    useEffect(() => {
        getResonsData();
    }, []);

    async function getResonsData() {
        try {
            setState((prevState) => {
                return {
                    ...prevState,
                    loading: true,
                    error: null,
                }
            });
            const response = await listReasonMaster({
                reason_type: ["PAYMENT_REJECTION"],
                status: [1],
                uuid,
            });
            // console.log('reson',response);
            setState((prevState) => {
                return {
                    ...prevState,
                    loading: false,
                    list: response?.data?.reason_details?.map(item => ({ ...item, label: item.reason, value: item.reason_id })) || [],
                }
            });
        } catch (error) {
            console.log(error);
            setState((prevState) => {
                return {
                    ...prevState,
                    loading: false,
                    error,
                }
            });
        }
    }
    return state
}