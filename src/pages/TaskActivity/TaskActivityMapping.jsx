import React from 'react'
import { useState, useEffect } from 'react';
import Page from '../../components/Page'
import { Container, Grid, TextField, InputAdornment, Pagination} from "@mui/material";
import TaskActivityTable from './TaskActivityTable';
import SearchIcon from '../../assets/icons/icon_search.svg';
import Controls from '../../components/controls/Controls';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getTaskActivityMappingList } from '../../config/services/taskActivity';
import {changeStatus} from '../../config/services/taskActivity';
import toast from 'react-hot-toast';

function TaskActivityMapping() {

    const navigate = useNavigate();
    const [pageNo, setPagination] = useState(1)
    const [search, setSearchValue] = useState('')
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [taskActivityList, setTaskActivityList] = useState([]);
    const [taskActivityListTotalCount, setTaskActivityListTotalCount] = useState(0)
    const [itemsPerPage] = useState(10)
  
    let totalPages = Number((taskActivityListTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < taskActivityListTotalCount)
        totalPages = totalPages + 1;

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }


    const handleNavigation = (route) => {
        navigate(route)
    }

    const fetchTaskActivityList = async () => {
        let params = {
            pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj}

        getTaskActivityMappingList(params)
            .then((res) => {
                setTaskActivityListTotalCount(res?.totalCount)
                setTaskActivityList(res?.result)
                
            })
            .catch((err) => {
                console.log(err, '...error')
            })
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }
 
    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))

    }

    const handleStatusToggle = (e, taskActivityDetails) => {
        let { status, _id } = taskActivityDetails
        let newStatus = status === 0 ? 1 : 0

        changeStatus({ _id, status: newStatus })
            .then(res => {
                if (res?.result) {
                    fetchTaskActivityList()
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


    useEffect(() => 
    fetchTaskActivityList(),[search, sortObj, pageNo, itemsPerPage]);

    return (
        <>
            <Page title="Extramarks | Task Activity" className="main-container datasets_container">
                <Container className="table_max_width">
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By"
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
                                        text="Add Task-Activity"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        className="cm_ui_button"
                                        onClick={() => handleNavigation('/authorised/add-taskActivity')}

                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <TaskActivityTable list={taskActivityList} handleSort={handleSort} handleStatusToggle={handleStatusToggle} pageNo={pageNo} itemsPerPage={itemsPerPage} sortObj={sortObj} />
                </Container>
                <div className='center cm_pagination'>
                    <Pagination count={totalPages} variant="outlined" color="primary" onChange={handlePagination} page={pageNo} />
                </div>
            </Page>
        </>
    )
}

export default TaskActivityMapping
