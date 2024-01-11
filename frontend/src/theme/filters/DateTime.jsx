import { FormControl, TextField, InputAdornment } from "@mui/material";
import DatePicker from "react-datepicker";
import { ReactComponent as CalendarIcon } from "../../assets/icons/icon_calender.svg";

const DateTimeFilter = ({label = '', placeholder = '', value, handleChange, minDate, maxDate, minTime, maxTime}) => {

    
    return (
        <FormControl>
            <DatePicker  dateFormat="dd/MM/yyyy HH:mm:ss" className="filter-input-date" popperClassName="reports-datetime-input"
                selected={value ? new Date(value) : null}  
                showTimeSelect
                onChange={handleChange} 
                placeholderText={placeholder} 
                minDate={minDate}
                maxDate={maxDate}
                minTime={minTime}
                maxTime={maxTime}
                onKeyDown={(e) => {
                    e.preventDefault();
                }}
                onChangeRaw={(e) => e.preventDefault()}
                isClearable={value ? true : false}
                customInput={
                    <TextField className="filter-input-date-field"
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="start">
                                <CalendarIcon className="filter-input-date-field-icon" />
                            </InputAdornment>
                            ),
                        }} 
                    />
                }
            />
        </FormControl>
    )
}

export default DateTimeFilter;