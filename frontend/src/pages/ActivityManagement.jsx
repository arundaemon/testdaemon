import { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from '../components/controls/Controls';
import { getActivityList, updateActivity, deleteActivity, createActivity } from '../config/services/activities';
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import ActivitiesListing from '../components/activityManagement/ActivitiesListing';
import Pagination from './Pagination';


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

export default function ActivityManagement() {
    const [openPopup, setOpenPopup] = useState(false);
    const [activityList, setActivityList] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState({})
    const [search, setSearchValue] = useState('')
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [loader, setLoading] = useState(false)
    const [pageNo, setPagination] = useState(1)
    const [itemsPerPage] = useState(10)
    const [deleteObj, setDeleteObj] = useState({})
    const [deletePopup, setDeletePopup] = useState(false)
    const [lastPage, setLastPage] = useState(false)
    const navigate = useNavigate();


    const classes = useStyles();

    // function to get all the activities listed on the listing page
    const getActivitiesList = () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
        setLoading(true)
        setLastPage(false)
        // route to get all the activities listed on the list page
        getActivityList(params)
            .then((res) => {
                // console.log(res);
                let data = res?.activityList
                setActivityList(data);
                if (data?.length < itemsPerPage) setLastPage(true)
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


    const deleteActivityOne = (params) => {
        setDeleteObj({ activityId: params?._id, activityName: params?.activityName })
        setDeletePopup(true)

    }

    const submitDeleteActivity = () => {
        let { activityId } = deleteObj
        deleteActivity({ activityId })
            .then(res => {
                if (res?.result) {
                    handleCancelDelete()
                    getActivitiesList()
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

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }


    const handleNavigation = (route) => {
        navigate(route)
    }

    useEffect(() => getActivitiesList(), [search, sortObj, pageNo, itemsPerPage]);


    return (
        <>
            <Page title="Extramarks | Activity Management" className="main-container datasets_container">
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Activity ID , Name , User Type , Created By"
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
                                        text="New Activity"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleNavigation('/authorised/create-activity')}

                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                <div className='tableCardContainer'>
                    {loader && <Loader />}
                    {activityList?.length ? <ActivitiesListing list={activityList} openInPopup={openInPopup} deleteActivityOne={deleteActivityOne} pageNo={pageNo} itemsPerPage={itemsPerPage} handleSort={handleSort} sortObj={sortObj} /> :

                        <Alert severity="error">No Content Available!</Alert>}


                    <div className='center cm_pagination'>
                        <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                    </div>
                </div>
            </Page>


            <Modal
                // aria-labelledby="transition-modal-title"
                // aria-describedby="transition-modal-description"
                className={classes.modal}
                open={deletePopup}
                closeAfterTransition
            >
                <Fade in={deletePopup}>
                    <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                        <Box className="modal-header p-1" >
                            <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >
                                {`Are you sure to delete "${deleteObj?.activityName}" ?`}
                            </Typography>
                        </Box>
                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={submitDeleteActivity} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                        {/* <Box className="modal-content text-left">
                            <Box className="modal-footer text-right" >
                                <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                                <Button onClick={submitDeleteActivity} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                            </Box>
                        </Box> */}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

