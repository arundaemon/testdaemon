import { useState, useEffect } from 'react';
import { Container, TextField, Breadcrumbs, Link, Stack, Button, Alert, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from '../components/controls/Controls';
import { getCyclesList, deleteCycle, changeStatus, createCycle, updateCycle } from '../config/services/cycles';
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import { CycleTable, CycleAddEditPage } from '../components/cycleManagement';
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
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
        minWidth: '200px',
        borderRadius: '4px',
        textAlign: 'center',
        padding: "20px"
    },
    modalTitle: {
        fontSize: '18px',
        textAlign: "left"

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



export default function CycleManagement(props) {
    const [openPopup, setOpenPopup] = useState(useLocation()?.state?.modalOpen);
    const [recordForEdit, setRecordForEdit] = useState({});
    const [pageNo, setPagination] = useState(1);
    const [search, setSearchValue] = useState('');
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [loader, setLoading] = useState(false);
    const [itemsPerPage] = useState(10);
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' });
    const [cycleList, setCycleList] = useState([]);
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [cycleModel, setCycleModel] = useState(false)
    const [cycleDetails, setCycleDetails] = useState({})
    const [deactivateStatus, setDeactivateStatus] = useState()
    const [lastPage, setLastPage] = useState(false)
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(null);


    const classes = useStyles();
    const { state } = useLocation();
    const para = useParams()

    const handleStatusToggle = (e, cycleDetails) => {
        let { status, _id } = cycleDetails
        let newStatus = status === 0 ? 1 : 0

        changeStatus({ _id, status: newStatus })
            .then(res => {
                if (res?.result) {
                    fetchCyclesList()
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

    const typeOptions = [
        { value: 'interest', label: 'Interest' },
        { value: 'user', label: 'User' },
        { value: 'implementation', label: 'Implementation' },
    ];

    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    const handleOnChange = (e) => {
        let { value, name } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails[name] = value
        filledDetails['type'] = selectedType
        setRecordForEdit(filledDetails)
        if (e.target.value.length >= 20) {
            toast.error('Cycle name  should be in limited character ')
        }
    }

    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    const fetchCyclesList = () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
        setLoading(true)
        setLastPage(false)
        getCyclesList(params)
            .then((res) => {
                let data = res?.result
                // console.log(res, 'res from be');
                setCycleList(data);
                setLoading(false)
                if (data.length < itemsPerPage) setLastPage(true)
            })
            .catch(err => console.error(err))
    }

    const openInPopup = cycleEdit => {
        setRecordForEdit(cycleEdit)
        setSelectedType({ label: cycleEdit?.type, value: cycleEdit?.type })
        setOpenPopup(true)
    }

    const deleteCycleObject = params => {
        setDeleteObj({ _id: params?._id, cycleName: params?.cycleName })
        setDeletePopup(true)
    }

    const submitDeleteCycle = () => {
        let { _id } = deleteObj
        deleteCycle({ _id })
            .then(res => {
                if (res?.result) {
                    handleCancelDelete()
                    fetchCyclesList()
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


    const saveCycle = async () => {
        if (!recordForEdit.cycleName) {
            toast.error('Fill Cycle Name')
            return;
        }
        if (!selectedType) {
            toast.error('Select Type')
            return;
        }

        let paramsObj = {}
        paramsObj.cycleName = recordForEdit.cycleName;
        paramsObj.modifiedBy = modifiedBy;
        paramsObj.modifiedBy_Uuid = modifiedBy_Uuid;
        paramsObj.type = selectedType?.value

        if (recordForEdit?._id) {
            paramsObj._id = recordForEdit?._id;
            return updateCycle(paramsObj)
                .then(res => {
                    if (res?.result) {
                        let url = `/authorised/journey-mapping/${recordForEdit.cycleName}`;
                        if (res?.result?._id) {
                            url = `${url}/${res?.result?._id}`
                        }

                        toast.success(res?.message)
                        setOpenPopup(false);
                        setRecordForEdit({})
                        navigate(url, { state: { ...res?.result } })
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
                    console.log(err);
                })
        }

        paramsObj.createdBy = createdBy;
        paramsObj.createdBy_Uuid = createdBy_Uuid;
        return createCycle(paramsObj)
            .then(res => {
                if (res?.result) {
                    let url = `/authorised/journey-mapping/${recordForEdit.cycleName}`;
                    if (res?.result?._id) {
                        url = `${url}/${res?.result?._id}`
                    }

                    toast.success(res?.message)
                    setOpenPopup(false);
                    setRecordForEdit({})
                    navigate(url);
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
                console.log(err);
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

    const handleAddCycle = () => {
        setOpenPopup(true);
    }

    const toggleCycleModal = () => {
        setCycleModel(!cycleModel)
    }

    const handleSubmit = (e, cycleDetails) => {
        setCycleDetails(cycleDetails)
        setDeactivateStatus(cycleDetails.status)
        if (cycleModel) {
            handleStatusToggle(e, cycleDetails)
            toggleCycleModal()

        }
    }

    useEffect(() => fetchCyclesList(), [search, sortObj, pageNo, itemsPerPage]);

    return (
        <>
            <Page title="Extramarks | Cycle Management" className="main-container datasets_container">
                <Stack style={{ marginLeft: "20px", marginBottom: 20 }}>
                    <Breadcrumbs className='create-cycle-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                        <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
                            Manage Cycle
                        </Link>,
                        <Typography key="2" color="text.primary">{'Cycle List'}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Cycle Name , Created By"
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
                                        text="New Cycle"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleAddCycle()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {loader && <Loader />}
                    {cycleList && cycleList.length > 0 ? <CycleTable list={cycleList} openInPopup={openInPopup} deleteCycleObject={deleteCycleObject} pageNo={pageNo} itemsPerPage={itemsPerPage} handleStatusToggle={handleStatusToggle} handleSort={handleSort} sortObj={sortObj} handleSubmit={handleSubmit} toggleCycleModal={toggleCycleModal} /> :
                        <Alert severity="error">No Content Available!</Alert>}
                </Container>

                <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
            </Page>


            <CycleAddEditPage list={cycleList}
                handleOnChange={handleOnChange} openPopup={openPopup}
                recordForEdit={recordForEdit} handleCloseEditPopup={handleCloseEditPopup} typeOptions={typeOptions} selectedType={selectedType} setSelectedType={setSelectedType}
                saveCycle={saveCycle}
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
                        <div >
                            <Typography variant="subtitle1" className={classes.modalTitle} >
                                {`Are you sure to delete "${deleteObj?.cycleName}" ?`}
                            </Typography>
                        </div>
                        {/* <Box className="modal-content text-left"> */}
                        <Box style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer text-right" >
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={submitDeleteCycle} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                        {/* </Box> */}
                    </Box>
                </Fade>
            </Modal>

            {cycleModel &&

                <Modal
                    hideBackdrop={true}
                    open={toggleCycleModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="targetModal1"
                >

                    <Box sx={style} className="modalContainer" style={{ height: '150px', width: '500px' }}>
                        <Typography align='center'>
                            {deactivateStatus == 1 &&
                                <p style={{ fontSize: '16px' }}>After Deactivating all the mappings will be removed</p>}
                            <p style={{ fontSize: '16px' }}>Are you sure you want to change the status?</p>
                        </Typography>

                        <button className='modalbtn' style={{ float: 'right', marginTop: '18px' }} onClick={e => handleSubmit(e, cycleDetails)}>Yes</button>

                        <button className='modalbtn' style={{ float: 'right', marginTop: '18px', marginRight: '12px', bgcolor: 'white' }} onClick={toggleCycleModal}>No</button>
                    </Box>
                </Modal>
            }
        </>
    )
}












