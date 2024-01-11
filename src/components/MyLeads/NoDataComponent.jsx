import React from 'react';
import { Tabs, Tab, Typography, Box } from "@mui/material";

const NoDataComponent = ({message, className=''}) => {
  return (
    <Box className={className} sx={{padding:'50px 0px',textAlign:"center", color:"#212B36"}}>
        <Typography variant='h6'>{message}</Typography>
    </Box>
  )
}

export default NoDataComponent