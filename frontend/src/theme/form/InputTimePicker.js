import React from "react";
import { FormControl, OutlinedInput, InputAdornment, FormHelperText, Typography, Box } from "@mui/material";
//import TimePicker from 'react-time-picker';
//import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import { ReactComponent as CalendarIcon } from "../../assets/icons/icon_calender.svg";
import moment from "moment";
import { parse } from "date-fns";
import 'rc-time-picker/assets/index.css';


const InputTimePicker  = (props) => {
    const { helperText, labelName, endIcon=null, disableLabel=false,  timeVal, handleChange } = props;
    //console.log(timeVal)
    const [timeValue, setTimeValue] = React.useState('');
    //console.log(timeValue)
    const format = 'HH:mm';
    const current = moment()
    const now = moment().minute(current.minute() + 30);

    const handleUpdate = (e) => {
        //console.log(e)
        //console.log(props.value)
        let value = moment(e).format("HH:mm");
        setTimeValue(value);
        handleChange(value)
    }

    const getDisabledHours = () => {
        var hours = [];
        for(var i =0; i < (moment().hour() + 1); i++){
            hours.push(i);
        }
        return hours;
    }
    
    const getDisabledMinutes = (selectedHour) => {
        var minutes= [];
        if (selectedHour === moment().hour()){
            for(var i =0; i < (moment().minute()); i++){
                minutes.push(i);
            }
        }
        return minutes;
    }

    return (
        <>
        <Box className="form-input-container">
            <FormControl  sx={{ m: 1, width: '25ch' }} variant="outlined">
                {
                    !disableLabel && <Typography className="form-input-label" variant="body2" >{labelName}</Typography>
                }
                
                {/* <DatePicker
                    selected={timeValue}
                    onChange={date => handleUpdate(date)}
                    showTimeSelect={true}
                    showTimeSelectOnly
                    timeCaption="Time"
                    timeFormat="hh:mm aa"
                    timeIntervals={15}
                    //dateFormat="LLL"
                    /> */}
                 <TimePicker
                    showSecond={false}
                    defaultValue={timeVal}
                    //value={props.value}
                    //disabledHours={getDisabledHours}
                    //disabledMinutes={getDisabledMinutes}
                    hideDisabledOptions={true}
                    minuteStep={5}
                    className="form-input-time"
                    onChange={handleUpdate}
                    format={format}                    
                />
                <FormHelperText id="outlined-text-helper-text">{helperText}</FormHelperText>
            </FormControl>
        </Box>
                
        </>
    )
}

export default InputTimePicker;