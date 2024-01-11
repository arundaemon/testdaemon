import React, { useState, useEffect, useRef } from 'react'
import { TextField, Grid, Box, Button, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import _ from 'lodash';
import { createAttendanceMatrix } from '../config/services/attendance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getRolesList } from '../config/services/hrmServices';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
   PaperProps: {
      style: {
         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
         width: 250,
      },
   },
};

const temp = [{
   profile_code: "selectAll",
   profile_id: "selectAll",
   profile_name: "Select All"
}]

export default function ProfileComponent(props) {
   let { matrixType } = props;
   const [profiles, setProfiles] = React.useState([]);
   const [profieName, setProfieName] = React.useState([]);
   const [dataToAdd, setDataToAdd] = React.useState({});
   const [min, setMin] = React.useState();
   const [max, setMax] = React.useState();
   const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
   const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
   const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
   const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
   const reactSelectRef = useRef();
   const [selectDropdown, setSelectDropdown] = React.useState(false)

   const navigate = useNavigate();


   const validateMatrix = (filledDetails) => {

      let { minTarget, maxTarget, attendanceMatrixArray } = filledDetails;
     

      if (attendanceMatrixArray.length === 0) {
         toast.error("Select the Profile");
         return false;
      }
      else {
         if (!minTarget || !maxTarget) {
            toast.error("Min and Max Target are mandatory");
            return false;
         }
         else if (minTarget > maxTarget) {
            toast.error("Max. Target cannot be less tha Min. Target");
            return false;
         }
         else {

            return true;
         }
      }
   }

   const fetchProfileList = () => {
      let params = { action: "profile" }
      getRolesList(params)
         .then(res => {
            if (res?.data?.response?.data) {
               setProfiles([...temp, ...res?.data?.response?.data]);
            }
            else {
               console.error(res)
            }
         })
   }

   const handleChange = (event, selected) => {

      const { target: { value } } = event;
      // console.log(value, "test event")
      if (value?.[value?.length - 1]?.profile_id === "selectAll") {
         setProfieName([...profiles.slice(1)])
         const temp = [...profiles]
         temp.shift()
         temp.unshift({
            profile_code: "unselectAll",
            profile_id: "unselectAll",
            profile_name: "Unselect All"
         })
         setProfiles(temp);

      }
      else if (value?.[value?.length - 1]?.profile_id === "unselectAll") {
         setProfieName([])
         const temp = [...profiles]
         temp.shift()
         temp.unshift({
            profile_code: "selectAll",
            profile_id: "selectAll",
            profile_name: "Select All"
         })
         setProfiles(temp);
         
      }
      else {
         const preventDuplicate = typeof value === 'object' ? value?.filter((v, i, a) => a?.findIndex((t) => t?.profile_id === v?.profile_id) === i) : value;
         setProfieName(typeof preventDuplicate === 'string' ? preventDuplicate?.split(',') : preventDuplicate);
        
      }



   };

   const handleSelect = (event) =>{
       setSelectDropdown(false)
  }





   const handleCick = (val) => {
      const newData = profieName.filter(delObj => {
         return delObj.profile_id !== val.profile_id
      });
      setProfieName(newData)

   };


   const handleMinTarget = (e) => {
      setMin(Number.parseInt(e.target.value));
   }

   const handleMaxTarget = (e) => {
      setMax(Number.parseInt(e.target.value));
   }

   const addMatrix = async (data) => {
      
      if (validateMatrix(data)) {
      
         createAttendanceMatrix(data)
            .then((res) => {
               if (res?.result) {
                  toast.success(res?.message)
                  navigate('/authorised/matrix-management');
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
      filledDetails.attendanceMatrixType = matrixType.value;
      filledDetails.attendanceMatrixArray = profieName;
      filledDetails.minTarget = min;
      filledDetails.maxTarget = max;
      filledDetails.createdBy = createdBy
      filledDetails.createdBy_Uuid = createdBy_Uuid
      filledDetails.modifiedBy = modifiedBy
      filledDetails.modifiedBy_Uuid = modifiedBy_Uuid
      addMatrix(filledDetails);
   }


   useEffect(() => fetchProfileList(), []);

   return (
      <div>
         <FormControl sx={{ m: 0, width: 300 }}>

            <Select className='role-selectBox'
               labelId="demo-multiple-checkbox-label"
               id="demo-multiple-checkbox"
               multiple
               value={profieName}
               onChange={handleChange}
               renderValue={(selected) => selected.map((x) => x.profile_name).join(', ')}
               MenuProps={MenuProps}
               ref={reactSelectRef}
               open={selectDropdown}
               onOpen={() => setSelectDropdown(true)}
               onClose={()=>setSelectDropdown(false)}
            >
               {profiles.map((variant) => (
                  <MenuItem key={variant.profile_id} value={variant}>
                     <Checkbox
                        checked={
                           profieName.find((item) => item.profile_id === variant.profile_id) ? true : false
                        }
                     />
                     <ListItemText primary={variant.profile_name} />
                  </MenuItem>
               ))}

               <Box sx={{ borderTop: "1px solid lightgrey", marginTop: "10px", padding: "10px 0px 0px 0px" }}>
                        <Button onClick={handleSelect} >Apply</Button>
                    </Box>
            </Select>


            <div className="cm_chip_parent">
               {profieName?.map((val, i) => (
                  <span className='cm_chip' onClick={() => handleCick(val)}>{val.profile_name}<span>X</span>
                  </span>

               ))}
            </div>

         </FormControl>

         <Grid container alignItems="flex-start" direction="row" item xs={12} sm={12} md={12} lg={9} spacing={1}>
            <Grid item xs={2} sm={2} md={2} lg={2}>
               <Typography variant='h6'>Min. Target</Typography>
               <TextField className='target-inputBox' type="number" id="outlined-basic" variant="outlined" onChange={(e) => handleMinTarget(e)} />
            </Grid>


            <Grid item xs={2} sm={2} md={2} lg={2}>
               <Typography variant='h6'>Max. Target</Typography>
               <TextField className='target-inputBox' type="number" id="outlined-basic" variant="outlined" onChange={(e) => handleMaxTarget(e)} />
            </Grid>
         </Grid>



         <Box className='employ-btn-group' mt={2}>
            <Button variant='contained' onClick={handleSubmit}>Save</Button>
            <Button variant='outlined' onClick={() => navigate('/authorised/matrix-management')}>Cancel</Button>
         </Box>
      </div>
   );
}


