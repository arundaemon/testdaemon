import { memo, 
    useState,
    // useCallback, 
    // useRef, 
    // useEffect 
} from "react"
//import { Box, } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import moment from "moment";
import { ReactComponent as IconCalendar } from "./../../../assets/icons/icon-calendar-disabled.svg";
import { ReactComponent as IconCalendarColored } from "./../../../assets/icons/icon-calendar-primary.svg";


const FormDatepicker = ({placeholder = 'mm/dd/yyyy', theme = 'medium-dark', value, handleSelectedValue,  minDateValue = null, maxDateValue = null, dateFormat = 'MM/DD/YYYY',
    className = null, disabled=false, iconColor='none', placeholderColor='medium-dark'}) => {

    const [dateValue, setDateValue] = useState(value ?? null)
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // const handleOpenPicker = (event) => {
    //     setIsOpen((isOpen) => !isOpen);
    //     setAnchorEl(event.currentTarget);
    // };
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                className={`crm-form-input crm-form-input-datepicker ` + className + ` ` + theme + ` placeholder-`+placeholderColor}
                disabled={disabled}
                clearable
                value={dateValue ? dayjs(moment(dateValue).format(dateFormat)) : null}
                onChange={(newValue) => {
                    setDateValue(newValue.format(dateFormat))
                    handleSelectedValue(newValue.format(dateFormat))
                }}
                format={dateFormat}
                // inputFormat={dateFormat}
                placeholder={placeholder}
                slots={{
                    openPickerIcon: iconColor ? IconCalendar : IconCalendarColored
                }}
                slotProps={{
                    textField: {
                        onClick: (e) => {
                            setIsOpen(!isOpen)
                            setAnchorEl(e.target);
                        },
                        placeholder: dateFormat          
                    },
                }}
                
                open={isOpen}
                onClose={() => setIsOpen(false)}
                // renderInput={(params) => (
                //     <Box className={`crm-form-input crm-form-input-custom ` + className + ` ` + theme}  onClick={handleOpenPicker}>
                //         <Box className={`crm-form-input-label ` + (dateValue ? `` : ` is-placeholder`) + ` ` + placeholderColor}>{dateValue ? moment(new Date(dateValue)).format(dateFormat) : placeholder}</Box>
                //         <Box  className="crm-form-input-icon">
                //             {iconColor === 'none'
                //                 ?   <IconCalendar />
                //                 :   <IconCalendarColored />
                //             }
                //         </Box>
                //     </Box>
                // )}
                minDate={dayjs(moment(minDateValue).format(dateFormat))}
                maxDate={dayjs(moment(maxDateValue).format(dateFormat))}
                PopperProps={{
                    placement: "bottom-start",
                    anchorEl: anchorEl
                }}

            />
        </LocalizationProvider>
    )
}

export default memo(FormDatepicker)