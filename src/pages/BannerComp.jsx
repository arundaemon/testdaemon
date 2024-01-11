import React, { useState, Component } from "react";
import { TextField, Grid } from "@mui/material";
import Select from "react-select";
import { makeStyles } from '@mui/styles'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box } from "@mui/system";


const StatusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'InActive' },
];

const priorityOptions = [
    {label: 1,value: 1},
    {label: 2,value: 2},
    {label: 3,value: 3},
    {label: 4,value: 4},
]


function BannerComp(props) {
    let { handlePriorityChange, handleCreatedbyChange, handleModifybyChange, handleSelectStatus, status, startdate, handleStartDate, handleEndDate, enddate, allFields, id } = props

    return (
        <Box >
            <div className='inputMain'>
                {/* <Box>
                    <h3>Priority</h3>
                    <TextField className="priortyInput" type="text" name="priority" value={allFields?.priority} onChange={handlePriorityChange} id="outlined-basic" variant="outlined" />
                </Box> */}
                <Box>
                    <h3>Priority</h3>
                    <Select 
                        className="statusSelect" 
                        name="priority" 
                        options={priorityOptions} 
                        value={{label:allFields?.priority,value: allFields?.priority}}
                        onChange={handlePriorityChange}
                    />
                    {/* <TextField className="priortyInput" type="text" name="priority" value={allFields?.priority} onChange={handlePriorityChange} id="outlined-basic" variant="outlined" /> */}
                </Box>

                <Box>
                    <h3>Status</h3>
                    <Select className="statusSelect" options={StatusOptions} onChange={handleSelectStatus} value={StatusOptions?.find(obj => obj?.value === allFields?.status)} />
                </Box>

                {/* {id ? <> */}
                    <Box>
                        <h3>Created By</h3>
                        <TextField className="priortyInput width150" disabled type="text" name="createdBy" value={allFields?.createdBy} onChange={handleCreatedbyChange} id="outlined-basic" variant="outlined" />
                    </Box>

                    <Box>
                        <h3>Created Date</h3>
                        <DatePicker className="datePicker"
                            selected={allFields?.createdAt ? new Date(allFields?.createdAt) : null}
                            disabled
                        />
                    </Box>

                    <Box>
                        <h3>Last Modified By</h3>
                        <TextField className="priortyInput width150" disabled type="text" name="modifiedBy" value={allFields?.modifiedBy} onChange={handleModifybyChange} id="outlined-basic" variant="outlined" />
                    </Box>


                    <Box>
                        <h3>Last Modified Date</h3>
                        <DatePicker className="datePicker"
                            selected={allFields?.updatedAt ? new Date(allFields?.updatedAt) : null}
                            disabled
                        />
                    </Box>
                {/* </> : null} */}
            </div>


            <Grid container alignItems="flex-start" direction="row" item xs={12} sm={12} md={12} lg={12} spacing={1}>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <h3>Start Date</h3>
                    <DatePicker className="dateInput"
                        selected={allFields?.startDate ? new Date(allFields?.startDate) : null}
                        onChange={(startdate) => handleStartDate(startdate, "startDate")}
                        minDate={new Date()}
                    />
                </Grid>


                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <h3>End Date</h3>
                    <DatePicker className="dateInput"
                        disabled={allFields?.startDate ? false : true}
                        selected={allFields?.endDate ? new Date(allFields?.endDate) : null}
                        onChange={(enddate) => handleEndDate(enddate, "endDate")}
                        minDate={allFields?.startDate ? new Date(allFields?.startDate) : new Date()}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default BannerComp;
