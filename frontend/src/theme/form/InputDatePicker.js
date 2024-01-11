import React from "react";
import { FormControl, OutlinedInput, InputAdornment, FormHelperText, Typography, Box, TextField} from "@mui/material";
import DatePicker from "react-datepicker";
import { ReactComponent as CalendarIcon } from "../../assets/icons/icon_calender.svg";
import moment from "moment";


const InputDatePicker  = (props) => {
    const { helperText, labelName, endIcon=null,format='dd-MM-yyyy',minDate= new Date(), handleChange, disableLabel=false,disabled=false, value, className=null } = props;
    const [dateValue, setDateValue] = React.useState(value ?? '');

    const handleUpdate = (e) => {
        let value;
        if (moment(e).isValid()) {
            value = moment(e).toDate()
          }
          else {
            value = ''
          }

        setDateValue(value);
        handleChange(value)
    }

    return (
        <>
        <Box className="form-input-container ">
            <FormControl  sx={{ m: 1, width: '25ch' }} variant="outlined">
            {
                !disableLabel && <Typography className="form-input-label" variant="body2" >{labelName}</Typography>
            }
                
                <DatePicker 
                    showTimeSelect={false}
                    onChange={date => handleUpdate(date)} selected={dateValue ? new Date(dateValue) : null} 
                    className={`form-input-date ` + className}
                    dateFormat={format}
                    autoComplete="off"
                    minDate={minDate}
                    disabled={disabled}
                    customInput={
                        <TextField className={`form-input-date` + (value ? `has-value` : ``)}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="start">
                                <CalendarIcon />
                            </InputAdornment>
                            ),
                        }} />
                    } />
                <FormHelperText id="outlined-text-helper-text">{helperText}</FormHelperText>
            </FormControl>
        </Box>
                
        </>
    )
}

export default InputDatePicker;