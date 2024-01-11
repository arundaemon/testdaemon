import React, { useEffect, useState } from 'react'
import Page from "../components/Page";
import {
    Container, Link, Breadcrumbs, Typography, Card, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Button, Box
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useParams } from 'react-router-dom';
import {
    attendanceDetails,
    updateAttendance
} from '../config/services/attendance';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BreadcrumbArrow from '../assets/image/bredArrow.svg';


const EditMatrix = () => {
    const [recordForEdit, setRecordForEdit] = useState({});
    const [min, setMin] = React.useState();
    const [max, setMax] = React.useState();
    const [status, setStatus] = React.useState();
    const [dataToAdd, setDataToAdd] = React.useState({});

    const navigate = useNavigate();

    const validateTarget = new RegExp('^[0-9]*$');


    const validateUpdate = (filledDetails) => {
        let { minTarget, maxTarget } = filledDetails;
        minTarget = parseInt(minTarget)
        maxTarget = parseInt(maxTarget)

        if (!minTarget) {
            toast.error("Min. Target is required");
            return false;
        }
        else if (!maxTarget) {
            toast.error("Max. Target is required");
            return false;
        }
        else if (minTarget > maxTarget) {
            toast.error("Min. Target must be smaller than Max. Target");
            return false;
        }
        else if (!(maxTarget > 10 )) {
            toast.error("Max Target Must Be Greater than 10");
            return false;
        }
        else if (!validateTarget.test(minTarget)) {
            toast.error("Min. Target must be a number");
            return false;
        }
        else if (!validateTarget.test(maxTarget)) {
            toast.error("Max. Target must be a number");
            return false;
        }
        else {

            return true;
        }

    }

    function handleClick(event) {
        event.preventDefault();
    }


    let { matrix_id } = useParams();

    const getMatrixDetails = async () => {
        attendanceDetails(matrix_id)
            .then((res) => {
                // console.log(res, '...res');
                if (res?.result) {
                    setRecordForEdit(res?.result)
                    setMin(res?.result?.minTarget)
                    setMax(res?.result?.maxTarget)
                    setStatus(res?.result?.status);
                }
            })
            .catch((err) => {
                console.log(err, '...error')
            })
    }

    useEffect(() => {
        getMatrixDetails()
    }, [])

    const handleMinTarget = (e) => {
        setMin(e.target.value);

    }

    const handleMaxTarget = (e) => {
        setMax(e.target.value);
    }

    const handleStatus = (e) => {
        let { value } = e.target;
        if (value === 'active') {
            setStatus(1)
        }
        else {
            setStatus(0)
        }
        // console.log(status, 'acs')
    }

    const updateMatrixDetails = async (data) => {
        if (validateUpdate(data)) {

            updateAttendance(data)
                .then(res => {
                    if (res?.data) {
                        toast.success(res?.message)
                        navigate('/authorised/matrix-management')
                    }
                })
                .catch((err) => {
                    console.log(err, '...error')
                })
        }
    }



    const handleSubmit = () => {
        let filledDetails = _.cloneDeep(dataToAdd);
        filledDetails.minTarget = min;
        filledDetails.maxTarget = max;
        filledDetails.status = status;
        filledDetails._id = recordForEdit?._id

        // setDataToAdd(filledDetails);
        updateMatrixDetails(filledDetails);
    }

    // const handleNavigation = (route) => {
    //     navigate(route)
    // }




    // Breadcrumb
    const breadcrumbs = [
        <Link className='box-col-pointer' color="inherit" onClick={() => navigate('/authorised/matrix-management')}>
            Manage Matrix</Link>,
        <Typography key="2" color="text.primary"> Edit </Typography>,
    ];



    return (
        <>
            <Page title="Extramarks | BDE(Profile / Role)" className="main-container datasets_container">
                <Container style={{ marginLeft: '10px' }}>
                    <Breadcrumbs separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>

                    <br></br>

                    <Card style={{ height: '300px', }}>
                        <Container style={{ marginTop: '20px', }}>
                            <b>Edit (BDE)</b>
                            <p>Enter Details</p>

                            <div style={{ display: 'flex', marginRight: '10px', marginTop: '10px' }}>
                                <div>
                                    <b>Min. Target</b>
                                    <div>
                                        <TextField name="minTarget" type="text" value={min} onChange={(e) => handleMinTarget(e)}></TextField>
                                    </div>
                                </div>
                                <div style={{ marginLeft: '40px' }}>
                                    <b>Max. Target</b>
                                    <div>
                                        <TextField name="maxTarget" type="text" value={max} onChange={(e) => handleMaxTarget(e)}></TextField>
                                    </div>
                                </div>
                            </div>

                            {/* Radio buttons */}
                            <FormControl>
                                <b>Status</b>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value='active' checked={status === 1 ? true : false} onChange={(e) => handleStatus(e)} control={<Radio />} label="Active" />
                                    <FormControlLabel value='inactive' checked={status === 0 ? true : false} onChange={(e) => handleStatus(e)} control={<Radio />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Container>
                    </Card>

                    <Box className='employ-btn-group' mt={2}>
                        <Button variant='outlined' onClick={() => navigate('/authorised/matrix-management')}>Cancel</Button>
                        <Button variant='contained' onClick={handleSubmit}>Update</Button>
                    </Box>
                </Container>
            </Page>
        </>
    )
}
export default EditMatrix
