import { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from '../components/controls/Controls';
import { getJourneyList, updateJourney, deleteJourney, getAllJourneys, changeStatus } from '../config/services/journeys';
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import { JourneyList, JourneyUpdate } from '../components/journey';
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

export default function JourneyManagement() {
    const [openPopup, setOpenPopup] = useState(false);
    const [journeyList, setJourneyList] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState({})
    const [search, setSearchValue] = useState('')
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [loader, setLoading] = useState(false)
    const [pageNo, setPagination] = useState(1)
    const [itemsPerPage] = useState(10)
    const [deleteObj, setDeleteObj] = useState({})
    const [deletePopup, setDeletePopup] = useState(false)
    const navigate = useNavigate();
    const [journeyModel, setJourneyModel] = useState(false)
    const [journeyDetails, setJourneyDetails] = useState({})
    const [deactivateStatus, setDeactivateStatus] = useState()
    const [lastPage, setLastPage] = useState(false)

    const classes = useStyles();

    const handleOnChange = (e) => {
        let { value, name } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails[name] = value
        setRecordForEdit(filledDetails)
    }


    const handleSelectParentMenu = (newSelectValue) => {
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.parentMenu = newSelectValue
        setRecordForEdit(filledDetails)
    }

    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    // function to get all the journeys listed on the listing page
    const getJourneysList = () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, ...sortObj, search }
        setLoading(true)
        setLastPage(false)

        // route to get all the journeys listed on the list page
        getJourneyList(params)
            .then((res) => {
                let data = res?.result
                setJourneyList(data);
                if (data.length < itemsPerPage) setLastPage(true)
                setLoading(false)

            })
            .catch(err => console.error(err))
    }



    const openInPopup = userTypeEdit => {

        if (userTypeEdit && userTypeEdit?.parentMenu) {
            let { parentMenu } = userTypeEdit
            userTypeEdit.parentMenu.label = parentMenu?.name
            userTypeEdit.parentMenu.value = parentMenu?._id
        }

        setRecordForEdit(userTypeEdit)
        setOpenPopup(true)
    }


    const deleteJourneyOne = (params) => {
        setDeleteObj({ journeyId: params?._id, journeyName: params?.journeyName })
        setDeletePopup(true)
    }

    const submitDeleteJourney = () => {
        let { journeyId } = deleteObj
        deleteJourney({ journeyId })
            .then(res => {
                if (res?.result) {
                    handleCancelDelete()
                    getJourneysList()
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



    const handleJourneyStatus = (e, journeyDetails) => {
        let { status, _id } = journeyDetails
        let newStatus = status === 0 ? 1 : 0

        changeStatus({ _id, status: newStatus })
            .then(res => {
                if (res?.result) {
                    getJourneysList()
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

    const handleNavigation = (route) => {
        navigate(route)
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    const toggleJourneyModal = () => {
        setJourneyModel(!journeyModel)
    }

    const handleSubmit = (e, journeyDetails) => {
        setJourneyDetails(journeyDetails)
        setDeactivateStatus(journeyDetails.status)
        if (journeyModel) {
            handleJourneyStatus(e, journeyDetails)
            toggleJourneyModal()

        }
    }

    useEffect(() => getJourneysList(), [search, sortObj, pageNo, itemsPerPage]);

    return (
        <>
            <Page title="Extramarks | Journey Management" className="main-container datasets_container">
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Journey Name"
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
                                        text="New Journey"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleNavigation('/authorised/create-journey')}

                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {loader && <Loader />}
                    {journeyList?.length ? <JourneyList list={journeyList} openInPopup={openInPopup} deleteJourneyOne={deleteJourneyOne} pageNo={pageNo} itemsPerPage={itemsPerPage} handleJourneyStatus={handleJourneyStatus} handleSort={handleSort} sortObj={sortObj} handleSubmit={handleSubmit} toggleJourneyModal={toggleJourneyModal} /> :
                        <Alert severity="error">No Content Available!</Alert>}

                </Container>

                <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage}/>
                </div>

            </Page>
            {/* <CreateJourney getJourneysList={getJourneysList}/> */}

            {/* <JourneyUpdate handleSelectParentMenu={handleSelectParentMenu}
                handleOnChange={handleOnChange} openPopup={openPopup}
                recordForEdit={recordForEdit} addOrEdit={addOrEdit}
                handleCloseEditPopup={handleCloseEditPopup}  
                /> */}


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
                                {`Are you sure to delete "${deleteObj?.journeyName}" ?`}
                            </Typography>
                        </Box>
                        {/* <Box className="modal-content text-left"> */}
                        <Box style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer text-right">
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={submitDeleteJourney} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                        {/* </Box> */}
                    </Box>
                </Fade>
            </Modal>
            {journeyModel &&

                <Modal
                    hideBackdrop={true}
                    open={toggleJourneyModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="targetModal1"
                >

                    <Box sx={style} className="modalContainer" style={{ height: '150px', width: '500px' }}>
                        <Typography align='center'>
                            {deactivateStatus == 1 &&
                                <p style={{ fontSize: '16px' }}>After Deactivating all the mappings will be removed </p>}
                            <p style={{ fontSize: '16px' }}>Are you sure you want to change the status?</p>
                        </Typography>
                        <button className='modalbtn' style={{ float: 'right', marginTop: '18px' }} onClick={e => handleSubmit(e, journeyDetails)}>Yes</button>

                        <button className='modalbtn' style={{ float: 'right', marginTop: '18px', marginRight: '12px', bgcolor: 'white' }} onClick={toggleJourneyModal}>No</button>
                    </Box>

                </Modal>

            }

        </>
    )
}

