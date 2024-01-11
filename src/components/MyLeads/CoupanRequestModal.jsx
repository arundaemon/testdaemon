import React, { useState, useEffect } from 'react';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material';
import { createRequest } from '../../config/services/approvalRequest';
import Page from '../../components/Page';
import toast from 'react-hot-toast';

export default function CoupanRequestModal() {
  const [sellingPrice, setSellingPrice] = useState('');
  const [coupanPercent, setCoupanPercent] = useState('');
  const [remarks, setRemarks] = useState('');
  const [userData] = useState(JSON.parse(localStorage.getItem('userData')));
  const [loginData, setLoginData] = useState(JSON.parse(localStorage.getItem("loginData")));
  const { uuid: requestBy_uuid } = loginData;
  const { employee_code: empCode, crm_role: requestBy_roleId, name: requestBy_name, crm_profile: requestBy_ProfileName, } = userData;

  let { leadId } = useParams();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    switch (e.target.name) {
      case 'sellingPrice':
        setSellingPrice(e.target.value)
        break;

      case 'coupanPercent':
        setCoupanPercent(e.target.value)
        break;

      case 'remarks':
        setRemarks(e.target.value)
        break;

        defualt:
        console.log('no value entered');
        break;

    }
  }

  const createMetaInfo = () => {
    return {
      Selling_Price: sellingPrice,
      Coupan_Percentage: coupanPercent,
      Remarks: remarks
    }
  }

  const trialInfoCreator = () => {
    return {
      requestBy_roleId,
      requestBy_name,
      requestBy_uuid,
      requestBy_ProfileName,
      requestBy_empCode: empCode
    }
  }

  const validateFields = (params) => {
    if (!sellingPrice) {
      toast.error('Please enter selling price');
      return false;
    }
    if (!coupanPercent) {
      toast.error('Please enter coupan percentage required');
      return false
    }
    return true;
  }
  
  const createSingleRequest = () => {
    const timestamp = new Date().getTime();
    let new_data = {
      requestType: "Coupon",
      trialCreatorDetails: trialInfoCreator(),
      requestBy_empCode: empCode,
      //remarks: remarks,
      requestStatus: "NEW",
      metaInfo: createMetaInfo(),
      requestId: timestamp,
      requestBy_roleId,
      requestBy_name,
      requestBy_uuid,
      requestBy_ProfileName,
    }
    createRequest(new_data)
      .then(res => {
        if (res?.data) {
          toast.success(res?.message);
          setSellingPrice('');
          setCoupanPercent('');
          navigate('/authorised/apply-request-management')
        }
      })
      .catch(err => {
        console.log(err, ':: error in catch');
      })
  }

  const handleSubmit = () => {
    if (validateFields()) {
      createSingleRequest()
    }
  }

  const handleCancel = () => {
    navigate(`/authorised/listing-details/${leadId}`)
  }

  return (
    <>
      <Page title="Extramarks | Single Coupon Request" className="main-container ApprovalRequestPage_Page datasets_container">
        <div className='requestHeading' align='left'> COUPON REQUEST </div>
        <Box>
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={12} sm={6} >
              <label>Selling Price</label>
              <TextField type='number' variant='outlined' value={sellingPrice} name="sellingPrice" onChange={handleOnChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} >
              <label>Coupan Percentage Required</label>
              <TextField type='number' value={coupanPercent} name="coupanPercent" onChange={handleOnChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={6} marginTop={2}>
              <label>Remarks</label>
              <TextField multiline rows={4} value={remarks} name="remarks" onChange={handleOnChange} fullWidth />
            </Grid>
          </Grid>


        </Box>
      </Page>
      <Box align="right" marginTop={2}>
        <Button  className="btn" variant='outlined' type="submit" onClick={handleCancel}>Cancel</Button>
        <Button  className="btn" variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>
      </Box>


    </>
  );
}