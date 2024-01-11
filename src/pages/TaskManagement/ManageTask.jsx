import React from 'react'
import { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Pagination, Grid, InputAdornment, Modal, Fade, Box, Typography, Card } from "@mui/material";
import Page from '../../components/Page';
import SearchIcon from '../../assets/icons/icon_search.svg';
import AddIcon from '@mui/icons-material/Add';
import Controls from '../../components/controls/Controls';
import { useNavigate } from 'react-router-dom';
import TaskTable from './TaskTable';
import { getTaskList, changeStatus } from '../../config/services/task';
import toast from 'react-hot-toast';
import Loader from ".././Loader";



const ManageTask = () => {

  const [taskList, setTaskList] = useState([]);
  const [pageNo, setPagination] = useState(1)
  const [search, setSearchValue] = useState('')
  const [loader, setLoading] = useState(false)
  const [itemsPerPage] = useState(10)
  const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
  const [taskListTotalCount, setTaskListTotalCount] = useState(0)
  const navigate = useNavigate();


  const fetchTaskList = async () => {
    let params = {
      pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj
    }

    getTaskList(params)
      .then((res) => {
        setTaskListTotalCount(res?.count)
        setTaskList(res?.taskList)

      })
      .catch((err) => {
        console.log(err, '...error')
      })
  }

  const handleStatusToggle = (e, matrixDetails) => {
    let { status, _id } = matrixDetails
    let newStatus = status === 0 ? 1 : 0

    changeStatus({ _id, status: newStatus })
      .then(res => {
        if (res?.result) {
          fetchTaskList()
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


  let totalPages = Number((taskListTotalCount / itemsPerPage).toFixed(0))
  if ((totalPages * itemsPerPage) < taskListTotalCount)
    totalPages = totalPages + 1;


  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber)
  }


  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
    // console.log(search);

  }

  const handleSort = (key) => {
    let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
    setSortObj({ sortKey: key, sortOrder: newOrder })
  }


  useEffect(() =>
    fetchTaskList(), [search, sortObj, pageNo, itemsPerPage]);




  return (
    <>
      <Page title="Extramarks | Task Management" className="main-container datasets_container">
        <Container className='table_max_width'>
          <Grid container alignItems="left" justifyContent="space-between" mb={2} spacing={2.5} >
            <Grid item xs={12} sm={4} md={4} lg={4} className="datasets_header" >
              <TextField className={`inputRounded search-input`} type="search"
                placeholder="Search By Task Name"
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
                    text="Add Task"
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="cm_ui_button"
                    onClick={() => handleNavigation('/authorised/add-task')}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Container>
        <div className='tableCardContainer'>
         {loader && <Loader />}
         {taskList?.length ?  <TaskTable list={taskList} handleStatusToggle={handleStatusToggle} pageNo={pageNo} itemsPerPage={itemsPerPage} handleSort={handleSort} sortObj={sortObj} /> :
                      <Alert severity="error">No Content Available!</Alert>}
         

          <div className='center cm_pagination'>
            <Pagination count={totalPages} variant="outlined" color="primary" onChange={handlePagination} page={pageNo} />
          </div>
        </div>
      </Page>
    </>
  )
}

export default ManageTask
