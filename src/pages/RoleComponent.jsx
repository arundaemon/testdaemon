import React, { useState, useEffect, useRef } from 'react'
import { TextField, Grid, Typography, Box, Button } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import _ from 'lodash';
import { createAttendanceMatrix } from '../config/services/attendance';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
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
    role_code: "selectAll",
    role_id: "selectAll",
    role_name: "Select All"
}]


export default function RoleComponent(props) {
    let { matrixType } = props;
    const [roles, setRoles] = React.useState([]);
    const [roleName, setRoleName] = React.useState([]);
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
            toast.error("Select the Role");
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

    const fetchRolesList = () => {
        let params = { action: "role" }
        getRolesList(params)
            .then(res => {
                if (res?.data?.response?.data) {
                    setRoles([...temp, ...res?.data?.response?.data]);
                }
                else {
                    console.error(res)
                }
            })
    }

    const handleChange = (event, selected) => {
      
        const { target: { value } } = event;
        // console.log(value,'.......val')
        if (value[value.length - 1].role_id === "selectAll") {
            setRoleName([...roles.slice(1)])
            const temp = [...roles]
            temp.shift()
            temp.unshift({
                role_code: "unselectAll",
                role_id: "unselectAll",
                role_name: "Unselect All"
            })
            setRoles(temp);
        }
        else if (value[value.length - 1].role_id === "unselectAll") {
            setRoleName([])
            const temp = [...roles]
            temp.shift()
            temp.unshift({
                role_code: "selectAll",
                role_id: "selectAll",
                role_name: "Select All"
            })
            setRoles(temp);
        }
        else {
            const preventDuplicate = value.filter((v, i, a) => a.findIndex((t) => t.role_id === v.role_id) === i);
            setRoleName(typeof preventDuplicate === 'string' ? preventDuplicate.split(',') : preventDuplicate);
        }

    };

    const handleSelect = (event) => {
        setSelectDropdown(false)
    }


    const handleCick = (val) => {
        const newData = roleName.filter(delObj => {
            return delObj.role_id !== val.role_id
        });
        setRoleName(newData)
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
        filledDetails.attendanceMatrixArray = roleName;
        filledDetails.minTarget = min;
        filledDetails.maxTarget = max;
        filledDetails.createdBy = createdBy
        filledDetails.createdBy_Uuid = createdBy_Uuid
        filledDetails.modifiedBy = modifiedBy
        filledDetails.modifiedBy_Uuid = modifiedBy_Uuid
        addMatrix(filledDetails);
    }

    useEffect(() => fetchRolesList(), []);
   

    return (
        <div>
            <FormControl >
                <Select className='role-selectBox'
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={roleName}
                    onChange={(event, selected) => handleChange(event, selected)}
                    renderValue={(selected) => selected.map((x) => x.role_name).join(', ')}
                    MenuProps={MenuProps}
                    ref={reactSelectRef}
                    open={selectDropdown}
                    onOpen={() => setSelectDropdown(true)}
                    onClose={()=>setSelectDropdown(false)}
                >
                    {roles.map((variant) => (
                        <MenuItem key={variant.role_id} value={variant}>
                            <Checkbox
                                checked={
                                    roleName.find((item) => item.role_id === variant.role_id) ? true : false
                                }
                            />
                            <ListItemText primary={variant.role_name} />
                        </MenuItem>
                    ))}
                    <Box sx={{ borderTop: "1px solid lightgrey", marginTop: "10px", padding: "10px 0px 0px 0px" }}>
                        <Button onClick={handleSelect} >Apply</Button>
                    </Box>

                </Select>


                <div className="cm_chip_parent">
                    {roleName?.map((val, i) => (
                        <span className='cm_chip' onClick={() => handleCick(val)}>{val.role_name}<span>X</span>
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


