import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { useStyles } from "../../../css/ClaimForm-css";
import { useEffect, useState } from "react";
import { handleKeyDown, handlePaste } from "../../../helper/randomFunction";
import { toast } from "react-hot-toast";
import FormSelect from "../../../theme/form/theme2/FormSelect";

export const FoodDetailForm = ({list,data,updateData}) => {

  const classes = useStyles();

  const [mealCount, setMealCount] = useState(null);

  const [readInput, setReadOnly] = useState(false);

  const [amount, setAmount] = useState(null);

  const [uploadData, setUpload] = useState(null);

  const [claimRemarks, setClaimRemarks] = useState(null);


  let randomData = [...Array(100)].map(() => Math.floor(Math.random() * 100));

  randomData = randomData?.map((obj, index) => {
    return {
      label: index + 1,
      value: index + 1,
    };
  });


  const getAmountCal = () => {
    let unitAmount = list?.[0]?.unitPrice;
    let totalAmount = mealCount?.value * unitAmount;
    if (totalAmount) {
      setAmount(totalAmount);
      setReadOnly(true)
    }
  };

  useEffect(() => {
    if (mealCount?.value && list?.length > 0) {
      getAmountCal();
    }
  }, [mealCount]);

  useEffect(() => {
    let params;
    params = {
      unitLabel: 'Count of Meal',
      field: mealCount,
      unit: mealCount?.value,
      claimAmount: amount,
      billFile: uploadData,
      claimRemarks: claimRemarks,
    };
    updateData({...data,...params});
  }, [mealCount, amount, uploadData,claimRemarks]);

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
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Count of Meal</Typography>
        <FormSelect
          theme="dark"
          fontTheme="lg"
          placeholder='Select'
          value={mealCount}
          optionLabels={{label: 'label', value: 'value'}}
          options={randomData}
          returnType="object"
          handleSelectedValue={(e) => {
            setMealCount({
              label: e.label,
              value: e.value,
            });
          }}
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
