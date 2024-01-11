import { memo, useEffect, useState } from 'react';
import { Grid, Typography, Box, Breadcrumbs, Link, Button, TextField, IconButton} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import IconBreadcrumbArrow from './../../assets/icons/icon-breadcrumb-arrow.svg';
import FormSelect from '../../theme/form/theme2/FormSelect';
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

const RaiseClaim = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [meetingsList, setMeetingsList] = useState([]);
    const [selectedMeetings, setSelectedMeetings] = useState([]);

    useEffect(() => {
        setMeetingsList([
            {id: 1, title: 'Demo follow up meeting', location: 'Kanpur', time: '12:00 PM - 12:30 PM', schoolCode: 'SC0123', schoolName: 'Swaraj India'},
            {id: 2, title: 'Demo follow up meeting', location: 'Kanpur', time: '12:00 PM - 12:30 PM', schoolCode: 'SC0123', schoolName: 'Swaraj India'},
            {id: 3, title: 'Demo follow up meeting', location: 'Kanpur', time: '12:00 PM - 12:30 PM', schoolCode: 'SC0123', schoolName: 'Swaraj India'},
            {id: 4, title: 'Demo follow up meeting', location: 'Kanpur', time: '12:00 PM - 12:30 PM', schoolCode: 'SC0123', schoolName: 'Swaraj India'},
        ])
    }, []);

    const handleSelectedMeetings = (obj) => {
        let selectedList = Object.assign([], selectedMeetings);
        let objPosition;
        if(selectedList.includes(obj)) {
            objPosition = selectedList.indexOf(obj);
            selectedList.splice(objPosition, 1);
        } else {
            selectedList.push(obj);
        }
        setSelectedMeetings(selectedList);
    }

    const handleUpload = (ref) => {

    }
 
  return (
    <>
      <Box className='crm-sd-claims'>

        <Breadcrumbs className='crm-breadcrumbs' separator={<img src={IconBreadcrumbArrow} />} aria-label="breadcrumbs" >
            <Link underline="hover" key="1" color="inherit" to="/authorised/school-dashboard" className='crm-breadcrumbs-item breadcrumb-link' >
                Dashboard
            </Link>
            <Typography key="2" component="span"  className='crm-breadcrumbs-item breadcrumb-active'> Add School </Typography>
        </Breadcrumbs>

        <Box className='crm-sd-claims-container'>

            <Box className='crm-sd-claims-list-wrapper'>
                <Box className='crm-sd-claims-list-header'>
                    <Typography component="h2" className='crm-sd-claims-title'>Raise a Claim</Typography>
                    <Button className='crm-btn crm-btn-outline' onClick={() => null}>Skip for now</Button>
                </Box>

                <Grid container spacing={2} className='crm-sd-claims-list-items'>
                    {
                    meetingsList?.map((item, i) => (
                        <Grid key={i} item xs={12} md={4}  >
                            <Box className={`crm-sd-claims-list-item ` + (selectedMeetings.includes(item) ? `claim-selected` : `123`)}  onClick={() => handleSelectedMeetings(item)}>
                                <Box className='crm-sd-claims-list-item-title'>{item.title}</Box>
                                <Box className='crm-sd-claims-list-item-info'>{item.schoolName}, {item.location} </Box>
                                <Box className='crm-sd-claims-list-item-info'>{item.time} | School Code: {item.location} </Box>
                            </Box>
                        </Grid>
                        ))
                    }
                </Grid>
                <Box className='crm-sd-claims-add-expense-btn'>
                    <Button className='crm-btn crm-btn-primary crm-btn-lg' onClick={() => null}>Add Expense</Button>
                </Box>

                <Box className='crm-sd-claims-expenses'>
                    <Typography component="h2" className='crm-sd-claims-expenses-label'>Expenses</Typography>
                </Box>
                <Grid container spacing={2} className='crm-sd-claims-expenses-form'>
                    <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
                        <Box className='crm-sd-claims-expenses-form-group'>
                            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Type of Expense</Typography>
                            <FormSelect
                                theme="dark"
                                placeholder=''
                                value={'Conveyance'}
                                handleSelectedValue={(e) => null}
                                optionLabels={{label: 'label', value: 'value'}}
                                options={[
                                    {label: 'Conveyance', value: 'Conveyance'},
                                    {label: 'Transport', value: 'Transport'}
                                ]}
                            />
                        </Box>
                    </Grid>
                    
                    <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
                        <Box className='crm-sd-claims-expenses-form-group'>
                            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Mode of Transport</Typography>
                            <FormSelect
                                theme="dark"
                                placeholder=''
                                value={'Own Transport'}
                                handleSelectedValue={(e) => null}
                                optionLabels={{label: 'label', value: 'value'}}
                                options={[
                                    {label: 'Own Transport', value: 'Own Transport'},
                                    {label: 'Local Transport', value: 'Local Transport'}
                                ]}
                            />
                        </Box>
                    </Grid>
                    <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
                        <Box className='crm-sd-claims-expenses-form-group'>
                            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Count of Kms</Typography>
                            <TextField
                                autoComplete="off"
                                className='crm-form-input dark'
                                name="distanceCount"
                                type="number"
                                placeholder=''
                                value="100"
                            />
                        </Box>
                    </Grid>


                    <Grid item className='crm-sd-claims-expenses-form-item pt-0' xs={12} md={4}>
                        <Box className='crm-sd-claims-expenses-form-group'>
                            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>File Upload</Typography>
                            <TextField
                                autoComplete="off"
                                disabled
                                className='crm-form-input dark'
                                name="distanceCount"
                                type="upload"
                                placeholder='Upload here'
                                value=""
                                InputProps={{
                                    endAdornment: (
                                      <IconButton component="label" className='crm-form-input-upload'>
                                        <input
                                          styles={{display:"none"}}
                                          type="file"
                                          hidden
                                          onChange={() => handleUpload('ref')}
                                          name="[licenseFile]"
                                        />
                                        Browse
                                      </IconButton>
                                    ),
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item className='crm-sd-claims-expenses-form-item pt-0' xs={12} md={12}>
                        <Box className='crm-sd-claims-expenses-form-group'>
                            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Remarks</Typography>
                            <TextField
                                multiline
                                minRows={2}
                                autoComplete="off"
                                className='crm-form-input crm-form-input-multiline medium-dark'
                                name="remarks"
                                placeholder=''
                                value=""
                                
                            />
                        </Box>
                    </Grid>
                </Grid>

            </Box>

            <Box className='crm-sd-claims-actions'>
                
            </Box>
        </Box>

        
      
      </Box>
    </>
  );
};

export default memo(RaiseClaim);
