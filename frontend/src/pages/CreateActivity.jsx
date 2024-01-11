import React,{useState} from 'react'
import {Box, Typography, Button} from '@mui/material';
import { makeStyles } from '@mui/styles'
import ReactSelect from 'react-select';
import { userType } from '../constants/ActivityConfig';
// import CreateCustomer from './CreateCustomer';
// import CreateEmployee  from './CreateEmployee';
import { useNavigate } from 'react-router-dom';
import { getEmployeesCount, getCustomersCount, getActivity } from '../config/services/activities';
import _ from 'lodash';
import { useEffect } from 'react';
//import "../../../frontend/src/Crm.css"




const useStyles = makeStyles((theme) => ({

  container:{ 
      
      padding:'20px',
      margin:'10px 20px 20px 20px',
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: "8px",
    },
    button:{
      
    }
  
}))

const CreateActivity = () => {

 const classes = useStyles();


 const [condition,setCondition]= useState({});

const navigate= useNavigate();

const handleSelectedCondition=(user)=>{

  let choosenUser= _.cloneDeep(condition);

  switch(user.value){ 
    case "Customer":
      choosenUser.userType=user.value;
      break;

    case "Employee":
      choosenUser.userType=user.value;
      break;

     default:
      choosenUser.userType=null;
     
  }
  setCondition(choosenUser);
  
}


const handleSubmit=()=>{
 
  if(condition.userType==='Customer'){
    navigate('/authorised/create-customer',{state:condition})
   
  }
  else {
    navigate('/authorised/create-employee',{state:condition})
  }

 setCondition({});
}




  return (
    <Box>
      <Box  className={classes.container +' create-activity'}>
     <Typography variant='h4'>Add New</Typography>
     <Typography variant='p'>Enter Basic Details</Typography>    
     
     <Typography variant='h6'>User Type</Typography>

    <Box style={{maxWidth:'180px'}}>
     <ReactSelect 
     options={userType}
     onChange={(e)=>{handleSelectedCondition(e)}}
     defaultValue={condition?.userType}
    //  defaultValue={user}
     />
     </Box>
    </Box>

    <Box className='create-activity-btn'>

    <Button
    variant="contained"
    color="primary"
    className={classes.button +' submit-btn'}
    type="submit"
    onClick={handleSubmit}
    
    >Submit</Button>

    <Button className='cancel-btn' variant='outlined' onClick={()=> navigate('/authorised/activity-management')}> Cancel</Button>
    </Box>
      

    </Box>
    
  )
}


export default CreateActivity