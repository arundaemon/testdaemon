import Page from '../components/Page';
import { Container, TextField, Button, Alert, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
import Controls from '../components/controls/Controls';
import Loader from "./Loader";
import BasicTable from './BasicTable';
import { getAttendanceList, changeStatus } from '../config/services/attendance';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../assets/icons/icon_search.svg';
import toast from 'react-hot-toast';
import Pagination from './Pagination'


function ManageMatrix() {
    const [attendanceList, setAttendanceList] = useState([]);
    const navigate = useNavigate();
    const [pageNo, setPagination] = useState(1)
    const [search, setSearchValue] = useState('')
    const [sortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [itemsPerPage] = useState(10)
    const [loader, setLoading] = useState(false)
    const [lastPage, setLastPage] = useState(false)


    const handleStatusToggle = (e, matrixDetails) => {
        let { status, _id } = matrixDetails
        let newStatus = status === 0 ? 1 : 0

        changeStatus({ _id, status: newStatus })
            .then(res => {
                if (res?.result) {
                    fetchAttendanceList()
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

    const fetchAttendanceList = async () => {
        let params = {
            pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj
        }
        setLastPage(false)
        getAttendanceList(params)
            .then((res) => {
                let data = res?.result
                setAttendanceList(data)
                if (data?.length < itemsPerPage) setLastPage(true)
            })
            .catch((err) => {
                console.log(err, '...error')
            })
    }

    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))
    }

    useEffect(() =>
        fetchAttendanceList(), [search, sortObj, pageNo, itemsPerPage,]);


    return (
        <>
            <Page title="Extramarks | Attendance Matrix" className="main-container datasets_container">
                <Container className="table_max_width">
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Profile / Role"
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
                                        text="Add Matrix"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleNavigation('/authorised/add-matrix')}

                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Container>
                <div className='tableCardContainer'>

                    {loader && <Loader />}
                    {attendanceList?.length ?
                        <BasicTable list={attendanceList} handleStatusToggle={handleStatusToggle} pageNo={pageNo} itemsPerPage={itemsPerPage} /> :
                        <Alert severity="error">No Content Available!</Alert>}

                    <div className='center cm_pagination'>
                        <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                    </div>
                </div>
            </Page>
        </>
    )
}

export default ManageMatrix;



