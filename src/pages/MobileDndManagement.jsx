import React, { useEffect, useState } from 'react'
import Page from "../components/Page";
import Select from 'react-select';
import { TextField, Button, Box, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { updateDndStatus } from '../config/services/leadassign';
import toast from 'react-hot-toast';

const MobileDndManagement = () => {
    const [dndStatus, setDndStatus] = useState();
    const [mobile, setMobile] = useState("");

    const statusList = [
        { label: 'Dnd Activate', value: 'activate' },
        { label: 'Dnd De-Activate', value: 'de_activate' }
    ]

    const handleOnChange = (e) => {
        setMobile(e.target.value);

    }

    const handleDndStatus = (newSelectValue) => {
        setDndStatus(newSelectValue);
    }

    const changeStatus = async () => {
        let params = { mobile, dndStatus: dndStatus.value };
        updateDndStatus(params)
            .then(res => {
                if (res?.result) {
                    let message = res?.message;
                    let leadName = res?.result?.name;
                    toast.success(`${message} ${dndStatus.value}d`)
                    setDndStatus('');
                    setMobile("")

                }
                else if (res?.data?.error) {
                    toast.error(res?.data?.error?.errorMessage)
                }
                else if (!res?.result) {
                    toast.error(res?.message)
                }
                else if (res?.result?.statusCode === 0) {
                    let { errorMessage } = res?.result?.error
                    toast.error(errorMessage)
                }
                else {
                    console.error(res);
                }
            })
            .catch(err => {
                console.log(err, ":::err");
            })
    }
    const handleSubmit = () => {
        if (mobile.length === 10) {
            changeStatus();
        }
        else {
            toast.error('Mobile number should be of 10 digits')
        }
    }

    return (

        <div className='add-matrix create-activity'>
            <Page title="Extramarks | Mobile Dnd Management" className="main-container  datasets_container">
                <h4 className='heading' >Manage Dnd Status</h4>
                <div style={{ marginTop: '40px' }}>
                    <b>Mobile Number</b>
                </div>
                <div >
                    <TextField required name="mobile" type="number" id="outlined-basic" variant="outlined" value={mobile} onChange={(e) => handleOnChange(e)} />
                </div><br />
                <div className='box' >
                    <label className='boxLabel'>Dnd Status</label>
                    <div>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="color"
                            options={statusList}
                            onChange={handleDndStatus}
                            value={dndStatus}
                            autosize={true}

                        />
                    </div>
                </div>

                <Box className='employ-btn-group' mt={6}>
                    {/* <Button variant='outlined' >Cancel</Button> */}
                    <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                </Box>
            </Page>

        </div>
    )

}

export default MobileDndManagement;