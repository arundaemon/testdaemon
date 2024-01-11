import { memo, useCallback, useState, useRef, useEffect } from "react"
import { Box, } from "@mui/material";
import { DesktopDateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import { ReactComponent as IconCalendar } from "./../../../assets/icons/icon-calendar-disabled.svg";


const FormDateTimepicker = ({placeholder = 'mm/dd/yyyy', theme = 'medium-dark', value, handleSelectedValue,  minDateValue = null, maxDateValue = null, 
    minTimeValue = null, dateFormat = 'MM/DD/YYYY', className = null, ampm=true, disabled=false, params}) => {

    const [dateValue, setDateValue] = useState(value ?? null)
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenPicker = (event) => {
        setIsOpen((isOpen) => !isOpen);
        setAnchorEl(event.currentTarget);
      };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDateTimePicker
                clearable
                disabled={disabled}
                value={value}
                onChange={(newValue) => {
                    setDateValue(newValue)
                    handleSelectedValue(newValue)
                }}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                renderInput={(params) => (
                    <Box className={`crm-form-input crm-form-input-custom ` + className + ` ` + theme}  onClick={handleOpenPicker}>
                        <Box className="crm-form-input-label">{dateValue ? moment(new Date(dateValue)).format(dateFormat) : placeholder}</Box>
                        <Box  className="crm-form-input-icon"><IconCalendar /></Box>
                    </Box>
                )}
                minDate={minDateValue}
                maxDate={maxDateValue}
                minTime={minTimeValue}
                format={dateFormat}
                ampm={ampm}
                PopperProps={{
                    placement: "bottom-start",
                    anchorEl: anchorEl
                }}

                {...params}

            />
        </LocalizationProvider>
    )
}

export default memo(FormDateTimepicker)