import React from 'react';
import {Typography, Button,Box,Modal } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const Connector = () => {
  return (
    <Box sx={{display:"flex",alignItems:"center"}}>
        <Box sx={{width:"20px",borderTop:"2px solid #909092"}}></Box>
        <AddIcon 
        //   onClick={onClick}
          sx={{
            backgroundColor:"#F45E29",
            color:"#fff",
            width:"20px",
            height:"20px"
            }}
        />
        <Box sx={{width:"20px",borderTop:"2px solid #909092"}}></Box>
    </Box>
  )
}

export default Connector