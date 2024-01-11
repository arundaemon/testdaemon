import { Button, Box, TextField, InputAdornment, Pagination ,Modal, Fade, Typography} from '@mui/material'
import React, { useEffect, useState, useRef } from 'react'
import Page from "../components/Page";
import { makeStyles } from '@mui/styles'
import SearchIcon from '../assets/icons/icon_search.svg';
import CreateSubject from '../components/activityForm/CreateSubject'
import { getSubjectList, getAllSubjects, deleteSubject} from '../config/services/subject'
import SubjectTable from '../components/activityForm/SubjectTable';
import toast from 'react-hot-toast';

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


const SubjectManagement = () => {
    const [createSubject, setCreateSubject] = useState(false)
    const [subjectList, setSubjectList] = useState([])
    // const [openPopup, setOpenPopup] = useState(false);
    const [pageNo, setPagination] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [search, setSearchValue] = useState('')
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [cycleTotalCount, setCycleTotalCount] = useState(0)
    const [deleteObj, setDeleteObj] = useState({})
    const [updateObj,setUpdateObj]=useState({})
    const [deletePopup, setDeletePopup] = useState(false)
    const divRef = useRef();
    const classes = useStyles();


    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))
    }
    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }

    let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < cycleTotalCount)
        totalPages = totalPages + 1;


    const fetchSubjectList = async (scrollFlag = false) => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, ...sortObj, search }
        getAllSubjects(params)
            .then((res) => {
                // console.log(res, '...res')
                setCycleTotalCount(res?.count)
                setSubjectList(res?.subjectList);
                if (scrollFlag) {
                    // console.log('scrll con');
                    divRef.current.scrollIntoView();
                }
            })
            .catch((err) => {
                console.log(err, '..error')
            })
    }

    const showCreateSubject = () => {
        setCreateSubject(!createSubject)
        setUpdateObj({})
    }

    const deleteJourneyOne = (params) => {
        // console.log(params,'...params')
        setDeleteObj({ subjectId: params?._id, subjectName: params?.subjectName})
        setDeletePopup(true)

    }

    const updateJourneyOne = (params) => {
        setCreateSubject(!createSubject)
        setUpdateObj({ subjectId: params?._id , subjectName: params?.subjectName})
       
    }


    const handleCancelDelete = () => {
        setDeletePopup(false)
        setDeleteObj({})
    }

    const submitDeleteJourney = () => {
        let { subjectId } = deleteObj
        deleteSubject({ subjectId })
            .then(res => {
                // console.log(res,'.........this is response')
                if (res?.result) {
                    handleCancelDelete()
                    fetchSubjectList()
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



    useEffect(() => {
        fetchSubjectList()
    }, [search, sortObj, pageNo, itemsPerPage])
 
    return (
        <>
            <Page title="Extramarks | Subject Management" className="main-container compaignManagenentPage datasets_container">
                <div>

                    <div>
                        {createSubject &&
                            <div className='createCampaign' >
                                <CreateSubject fetchSubjectList={fetchSubjectList} showCreateSubject={showCreateSubject} updateObj={updateObj} />
                            </div>
                        }

                        {!createSubject &&
                            <Box className='employ-btn-group' mt={2}>
                                <Button variant='contained' onClick={showCreateSubject}>Create New</Button>
                            </Box>
                        }
                    </div>


                    <div className='tableCardContainer' >
                        <div ref={divRef}>
                            <div className='contaienr'>
                                <h4 className='heading' >Manage Subject</h4>
                                {/* <p className='subheading'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
                            </div>

                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Subject Name"
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

                            <SubjectTable list={subjectList} pageNo={pageNo} itemsPerPage={itemsPerPage} search={search} deleteJourneyOne={deleteJourneyOne} updateJourneyOne={updateJourneyOne}/>

                            <div className='center cm_pagination'>
                                <Pagination count={totalPages} variant="outlined" color="primary" onChange={handlePagination} page={pageNo} />
                            </div>
                        </div>

                    </div>
                </div>
            </Page>
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
                                {`Are you sure to delete "${deleteObj?.subjectName}" ?`}
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
        </>

    )
}

export default SubjectManagement
