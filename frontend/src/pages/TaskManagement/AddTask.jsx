import React from 'react'
import { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid, Box, Typography, Card } from "@mui/material";
import Page from '../../components/Page';
import ReactSelect, { components, PlaceholderProps } from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
import { createTask, updateTask, getTask } from '../../config/services/task';
import toast from 'react-hot-toast';

const options = [
  { value: 'Home Demo', label: 'Home Demo' },
  { value: 'Virtual Demo', label: 'Virtual Demo' },
  { value: 'Follow Up', label: 'Follow Up' }
]


const AddTask = () => {

  const [taskName, setTaskName] = React.useState();
  const [selectedOption, setSelectedOption] = useState({ value: '', label: 'Select Category' });
  const [dataToAdd, setDataToAdd] = React.useState({});
  const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);

  const { id } = useParams();
  const navigate = useNavigate();




  const validFilterLogic = new RegExp('^[a-zA-Z ]*$');


  const validateTask = (filledDetails) => {
    let { taskName, category } = filledDetails;
  
    if (!taskName) {
      toast.error("Fill task name");
      return false;
    }
    else if (!validFilterLogic.test(taskName)) {
      toast.error("Task name must be alphabetical");
      return false;
    }
    else if (!category) {
      toast.error("Task category must be specified");
    }
    else {

      return true;
    }

  }



  const handleTaskName = (e) => {
    
    if(e.target.value.length >= 20)
    {
        toast.error('Task name should be in limited character')
    }

    setTaskName(e.target.value);
    // console.log(taskName);
  }

  const handleChange = (e) => {
    setSelectedOption(e);



  }


  const handleSubmit = () => {
    let filledDetails = _.cloneDeep(dataToAdd);
    let newName = taskName.trim();
    filledDetails.taskName = newName
    filledDetails.category = selectedOption.value
    filledDetails.createdBy = createdBy;
    filledDetails.modifiedBy = modifiedBy;
    filledDetails.createdBy_Uuid = createdBy_Uuid;
    filledDetails.modifiedBy_Uuid = modifiedBy_Uuid;
    if (id) {
      filledDetails.TkId = id
    }
    submitTask(filledDetails)
  }



  const submitTask = (data) => {


    if (validateTask(data)) {

      let paramObj = { ...data };

      if (paramObj?.TkId) {

        updateTask(paramObj)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message)

              navigate('/authorised/task-management');
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
        createTask(paramObj)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message)
              navigate('/authorised/task-management');
            }
            else if (res?.data.statusCode === 0) {
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


  const fetchTaskDetails = async (data) => {
    if (!id) {
      return;
    }
    getTask({ TkId: id })
      .then((res) => {
        if (res?.result) {
          setTaskName(res?.result?.taskName);
          setSelectedOption({ label: res?.result.category, value: res?.result.category })
        }
      })
      .catch((err) => {
        console.log(err, '...error');
      })
  };


  useEffect(() =>
    fetchTaskDetails(), []);

  return (
    <>

      <Page title="Extramarks | Task Management" className="main-container datasets_container addTaskPage">
        <div className='heading'>{id ? "Update the Task" : "Add Task"}</div>
        <div className='mainSection'>
          <div className='leftSection'>
            <div className='type'> Task Name </div>
            <input className='input'
              placeholder="Enter Task" value={taskName} type="text" id="outlined-basic" onChange={(e) => handleTaskName(e)} maxLength='20' />
          </div>

          <div className='rightSection'>
            <div className='type'> Category  </div>
            <ReactSelect className="dropDown" value={selectedOption} options={options} onChange={(e) => handleChange(e)} />
          </div>
        </div>
        <Box className='btn-container'>
          <Button className='saveBtn' variant='contained' onClick={handleSubmit}>Save</Button>
          {/* <Button className='cancleBtn' variant='outlined' onClick={() => navigate('/authorised/task-management')}>Cancel</Button> */}
        </Box>
      </Page>
    </>

  )
}

export default AddTask


