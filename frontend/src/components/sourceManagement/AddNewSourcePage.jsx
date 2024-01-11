import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState , useEffect} from "react";
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from "react-router-dom";
import { addUpdateNewSource } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";

export default function AddNewSourcePage() {
    const [entry, setEntry] = useState({});
    const navigate = useNavigate();
    const data = getUserData('loginData')
    const status = 1
    const uuid = data?.uuid
   

    
    const handleOnChange = (e) => {
        if (e.target.value.length >= 30) {
            toast.error('Source name should be in limited character')
        }
        let filledDetails = {};
        filledDetails.sourceName = e.target.value;
        setEntry(filledDetails);
    }

    const validateAddSource = (data) => {
        let { sourceName } = data;
        if (!sourceName) {
            toast.error('Please fill source name')
            return false
        }
        else if (!/\S/.test(sourceName)) {
            toast.error('Enter a valid source Name!')
            return false
        }
        else {
            return true
        }
    }

    const createLeadSource = async (data) => {
        let params = { source_name: data.sourceName, uuid: uuid, status: status , source_id: data.source_id};
        addUpdateNewSource(params)
            .then((res) => {
                if (res?.data?.status === 1) {
                    toast.success(res?.data?.message);
                    navigate('/authorised/source-management')
                }
                else if (res?.data?.status === 0) {
                    toast.error(res?.data?.message)
                }
                else {
                    console.error(res);
                }
            })
            .catch((err) => {
                console.error(err, "::err");
            })

    }

    const handleSaveButton = () => {
        if (validateAddSource(entry)) {
            createLeadSource(entry)
        }
    }



    return (
        <>
            <div className="add-source" style={{ minHeight: "423px" }}>
                <h5>Add Source</h5>
                <Grid container mb={2} spacing={4} sx={{ marginTop: '24px' }}>
                    <Grid item xs={12} sm={6} md={6} lg={6} display='flex'>
                        <p>SOURCE:</p>
                        <TextField className="report_form_ui_input" name="sourceName" inputProps={{ maxLength: 30 }} onChange={(e) => handleOnChange(e)}/>

                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={5} >
                        <Box className="lead-btn-group" display='flex' justifyContent='flex-end'>

                            <Button
                                variant="outlined"
                                color='primary'
                                size='large'
                                onClick={() => navigate('/authorised/source-management')}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color='primary'
                                size='large'
                                onClick={() => handleSaveButton()}>
                                Save
                            </Button>
                        </Box>

                    </Grid>
                </Grid>

            </div>
        </>
    )
}