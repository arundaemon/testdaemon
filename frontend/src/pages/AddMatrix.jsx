import React from 'react';
import Page from '../components/Page';
import { Container, TextField, Button, Grid, Typography } from "@mui/material";
import Select from 'react-select';
import Dropdown from './Dropdown';
import Controls from "../components/controls/Controls";



const AddMatrix = () => {

  return (
    <>
      <div className='add-matrix create-activity'>
        <Page title="Extramarks | Add Matrix" className="main-container datasets_container"></Page>
        <Typography variant='h4'>Add New Matrix</Typography>
        <Typography variant='p'>Enter Basic Details</Typography>
        <Typography variant='h6'>Select</Typography>
        <Dropdown />
      </div>
    </>
  )
}

export default AddMatrix
