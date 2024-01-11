import { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Grid, Breadcrumbs, Link, Stack, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from '../components/controls/Controls';
import { getStatusList, deleteStatus, createStatus, isDuplicateStatus, changeStatus } from '../config/services/status';
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import { StatusTable, AddStatusModal } from '../components/statusManagement';
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import BreadcrumbArrow from '../assets/image/bredArrow.svg';
import Pagination from './Pagination';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '4px',

};

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #fff',
        boxShadow: '0px 0px 4px #0000001A',
        minWidth: '300px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '18px',
    },
    outlineButton: {
        color: '#85888A',
        fontSize: '14px',
        border: '1px solid #DEDEDE',
        borderRadius: '4px',
        fontWeight: 'normal',
        marginRight: '10px',
        padding: '0.5rem 1.5rem'
    },
    containedButton: {
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        padding: '0.5rem 1.5rem'
    }
}));

export default function StatusManagement(props) {
    const [openPopup, setOpenPopup] = useState(useLocation()?.state?.modalOpen);
    const [recordForEdit, setRecordForEdit] = useState({});
    const [pageNo, setPagination] = useState(1);
    const [search, setSearchValue] = useState('');
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [loader, setLoading] = useState(false);
    const [itemsPerPage] = useState(10);
    const [statusList, setStatusList] = useState([]);
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [statusModel, setStatusModel] = useState(false)
    const [stageDetails, setStageDetails] = useState({})
    const [deactivateStatus, setDeactivateStatus] = useState()
    const [lastPage, setLastPage] = useState(false)
    const [selectedType, setSelectedType] = useState(null);


    const classes = useStyles();
    const navigate = useNavigate();
    const { state } = useLocation();


    const validateAddStatus = (filledDetails) => {
        let { statusName, stageId } = filledDetails

        if (!statusName) {
            toast.error('Fill Status Name')
            return false
        }
        if (!stageId) {
            toast.error('Select Stage ')
            return false
        }
        if (!selectedType) {
            toast.error('Select Type ')
            return false
        }
        else {
            return true
        }
    }

    const checkDuplicateStatus = async () => {
        isDuplicateStatus({ statusName: recordForEdit.statusName })
            .then(res => {
                if (res?.data?.statusCode === 0) {
                    toast.error(res?.data?.error?.errorMessage)
                    return true;
                }
                else {
                    add();
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    const handleStatusToggle = (e, statusDetails) => {
        let { status, _id } = statusDetails
        let newStatus = status === 0 ? 1 : 0

        changeStatus({ _id, status: newStatus, modifiedBy: modifiedBy })
            .then(res => {
                if (res?.result) {
                    fetchStatusList()
                    toast.success(res?.message)
                }
                else if (res?.data?.statusCode === 0) {
                    let { errorMessage } = res?.data?.error
                    toast.error(errorMessage)
                }
                else {
                    console.error(res);
                }
            })
    }


    const toggleStatusModal = () => {
        setStatusModel(!statusModel)
    }

    const handleSubmit = (e, stageDetails) => {
        setStageDetails(stageDetails)
        setDeactivateStatus(stageDetails.status)
        if (statusModel) {
            handleStatusToggle(e, stageDetails)
            toggleStatusModal()
        }
    }

    const add = () => {
        if (validateAddStatus(recordForEdit)) {
            let paramsObj = { ...recordForEdit }
            createStatus(paramsObj)
                .then(res => {
                    if (res?.result) {
                        handleCloseEditPopup()
                        fetchStatusList()
                        toast.success(res?.message)
                        setPagination(1)
                        navigate('/authorised/status-management');
                    }
                    else if (res?.data?.statusCode === 0) {
                        let { errorMessage } = res?.data?.error
                        toast.error(errorMessage)
                    }
                    else {
                        console.error(res);
                    }
                })
        }
    }

    const handleSelectStageName = (newSelectValue) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.stageId = newSelectValue._id
        setRecordForEdit(filledDetails)
    }

    const handleOnChange = (e) => {
        let { value, name } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails[name] = value
        filledDetails.createdBy = createdBy;
        filledDetails.modifiedBy = modifiedBy;
        filledDetails.type = selectedType?.value
        setRecordForEdit(filledDetails)
    }

    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    function handleClick(event) {
        event.preventDefault();
        navigate('/authorised/cycle-management');
    }

    const fetchStatusList = () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
        setLoading(true)
        setLastPage(false)
        getStatusList(params)
            .then((res) => {
                let data = res?.result
                setStatusList(data);
                if (data?.length < itemsPerPage) setLastPage(true)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }

    const openInPopup = statusEdit => {
        setRecordForEdit(statusEdit)
        setOpenPopup(true)
    }

    const deleteStatusObject = params => {
        setDeleteObj({ _id: params?._id, statusName: params?.statusName })
        setDeletePopup(true)
    }

    const submitDeleteStatus = () => {
        let { _id } = deleteObj
        deleteStatus({ _id })
            .then(res => {
                if (res?.result) {
                    handleCancelDelete()
                    fetchStatusList()
                    toast.success(res?.message)
                }
                else if (res?.data?.statusCode === 0) {
                    let { errorMessage } = res?.data?.error
                    toast.error(errorMessage)
                }
                else {
                    console.error(res);
                }
            })
    }

    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))
    }

    const handleCancelDelete = () => {
        setDeletePopup(false)
        setDeleteObj({})
    }

    const handleAddStatus = () => {
        setOpenPopup(true);
    }

    const navigateToManageCycle = () => {
        navigate('/authorised/cycle-management')

    }

    const typeOptions = [
        { value: 'interest', label: 'Interest' },
        { value: 'user', label: 'User' },
        { value: 'implementation', label: 'Implementation' }
    ];

    useEffect(() => fetchStatusList(), [search, sortObj, pageNo, itemsPerPage]);

    return (
        <>
            <Page title="Extramarks | Status Management" className="main-container datasets_container">
                <Stack spacing={2}>
                    <Breadcrumbs className='create-status-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                        <Link underline="hover" key="1" color="inherit" onClick={navigateToManageCycle}>
                            Manage Cycle
                        </Link>
                        <Typography key="2" color="text.primary">Status List</Typography>
                    </Breadcrumbs>

                </Stack><br />
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Status Name , Created By"
                                onChange={handleSearch}
                                InputLabelProps={{ style: { ...({ top: `${-7}px` }) } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src={SearchIcon} alt="" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} >
                            <Grid container justifyContent="flex-end" spacing={2.5}>
                                <Grid item xs={6} sm={6} md={6} lg={4} display="flex" justifyContent="flex-end" >
                                    <Controls.Button
                                        text="New Status"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleAddStatus()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {loader && <Loader />}
                    {statusList && statusList.length > 0 ? <StatusTable list={statusList} openInPopup={openInPopup} deleteStatusObject={deleteStatusObject} pageNo={pageNo} handleSort={handleSort} sortObj={sortObj} itemsPerPage={itemsPerPage} handleSubmit={handleSubmit} toggleStatusModal={toggleStatusModal} /> :
                        <Alert severity="error">No Content Available!</Alert>}
                </Container>
                <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
            </Page>

            <AddStatusModal list={statusList} handleSelectStageName={handleSelectStageName}
                handleOnChange={handleOnChange} openPopup={openPopup}
                recordForEdit={recordForEdit} addOrEdit={add} checkDuplicateStatus={checkDuplicateStatus}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                typeOptions={typeOptions}
                handleCloseEditPopup={handleCloseEditPopup} />

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={deletePopup}
                closeAfterTransition
            >
                <Fade in={deletePopup}>
                    <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                        <Box className="modal-header p-1" >
                            <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >
                                {`Are you sure to delete "${deleteObj?.statusName}" ?`}
                            </Typography>
                        </Box>
                        {/* <Box className="modal-content text-left"> */}
                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={submitDeleteStatus} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                        {/* </Box> */}
                    </Box>
                </Fade>
            </Modal>
            {statusModel &&
                <Modal
                    hideBackdrop={true}
                    open={toggleStatusModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="targetModal1"

                >
                    <Box sx={style} className="modalContainer" style={{ height: '150px', width: '500px' }}>
                        <Typography align='center' >
                            {deactivateStatus == 1 &&
                                <p style={{ fontSize: '16px' }}>After Deactivating all the mappings will be removed</p>}
                            <p style={{ fontSize: '16px' }}>Are you sure you want to change the status?</p>
                        </Typography>
                        <button className='modalbtn' style={{ float: 'right', marginTop: '18px' }} onClick={e => handleSubmit(e, stageDetails)}>Yes</button>
                        <button className='modalbtn' style={{ float: 'right', marginTop: '18px', marginRight: '12px', bgcolor: 'white' }} onClick={toggleStatusModal}>No</button>
                    </Box>
                </Modal>
            }

        </>
    )







}