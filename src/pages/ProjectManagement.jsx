import { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from '../components/controls/Controls';
import { getProjectList, deleteProject, createProject, updateProject } from '../config/services/project';
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import { ProjectTable, ProjectPopup } from '../components/projectManagement';
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
}));

export default function ProjectManagement() {
    const [openPopup, setOpenPopup] = useState(false);
    const [userTypeList, setUserTypeList] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState({})
    const [search, setSearchValue] = useState('')
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [loader, setLoading] = useState(false)
    const [pageNo, setPagination] = useState(1)
    const [itemsPerPage] = useState(10)
    const [deleteObj, setDeleteObj] = useState({})
    const [deletePopup, setDeletePopup] = useState(false)
    const [lastPage, setLastPage] = useState(false)

    const classes = useStyles();


    const validateAddProject = (filledDetails) => {
        let { projectName } = filledDetails

        if (!projectName) {
            toast.error('Fill Project Name')
            return false
        }
        else {
            return true
        }
    }

    const addOrEdit = () => {
        if (validateAddProject(recordForEdit)) {
            let paramsObj = { ...recordForEdit }

            if (paramsObj?._id) {
                paramsObj.projectId = paramsObj?._id

                updateProject(paramsObj)
                    .then(res => {
                        if (res?.result) {
                            handleCloseEditPopup()
                            fetchProjectsList()
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
            else {
                createProject(paramsObj)
                    .then(res => {
                        if (res?.result) {
                            handleCloseEditPopup()
                            fetchProjectsList()
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
        }
    }

    const handleOnChange = (e) => {
        let { value, name } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails[name] = value
        setRecordForEdit(filledDetails)
    }



    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    const fetchProjectsList = () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
        setLoading(true)
        setLastPage(false)
        getProjectList(params)
            .then((res) => {
                let data = res?.result
                setUserTypeList(data);
                if (data?.length < itemsPerPage) setLastPage(true)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }


    const openInPopup = userTypeEdit => {
        setRecordForEdit(userTypeEdit)
        setOpenPopup(true)
    }


    const deleteProjectF = params => {
        setDeleteObj({ projectId: params?._id, projectName: params?.projectName })
        setDeletePopup(true)
    }

    const submitDeleteProject = () => {
        let { projectId } = deleteObj
        deleteProject({ projectId })
            .then(res => {
                if (res?.result) {
                    handleCancelDelete()
                    fetchProjectsList()
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

    const handleAddProject = () => {
        setOpenPopup(true);
        setRecordForEdit({});
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchProjectsList(), [search, sortObj, pageNo, itemsPerPage]);

    return (
        <>
            <Page title="Extramarks | Project Management" className="main-container datasets_container">
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={4} md={4} lg={4} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Project Name"
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
                        <Grid item xs={12} sm={8} md={8} lg={8} >
                            <Grid container justifyContent="flex-end" spacing={2.5}>
                                <Grid item xs={6} sm={6} md={6} lg={3} display="flex" justifyContent="flex-end" >
                                    <Controls.Button
                                        text="New Project"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleAddProject()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {loader && <Loader />}
                    {userTypeList?.length ? <ProjectTable list={userTypeList} openInPopup={openInPopup} deleteUserType={deleteProjectF} pageNo={pageNo} itemsPerPage={itemsPerPage} handleSort={handleSort} sortObj={sortObj} /> :
                        <Alert severity="error">No Content Available!</Alert>}
                </Container>

                <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
            </Page>


            <ProjectPopup
                handleOnChange={handleOnChange} openPopup={openPopup}
                recordForEdit={recordForEdit} addOrEdit={addOrEdit}
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
                                {`Are you sure to delete "${deleteObj?.projectName}" ?`}
                            </Typography>
                        </Box>
                        {/* <Box className="modal-content text-left"> */}
                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={submitDeleteProject} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                        {/* </Box> */}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
