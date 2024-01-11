import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { useStyles } from "../../../css/ClaimForm-css";
import { useEffect, useState } from "react";
import { handleKeyDown, handlePaste } from "../../../helper/randomFunction";
import { toast } from "react-hot-toast";
import FormSelect from "../../../theme/form/theme2/FormSelect";

export const ConveyanceDetail = ({ list, data, updateData }) => {
  const classes = useStyles();

  const [vechicleType, setVechicle] = useState(null);

  const [readInput, setReadOnly] = useState(false);

  const [count, setCount] = useState(null);

  const [amount, setAmount] = useState(null);

  const [vechicleAmount, setVechicleAmount] = useState(null);

  const [uploadData, setUpload] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [claimRemarks, setClaimRemarks] = useState(null);


  const vechicleOptions = [
    { label: "Own Transport", value: "Own Transport" },
    { label: "Cab", value: "Cab" },
    { label: "Bus", value: "Bus" },
    { label: "Rickshaw", value: "Rickshaw" },
    { label: "Train", value: "Train" },
    { label: "Metro", value: "Metro" },
    { label: "Flight", value: "Flight" },
  ];

  const getVechicleExpense = () => {
    let amount = list
      ?.filter((obj) => obj?.field?.subField === vechicleType.value)?.[0]
      ?.unitPrice?.toString();
    setVechicleAmount(amount);
  };

  const getAmountCal = () => {
    let totalAmount = count * vechicleAmount;
    if (totalAmount) {
      setAmount(totalAmount);
      setReadOnly(true)
    }
  };


  useEffect(() => {
    if (vechicleType?.value) {
      getVechicleExpense();
    }
    if (uploadData) {
      setUpload(null)
      setSelectedFileName('')
    }
  }, [vechicleType]);

  useEffect(() => {
    if (count && vechicleAmount) {
      getAmountCal();
    }
    else {
      setAmount('')
      setReadOnly(false)
    }
  }, [count]);

  useEffect(() => {
    let params;
    params = {
      unitLabel: 'Count of Kms',
      unit: count,
      claimAmount: amount,
      field: { label: 'Mode of Transport', value: vechicleType?.value },
      billFile: uploadData,
      claimRemarks: claimRemarks,
    };
    //console.log(params, 'testConveyanceParams')
    updateData({ ...data, ...params });
  }, [count, amount, vechicleType, uploadData, claimRemarks]);


  const handleUploadFile = (e) => {
    if (e.target.files[0]?.type === 'application/vnd.ms-excel' || e.target.files[0]?.type === 'text/csv') {
      // file is invalid, do not upload
      toast.error('Invalid file type');
      setUpload(null)
    }
    else {
      setSelectedFileName(e.target.files[0].name);
      setUpload(e.target.files[0])
    }
  }

  

  return (
    <>
      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Mode of Transport</Typography>
        <FormSelect
          theme="dark"
          fontTheme="lg"
          placeholder='Select Vehicle'
          value={vechicleType}
          optionLabels={{ label: 'label', value: 'value' }}
          options={vechicleOptions}
          returnType="object"
          handleSelectedValue={(e) => {
            setVechicle({
              label: e.label,
              value: e.value,
            })
            setCount('')
            setAmount('')
            setReadOnly(false)
          }}
        />
      </Grid>

      {(!(vechicleType?.value === "Metro" || vechicleType?.value === "Flight")) ? <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Count of Kms</Typography>
        <TextField
          autoComplete="off"
          className='crm-form-input dark'
          name="count"
          type="number"
          value={count}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={(e) => setCount(e.target.value)}
        />
      </Grid> : ''}
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


      {vechicleType?.value != "Own Transport" ? (
        <>
          <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Upload Bill</Typography>

            <TextField
              autoComplete="off"
              disabled
              className='crm-form-input dark'
              type="upload"
              placeholder={selectedFileName ?? 'Upload here'}
              value=""
              InputProps={{
                endAdornment: (
                  <IconButton component="label" className='crm-form-input-upload'>
                    <input
                      styles={{ display: "none" }}
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
        </>
      ) : null}

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