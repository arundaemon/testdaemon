import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { useStyles } from "../../../css/ClaimForm-css";
import { useEffect, useState } from "react";
import { handleKeyDown, handleKeyTextDown, handlePaste, handleTextPaste } from "../../../helper/randomFunction";
import { toast } from "react-hot-toast";

export const EventDetailForm = ({list,data,updateData}) => {

  const classes = useStyles();

  const [itemCount, setItem] = useState(null);

  const [readInput, setReadOnly] = useState(false);

  let randomData = [...Array(100)].map(() => Math.floor(Math.random() * 100));

  randomData = randomData?.map((obj, index) => {
    return {
      label: index + 1,
      value: index + 1,
    };
  });

  const [count, setCount] = useState(null);

  const [amount, setAmount] = useState(null);

  const [uploadData, setUpload] = useState(null);

  const [claimRemarks, setClaimRemarks] = useState(null);



  const getAmountCal = () => {
    let unitAmount = list?.[0]?.unitPrice;
    let totalAmount = count * unitAmount;
    if (totalAmount) {
      setAmount(totalAmount);
      setReadOnly(true)
    }
  };

  //console.log(list, "testData")

  useEffect(() => {
    if (count && list?.length > 0) {
      getAmountCal();
    }
  }, [count]);

  useEffect(() => {
    let params;
    params = {
      unitLabel: 'Quantity',
      unit: count,
      field: {label: 'Item', value: itemCount},
      claimAmount: amount,
      billFile: uploadData,
      claimRemarks: claimRemarks,
    };
    updateData({...data,...params});
  }, [itemCount, count, amount, uploadData,claimRemarks]);


  const handleUploadFile = (e) => {
    if (e.target.files[0]?.type === 'application/vnd.ms-excel' || e.target.files[0]?.type === 'text/csv') {
      // file is invalid, do not upload
      toast.error('Invalid file type');
      setUpload(null)
    }
    else {
      setUpload(e.target.files[0])
    }
  }


  return (
    <>
      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Item</Typography>
        <TextField
          autoComplete="off"
          className='crm-form-input dark'
          name="itemCount"
          type="text"
          value={itemCount}
          onChange={(e) => {
            setItem(e.target.value)
          }}
          onKeyDown={handleKeyTextDown}
          onPaste={handleTextPaste}
        />
      </Grid>

      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Quantity</Typography>
        <TextField
          autoComplete="off"
          className='crm-form-input dark'
          name="count"
          type="number"
          value={count}
          onChange={(e) => {
            setCount(e.target.value)
            setAmount('')
            setReadOnly(false)
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </Grid>

      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Amount</Typography>
        <TextField
          autoComplete="off"
          className='crm-form-input dark'
          name="amount"
          type="number"
          disabled={readInput ? true : false}
          value={amount}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Grid>

      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Upload Bill</Typography>
        <TextField
          autoComplete="off"
          disabled
          className='crm-form-input dark'
          type="upload"
          placeholder={uploadData ? uploadData?.name : 'Upload here'}
          value=""
          InputProps={{
              endAdornment: (
                <IconButton component="label" className='crm-form-input-upload'>
                  <input
                    styles={{display:"none"}}
                    type="file"
                    hidden
                    onChange={(e) => handleUploadFile(e)}
                    accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                  />
                  Browse
                </IconButton>
              ),
          }}
        />
      </Grid>

      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={12}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Remarks</Typography>
        <textarea
          className='crm-form-input-textarea dark'
          name="amount"
          rows="5"
          style={{resize: 'none'}}
          type="text"
          value={claimRemarks}
          // onKeyDown={handleKeyDown}
          // onPaste={handlePaste}
          onChange={(e) => setClaimRemarks(e.target.value)}
        />
      </Grid>
    </>
  );
};
