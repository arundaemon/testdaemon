import React, { useState } from 'react'
import Page from "../components/Page";
import { Container, Link, Breadcrumbs, Typography, Card, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Box, Button } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { updateActivity } from '../config/services/attendance';
import { updateRoleBasedAttendanceMatrixById } from '../config/services/roleBasedAttendanceMatrix';
import toast from 'react-hot-toast';
import BreadcrumbArrow from  '../assets/image/bredArrow.svg';


const UpdateActivity = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let stateData = location?.state ?? {}
    const [minTarget, setMinTarget] = useState(stateData?.minTarget);
    const [status, setStatus] = useState(stateData?.active);


    // const submitUpdateActivity = () => {
    //     console.log("state data inside update activity",stateData); 

    //     console.log("submit update activity called")
    //     let reqParams = {
    //         _id: stateData?.attendanceMatrixId,
    //         activityId: stateData?.activityId,
    //         minTarget,
    //         status,
    //     }
    //     console.log("reParams",reqParams)
    //     console.log("statussss",status)
    //     if(!parseInt(status)){        
    //         console.log("submit update activity called inside true")

    //         updateActivity(reqParams)
    //         .then(res => {
    //             if (res?.result) {
    //                 toast.success(res?.message)
    //                 navigate('/authorised/matrix-management');
    //             }
    //             else if (res?.data?.statusCode === 0) {
    //                 let { errorMessage } = res?.data?.error
    //                 toast.error(errorMessage)
    //             }
    //             else {
    //                 console.error(res);
    //             }
    //         })
    //     }
    // }

    const submitUpdateActivity = () =>{
        const { manageMatrixData } = stateData;
        let params = {}

        if(stateData?.manageMatrixData?.attendanceMatrixType === "ROLE"){
            params.role_id = manageMatrixData.role_id
            params.role_code = manageMatrixData.role_code
            params.role_name = manageMatrixData.role_name
        }else{
            params.profile_id = manageMatrixData.profile_id
            params.profile_code = manageMatrixData.profile_code
            params.profile_name = manageMatrixData.profile_name
        }
    
        // params._id = stateData?._id;
        params.minTarget = minTarget;
        params.status = status;
        params.activityName = stateData?.activityName;
        params.ID = stateData?.attendanceMatrixId;
        params.activityId = stateData?.ID
        params.id = stateData?._id


        updateRoleBasedAttendanceMatrixById([{...params}])
        .then((res) =>{
            if (res?.result) 
            {
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
    }

    const handleStatusChange = (e) =>{
        if(minTarget === undefined){
            toast.error("Minimum Target Required!");
            return 
        }
        setStatus(e.target.value)
    }
    const handleValueChange = (e) => {
        const {value} = e?.target;
        setMinTarget(value)
    }

    return (
        <>
            <Page title="Extramarks | BDE(Profile / Role)" className="main-container datasets_container">
                <Container style={{ marginLeft: '10px' }}>

                    <Breadcrumbs separator={<img src={BreadcrumbArrow} alt="Arrow"/>} aria-label="breadcrumb">
                        <Link className='box-col-pointer' color="inherit" onClick={() => navigate('/authorised/matrix-management')}>
                            Manage Matrix
                        </Link>
                        <Typography key="2" color="text.primary"> BDE (Profile / Role) </Typography>
                    </Breadcrumbs>

                    <Card style={{ height: '300px', }}>
                        <Container style={{ marginTop: '20px', }}>
                            <b>Edit</b>
                            <p>Enter Details</p>

                            <div style={{ display: 'flex', marginRight: '10px', marginTop: '10px' }}>
                                <div>
                                    <b>Parameter</b>
                                    <div>
                                        <TextField disabled id="filled-disabled" value={stateData?.activityName} variant="filled" />
                                    </div>
                                </div>

                                <div style={{ marginLeft: '40px', marginBottom: '10px' }}>
                                    <p>Min. parameter target</p>
                                    <TextField value={minTarget} name='minTarget' onChange={handleValueChange} />
                                </div>
                            </div>

                            <FormControl>
                                <b>Status</b>
                                <RadioGroup row name='status' onChange={handleStatusChange} value={status}>
                                    <FormControlLabel value={1} control={<Radio />} label="Active" />
                                    <FormControlLabel value={0} control={<Radio />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Container>
                    </Card>

                    <Box className='employ-btn-group' mt={2}>
                        <Button variant='outlined' onClick={() => navigate('/authorised/matrix-management')}>Cancel</Button>
                        <Button variant='contained' onClick={submitUpdateActivity}>Save</Button>
                    </Box>
                </Container>
            </Page>
        </>
    )
}
export default UpdateActivity
