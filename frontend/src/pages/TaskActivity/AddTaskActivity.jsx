import React from 'react'
import { useState, useEffect } from 'react'
import Page from "../../components/Page";
import { Container, Card, Grid, Box, Button } from "@mui/material";
import ReactSelect from 'react-select';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import _ from 'lodash';
import toast from 'react-hot-toast'
import { getAllTasks } from '../../config/services/task'
import { getAllActivities } from '../../config/services/activities'
import { createTaskActivityMapping } from '../../config/services/taskActivity';
import { useNavigate } from 'react-router-dom';




const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function AddTaskActivity() {

  const [taskList, setTaskList] = React.useState([]);
  const [task, setTask] = React.useState({ value: '', label: 'Select Task' });
  const [activityList, setActivityList] = React.useState([]);
  const [activity, setActivity] = React.useState({ value: '', label: 'Select Activity' });
  const [dataToAdd, setDataToAdd] = React.useState({});
  const [isChecked, setIsChecked] = React.useState(false);
  const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);

  const navigate = useNavigate();

  const validateUpdate = (filledDetails) => {
    let { taskId, activityId } = filledDetails;

    if (!activityId) {
      toast.error("Activity Target is required");
      return false;
    }
    else if (!taskId) {
      toast.error("Task is required");
      return false;
    }
    else {

      return true;
    }

  }

  const fetchTaskList = () => {
    let params = { action: "task" }
    getAllTasks(params)
      .then(res => {
        if (res?.result) {
          const modifiedResult = res.result.map((result) => {
            result.label = result.taskName
            result.value = result.taskName
            return result
          })
          setTaskList(modifiedResult);

        }
        else {
          console.error(res)
        }
      })
  }


  const fetchActivityList = () => {
    let params = { action: "activity" }
    getAllActivities(params)
      .then(res => {
        if (res?.result) {
          const modifiedResult = res.result.map((result) => {
            result.label = result.activityName
            result.value = result.activityName
            return result
          })
          setActivityList(modifiedResult);

        }
        else {
          console.error(res)
        }
      })
  }

  const submitTaskActivity = (data) => {
    if (validateUpdate(data)) {
      createTaskActivityMapping(data)
        .then((res) => {
          if (res?.data) {
            toast.success(res?.message)
            navigate('/authorised/taskActivity-mapping');
          }
          else if (res?.data?.statusCode === 0) {
            let { errorMessage } = res?.data?.error
            toast.error(errorMessage)
          }
          else {
            console.error(res);
          }
        })
        .catch((error) => console.log(error, '...errror'))
    }
  }





  const handleSubmit = () => {
    let filledDetails = _.cloneDeep(dataToAdd);
    filledDetails.taskId = task._id;
    filledDetails.activityId = activity._id;
    filledDetails.callingEnabled = isChecked;
    filledDetails.createdBy = createdBy
    filledDetails.createdBy_Uuid = createdBy_Uuid
    filledDetails.modifiedBy = modifiedBy
    filledDetails.modifiedBy_Uuid = modifiedBy_Uuid
    submitTaskActivity(filledDetails)
  }


  useEffect(() => fetchTaskList(), []);
  useEffect(() => fetchActivityList(), []);

  return (
    <>
      <Page title="Extramarks | AddTaskActivity" >
        <div className="datasets_container1">
          <div className='main-container' >
            <h3 className='heading'>Add Task-Activity Mapping</h3>
            <div className='container'>
              <div className='inner-cont'>
                <div className='section'>
                  <h4 className='innerHead'>Activity :</h4>
                  <div className='serchbox_container'>
                    <ReactSelect
                      options={activityList}
                      value={activity}
                      onChange={(e) => setActivity(e)}
                      placeholder={"Select"}
                    />
                  </div>
                </div>
                <div className='verticalLine'>
                  {/* <img src='https://cdn-icons-png.flaticon.com/512/545/545682.png' ></img> */}
                </div>
                <div className='section'>
                  <h4 className='innerHead'>Task :</h4>
                  <div className='serchbox_container'>
                    <ReactSelect
                      type="search"
                      options={taskList}
                      value={task}
                      onChange={(e) => setTask(e)}
                    />
                  </div>
                </div>
              </div>
              <div>
                {/* <h4>Calling Enabled :</h4> */}
                {/* <Checkbox {...label} /> */}
                {/* <FormControlLabel className='checkbox-input' control={<Checkbox checked={isChecked} />} label="Calling Enabled" onChange={(e) => setIsChecked(e.target.checked)} /> */}
              </div>
              <div className='employ-btn-container'>
                <Button className='btn' onClick={handleSubmit}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

export default AddTaskActivity
