import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { createActivity, getActivity, updateActivity } from '../config/services/activities';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCategoryList } from '../config/services/categories';
import ReactSelect from 'react-select';

// import { validate } from '../../../api/server/models/journeyModel';




const CreateEmployee = () => {

  const userData = useLocation();
  const { id } = useParams();
  const [attendance, setAttendance] = useState(false);
  const [task, setTask] = useState(false);
  const [approval, setApproval] = useState(false);
  const [activityName, setActivityName] = useState();
  const [score, setScore] = useState();
  const [maxScore, setMaxScore] = useState();
  const [ID, setID] = useState();
  const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const CHARACTER_LIMIT = 10;
  const navigate = useNavigate();
  const [calling, setCalling] = useState(false);

  const data = _.cloneDeep(userData.state);

  const data1 = {
    attendance: attendance,
    task: task,
    approval: approval,
    calling: calling,
    activityName: activityName,
    score: score,
    maxScore:maxScore,
    ID: ID,
    createdBy: createdBy,
    createdBy_Uuid: createdBy_Uuid,
    modifiedBy: modifiedBy,
    modifiedBy_Uuid: modifiedBy_Uuid,

  }

  const postData = { ...data, ...data1 }

  // console.log("postData", postData)
  const validFilterLogic = new RegExp('^[a-zA-Z ]*$');
  const validateScore = new RegExp('^[0-9]*$');

  const validateActivity = (filledDetails) => {
    let { ID, calling, attendance, task, approval, activityName, score, createdBy_Uuid, modifiedBy_Uuid, createdBy, modifiedBy, maxScore } = filledDetails;

    if (!activityName) {
      toast.error("Fill activty name");
      return false;
    }
    else if (!ID) {
      toast.error("Fill Activity ID")
      return false;
    }
    else if (!validFilterLogic.test(activityName)) {
      toast.error("Activity name must be alphabetical");
      return false;
    }
    else if (!score) {
      toast.error("Score is required");
      return false;
    }
    else if (!validateScore.test(score)) {
      toast.error("Score must be a number");
      return false;
    }
    else if (!validateScore.test(maxScore)) {
      toast.error("Max Score must be a number");
      return false;
    }
    else if (parseInt(maxScore)<parseInt(score)) {
      
      toast.error("Max Score must be greater than score");
      return false;
    }
    else {

      return true;
    }

  }





  const handleSubmit = () => {
    //   e.preventDefault();
    let paramObj = postData;

    if (id) {
      paramObj.activityId = id;
    }
    submitActivity(paramObj);
  }

  const submitActivity = (data) => {
    if (validateActivity(data)) {
      let paramObj = { ...data };

      if (paramObj?.activityId) {
        updateActivity(paramObj)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message)
              navigate('/authorised/activity-management');
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
        createActivity(paramObj)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message)
              navigate('/authorised/activity-management');
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

  const fetchActivityDetails = () => {
    if (!id) {
      return;
    }

    getActivity({ activityId: id })
      .then((res) => {
        // setActivityName(res.)
        // console.log(res?.result);

        setActivityName(res?.result?.activityName);
        setScore(res?.result?.score)
        setMaxScore(res?.result?.maxScore)
        setApproval(res?.result?.approval)
        setAttendance(res?.result?.attendance)
        setTask(res?.result?.task)
        setCalling(res?.result?.calling)
        setID(res?.result?.ID)
      })
      .catch((err) => {
        console.log(err);
      });

  }

  // const fetchCategoryDetails = () => {

  //   getCategoryList()
  //     .then(res =>{
  //     // console.log(res,"category list")
  //      if(res?.categoryList){

  //       const modifiedCategoryList = res?.categoryList?.map(( result) =>{

  //         result.label = result.categoryName;
  //         result.value = result.categoryName;
  //         return result;
  //       })
  //        setCategoryList(modifiedCategoryList)

  //      }

  //     })
  //     .catch((err) => 
  //     console.log(err) )  

  // }
  // console.log(category.value,"categoryOptions....")

  useEffect(() => {
    fetchActivityDetails()
  }, [])
  // useEffect(() => {fetchCategoryDetails()},[])

  return (
    <>
      <Box className='create-employ'>
        <Box>
          <Typography variant='h4'>
            {id ? 'Update Customer Activity Details' : 'Customer Activity Details'}</Typography>
          <Typography variant='body'>Enter Basic Details</Typography>

          <Box className='inpt-group'>

            <Box>
              <Typography variant='h6' >Activity Code</Typography>
              <TextField className='activity-name' placeholder='Activity Code'
                onChange={(e) => setID(e.target.value)}
                value={ID}
                disabled={id ? true : false}
              ></TextField>
            </Box>

            <Box >
              <Typography variant='h6'>Activity Name</Typography>
              {id ?
                <TextField className='activity-name' placeholder='Activity Name'
                  onChange={(e) => setActivityName(e.target.value)}
                  value={activityName}
                  disabled
                ></TextField>
                :
                <TextField className='activity-name' placeholder='Activity Name'
                  onChange={(e) => setActivityName(e.target.value)}
                  value={activityName}> </TextField>
              }
            </Box>



            <Box>
              <Typography variant='h6'>Score</Typography>

              <TextField className='score-btn' placeholder='score'
                inputProps={{ maxLength: CHARACTER_LIMIT }}
                onChange={(e) => setScore(e.target.value)}
                value={score}></TextField>
            </Box>

            <Box sx={{marginLeft:'30px'}}>
              <Typography variant='h6' >Max Score</Typography>
              <TextField className='score-btn' placeholder='Max score'
                inputProps={{ maxLength: CHARACTER_LIMIT }}
                onChange={(e) => setMaxScore(e.target.value)}
                value={maxScore}
              ></TextField>

            </Box>




          </Box>
          {/* <Box>
         <FormControlLabel className='checkbox-input' control={<Checkbox checked={calling} />} label="Calling"
          onChange={(e) => setCalling(e.target.checked)} /> 
         </Box> */}

        </Box>

      </Box>
      <Box className='employ-btn-group'>
        <Button variant='outlined' onClick={() => navigate('/authorised/activity-management')}>Cancel</Button>

        <Button variant='contained' onClick={handleSubmit}>Save</Button>
      </Box>
    </>
  )
}

export default CreateEmployee