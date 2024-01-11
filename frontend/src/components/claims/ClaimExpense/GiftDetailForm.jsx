import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { useStyles } from "../../../css/ClaimForm-css";
import { useEffect, useState } from "react";
import { handleKeyDown, handlePaste } from "../../../helper/randomFunction";
import { toast } from "react-hot-toast";
import FormSelect from "../../../theme/form/theme2/FormSelect";

export const GiftDetailForm = ({list,data,updateData}) => {

  const classes = useStyles();

  const [count, setCount] = useState(null);

  const [schoolInfo, setSchoolInfo] = useState(null);

  const [amount, setAmount] = useState(null);

  const [uploadData, setUpload] = useState(null);

  const [readInput, setReadOnly] = useState(false);

  const [studentType, setStudentType] = useState()

  const [claimRemarks, setClaimRemarks] = useState(null);

  const getAmountCal = () => {
    let unitAmount = list?.[0]?.unitPrice;
    let totalAmount = count * unitAmount;
    if (totalAmount) {
      setAmount(totalAmount);
      setReadOnly(true);
    }
  };

  useEffect(() => {
    if (count && list?.length > 0) {
      getAmountCal();
    }
  }, [count]);

  useEffect(() => {
    let params;
    params = {
      unitLabel: 'Quantity',
      field: {label: 'Gifts To', value: studentType?.value},
      unit: count,
      claimAmount: amount,
      billFile: uploadData,
      claimRemarks: claimRemarks,
    };
    updateData({...data,...params});
  }, [count, amount, uploadData,claimRemarks]);

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

  const giftOptions = [
    { label: "Students", value: "Students" },
    { label: "School Management", value: "School Management" },
  ];


  return (
    <>

      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Gifts To</Typography>
        <FormSelect
          theme="dark"
          fontTheme="lg"
          placeholder='Select'
          value={studentType}
          optionLabels={{label: 'label', value: 'value'}}
          options={giftOptions}
          returnType="object"
          handleSelectedValue={(e) => {
            setStudentType({
              label: e.label,
              value: e.value,
            })
            setCount('')
            setAmount('')
            setReadOnly(false)
          }}
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
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={(e) => setCount(e.target.value)}
        />
      </Grid>


      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Amount</Typography>
        <TextField
          autoComplete="off"
          className='crm-form-input dark'
          name="amount"
          disabled={readInput ? true : false}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
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
