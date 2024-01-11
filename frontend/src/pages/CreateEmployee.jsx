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
import bredcrumb_arrow from '../assets/image/arrow1.svg'
import ReactSelect from 'react-select';
import { getCategoryList } from '../config/services/categories';

// import { validate } from '../../../api/server/models/journeyModel';




const CreateEmployee = () => {

  const userData = useLocation();
  const { id } = useParams();
  const [attendance, setAttendance] = useState(false);
  const [task, setTask] = useState(false);
  const [approval, setApproval] = useState(false);
  const [activityName, setActivityName] = useState();
  const [ID, setID] = useState();
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const CHARACTER_LIMIT = 10;
  const navigate = useNavigate();
  const [calling, setCalling] = useState(false);
  const [nonCalendar, setNonCalendar] = useState(false);
  const [category, setCategory] = useState({ value: '', label: 'Select Category' });
  const [categoryList, setCategoryList] = useState([]);
  const [callingScore, setCallingScore] = useState(0)
  const data = _.cloneDeep(userData.state);
  const [implementation, setImplementation] = useState(false);
  const [isCollection, setIsCollection] = useState(false);

  const data1 = {
    attendance: attendance,
    task: task,
    approval: approval,
    calling: calling,
    activityName: activityName,
    ID: ID,
    score: score,
    maxScore: maxScore,
    callingScore: callingScore,
    nonCalendar: nonCalendar,
    implementation: implementation,
    isCollection: isCollection,
    createdBy: createdBy,
    createdBy_Uuid: createdBy_Uuid,
    modifiedBy: modifiedBy,
    modifiedBy_Uuid: modifiedBy_Uuid,
    categoryName: category?.value
  }

  const postData = { ...data, ...data1 }

  // console.log("postData", postData)
  const validFilterLogic = new RegExp('^[a-zA-Z ]*$');
  const validateScore = new RegExp('^[0-9]*$');

  const validateActivity = (filledDetails) => {
    let { categoryName, calling, attendance, task, approval, activityName, score, createdBy_Uuid, modifiedBy_Uuid, createdBy, modifiedBy, maxScore } = filledDetails;

    if (!activityName) {
      toast.error("Fill activty name");
      return false;
    }
    else if (!categoryName) {
      toast.error("Select a category.");
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
    else if (parseInt(maxScore) < parseInt(score)) {

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
    //console.log(paramObj)
    if (id) {
      paramObj.activityId = id;
    }
    submitActivity(paramObj);
  }

  const submitActivity = (data) => {

    if (validateActivity(data)) {
      
      if (data?.calling === false) {
        setCallingScore(0)
      }

      let paramObj = { ...data };
      //  console.log("paramsObj",paramObj);

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
        // console.log(res?.result,"activityBy Id...");

        setActivityName(res?.result?.activityName);
        setID(res?.result?.ID);
        setScore(res?.result?.score)
        setMaxScore(res?.result?.maxScore)
        setApproval(res?.result?.approval)
        setAttendance(res?.result?.attendance)
        setTask(res?.result?.task)
        setCalling(res?.result?.calling)
        if (res?.result?.calling)
          setCallingScore(res?.result?.callingScore)
        setNonCalendar(res?.result?.nonCalendar)
        setImplementation(res?.result?.implementation)
        setIsCollection(res?.result?.isCollection)
        setCategory({ label: res?.result?.categoryName, value: res?.result?.categoryName })
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const fetchCategoryDetails = () => {

    getCategoryList()
      .then(res => {

        if (res?.categoryList) {

          const modifiedCategoryList = res?.categoryList?.map((result) => {

            result.label = result.categoryName;
            result.value = result.categoryName;
            return result;
          })
          setCategoryList(modifiedCategoryList)

        }

      })
      .catch((err) =>
        console.log(err))

  }
  // console.log(category,"categoryOptions....")
  useEffect(() => {
    fetchActivityDetails()
  }, [])
  useEffect(() => { fetchCategoryDetails() }, [])

  return (
    <>

      <div className='breadcrumbs-text'>
        <span className='breadcrumbs-item'>Add User</span>
        <img className='bredcrumb_arrow' src={bredcrumb_arrow} alt="" />
        <span className='breadcrumbs-lastItem'> User Type (Employee)</span>
      </div>
      <Box className='create-employ'>
        <Box>
          <Typography variant='h4'>{id ? "Update Employee Activity" : "Employee Activity Details"}</Typography>

          <div style={{ fontSize: 14, marginBottom: 25 }}>Enter Basic Details</div>
          <Typography variant='h6'>Select Category</Typography>
          <Box className='select-category'>
            <ReactSelect
              type="search"
              options={categoryList}
              value={category}
              onChange={(e) => setCategory(e)}
            />
          </Box>
          <Box className='inpt-group'>

            <Box >
              <Typography variant='h6'>Activity Name</Typography>
              {id ?
                <TextField className='activity-name' placeholder='Activity Name'
                  onChange={(e) => setActivityName(e.target.value)}
                  value={activityName}
                  margin="normal"
                ></TextField>
                :
                <TextField className='activity-name' placeholder='Activity Name'
                  onChange={(e) => setActivityName(e.target.value)}
                  value={activityName}
                  margin="normal"> </TextField>
              }

            </Box>


            <Box>
              <Typography variant='h6'>Score</Typography>

              <TextField className='score-btn' placeholder='score'
                inputProps={{ maxLength: CHARACTER_LIMIT }}
                onChange={(e) => setScore(e.target.value)}
                value={score}
              ></TextField>

            </Box>


            <Box sx={{ marginLeft: '30px' }}>
              <Typography variant='h6' >Max Score</Typography>
              <TextField className='score-btn' placeholder='Max score'
                inputProps={{ maxLength: CHARACTER_LIMIT }}
                onChange={(e) => setMaxScore(e.target.value)}
                value={maxScore}
              ></TextField>

            </Box>

            <Box sx={{ marginLeft: '30px' }}>
              <Typography variant='h6' >Calling Score</Typography>
              <TextField className='score-btn'
                inputProps={{ maxLength: CHARACTER_LIMIT }}
                onChange={(e) => setCallingScore(e.target.value)}
                value={calling ? callingScore : 0}
                disabled={calling ? false : true}
              ></TextField>
            </Box>

          </Box>


        </Box>





        <FormControlLabel className='checkbox-input' control={<Checkbox checked={attendance} />} label="Attendance"
          onChange={(e) => setAttendance(e.target.checked)} />

        <FormControlLabel className='checkbox-input' control={<Checkbox checked={task} />} label="Task"
          onChange={(e) => setTask(e.target.checked)} />

        <FormControlLabel className='checkbox-input' control={<Checkbox checked={approval} />} label="Approval"
          onChange={(e) => setApproval(e.target.checked)} />

        <FormControlLabel className='checkbox-input' control={<Checkbox checked={calling} />} label="Calling"
          onChange={(e) => setCalling(e.target.checked)} />

        <FormControlLabel className='checkbox-input' control={<Checkbox checked={nonCalendar} />} label="Non-Calendar"
          onChange={(e) => setNonCalendar(e.target.checked)} />

        <FormControlLabel className='checkbox-input' control={<Checkbox checked={implementation} />} label="Implementation"
          onChange={(e) => setImplementation(e.target.checked)} />

        <FormControlLabel className='checkbox-input' control={<Checkbox checked={isCollection} />} label="Collection"
          onChange={(e) => setIsCollection(e.target.checked)} />

      </Box>
      <Box className='employ-btn-group'>
        <Button variant='outlined' onClick={() => navigate('/authorised/activity-management')}>Cancel</Button>

        <Button variant='contained' onClick={handleSubmit}>Save</Button>
      </Box>
    </>

  )
}

export default CreateEmployee