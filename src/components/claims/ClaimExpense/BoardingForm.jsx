import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useStyles } from "../../../css/ClaimForm-css";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import AlarmIcon from "@mui/icons-material/Alarm";
import SnoozeIcon from "@mui/icons-material/Snooze";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { handleKeyDown, handlePaste } from "../../../helper/randomFunction";
import { toast } from "react-hot-toast";
import FormDateTimePicker from "../../../theme/form/theme2/FormDateTimePicker";

export const BoardingForm = ({list,data,updateData}) => {
  //let { data, boardingData,formIndex } = props;
  const classes = useStyles();
  const [expense, setExpense] = useState({
    label: "Select Expense",
    value: null,
  });

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [count, setDayCount] = useState(null);
  const [amount, setAmount] = useState(null);
  const [uploadData, setUpload] = useState(null);
  const [readInput, setReadOnly] = useState(false);
  const [claimRemarks, setClaimRemarks] = useState(null);

  const getDaysCount = () => {
    
    let endday = moment(new Date(endTime)).format("YYYY-MM-DD");
   

    let startday;
    let differDays = null;

    if (endday != "Invalid") {
      startday = moment(new Date(startTime)).format("YYYY-MM-DD");
      differDays = moment(endday).diff(moment(startday), "days");
    }

    if (differDays) {
      setDayCount(differDays);
    }
    else {
      setDayCount(1)
    }
  };

  const getAmountCal = () => {
    let unitAmount = list?.[0]?.unitPrice;
    let totalAmount = count * unitAmount;
    setAmount(totalAmount);
  };

  useEffect(() => {
    if (list?.length > 0) {
      setReadOnly(true);
    }
  }, [list]);

  useEffect(() => {
    if (count) {
      getAmountCal();
    }
  }, [count]);

  useEffect(() => {
    if (startTime && endTime) {
      getDaysCount();
    }
  }, [endTime]);

  useEffect(() => {
    let params;
    // if (count && startTime && endTime && amount && uploadData) {
    //   params = {
    //     unit: count,
    //     visitTimeIn: new Date(startTime),
    //     visitTimeOut: new Date(endTime),
    //     claimAmount: amount,
    //     billFile: uploadData
    //   };
    //   boardingData(params);
    // }
    params = {
      unitLabel: 'No of Days',
      unit: count,
      visitTimeIn: startTime ? new Date(startTime) : null,
      visitTimeOut: endTime ? new Date(endTime) : null,
      claimAmount: amount,
      billFile: uploadData,
      claimRemarks: claimRemarks,
    };
    updateData({...data,...params});
  }, [count, startTime, endTime, amount, uploadData, claimRemarks]);

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
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Check in Time</Typography>
        
        <FormDateTimePicker
          theme="dark"
          value={startTime}
          maxDateValue={new Date()}
          handleSelectedValue={(e) => setStartTime(e)}
          dateFormat="hh:mm a"
          placeholder="hh:mm (a | p)m"
          ampm={true}
        />
      </Grid> 

      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Check out Time</Typography>
        
        <FormDateTimePicker
          theme="dark"
          value={endTime}
          minDateValue={startTime}
          maxDateValue={new Date()}
          minTimeValue={startTime}
          handleSelectedValue={(e) => setEndTime(e)}
          dateFormat="hh:mm a"
          placeholder="hh:mm (a | p)m"
          ampm={true}
          disabled={startTime ? false : true}
        />
      </Grid>
      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>No of Days</Typography>
        <TextField
          autoComplete="off"
          className='crm-form-input dark'
          name="count"
          type="number"
          placeholder="No of days"
          value={count}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={(e) => setDayCount(e.target.value)}
          disabled={count ? true : false}
        />
      </Grid>
      <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
        <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Amount</Typography>
        <TextField
            autoComplete="off"
            className='crm-form-input dark'
            name="amount"
            type="number"
            placeholder=''
            value={amount}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onChange={(e) => setAmount(e.target.value)}
            disabled={readInput}
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
