import { React, useState } from "react";
import ReactSelect from 'react-select';
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material';
import { useEffect } from "react";
import { getAllSourcesList } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";

export default function AddSubSource() {
    const [sourceList, setSourceList] = useState([]);
    const [sourceId, setSourceId] = useState(null);
    const [leadSource, setLeadSource] = useState();
    const data = getUserData('loginData')
    const uuid = data?.uuid

    const navigate = useNavigate();


    const fetchAllSourceList = () => {
        let params = {
            uuid: uuid,
            status: [1, 2]
        }
        getAllSourcesList(params)
            .then((res) => {
                let data = res?.data?.source_list
                data.map(sourceObj => {
                    sourceObj.label = sourceObj?.source_name
                    sourceObj.value = sourceObj.source_id
                    return sourceObj
                })
                setSourceList(data)
            })
            .catch(err => console.error(err))
    }

    const handleSelectButton = () => {
        let url;
        if (leadSource) {
            url = `/authorised/lead-sub-source/${leadSource.source_id}`;
            navigate(url);

        }

    }

    const handleSelectLeadSourceName = (newSelectValue) => {
        setLeadSource(newSelectValue);
    }

    useEffect(() => {
        fetchAllSourceList()
    }, [])

   

    return (
        <>
            <Box className="add-source">
                <h3>Add Sub Source</h3>

                <Grid container mb={2} spacing={4} sx={{ marginTop: '24px' }}>
                    <Grid item xs={12} sm={6} md={6} lg={3} >
                        <h3>Lead Source:</h3>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} >
                        <ReactSelect
                            classNamePrefix="select"
                            options={sourceList}
                            value={leadSource}
                            onChange={handleSelectLeadSourceName}
                        />
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
                                onClick={() => handleSelectButton()}>
                                Select
                            </Button>
                        </Box>

                    </Grid>
                </Grid>

            </Box>

        </>
    )
}