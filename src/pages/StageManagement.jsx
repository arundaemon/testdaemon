import { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Breadcrumbs, Stack, Link, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from '../components/controls/Controls';
import { getStageList, deleteStage, changeStatus, updateStage, createStage } from '../config/services/stages';
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import { StageTable, AddStageModal } from '../components/stageManagement';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CrossIcon from "../assets/image/crossIcn.svg"
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

export default function StageManagement(props) {
    const [openPopup, setOpenPopup] = useState(useLocation()?.state?.modalOpen);
    const [recordForEdit, setRecordForEdit] = useState({});
    const [pageNo, setPagination] = useState(1);
    const [search, setSearchValue] = useState('');
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [loader, setLoading] = useState(false);
    const [itemsPerPage] = useState(10);
    const [stageList, setStageList] = useState([]);
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [statusModel, setStatusModel] = useState(false)
    const [stageDetails, setStageDetails] = useState({})
    const [deactivateStatus, setDeactivateStatus] = useState()
    const [lastPage, setLastPage] = useState(false)
    const validStageName = new RegExp('^[A-Za-z0-9 ]+$');
    const [selectedType, setSelectedType] = useState(null);



    const navigate = useNavigate();
    const classes = useStyles();
    const { state } = useLocation();

    const typeOptions = [
        { value: 'interest', label: 'Interest' },
        { value: 'user', label: 'User' },
        { value: 'implementation', label: 'Implementation'}
    ];


    const handleOnChange = (e) => {
        let { value, name } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails[name] = value
        setRecordForEdit(filledDetails)
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    const handleSaveButton = () => {
        let filledDetails = {}
        filledDetails.stageName = recordForEdit.stageName;
        filledDetails.createdBy = createdBy;
        filledDetails.createdBy_Uuid = createdBy_Uuid;
        filledDetails.modifiedBy = modifiedBy;
        filledDetails.modifiedBy_Uuid = modifiedBy_Uuid;
        filledDetails.type = selectedType?.value

        if (recordForEdit?._id) {
            filledDetails._id = recordForEdit?._id;
        }
        if (!(/^[^\s].*/.test(filledDetails.stageName)) || !validStageName.test(filledDetails.stageName)) {
            toast.error("Enter a valid Stage Name !")
        }
        if (!selectedType) {
            toast.error('Select Type')
            return;
        }
        else {
            submitStage(filledDetails)
        }

    }

    const submitStage = (paramsObj) => {

        if (paramsObj?._id) {
            updateStage(paramsObj)
                .then(res => {
                    if (res?.result) {
                        toast.success(res?.message)
                        handleCloseEditPopup()
                        fetchStageList()

                        let url = `/authorised/cycle-stage-mapping`;
                        if (res?.result?._id) {
                            url = `${url}/${res?.result?._id}`
                        }

                        navigate(url, { state: { ...res?.result } });
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
        else {
            createStage(paramsObj)
                .then(res => {
                    if (res?.result?.status === 1) {
                        toast.success(res?.message)
                        handleCloseEditPopup()
                        fetchStageList()

                        let url = `/authorised/cycle-stage-mapping`;
                        if (res?.result?._id) {
                            url = `${url}/${res?.result?._id}`
                        }

                        navigate(url, { state: { ...res?.result } });
                    }
                    else if (res?.data?.statusCode === 0) {
                        let { errorMessage } = res?.data?.error
                        toast.error(errorMessage)
                    }
                    else {
                        console.error(res);
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        }

    }
    const handleStatusToggle = (e, stageDetails) => {
        let { status, _id } = stageDetails
        let newStatus = status === 0 ? 1 : 0

        changeStatus({ _id, status: newStatus, modifiedBy: modifiedBy })
            .then(res => {
                if (res?.result) {
                    fetchStageList()
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

    const fetchStageList = () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
        setLoading(true)
        setLastPage(false)
        getStageList(params)
            .then((res) => {
                let data = res?.result
                setStageList(data);
                if (data?.length < itemsPerPage) setLastPage(true)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }

    const openInPopup = stageEdit => {
        setRecordForEdit(stageEdit)
        setSelectedType({ label: stageEdit?.type, value: stageEdit?.type })
        setOpenPopup(true)
    }

    const deleteStageObject = params => {
        setDeleteObj({ _id: params?._id, stageName: params?.stageName })
        setDeletePopup(true)
    }

    const submitDeleteStage = () => {
        let { _id } = deleteObj
        deleteStage({ _id })
            .then(res => {
                if (res?.result) {
                    handleCancelDelete()
                    fetchStageList()
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

    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
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

    const handleAddStage = () => {
        setOpenPopup(true);
    }
    const navigateToManageCycle = () => {
        navigate('/authorised/cycle-management')

    }

    useEffect(() => fetchStageList(), [search, sortObj, pageNo, itemsPerPage]);


    return (
        <>
            <Page title="Extramarks | Stage Management" className="main-container datasets_container">
                {/* <Stack spacing={2}>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
                    Manage Cycle
                    </Link>,
                    <Typography key="2" color="text.primary">{'Stage List'}
                    </Typography>
                    </Breadcrumbs>
                </Stack><br/> */}
                <Container className='table_max_width'>
                    <Box>
                        <Breadcrumbs className='create-stage-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                            <Link underline="hover" key="1" color="inherit" onClick={navigateToManageCycle} >
                                Manage Cycle
                            </Link>

                            <Typography key="2" color="text.primary">
                                Stage List
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Stage Name , Created By"
                                onChange={handleSearch}
                                InputLabelProps={{ style: { ...({ top: `${-7}px` }) } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"> <img src={SearchIcon} alt="" /></InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} >
                            <Grid container justifyContent="flex-end" spacing={2.5}>
                                <Grid item xs={6} sm={6} md={6} lg={4} display="flex" justifyContent="flex-end" >
                                    <Controls.Button
                                        text="New Stage"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleAddStage()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {loader && <Loader />}
                    {stageList && stageList.length > 0 ? <StageTable list={stageList} openInPopup={openInPopup} deleteStageObject={deleteStageObject} toggleStatusModal={toggleStatusModal} pageNo={pageNo} itemsPerPage={itemsPerPage} handleSubmit={handleSubmit} sortObj={sortObj} handleSort={handleSort} /> :
                        <Alert severity="error">No Content Available!</Alert>}
                </Container>

                <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
            </Page>

            <AddStageModal
                recordForEdit={recordForEdit}
                openPopup={openPopup}
                handleOnChange={handleOnChange}
                handleCloseEditPopup={handleCloseEditPopup}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                typeOptions={typeOptions}
                handleSaveButton={handleSaveButton}
            />



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
                                {`Are you sure to delete "${deleteObj?.stageName}" ?`}
                            </Typography>
                        </Box>
                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={submitDeleteStage} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
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
